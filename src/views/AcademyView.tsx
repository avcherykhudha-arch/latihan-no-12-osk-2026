import React, { useState } from 'react';
import { Volume2, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { ACADEMY_SECTIONS } from '../data/academyData';
import { FormulaShowcaseCard, MathFormula } from '../components/MathFormula';
import { AcademySection, ViewId } from '../types/physics';

interface AcademyViewProps {
  completedIds: number[];
  onToggleComplete: (id: number) => void;
  onSpeakText: (text: string, label: string) => void;
  onNavigate: (view: ViewId, questionId?: number) => void;
}

const AcademyDiagram: React.FC<{ type: AcademySection['diagramType'] }> = ({ type }) => {
  if (!type) return null;

  if (type === 'phenomenon') {
    return (
      <svg viewBox="0 0 600 180" className="w-full h-auto rounded-lg border border-[#EFE8EA] bg-[#FCFAFB]" role="img" aria-label="Ilustrasi perubahan massa dan gaya hambat sepanjang perjalanan">
        <line x1="35" y1="138" x2="565" y2="138" stroke="#614D53" strokeWidth="2" />
        {/* Car at Start */}
        <g transform="translate(115, 112)">
          <rect x="-42" y="-18" width="84" height="24" rx="5" fill="#6B0F24" />
          <rect x="-34" y="-12" width="68" height="8" rx="2" fill="#F59E0B" />
          <circle cx="-24" cy="10" r="7" fill="#1E1417" />
          <circle cx="24" cy="10" r="7" fill="#1E1417" />
          <text x="0" y="-26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6B0F24">Awal: Tangki Penuh (M = m + m_b)</text>
          <line x1="-45" y1="-2" x2="-98" y2="-2" stroke="#DC2626" strokeWidth="2.5" />
          <text x="-98" y="-10" fontSize="10" fontWeight="700" fill="#DC2626">f besar</text>
        </g>

        {/* Car near End */}
        <g transform="translate(445, 112)">
          <rect x="-42" y="-18" width="84" height="24" rx="5" fill="#6B0F24" />
          <rect x="-34" y="-12" width="12" height="8" rx="2" fill="#F59E0B" />
          <circle cx="-24" cy="10" r="7" fill="#1E1417" />
          <circle cx="24" cy="10" r="7" fill="#1E1417" />
          <text x="0" y="-26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#15803D">Akhir: Hampir Kosong (M → m)</text>
          <line x1="-45" y1="-2" x2="-74" y2="-2" stroke="#DC2626" strokeWidth="2" />
          <text x="-82" y="-10" fontSize="10" fontWeight="700" fill="#DC2626">f kecil</text>
        </g>
        <text x="300" y="164" textAnchor="middle" fontSize="11" fill="#614D53">
          Massa bahan bakar terus berkurang → berat mobil mengecil → gaya hambat mengecil!
        </text>
      </svg>
    );
  }

  if (type === 'work-integral') {
    return (
      <svg viewBox="0 0 600 185" className="w-full h-auto rounded-lg border border-[#EFE8EA] bg-[#FCFAFB]" role="img" aria-label="Ilustrasi elemen diferensial dx dan dM">
        <line x1="65" y1="25" x2="65" y2="145" stroke="#1E1417" strokeWidth="1.5" />
        <line x1="65" y1="145" x2="540" y2="145" stroke="#1E1417" strokeWidth="1.5" />
        <path d="M 65 45 Q 250 75 500 105" fill="none" stroke="#6B0F24" strokeWidth="2.5" />
        {/* Differential slice dx */}
        <rect x="255" y="75" width="22" height="70" fill="#6B0F24" fillOpacity="0.22" stroke="#6B0F24" strokeWidth="1.2" />
        <text x="266" y="162" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6B0F24">dx</text>
        <text x="266" y="65" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1E1417">dW = μMg dx = -η dM</text>
        <text x="22" y="30" fontSize="11" fill="#614D53">f = μMg</text>
        <text x="510" y="162" fontSize="11" fill="#614D53">x</text>
      </svg>
    );
  }

  if (type === 'log-vs-linear') {
    return (
      <svg viewBox="0 0 600 190" className="w-full h-auto rounded-lg border border-[#EFE8EA] bg-[#FCFAFB]" role="img" aria-label="Perbandingan jarak tempuh eksak logaritmik terhadap aproksimasi linier">
        <line x1="65" y1="25" x2="65" y2="155" stroke="#1E1417" strokeWidth="1.5" />
        <line x1="65" y1="155" x2="540" y2="155" stroke="#1E1417" strokeWidth="1.5" />
        {/* Upper linear (empty mass) */}
        <line x1="65" y1="155" x2="480" y2="35" stroke="#9E8B91" strokeDasharray="5 4" strokeWidth="1.5" />
        {/* Exact log curve */}
        <path d="M 65 155 Q 260 102 480 65" fill="none" stroke="#6B0F24" strokeWidth="3" />
        {/* Lower naive constant M0 */}
        <path d="M 65 155 Q 260 120 480 95" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="4 3" />
        <text x="485" y="40" fontSize="10.5" fill="#614D53">Aproksimasi m kosong (terlalu besar)</text>
        <text x="485" y="69" fontSize="10.5" fontWeight="700" fill="#6B0F24">Solusi Eksak ln(1 + m_b/m)</text>
        <text x="485" y="99" fontSize="10.5" fill="#0284C7">Aproksimasi M₀ tetap (terlalu kecil)</text>
        <text x="290" y="176" textAnchor="middle" fontSize="11" fill="#614D53">Rasio Bahan Bakar m_b / m</text>
      </svg>
    );
  }

  return null;
};

export const AcademyView: React.FC<AcademyViewProps> = ({
  completedIds,
  onToggleComplete,
  onSpeakText,
  onNavigate,
}) => {
  const [activeId, setActiveId] = useState<number>(1);
  const current = ACADEMY_SECTIONS.find((s) => s.id === activeId) ?? ACADEMY_SECTIONS[0];
  const isCompleted = completedIds.includes(current.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EFE8EA] pb-4">
        <div>
          <p className="text-xs font-semibold text-[#6B0F24]">
            Modul Pembelajaran Bertahap
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1417]">
            AKADEMI KONSEP FISIKA – MISTER JO
          </h1>
          <p className="text-sm text-[#614D53] mt-1">
            Seluruh teori dasar, penurunan kalkulus, dan contoh soal OSK 2026 Nomor 12.
          </p>
        </div>
        <div className="text-xs font-mono-tabular text-[#614D53]">
          Selesai: {completedIds.length} / {ACADEMY_SECTIONS.length} Modul
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Module Navigation Sidebar */}
        <aside className="lg:col-span-4 space-y-2">
          {ACADEMY_SECTIONS.map((sec) => {
            const done = completedIds.includes(sec.id);
            const active = sec.id === current.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveId(sec.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'border-[#6B0F24] bg-[#FBF6F7]'
                    : 'border-[#E7DFE2] bg-white hover:bg-[#FAF7F8]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#614D53]">
                  <span className="font-semibold text-[#6B0F24]">{sec.numberLabel}</span>
                  <span className="inline-flex items-center gap-1">
                    {done ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                        <span className="text-[#15803D] font-medium">Dipahami</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-3.5 h-3.5 text-[#9E8B91]" />
                        <span>Belum</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#1E1417] leading-snug">
                  {sec.title}
                </p>
              </button>
            );
          })}
        </aside>

        {/* Main Content Panel */}
        <article className="lg:col-span-8 rounded-2xl border border-[#E7DFE2] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EFE8EA] pb-5">
            <div className="space-y-1.5 max-w-2xl">
              <p className="text-xs font-semibold text-[#6B0F24]">
                {current.numberLabel} · {current.category}
              </p>
              <h2 className="text-2xl font-bold text-[#1E1417] leading-snug">
                {current.title}
              </h2>
              <p className="text-sm text-[#614D53]">{current.summary}</p>
            </div>

            <button
              type="button"
              onClick={() => onSpeakText(current.ttsScript, `${current.numberLabel}: ${current.title}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>PUTAR PENJELASAN SUARA</span>
            </button>
          </div>

          <div className="space-y-4 text-[15px] text-[#2A181D] leading-relaxed">
            {current.contentParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {current.bullets && (
            <div className="rounded-xl border border-[#EFE8EA] bg-[#FAF7F8] p-5 space-y-2.5">
              <h3 className="text-sm font-bold text-[#1E1417]">Rincian Penting:</h3>
              <ul className="space-y-2 text-sm text-[#2A181D]">
                {current.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-mono-tabular font-semibold text-[#6B0F24] mt-0.5">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {current.formula && <FormulaShowcaseCard formula={current.formula} />}

          {current.diagramType === 'forces-fbd' && (
            <div className="rounded-xl border border-[#DFC99B] bg-[#FBF7EE] p-4 text-sm text-[#2A181D]">
              <p className="font-semibold text-[#8C5810] mb-1">Rumus Referensi Cepat Hukum II Newton:</p>
              <MathFormula latex={String.raw`\Sigma F = m a \implies F_{\text{mesin}} - \mu M g = 0`} displayMode />
            </div>
          )}

          {current.diagramType === 'osk-12-model' && (
            <div className="rounded-xl border border-[#DFC99B] bg-[#FBF7EE] p-5 space-y-2">
              <p className="text-xs font-bold text-[#8C5810]">
                RINGKASAN PERHITUNGAN ASLI OSK FISIKA 2026 SOAL NOMOR 12
              </p>
              <div className="bg-white rounded-lg border border-[#E7D8B6] p-3 overflow-x-auto">
                <MathFormula
                  latex={String.raw`x_{\text{maks}} = \frac{2197,3 \times 10^3\text{ J/kg}}{0,1 \times 9,8\text{ m/s}^2} \ln\left(\frac{4m_b + m_b}{4m_b}\right) = 2242,14\text{ km} \times \ln(1,25) \approx 500,3\text{ km}`}
                  displayMode
                />
              </div>
            </div>
          )}

          <AcademyDiagram type={current.diagramType} />

          {/* Bottom Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#EFE8EA]">
            <button
              type="button"
              onClick={() => onToggleComplete(current.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isCompleted
                  ? 'border-[#15803D] bg-[#ECFDF5] text-[#15803D]'
                  : 'border-[#D8CCD0] bg-white text-[#1E1417] hover:bg-[#FAF7F8]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Sudah Ditandai Dipahami' : 'Tandai Modul Dipahami'}</span>
            </button>

            <div className="flex items-center gap-2">
              {current.id < ACADEMY_SECTIONS.length ? (
                <button
                  type="button"
                  onClick={() => setActiveId(current.id + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] cursor-pointer"
                >
                  <span>Modul Berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('bank-soal', 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] cursor-pointer"
                >
                  <span>Mulai Bank Soal 15 Tantangan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
