import React, { useState } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import { Question, QuestionAttempt, StageId, ViewId } from '../types/physics';
import { STAGES_META } from '../data/questionsData';
import { MathFormula } from '../components/MathFormula';
import { PembahasanAccordion } from '../components/PembahasanAccordion';

interface PembahasanViewProps {
  questions: Question[];
  attemptsById: Record<number, QuestionAttempt>;
  onSpeakText: (text: string, label: string) => void;
  onNavigate: (view: ViewId, questionId?: number) => void;
}

export const PembahasanView: React.FC<PembahasanViewProps> = ({
  questions,
  attemptsById,
  onSpeakText,
  onNavigate,
}) => {
  const [stageFilter, setStageFilter] = useState<StageId | 'all'>('all');
  const [openIds, setOpenIds] = useState<Record<number, boolean>>({ 1: true });

  const filtered =
    stageFilter === 'all'
      ? questions
      : questions.filter((q) => q.stage === stageFilter);

  const toggleId = (id: number) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EFE8EA] pb-4">
        <div>
          <p className="text-xs font-semibold text-[#6B0F24]">
            Arsip Solusi Buku Teks & Strategi Olimpiade
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1417]">
            Pembahasan Lengkap 15 Tantangan
          </h1>
          <p className="text-sm text-[#614D53] mt-1">
            Ringkasan rumus utama, trik efisiensi olimpiade, kesalahan umum, dan narasi
            Mister Jo untuk setiap soal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F1F2] rounded-xl">
          <button
            type="button"
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              stageFilter === 'all'
                ? 'bg-white text-[#6B0F24] shadow-sm'
                : 'text-[#614D53] hover:text-[#1E1417]'
            }`}
          >
            Semua
          </button>
          {STAGES_META.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStageFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                stageFilter === st.id
                  ? 'bg-white text-[#6B0F24] shadow-sm'
                  : 'text-[#614D53] hover:text-[#1E1417]'
              }`}
            >
              Tahap {st.id}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((q) => {
          const att = attemptsById[q.id];
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-[#E7DFE2] bg-white p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#6B0F24]">
                    Soal {q.id} · {q.stageLabel} ·{' '}
                    {att?.isCorrect
                      ? 'Sudah Dikuasai'
                      : att?.hasTried
                      ? 'Perlu Review'
                      : 'Belum Dikerjakan'}
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E1417]">
                    {q.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSpeakText(q.ttsExplanationSummary, `Intisari Soal ${q.id}`)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CCD0] bg-[#FAF7F8] text-xs font-semibold text-[#6B0F24] hover:bg-[#F2ECEE] cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ringkasan Suara</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('bank-soal', q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CCD0] bg-white text-xs font-semibold text-[#1E1417] hover:bg-[#FAF7F8] cursor-pointer"
                  >
                    <span>Kerjakan Soal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Key Equation & Olympiad Strategy Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 rounded-xl border border-[#E7D8B6] bg-[#FBF7EE] p-4 space-y-1">
                  <p className="text-[11px] font-bold text-[#8C5810]">RUMUS UTAMA</p>
                  <div className="overflow-x-auto">
                    <MathFormula
                      latex={q.explanation.langkah6Persamaan[0]?.latex ?? ''}
                      displayMode
                    />
                  </div>
                </div>
                <div className="lg:col-span-6 rounded-xl border border-[#EFE8EA] bg-[#FAF7F8] p-4 space-y-1">
                  <p className="text-[11px] font-bold text-[#6B0F24]">
                    STRATEGI OLIMPIADE MISTER JO
                  </p>
                  <p className="text-xs sm:text-sm text-[#2A181D] leading-relaxed">
                    {q.explanation.langkah13StrategiOlimpiade}
                  </p>
                </div>
              </div>

              <PembahasanAccordion
                question={q}
                isOpen={Boolean(openIds[q.id])}
                onToggle={() => toggleId(q.id)}
                onSpeakText={onSpeakText}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
