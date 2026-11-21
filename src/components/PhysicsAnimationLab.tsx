import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward } from 'lucide-react';
import { AnimationConfig } from '../types/physics';

interface PhysicsAnimationLabProps {
  title: string;
  animation: AnimationConfig;
  onSpeakStage?: (text: string, label: string) => void;
}

interface InstantPhysicsState {
  xKm: number;
  massKg: number;
  fuelLeftKg: number;
  resistanceN: number;
  thrustN: number;
  workMJ: number;
  muCurrent: number;
  tankDropped: boolean;
}

function computeInstantState(anim: AnimationConfig, p: number): InstantPhysicsState {
  const clampedP = Math.max(0, Math.min(1, p));
  const xKm = clampedP * anim.expectedDistanceKm;
  const xM = xKm * 1000;
  const eta = anim.etaKJ * 1000 * (anim.efficiency ?? 1);
  const M0 =
    anim.modelType === 'tank-drop-staging'
      ? anim.mEmpty + (anim.tankMassKg ?? 0) + (anim.fuel1Kg ?? 0) + (anim.fuel2Kg ?? 0)
      : anim.mEmpty + anim.mFuel;

  if (anim.modelType === 'constant-mass') {
    const resistanceN = anim.mu * anim.mEmpty * anim.g;
    const fuelLeftKg = anim.mFuel * (1 - clampedP);
    return {
      xKm,
      massKg: anim.mEmpty,
      fuelLeftKg,
      resistanceN,
      thrustN: resistanceN,
      workMJ: (resistanceN * xM) / 1e6,
      muCurrent: anim.mu,
      tankDropped: false,
    };
  }

  if (anim.modelType === 'two-stage-discrete') {
    const s1Km = (100 * anim.etaKJ * 1000) / (anim.mu * M0 * anim.g) / 1000;
    const inStage1 = xKm <= s1Km;
    const massKg = inStage1 ? M0 : M0 - anim.mFuel / 2;
    const resistanceN = anim.mu * massKg * anim.g;
    const fuelLeftKg = anim.mFuel * (1 - clampedP);
    const workMJ = inStage1
      ? (anim.mu * M0 * anim.g * xM) / 1e6
      : (anim.mu * M0 * anim.g * s1Km * 1000 +
          anim.mu * (M0 - anim.mFuel / 2) * anim.g * (xM - s1Km * 1000)) /
        1e6;
    return {
      xKm,
      massKg,
      fuelLeftKg,
      resistanceN,
      thrustN: resistanceN,
      workMJ,
      muCurrent: anim.mu,
      tankDropped: false,
    };
  }

  if (anim.modelType === 'inclined-plane') {
    const muEff = (anim.sinTheta ?? 0.28) + anim.mu * (anim.cosTheta ?? 0.96);
    const massKg = M0 * Math.exp((-muEff * anim.g * xM) / eta);
    const resistanceN = muEff * massKg * anim.g;
    return {
      xKm,
      massKg,
      fuelLeftKg: Math.max(0, massKg - anim.mEmpty),
      resistanceN,
      thrustN: resistanceN,
      workMJ: ((M0 - massKg) * eta) / 1e6,
      muCurrent: muEff,
      tankDropped: false,
    };
  }

  if (anim.modelType === 'aero-drag' || anim.modelType === 'fuel-leak') {
    const F0 =
      anim.modelType === 'aero-drag'
        ? anim.aeroDragN ?? 0
        : (eta * (anim.leakRateKgS ?? 0)) / (anim.speedMs ?? 20);
    const u0 = anim.mu * M0 * anim.g + F0;
    const u = u0 * Math.exp((-anim.mu * anim.g * xM) / eta);
    const massKg = (u - F0) / (anim.mu * anim.g);
    const resistanceN =
      anim.modelType === 'aero-drag'
        ? anim.mu * massKg * anim.g + F0
        : anim.mu * massKg * anim.g;
    return {
      xKm,
      massKg,
      fuelLeftKg: Math.max(0, massKg - anim.mEmpty),
      resistanceN,
      thrustN: resistanceN,
      workMJ: (resistanceN * xM) / 1e6,
      muCurrent: anim.mu,
      tankDropped: false,
    };
  }

  if (anim.modelType === 'two-segment-road') {
    const d1 = anim.segment1Km ?? 300;
    const mu2 = anim.mu2 ?? anim.mu;
    if (xKm <= d1) {
      const massKg = M0 * Math.exp((-anim.mu * anim.g * xM) / eta);
      const resistanceN = anim.mu * massKg * anim.g;
      return {
        xKm,
        massKg,
        fuelLeftKg: Math.max(0, massKg - anim.mEmpty),
        resistanceN,
        thrustN: resistanceN,
        workMJ: ((M0 - massKg) * eta) / 1e6,
        muCurrent: anim.mu,
        tankDropped: false,
      };
    } else {
      const M1 = M0 * Math.exp((-anim.mu * anim.g * d1 * 1000) / eta);
      const massKg = M1 * Math.exp((-mu2 * anim.g * (xM - d1 * 1000)) / eta);
      const resistanceN = mu2 * massKg * anim.g;
      return {
        xKm,
        massKg,
        fuelLeftKg: Math.max(0, massKg - anim.mEmpty),
        resistanceN,
        thrustN: resistanceN,
        workMJ: ((M0 - massKg) * eta) / 1e6,
        muCurrent: mu2,
        tankDropped: false,
      };
    }
  }

  if (anim.modelType === 'tank-drop-staging') {
    const fuel1 = anim.fuel1Kg ?? 150;
    const tankM = anim.tankMassKg ?? 100;
    const M1 = M0 - fuel1;
    const x1Km = ((eta / (anim.mu * anim.g)) * Math.log(M0 / M1)) / 1000;
    if (xKm <= x1Km) {
      const massKg = M0 * Math.exp((-anim.mu * anim.g * xM) / eta);
      const resistanceN = anim.mu * massKg * anim.g;
      return {
        xKm,
        massKg,
        fuelLeftKg: Math.max(0, massKg - anim.mEmpty - tankM),
        resistanceN,
        thrustN: resistanceN,
        workMJ: ((M0 - massKg) * eta) / 1e6,
        muCurrent: anim.mu,
        tankDropped: false,
      };
    } else {
      const M2 = M1 - tankM;
      const massKg = M2 * Math.exp((-anim.mu * anim.g * (xM - x1Km * 1000)) / eta);
      const resistanceN = anim.mu * massKg * anim.g;
      return {
        xKm,
        massKg,
        fuelLeftKg: Math.max(0, massKg - anim.mEmpty),
        resistanceN,
        thrustN: resistanceN,
        workMJ: ((M0 - tankM - massKg) * eta) / 1e6,
        muCurrent: anim.mu,
        tankDropped: true,
      };
    }
  }

  if (anim.modelType === 'linear-mu-gradient') {
    const alpha = anim.alphaPerM ?? 2e-7;
    const muCurrent = anim.mu + alpha * xM;
    const integralMu = anim.mu * xM + 0.5 * alpha * xM * xM;
    const massKg = M0 * Math.exp((-anim.g * integralMu) / eta);
    const resistanceN = muCurrent * massKg * anim.g;
    return {
      xKm,
      massKg,
      fuelLeftKg: Math.max(0, massKg - anim.mEmpty),
      resistanceN,
      thrustN: resistanceN,
      workMJ: ((M0 - massKg) * eta) / 1e6,
      muCurrent,
      tankDropped: false,
    };
  }

  // continuous-flat default
  const massKg = M0 * Math.exp((-anim.mu * anim.g * xM) / eta);
  const resistanceN = anim.mu * massKg * anim.g;
  return {
    xKm,
    massKg,
    fuelLeftKg: Math.max(0, massKg - anim.mEmpty),
    resistanceN,
    thrustN: resistanceN,
    workMJ: ((M0 - massKg) * eta) / 1e6,
    muCurrent: anim.mu,
    tankDropped: false,
  };
}

export const PhysicsAnimationLab: React.FC<PhysicsAnimationLabProps> = ({
  title,
  animation,
  onSpeakStage,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [syncTTS, setSyncTTS] = useState<boolean>(false);
  const lastFrameRef = useRef<number | null>(null);
  const lastSpokenStageRef = useRef<number>(-1);

  // Reset when question changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    lastSpokenStageRef.current = -1;
  }, [animation]);

  const currentStageIdx = useMemo(() => {
    const idx = animation.stages.findIndex(
      (st) => progress >= st.progressStart && progress <= st.progressEnd + 1e-6
    );
    return idx >= 0 ? idx : animation.stages.length - 1;
  }, [animation.stages, progress]);

  // Synchronized TTS when crossing into a new stage while playing
  useEffect(() => {
    if (
      isPlaying &&
      syncTTS &&
      onSpeakStage &&
      currentStageIdx !== lastSpokenStageRef.current
    ) {
      lastSpokenStageRef.current = currentStageIdx;
      const script = animation.ttsStages[currentStageIdx];
      if (script) {
        onSpeakStage(script, `Animasi Tahap ${currentStageIdx + 1}`);
      }
    }
  }, [currentStageIdx, isPlaying, syncTTS, onSpeakStage, animation.ttsStages]);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = null;
      return;
    }

    let rafId = 0;
    const durationSec = 9; // full proof cycle in seconds at 1x

    const tick = (now: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }
      const dtSec = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;

      setProgress((prev) => {
        const next = prev + (dtSec * speed) / durationSec;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speed]);

  const instant = useMemo(
    () => computeInstantState(animation, progress),
    [animation, progress]
  );

  // Sample curve points for live proof graph f(x) vs x
  const curveSamples = useMemo(() => {
    const pts: { p: number; state: InstantPhysicsState }[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      pts.push({ p, state: computeInstantState(animation, p) });
    }
    return pts;
  }, [animation]);

  const maxForce = useMemo(
    () => Math.max(...curveSamples.map((s) => s.state.resistanceN), 100) * 1.15,
    [curveSamples]
  );

  const carX = 60 + progress * 410;
  const isInclined = animation.modelType === 'inclined-plane';
  const inclineAngle = animation.inclineDeg ?? 16.26;
  const inclineRad = (inclineAngle * Math.PI) / 180;
  const carY = isInclined
    ? 172 - progress * 410 * Math.tan(inclineRad) * 0.55
    : 132;

  const initialForce = curveSamples[0]?.state.resistanceN || 1;
  const arrowScale = Math.max(30, Math.min(82, (instant.resistanceN / initialForce) * 65));

  const fuelRatio =
    animation.mFuel > 0
      ? Math.max(0, Math.min(1, instant.fuelLeftKg / animation.mFuel))
      : 1 - progress;

  // Graph coordinate helpers
  const gx0 = 54;
  const gy0 = 152;
  const gw = 265;
  const gh = 112;

  const graphPath = curveSamples
    .map((s, idx) => {
      const x = gx0 + s.p * gw;
      const y = gy0 - (s.state.resistanceN / maxForce) * gh;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  const filledAreaSamples = curveSamples.filter((s) => s.p <= progress + 0.001);
  const areaPath =
    filledAreaSamples.length > 1
      ? `${filledAreaSamples
          .map((s, idx) => {
            const x = gx0 + s.p * gw;
            const y = gy0 - (s.state.resistanceN / maxForce) * gh;
            return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join(' ')} L ${(gx0 + progress * gw).toFixed(1)} ${gy0} L ${gx0} ${gy0} Z`
      : '';

  const currentStage = animation.stages[currentStageIdx];

  return (
    <div
      className="rounded-xl border border-[#E7DFE2] bg-white p-5 space-y-4"
      data-testid="physics-animation-lab"
      data-progress={progress.toFixed(2)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#6B0F24]">
            Animasi Pembuktian Fenomena Fisika
          </p>
          <h4 className="text-base font-semibold text-[#1E1417]">{title}</h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={() => {
                if (progress >= 0.999) setProgress(0);
                setIsPlaying(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{progress > 0 && progress < 1 ? 'Lanjutkan' : 'Putar Animasi'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setProgress(0);
              lastSpokenStageRef.current = -1;
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D8CCD0] bg-white text-xs font-medium text-[#2A181D] hover:bg-[#FAF7F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <label className="inline-flex items-center gap-1.5 text-xs text-[#614D53]">
            <FastForward className="w-3.5 h-3.5 text-[#6B0F24]" />
            <span>Kecepatan:</span>
            <select
              aria-label="Kecepatan animasi fisika"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded-lg border border-[#D8CCD0] bg-white px-2 py-1.5 text-xs font-mono-tabular text-[#1E1417]"
            >
              <option value={0.5}>0,5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          </label>
        </div>
      </div>

      {/* Interactive Motion Stage + Live Integral Proof Graph */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        {/* Motion Canvas SVG */}
        <div className="xl:col-span-7 rounded-xl border border-[#EFE8EA] bg-[#FCFAFB] p-3 flex flex-col justify-between">
          <svg
            viewBox="0 0 540 205"
            className="w-full h-auto"
            role="img"
            aria-label="Simulasi gerak kendaraan bermassa variabel"
          >
            <defs>
              <marker
                id="sim-arrow-green"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#15803D" />
              </marker>
              <marker
                id="sim-arrow-red"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#DC2626" />
              </marker>
            </defs>

            {/* Road Surface */}
            {isInclined ? (
              <polygon
                points="40,185 500,185 500,90"
                fill="#EFE8EA"
                stroke="#8C1D35"
                strokeWidth="2"
              />
            ) : animation.modelType === 'two-segment-road' ? (
              <g>
                <rect
                  x="30"
                  y="150"
                  width={((animation.segment1Km ?? 300) / animation.expectedDistanceKm) * 440}
                  height="12"
                  fill="#4A4044"
                />
                <rect
                  x={30 + ((animation.segment1Km ?? 300) / animation.expectedDistanceKm) * 440}
                  y="150"
                  width={
                    440 -
                    ((animation.segment1Km ?? 300) / animation.expectedDistanceKm) * 440 +
                    30
                  }
                  height="12"
                  fill="#B89B7A"
                />
                <text
                  x={30 + ((animation.segment1Km ?? 300) / animation.expectedDistanceKm) * 440}
                  y="178"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#6B0F24"
                >
                  300 km (μ₁→μ₂)
                </text>
              </g>
            ) : animation.modelType === 'linear-mu-gradient' ? (
              <g>
                <defs>
                  <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5C5356" />
                    <stop offset="100%" stopColor="#C49A6C" />
                  </linearGradient>
                </defs>
                <rect x="30" y="150" width="470" height="12" fill="url(#sandGrad)" />
                <text x="35" y="178" fontSize="9.5" fill="#614D53">μ₀ = 0,05 (halus)</text>
                <text x="415" y="178" fontSize="9.5" fill="#8C5810">μ ≈ 0,15 (pasir)</text>
              </g>
            ) : (
              <line x1="30" y1="152" x2="505" y2="152" stroke="#614D53" strokeWidth="3" />
            )}

            {/* Naive comparison ghost marker if applicable */}
            {animation.naiveDistanceKm && animation.naiveDistanceKm < animation.expectedDistanceKm && (
              <g
                transform={`translate(${
                  60 + (animation.naiveDistanceKm / animation.expectedDistanceKm) * 410
                }, 0)`}
              >
                <line
                  x1="0"
                  y1="40"
                  x2="0"
                  y2="152"
                  stroke="#9E8B91"
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                />
                <text x="0" y="34" textAnchor="middle" fontSize="9.5" fill="#614D53">
                  Batas Massa Tetap ({animation.naiveDistanceKm.toFixed(1).replace('.', ',')} km)
                </text>
              </g>
            )}

            {/* Dropped tank artifact for Q13 */}
            {animation.modelType === 'tank-drop-staging' && instant.tankDropped && (
              <g transform={`translate(${60 + (400.6 / animation.expectedDistanceKm) * 410}, 136)`}>
                <rect x="-14" y="0" width="28" height="14" rx="2" fill="#A36A1C" opacity="0.85" />
                <text x="0" y="-5" textAnchor="middle" fontSize="8.5" fill="#8C5810" fontWeight="600">
                  Tangki Dilepas (-100 kg)
                </text>
              </g>
            )}

            {/* Moving Vehicle + Dynamic Vectors */}
            <g
              transform={`translate(${carX}, ${carY}) rotate(${
                isInclined ? -inclineAngle * 0.6 : 0
              })`}
            >
              {/* Fuel Tank Bar inside car */}
              <rect x="-32" y="-14" width="64" height="24" rx="5" fill="#6B0F24" />
              <rect x="-26" y="-8" width="52" height="10" rx="2" fill="#3A0814" />
              <rect
                x="-26"
                y="-8"
                width={52 * fuelRatio}
                height="10"
                rx="2"
                fill="#F59E0B"
              />
              <circle cx="-18" cy="14" r="6" fill="#1E1417" />
              <circle cx="18" cy="14" r="6" fill="#1E1417" />

              {/* Fuel leak droplets for Q14 */}
              {animation.modelType === 'fuel-leak' && progress < 0.99 && (
                <g>
                  <circle cx="-8" cy="18" r="2.5" fill="#D97706" />
                  <circle cx="-16" cy="24" r="2" fill="#D97706" />
                </g>
              )}

              {/* Forward Thrust Vector (green) */}
              <line
                x1="34"
                y1="-2"
                x2={34 + arrowScale}
                y2="-2"
                stroke="#15803D"
                strokeWidth="2.5"
                markerEnd="url(#sim-arrow-green)"
              />
              <text
                x={36 + arrowScale * 0.45}
                y="-10"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#15803D"
              >
                F={instant.thrustN.toFixed(0)} N
              </text>

              {/* Backward Resistance Vector (red) */}
              <line
                x1="-34"
                y1="-2"
                x2={-34 - arrowScale}
                y2="-2"
                stroke="#DC2626"
                strokeWidth="2.5"
                markerEnd="url(#sim-arrow-red)"
              />
              <text
                x={-36 - arrowScale * 0.5}
                y="-10"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#DC2626"
              >
                f={instant.resistanceN.toFixed(0)} N
              </text>
            </g>

            {/* Distance Axis Markers */}
            <text x="58" y="195" fontSize="10" fill="#614D53">0 km</text>
            <text x="470" y="195" textAnchor="end" fontSize="10" fontWeight="700" fill="#6B0F24">
              {animation.expectedDistanceKm.toFixed(1).replace('.', ',')} km
            </text>
          </svg>

          {/* Live Physics Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#EFE8EA] text-xs">
            <div className="px-2 py-1.5 rounded bg-white border border-[#EFE8EA]">
              <p className="text-[11px] text-[#614D53]">Posisi x</p>
              <p className="font-mono-tabular font-semibold text-[#1E1417]">
                {instant.xKm.toFixed(1).replace('.', ',')} km
              </p>
            </div>
            <div className="px-2 py-1.5 rounded bg-white border border-[#EFE8EA]">
              <p className="text-[11px] text-[#614D53]">Massa Total M</p>
              <p className="font-mono-tabular font-semibold text-[#6B0F24]">
                {instant.massKg.toFixed(1).replace('.', ',')} kg
              </p>
            </div>
            <div className="px-2 py-1.5 rounded bg-white border border-[#EFE8EA]">
              <p className="text-[11px] text-[#614D53]">Gaya Hambat f</p>
              <p className="font-mono-tabular font-semibold text-[#DC2626]">
                {instant.resistanceN.toFixed(1).replace('.', ',')} N
              </p>
            </div>
            <div className="px-2 py-1.5 rounded bg-white border border-[#EFE8EA]">
              <p className="text-[11px] text-[#614D53]">Usaha ∫f dx</p>
              <p className="font-mono-tabular font-semibold text-[#15803D]">
                {instant.workMJ.toFixed(1).replace('.', ',')} MJ
              </p>
            </div>
          </div>
        </div>

        {/* Live Proof Graph: Force vs Distance (Area = Work) */}
        <div className="xl:col-span-5 rounded-xl border border-[#EFE8EA] bg-[#FCFAFB] p-3 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#2A181D]">
              Bukti Grafis: Luas Kurva Gaya ∫f(x) dx = Usaha
            </p>
            <p className="text-[11px] text-[#614D53]">
              Luas daerah terarsir menunjukkan energi mekanik yang telah terkonversi.
            </p>
          </div>
          <svg viewBox="0 0 340 175" className="w-full h-auto mt-1" role="img" aria-label="Grafik gaya hambat terhadap jarak">
            <line x1={gx0} y1="22" x2={gx0} y2={gy0} stroke="#2A181D" strokeWidth="1.2" />
            <line x1={gx0} y1={gy0} x2={gx0 + gw + 10} y2={gy0} stroke="#2A181D" strokeWidth="1.2" />

            {areaPath && <path d={areaPath} fill="#6B0F24" fillOpacity="0.16" />}
            <path d={graphPath} fill="none" stroke="#6B0F24" strokeWidth="2.5" />

            {/* Moving dot on graph */}
            <circle
              cx={gx0 + progress * gw}
              cy={gy0 - (instant.resistanceN / maxForce) * gh}
              r="4.5"
              fill="#6B0F24"
              stroke="white"
              strokeWidth="1.5"
            />

            <text x="8" y="25" fontSize="9.5" fill="#614D53">f (N)</text>
            <text x="10" y="45" fontSize="9" fontFamily="IBM Plex Mono" fill="#614D53">
              {Math.round(maxForce)}
            </text>
            <text x={gx0} y="166" fontSize="9.5" fill="#614D53">0</text>
            <text x={gx0 + gw} y="166" textAnchor="end" fontSize="9.5" fill="#6B0F24" fontWeight="600">
              {animation.expectedDistanceKm.toFixed(1).replace('.', ',')} km
            </text>
          </svg>
        </div>
      </div>

      {/* Stage Timeline Scrubber + Stage Explanation + TTS Sync */}
      <div className="rounded-xl border border-[#EFE8EA] bg-[#FAF7F8] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {animation.stages.map((st, idx) => (
              <button
                key={st.title}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setProgress(st.progressStart);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  idx === currentStageIdx
                    ? 'bg-[#6B0F24] text-white'
                    : 'bg-white border border-[#D8CCD0] text-[#3A272C] hover:bg-[#F2ECEE]'
                }`}
              >
                Tahap {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {onSpeakStage && (
              <>
                <label className="inline-flex items-center gap-1.5 text-xs text-[#3A272C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncTTS}
                    onChange={(e) => setSyncTTS(e.target.checked)}
                    className="accent-[#6B0F24]"
                  />
                  <span>Sinkron Narasi TTS</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onSpeakStage(
                      animation.ttsStages[currentStageIdx] || currentStage.description,
                      `Animasi Tahap ${currentStageIdx + 1}`
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#D8CCD0] bg-white text-xs font-medium text-[#6B0F24] hover:bg-[#F2ECEE] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Narasi Tahap</span>
                </button>
              </>
            )}
          </div>
        </div>

        <input
          type="range"
          aria-label="Penanda posisi animasi fisika"
          min={0}
          max={1}
          step={0.005}
          value={progress}
          onChange={(e) => {
            setIsPlaying(false);
            setProgress(Number(e.target.value));
          }}
          className="w-full accent-[#6B0F24] cursor-pointer"
        />

        <div className="text-sm text-[#2A181D]">
          <p className="font-semibold text-[#6B0F24]">{currentStage?.title}</p>
          <p className="text-xs sm:text-sm text-[#3A272C] mt-0.5 leading-relaxed">
            {currentStage?.description}
          </p>
        </div>
      </div>
    </div>
  );
};
