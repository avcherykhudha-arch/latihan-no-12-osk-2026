import React from 'react';
import { ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { Question } from '../types/physics';
import { MathFormula } from './MathFormula';
import { FreeBodyDiagram } from './FreeBodyDiagram';

interface PembahasanAccordionProps {
  question: Question;
  isOpen: boolean;
  onToggle: () => void;
  onSpeakText: (text: string, label: string) => void;
}

export const PembahasanAccordion: React.FC<PembahasanAccordionProps> = ({
  question,
  isOpen,
  onToggle,
  onSpeakText,
}) => {
  const exp = question.explanation;

  const fullSpeakScript = `
    Pembahasan lengkap Soal Nomor ${question.id}: ${question.title}.
    Langkah pertama, memahami permasalahan: ${exp.langkah1Memahami}
    Langkah keempat, model fisika: ${exp.langkah4ModelFisika}
    Langkah kesebelas, jawaban akhir adalah ${exp.langkah11JawabanAkhir}.
    Interpretasi fisis: ${exp.langkah12Interpretasi}
    Strategi cepat olimpiade: ${exp.langkah13StrategiOlimpiade}
  `;

  return (
    <div className="rounded-xl border border-[#E7DFE2] bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 bg-[#FAF7F8] hover:bg-[#F3ECEF] transition-colors text-left cursor-pointer"
      >
        <div>
          <p className="text-xs font-semibold text-[#6B0F24]">
            Pembahasan Buku Teks Olimpiade (14 Langkah Sistematis)
          </p>
          <p className="text-sm sm:text-base font-semibold text-[#1E1417]">
            {isOpen ? 'TUTUP PEMBAHASAN LENGKAP' : 'BUKA PEMBAHASAN LENGKAP'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold whitespace-nowrap shrink-0">
          {isOpen ? (
            <>
              <span>Tutup</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Buka</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </span>
      </button>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6 border-t border-[#E7DFE2]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFE8EA]">
            <p className="text-xs text-[#614D53]">
              Pelajari setiap langkah penurunan matematis dan interpretasi fisis secara runtut.
            </p>
            <button
              type="button"
              onClick={() => onSpeakText(fullSpeakScript, `Pembahasan Soal ${question.id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D8CCD0] bg-[#FAF7F8] text-xs font-semibold text-[#6B0F24] hover:bg-[#F2ECEE] transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengarkan Pembahasan Mister Jo</span>
            </button>
          </div>

          <div className="space-y-5 text-sm text-[#2A181D] leading-relaxed">
            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 1 – MEMAHAMI PERMASALAHAN
              </h5>
              <p>{exp.langkah1Memahami}</p>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 2 – IDENTIFIKASI DATA
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                {exp.langkah2Data.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 3 – MENENTUKAN BESARAN YANG DITANYAKAN
              </h5>
              <p>{exp.langkah3Target}</p>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 4 – MEMBANGUN MODEL FISIKA
              </h5>
              <p>{exp.langkah4ModelFisika}</p>
            </section>

            <section className="space-y-3">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 5 – DIAGRAM ANALISIS (FREE BODY DIAGRAM)
              </h5>
              <p>{exp.langkah5DiagramNote}</p>
              <FreeBodyDiagram
                fbd={question.fbd}
                onSpeakFBD={(txt) => onSpeakText(txt, `FBD Soal ${question.id}`)}
              />
            </section>

            <section className="space-y-2.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 6 – MEMILIH PERSAMAAN
              </h5>
              <div className="grid grid-cols-1 gap-3">
                {exp.langkah6Persamaan.map((eq, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[#E7D8B6] bg-[#FBF7EE] px-4 py-3"
                  >
                    <p className="text-xs font-medium text-[#8C5810] mb-1">{eq.caption}</p>
                    <div className="overflow-x-auto">
                      <MathFormula latex={eq.latex} displayMode />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 7 – PENURUNAN MATEMATIS
              </h5>
              <ol className="list-decimal pl-5 space-y-1.5">
                {exp.langkah7Penurunan.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 8 – SUBSTITUSI ANGKA
              </h5>
              <ul className="list-disc pl-5 space-y-1 font-mono-tabular text-[13px]">
                {exp.langkah8Substitusi.map((sub, i) => (
                  <li key={i}>{sub}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 9 – PERHITUNGAN
              </h5>
              <ul className="list-disc pl-5 space-y-1 font-mono-tabular text-[13px]">
                {exp.langkah9Perhitungan.map((calc, i) => (
                  <li key={i}>{calc}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 10 – PEMBULATAN
              </h5>
              <p>{exp.langkah10Pembulatan}</p>
            </section>

            <section className="rounded-xl border border-[#DFC99B] bg-[#FBF7EE] p-5 text-center space-y-1">
              <h5 className="text-xs font-bold tracking-wide text-[#8C5810]">
                LANGKAH 11 – JAWABAN AKHIR
              </h5>
              <p className="text-2xl sm:text-3xl font-bold font-mono-tabular text-[#6B0F24]">
                {exp.langkah11JawabanAkhir}
              </p>
              <p className="text-xs text-[#614D53]">
                Toleransi ketelitian ilmiah: ±{question.tolerance.toString().replace('.', ',')}{' '}
                {question.unit} ({question.toleranceRationale})
              </p>
            </section>

            <section className="space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 12 – INTERPRETASI FISIS
              </h5>
              <p>{exp.langkah12Interpretasi}</p>
            </section>

            <section className="rounded-xl border border-[#EFE8EA] bg-[#FAF7F8] p-4 space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#6B0F24]">
                LANGKAH 13 – STRATEGI OLIMPIADE
              </h5>
              <p>{exp.langkah13StrategiOlimpiade}</p>
            </section>

            <section className="rounded-xl border border-[#F2DADA] bg-[#FEF7F7] p-4 space-y-1.5">
              <h5 className="text-xs font-bold tracking-wide text-[#B91C1C]">
                LANGKAH 14 – KESALAHAN UMUM
              </h5>
              <ul className="list-disc pl-5 space-y-1 text-[#3A272C]">
                {exp.langkah14KesalahanUmum.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
