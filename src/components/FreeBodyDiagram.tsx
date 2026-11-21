import React, { useState } from 'react';
import { Maximize2, Minimize2, Volume2 } from 'lucide-react';
import { FBDConfig } from '../types/physics';

interface FreeBodyDiagramProps {
  fbd: FBDConfig;
  onSpeakFBD?: (text: string) => void;
}

export const FreeBodyDiagram: React.FC<FreeBodyDiagramProps> = ({ fbd, onSpeakFBD }) => {
  const [zoomed, setZoomed] = useState(false);
  const [selectedVectorId, setSelectedVectorId] = useState<string | null>(
    fbd.vectors[0]?.id ?? null
  );

  const angleRad = (fbd.surfaceAngleDeg * Math.PI) / 180;
  const isInclined = Math.abs(fbd.surfaceAngleDeg) > 0.1;

  // Compute rotated coordinate unit vectors for inclined plane (moving UP incline to the right-up)
  // Screen y goes down; moving up-right incline means direction (+cos(theta), -sin(theta))
  const tx = Math.cos(angleRad);
  const ty = -Math.sin(angleRad);
  const nx = -Math.sin(angleRad);
  const ny = -Math.cos(angleRad);

  const selectedVector =
    fbd.vectors.find((v) => v.id === selectedVectorId) || fbd.vectors[0];

  const renderSvg = (large: boolean) => {
    const cx = 210;
    const cy = 145;

    // Determine arrow endpoints for standard vectors
    const hasAero = fbd.vectors.some((v) => v.id === 'Fa');

    return (
      <svg
        viewBox="0 0 420 280"
        className={`w-full ${large ? 'max-h-[480px]' : 'max-h-[280px]'} select-none`}
        role="img"
        aria-label={fbd.title}
      >
        <defs>
          <marker
            id="arrow-W"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#6B0F24" />
          </marker>
          <marker
            id="arrow-N"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
          </marker>
          <marker
            id="arrow-F"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#15803D" />
          </marker>
          <marker
            id="arrow-f"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#DC2626" />
          </marker>
          <marker
            id="arrow-Fa"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#D97706" />
          </marker>
          <marker
            id="arrow-comp"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#8C1D35" />
          </marker>
        </defs>

        {/* Subtle coordinate grid */}
        <rect x="0" y="0" width="420" height="280" rx="10" fill="#FCFAFB" />

        {/* Coordinate axes indicator top-left */}
        <g transform="translate(36, 48)">
          <line
            x1="0"
            y1="0"
            x2={28 * tx}
            y2={28 * ty}
            stroke="#9E8B91"
            strokeWidth="1.5"
          />
          <text
            x={32 * tx}
            y={32 * ty + 3}
            fontSize="10"
            fill="#614D53"
            fontFamily="IBM Plex Mono, monospace"
          >
            {isInclined ? "x'" : 'x'}
          </text>
          <line
            x1="0"
            y1="0"
            x2={28 * nx}
            y2={28 * ny}
            stroke="#9E8B91"
            strokeWidth="1.5"
          />
          <text
            x={32 * nx - 4}
            y={32 * ny - 2}
            fontSize="10"
            fill="#614D53"
            fontFamily="IBM Plex Mono, monospace"
          >
            {isInclined ? "y'" : 'y'}
          </text>
        </g>

        {/* Dashed reference surface */}
        <line
          x1={cx - 145 * tx}
          y1={cy - 145 * ty + 20 * -ny}
          x2={cx + 145 * tx}
          y2={cy + 145 * ty + 20 * -ny}
          stroke="#C8B9BE"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Inclined angle arc if inclined */}
        {isInclined && (
          <g>
            <line
              x1={cx - 120}
              y1={cy + 55}
              x2={cx + 60}
              y2={cy + 55}
              stroke="#C8B9BE"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text
              x={cx - 65}
              y={cy + 48}
              fontSize="11"
              fill="#614D53"
              fontWeight="600"
            >
              θ = {fbd.surfaceAngleDeg.toFixed(1).replace('.', ',')}°
            </text>
          </g>
        )}

        {/* Rotated coordinate dashed lines through center of mass */}
        <line
          x1={cx - 130 * tx}
          y1={cy - 130 * ty}
          x2={cx + 130 * tx}
          y2={cy + 130 * ty}
          stroke="#E5DCE0"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <line
          x1={cx - 95 * nx}
          y1={cy - 95 * ny}
          x2={cx + 95 * nx}
          y2={cy + 95 * ny}
          stroke="#E5DCE0"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Vehicle rigid body block */}
        <g transform={`translate(${cx}, ${cy}) rotate(${-fbd.surfaceAngleDeg})`}>
          <rect
            x="-32"
            y="-16"
            width="64"
            height="28"
            rx="6"
            fill="#F4EBEF"
            stroke="#6B0F24"
            strokeWidth="2"
          />
          <circle cx="-18" cy="14" r="5" fill="#2A181D" />
          <circle cx="18" cy="14" r="5" fill="#2A181D" />
          <circle cx="0" cy="-2" r="3.5" fill="#6B0F24" />
          <text
            x="0"
            y="-22"
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="#2A181D"
          >
            Mobil M(x)
          </text>
        </g>

        {/* Vector: Weight W = Mg (always straight down) */}
        <g
          onClick={() => setSelectedVectorId('W')}
          className="cursor-pointer"
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy + 88}
            stroke="#6B0F24"
            strokeWidth={selectedVectorId === 'W' ? 3.5 : 2.5}
            markerEnd="url(#arrow-W)"
          />
          <text
            x={cx + 8}
            y={cy + 84}
            fontSize="12"
            fontWeight="700"
            fill="#6B0F24"
          >
            W = Mg
          </text>
        </g>

        {/* Weight components if inclined */}
        {isInclined && (
          <g>
            {/* Mg cos theta (-y') */}
            <line
              x1={cx}
              y1={cy}
              x2={cx - 84 * nx}
              y2={cy - 84 * ny}
              stroke="#8C1D35"
              strokeWidth="1.8"
              strokeDasharray="4 2"
              markerEnd="url(#arrow-comp)"
            />
            <text
              x={cx - 84 * nx + 8}
              y={cy - 84 * ny + 10}
              fontSize="10.5"
              fontWeight="600"
              fill="#8C1D35"
            >
              Mg cos θ
            </text>
            {/* Mg sin theta (-x') */}
            <line
              x1={cx}
              y1={cy}
              x2={cx - 56 * tx}
              y2={cy - 56 * ty}
              stroke="#8C1D35"
              strokeWidth="1.8"
              strokeDasharray="4 2"
              markerEnd="url(#arrow-comp)"
            />
            <text
              x={cx - 56 * tx - 52}
              y={cy - 56 * ty + 16}
              fontSize="10.5"
              fontWeight="600"
              fill="#8C1D35"
            >
              Mg sin θ
            </text>
          </g>
        )}

        {/* Vector: Normal Force N (+y') */}
        <g
          onClick={() => setSelectedVectorId('N')}
          className="cursor-pointer"
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx + 84 * nx}
            y2={cy + 84 * ny}
            stroke="#0284C7"
            strokeWidth={selectedVectorId === 'N' ? 3.5 : 2.5}
            markerEnd="url(#arrow-N)"
          />
          <text
            x={cx + 84 * nx + 8}
            y={cy + 84 * ny + 4}
            fontSize="12"
            fontWeight="700"
            fill="#0284C7"
          >
            {isInclined ? 'N = Mg cos θ' : 'N'}
          </text>
        </g>

        {/* Vector: Thrust Force F_mesin (+x') */}
        <g
          onClick={() => setSelectedVectorId('F')}
          className="cursor-pointer"
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx + 108 * tx}
            y2={cy + 108 * ty}
            stroke="#15803D"
            strokeWidth={selectedVectorId === 'F' ? 3.5 : 2.5}
            markerEnd="url(#arrow-F)"
          />
          <text
            x={cx + 108 * tx - 14}
            y={cy + 108 * ty - 10}
            fontSize="12"
            fontWeight="700"
            fill="#15803D"
          >
            F_mesin
          </text>
        </g>

        {/* Vector: Road Resistance f (-x') */}
        <g
          onClick={() => setSelectedVectorId('f')}
          className="cursor-pointer"
        >
          <line
            x1={cx}
            y1={cy - (hasAero ? 7 : 0)}
            x2={cx - 100 * tx}
            y2={cy - 100 * ty - (hasAero ? 7 : 0)}
            stroke="#DC2626"
            strokeWidth={selectedVectorId === 'f' ? 3.5 : 2.5}
            markerEnd="url(#arrow-f)"
          />
          <text
            x={cx - 108 * tx - 26}
            y={cy - 108 * ty - (hasAero ? 14 : 10)}
            fontSize="11.5"
            fontWeight="700"
            fill="#DC2626"
          >
            {isInclined ? 'f = μN' : 'f = μMg'}
          </text>
        </g>

        {/* Optional Aero Drag vector */}
        {hasAero && (
          <g
            onClick={() => setSelectedVectorId('Fa')}
            className="cursor-pointer"
          >
            <line
              x1={cx}
              y1={cy + 10}
              x2={cx - 75 * tx}
              y2={cy - 75 * ty + 10}
              stroke="#D97706"
              strokeWidth={selectedVectorId === 'Fa' ? 3.5 : 2.5}
              markerEnd="url(#arrow-Fa)"
            />
            <text
              x={cx - 82 * tx - 38}
              y={cy - 82 * ty + 24}
              fontSize="11"
              fontWeight="700"
              fill="#D97706"
            >
              F_udara
            </text>
          </g>
        )}

        {/* Velocity indicator (v = konstan) detached above body */}
        <g transform="translate(300, 34)">
          <line
            x1="0"
            y1="0"
            x2="55"
            y2="0"
            stroke="#4A0817"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            markerEnd="url(#arrow-W)"
          />
          <text x="0" y="-6" fontSize="10" fontWeight="600" fill="#4A0817">
            v = konstan (a = 0)
          </text>
        </g>
      </svg>
    );
  };

  return (
    <div className="rounded-xl border border-[#E7DFE2] bg-white p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-[#6B0F24]">
            Free Body Diagram (FBD)
          </p>
          <h4 className="text-base font-semibold text-[#1E1417]">{fbd.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {onSpeakFBD && (
            <button
              type="button"
              onClick={() => onSpeakFBD(fbd.ttsSummary)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CCD0] bg-[#FAF7F8] text-xs font-medium text-[#2A181D] hover:bg-[#F2ECEE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#6B0F24]" />
              <span>Penjelasan FBD</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label="Perbesar Free Body Diagram"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CCD0] bg-white text-xs font-medium text-[#2A181D] hover:bg-[#FAF7F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Perbesar FBD</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-7 rounded-lg border border-[#EFE8EA] overflow-hidden">
          {renderSvg(false)}
        </div>

        <div className="lg:col-span-5 space-y-2">
          <p className="text-xs font-medium text-[#614D53]">
            Klik vektor gaya untuk membaca rincian fisis:
          </p>
          <div className="space-y-1.5">
            {fbd.vectors.map((vec) => {
              const active = vec.id === selectedVector?.id;
              return (
                <button
                  key={vec.id}
                  type="button"
                  onClick={() => setSelectedVectorId(vec.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    active
                      ? 'border-[#6B0F24] bg-[#FBF6F7]'
                      : 'border-[#EFE8EA] bg-white hover:bg-[#FAF7F8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold flex items-center gap-2 text-[#1E1417]">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: vec.color }}
                      />
                      <span className="font-mono-tabular">{vec.symbol}</span>
                      <span className="font-normal text-[#614D53]">· {vec.label}</span>
                    </span>
                    <span className="text-[11px] font-mono-tabular text-[#614D53]">
                      {vec.magnitudeDesc}
                    </span>
                  </div>
                  {active && (
                    <p className="mt-1.5 text-xs text-[#3A272C] leading-relaxed">
                      <span className="font-semibold">Arah:</span> {vec.directionText}.{' '}
                      {vec.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Perbesaran ${fbd.title}`}
        >
          <div className="bg-white rounded-2xl border border-[#E7DFE2] max-w-4xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#1E1417]">{fbd.title}</h3>
              <button
                type="button"
                onClick={() => setZoomed(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CCD0] text-xs font-medium text-[#1E1417] hover:bg-[#FAF7F8] cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Tutup Perbesaran</span>
              </button>
            </div>
            <div className="rounded-xl border border-[#EFE8EA] p-2">
              {renderSvg(true)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#3A272C]">
              {fbd.vectors.map((vec) => (
                <div
                  key={vec.id}
                  className="p-3 rounded-lg border border-[#EFE8EA] bg-[#FAF7F8]"
                >
                  <p className="font-semibold text-[#1E1417] flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: vec.color }}
                    />
                    <span>
                      {vec.symbol} ({vec.label})
                    </span>
                  </p>
                  <p className="mt-1">
                    <strong>Arah:</strong> {vec.directionText} · <strong>Besar:</strong>{' '}
                    {vec.magnitudeDesc}
                  </p>
                  <p className="mt-0.5 text-[#614D53]">{vec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
