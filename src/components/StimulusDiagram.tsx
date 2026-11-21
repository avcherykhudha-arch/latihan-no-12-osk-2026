import React from 'react';
import { Question } from '../types/physics';

interface StimulusDiagramProps {
  question: Question;
}

export const StimulusDiagram: React.FC<StimulusDiagramProps> = ({ question }) => {
  const renderVisual = () => {
    switch (question.stimulusType) {
      case 'mass-distance-graph':
        return (
          <svg viewBox="0 0 540 240" className="w-full h-auto" role="img" aria-label="Grafik M(x) terhadap jarak x">
            <rect x="0" y="0" width="540" height="240" rx="8" fill="#FCFAFB" />
            {/* Grid lines */}
            <line x1="75" y1="30" x2="75" y2="195" stroke="#2A181D" strokeWidth="1.5" />
            <line x1="75" y1="195" x2="500" y2="195" stroke="#2A181D" strokeWidth="1.5" />
            {/* Horizontal M=1000 kg asymptote / cutoff */}
            <line x1="75" y1="150" x2="480" y2="150" stroke="#9E8B91" strokeDasharray="5 4" strokeWidth="1.2" />
            <text x="14" y="154" fontSize="11" fill="#6B0F24" fontWeight="600">m = 1000</text>
            <text x="14" y="99" fontSize="11" fill="#1E1417" fontWeight="600">1250</text>
            <text x="14" y="49" fontSize="11" fill="#1E1417" fontWeight="600">M₀ = 1500</text>
            <text x="16" y="22" fontSize="11" fill="#614D53" fontWeight="600">M (kg)</text>

            {/* Exponential decay curve from (75,45) through (245,96) to (445,150) */}
            <path
              d="M 75 45 Q 210 86 445 150"
              fill="none"
              stroke="#6B0F24"
              strokeWidth="3"
            />

            {/* Dashed guides for x1 = 300 km */}
            <line x1="75" y1="96" x2="245" y2="96" stroke="#C8B9BE" strokeDasharray="4 3" />
            <line x1="245" y1="96" x2="245" y2="195" stroke="#C8B9BE" strokeDasharray="4 3" />
            <line x1="445" y1="150" x2="445" y2="195" stroke="#C8B9BE" strokeDasharray="4 3" />

            {/* Points */}
            <circle cx="75" cy="45" r="5" fill="#6B0F24" />
            <circle cx="245" cy="96" r="5" fill="#0284C7" />
            <circle cx="445" cy="150" r="5" fill="#15803D" />

            <text x="253" y="90" fontSize="11" fontWeight="600" fill="#0284C7">
              (300 km ; 1250 kg)
            </text>
            <text x="412" y="140" fontSize="11" fontWeight="600" fill="#15803D">
              (x_maks ; 1000 kg)
            </text>

            {/* X labels */}
            <text x="72" y="212" fontSize="11" fill="#1E1417">0</text>
            <text x="232" y="212" fontSize="11" fill="#0284C7" fontWeight="600">300</text>
            <text x="428" y="212" fontSize="11" fill="#15803D" fontWeight="600">x_maks = ?</text>
            <text x="495" y="212" fontSize="11" fill="#614D53" fontWeight="600">x (km)</text>
          </svg>
        );

      case 'inclined-car':
        return (
          <svg viewBox="0 0 540 240" className="w-full h-auto" role="img" aria-label="Kendaraan mendaki tanjakan bersudut theta">
            <rect x="0" y="0" width="540" height="240" rx="8" fill="#FCFAFB" />
            {/* Inclined ramp */}
            <polygon points="70,195 470,195 470,83" fill="#EFE8EA" stroke="#6B0F24" strokeWidth="2" />
            {/* Angle arc */}
            <path d="M 140 195 A 70 70 0 0 0 137 176" fill="none" stroke="#6B0F24" strokeWidth="2" />
            <text x="150" y="185" fontSize="12" fontWeight="700" fill="#6B0F24">
              θ (sin θ = 0,28 ; cos θ = 0,96)
            </text>
            {/* Car on ramp */}
            <g transform="translate(265, 134) rotate(-15.6)">
              <rect x="-38" y="-22" width="76" height="24" rx="5" fill="#6B0F24" />
              <rect x="-24" y="-34" width="42" height="14" rx="3" fill="#8C1D35" />
              <circle cx="-22" cy="4" r="7" fill="#1E1417" />
              <circle cx="22" cy="4" r="7" fill="#1E1417" />
              <line x1="48" y1="-12" x2="95" y2="-12" stroke="#15803D" strokeWidth="2.5" />
              <polygon points="95,-17 105,-12 95,-7" fill="#15803D" />
              <text x="52" y="-20" fontSize="11" fontWeight="700" fill="#15803D">v = konstan</text>
            </g>
            <text x="220" y="34" fontSize="12" fontWeight="600" fill="#1E1417">
              m = 1000 kg · m_b = 250 kg · μ = 0,125
            </text>
            <text x="480" y="145" fontSize="11" fill="#614D53">h</text>
          </svg>
        );

      case 'two-surface-road':
        return (
          <svg viewBox="0 0 540 210" className="w-full h-auto" role="img" aria-label="Lintasan dua segmen aspal dan kerikil">
            <rect x="0" y="0" width="540" height="210" rx="8" fill="#FCFAFB" />
            {/* Segment 1 asphalt */}
            <rect x="40" y="135" width="230" height="16" fill="#4A4044" />
            {/* Segment 2 gravel */}
            <rect x="270" y="135" width="230" height="16" fill="#B89B7A" />
            <text x="155" y="172" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1E1417">
              Segmen 1: Aspal (d₁ = 300 km, μ₁ = 0,08)
            </text>
            <text x="385" y="172" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6B0F24">
              Segmen 2: Berkerikil (d₂ = ?, μ₂ = 0,15)
            </text>
            {/* Divider marker */}
            <line x1="270" y1="75" x2="270" y2="155" stroke="#6B0F24" strokeDasharray="4 3" strokeWidth="1.5" />
            <text x="270" y="65" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6B0F24">
              Batas x = 300 km (Massa = M₁)
            </text>
            {/* Car */}
            <g transform="translate(115, 118)">
              <rect x="-28" y="-14" width="56" height="18" rx="4" fill="#6B0F24" />
              <circle cx="-16" cy="6" r="6" fill="#1E1417" />
              <circle cx="16" cy="6" r="6" fill="#1E1417" />
            </g>
            <text x="40" y="34" fontSize="12" fontWeight="600" fill="#1E1417">
              M₀ = 1250 kg → m = 1000 kg · η = 2940 kJ/kg
            </text>
          </svg>
        );

      case 'dual-tank-staging':
        return (
          <svg viewBox="0 0 540 220" className="w-full h-auto" role="img" aria-label="Skema dua tangki dengan pelepasan tangki eksternal">
            <rect x="0" y="0" width="540" height="220" rx="8" fill="#FCFAFB" />
            {/* Stage 1 Vehicle */}
            <text x="40" y="32" fontSize="12" fontWeight="700" fill="#6B0F24">
              Tahap 1: Bawa Tangki Eksternal (M₀ = 1200 kg → 1050 kg)
            </text>
            <rect x="45" y="48" width="110" height="36" rx="5" fill="#6B0F24" />
            <text x="100" y="70" textAnchor="middle" fontSize="10.5" fill="white" fontWeight="600">
              Sasis 800 + b2 150
            </text>
            <rect x="162" y="50" width="95" height="32" rx="4" fill="#A36A1C" />
            <text x="209" y="70" textAnchor="middle" fontSize="10" fill="white" fontWeight="600">
              m_t 100 + b1 150
            </text>

            {/* Arrow & Drop event */}
            <line x1="275" y1="66" x2="335" y2="66" stroke="#1E1417" strokeWidth="2" />
            <polygon points="335,61 345,66 335,71" fill="#1E1417" />
            <text x="310" y="54" textAnchor="middle" fontSize="10" fontWeight="600" fill="#DC2626">
              Lepas m_t (100 kg)
            </text>

            {/* Stage 2 Vehicle */}
            <text x="40" y="130" fontSize="12" fontWeight="700" fill="#15803D">
              Tahap 2: Tanpa Tangki Eksternal (M₂ = 950 kg → 800 kg)
            </text>
            <rect x="45" y="146" width="110" height="36" rx="5" fill="#6B0F24" />
            <text x="100" y="168" textAnchor="middle" fontSize="10.5" fill="white" fontWeight="600">
              Sasis 800 + b2 150
            </text>
            <rect x="195" y="148" width="85" height="32" rx="4" fill="none" stroke="#DC2626" strokeDasharray="4 3" />
            <text x="237" y="168" textAnchor="middle" fontSize="10" fill="#DC2626" fontWeight="600">
              Tangki Ditinggal
            </text>
          </svg>
        );

      case 'fuel-leak-car':
        return (
          <svg viewBox="0 0 540 210" className="w-full h-auto" role="img" aria-label="Skema kebocoran bahan bakar saat melaju">
            <rect x="0" y="0" width="540" height="210" rx="8" fill="#FCFAFB" />
            <line x1="30" y1="158" x2="510" y2="158" stroke="#614D53" strokeWidth="2" />
            <g transform="translate(220, 128)">
              <rect x="-65" y="-26" width="130" height="38" rx="6" fill="#6B0F24" />
              <rect x="-42" y="-44" width="76" height="20" rx="4" fill="#8C1D35" />
              <circle cx="-40" cy="14" r="10" fill="#1E1417" />
              <circle cx="40" cy="14" r="10" fill="#1E1417" />
              <text x="0" y="-4" textAnchor="middle" fontSize="11" fill="white" fontWeight="600">
                Tangki 300 kg → Bocor
              </text>
              {/* Velocity arrow */}
              <line x1="78" y1="-10" x2="150" y2="-10" stroke="#15803D" strokeWidth="2.5" />
              <polygon points="150,-15 160,-10 150,-5" fill="#15803D" />
              <text x="80" y="-20" fontSize="11" fontWeight="700" fill="#15803D">v = 20 m/s</text>
              {/* Leak droplets */}
              <circle cx="-18" cy="22" r="3" fill="#D97706" />
              <circle cx="-26" cy="34" r="2.5" fill="#D97706" />
              <text x="-12" y="44" fontSize="11" fontWeight="700" fill="#B45309">
                dm_bocor/dt = 0,004 kg/s
              </text>
            </g>
            <text x="36" y="34" fontSize="12" fontWeight="600" fill="#1E1417">
              m = 900 kg · m_b = 300 kg · μ = 0,1 · η = 2940 kJ/kg
            </text>
          </svg>
        );

      case 'gradient-road':
        return (
          <svg viewBox="0 0 540 220" className="w-full h-auto" role="img" aria-label="Grafik kenaikan linear koefisien hambat jalan terhadap jarak">
            <rect x="0" y="0" width="540" height="220" rx="8" fill="#FCFAFB" />
            <line x1="75" y1="30" x2="75" y2="175" stroke="#2A181D" strokeWidth="1.5" />
            <line x1="75" y1="175" x2="495" y2="175" stroke="#2A181D" strokeWidth="1.5" />
            {/* Linear mu(x) */}
            <line x1="75" y1="145" x2="450" y2="55" stroke="#6B0F24" strokeWidth="3" />
            <text x="16" y="148" fontSize="11" fontWeight="600" fill="#6B0F24">μ₀=0,05</text>
            <text x="16" y="32" fontSize="11" fontWeight="600" fill="#614D53">μ(x)</text>
            <text x="275" y="75" fontSize="11.5" fontWeight="700" fill="#6B0F24">
              μ(x) = 0,05 + (2,0×10⁻⁷ m⁻¹)·x
            </text>
            <text x="72" y="195" fontSize="11" fill="#1E1417">0</text>
            <text x="435" y="195" fontSize="11" fontWeight="600" fill="#15803D">x_maks = ? km</text>
            <text x="235" y="195" fontSize="11" fill="#614D53">Posisi x (m)</text>
          </svg>
        );

      case 'efficiency-flow':
        return (
          <svg viewBox="0 0 540 200" className="w-full h-auto" role="img" aria-label="Diagram aliran efisiensi energi bahan bakar 25 persen">
            <rect x="0" y="0" width="540" height="200" rx="8" fill="#FCFAFB" />
            <rect x="30" y="65" width="140" height="70" rx="8" fill="#6B0F24" />
            <text x="100" y="96" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">Energi Pembakaran</text>
            <text x="100" y="114" textAnchor="middle" fontSize="10.5" fill="#F8ECEF">15 kg × 4200 kJ/kg</text>

            <path d="M 170 85 L 280 55" stroke="#15803D" strokeWidth="3" fill="none" />
            <rect x="285" y="30" width="215" height="52" rx="8" fill="#ECFDF5" stroke="#15803D" strokeWidth="1.5" />
            <text x="392" y="53" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#15803D">
              Usaha Mekanik Roda (ε = 25%)
            </text>
            <text x="392" y="70" textAnchor="middle" fontSize="10.5" fill="#166534">
              Melawan f = μMg sepanjang jarak s
            </text>

            <path d="M 170 115 L 280 145" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 3" fill="none" />
            <rect x="285" y="122" width="215" height="46" rx="8" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1" />
            <text x="392" y="144" textAnchor="middle" fontSize="11" fontWeight="600" fill="#B91C1C">
              Rugi Kalor Mesin & Knalpot (75%)
            </text>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 540 190" className="w-full h-auto" role="img" aria-label={question.stimulusCaption}>
            <rect x="0" y="0" width="540" height="190" rx="8" fill="#FCFAFB" />
            <line x1="30" y1="148" x2="510" y2="148" stroke="#614D53" strokeWidth="2" />
            <g transform="translate(175, 118)">
              <rect x="-56" y="-26" width="112" height="36" rx="6" fill="#6B0F24" />
              <rect x="-36" y="-42" width="64" height="18" rx="4" fill="#8C1D35" />
              <circle cx="-34" cy="14" r="9" fill="#1E1417" />
              <circle cx="34" cy="14" r="9" fill="#1E1417" />
              <text x="0" y="-4" textAnchor="middle" fontSize="11" fontWeight="600" fill="white">
                Massa Total M(x)
              </text>
              {/* Velocity arrow */}
              <line x1="70" y1="-10" x2="145" y2="-10" stroke="#15803D" strokeWidth="2.5" />
              <polygon points="145,-15 155,-10 145,-5" fill="#15803D" />
              <text x="72" y="-19" fontSize="11" fontWeight="700" fill="#15803D">v = konstan</text>
              {/* Friction arrow */}
              <line x1="-65" y1="8" x2="-125" y2="8" stroke="#DC2626" strokeWidth="2.5" />
              <polygon points="-125,3 -135,8 -125,13" fill="#DC2626" />
              <text x="-135" y="-2" fontSize="11" fontWeight="700" fill="#DC2626">f = μMg</text>
            </g>
            <text x="30" y="32" fontSize="12" fontWeight="600" fill="#1E1417">
              {question.givenData.map((d) => `${d.symbol} = ${d.value}`).slice(0, 3).join(' · ')}
            </text>
            <text x="30" y="174" fontSize="11" fill="#614D53">
              x = 0 (Tangki Penuh) ─────────────────────────────────────────▶ x = x_maks (Kosong)
            </text>
          </svg>
        );
    }
  };

  return (
    <figure className="rounded-xl border border-[#E7DFE2] bg-white p-4 space-y-2.5">
      <div className="rounded-lg border border-[#EFE8EA] overflow-hidden">
        {renderVisual()}
      </div>
      <figcaption className="text-xs text-[#614D53] leading-relaxed">
        <span className="font-semibold text-[#2A181D]">Stimulus Ilmiah: </span>
        {question.stimulusCaption}
      </figcaption>
    </figure>
  );
};
