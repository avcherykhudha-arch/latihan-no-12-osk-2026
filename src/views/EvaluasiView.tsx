import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { Question, StudentProgress, ViewId } from '../types/physics';
import { STAGES_META } from '../data/questionsData';

interface EvaluasiViewProps {
  questions: Question[];
  progress: StudentProgress;
  onNavigate: (view: ViewId, questionId?: number) => void;
  onResetProgress: () => void;
}

export const EvaluasiView: React.FC<EvaluasiViewProps> = ({
  questions,
  progress,
  onNavigate,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const attempts = Object.values(progress.attemptsById);
  const correctCount = questions.filter(
    (q) => progress.attemptsById[q.id]?.isCorrect
  ).length;
  const wrongCount = questions.filter(
    (q) =>
      progress.attemptsById[q.id]?.hasTried &&
      !progress.attemptsById[q.id]?.isCorrect
  ).length;
  const unansweredCount = questions.length - correctCount - wrongCount;
  const masteryPct = Math.round((correctCount / questions.length) * 100);
  const totalScore = Math.round((correctCount / questions.length) * 100);

  // Determine weak stages & academy recommendations
  const stageStats = STAGES_META.map((stage) => {
    const qs = questions.filter((q) => q.stage === stage.id);
    const solved = qs.filter((q) => progress.attemptsById[q.id]?.isCorrect).length;
    const pct = Math.round((solved / qs.length) * 100);
    return { stage, qs, solved, pct };
  });

  const weakStages = stageStats.filter((s) => s.pct < 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EFE8EA] pb-4">
        <div>
          <p className="text-xs font-semibold text-[#6B0F24]">
            Laporan Penguasaan Kompetensi OSK 2026 Soal 12
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1417]">
            Evaluasi & Rekapitulasi Belajar
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D8CCD0] bg-white text-xs font-semibold text-[#614D53] hover:text-[#B91C1C] hover:border-[#FCA5A5] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progres</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#FEF2F2] border border-[#FCA5A5] px-3 py-1.5 rounded-xl">
              <span className="text-xs font-medium text-[#7F1D1D]">
                Hapus semua progres?
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#B91C1C] text-white text-xs font-semibold cursor-pointer"
              >
                Ya, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2.5 py-1 rounded-lg border border-[#D8CCD0] bg-white text-xs font-medium text-[#1E1417] cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
          <p className="text-xs text-[#614D53]">Skor Total Lab</p>
          <p className="mt-1 text-3xl font-bold font-mono-tabular text-[#6B0F24]">
            {totalScore}
            <span className="text-base font-normal text-[#614D53]"> / 100</span>
          </p>
          <p className="mt-1 text-xs text-[#614D53]">
            {attempts.reduce((sum, a) => sum + a.attempts, 0)} total percobaan
          </p>
        </div>

        <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
          <p className="text-xs text-[#614D53]">Jumlah Soal Benar</p>
          <p className="mt-1 text-3xl font-bold font-mono-tabular text-[#15803D]">
            {correctCount}
          </p>
          <p className="mt-1 text-xs text-[#614D53]">dari 15 tantangan</p>
        </div>

        <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
          <p className="text-xs text-[#614D53]">Belum Tepat / Belum Dijawab</p>
          <p className="mt-1 text-3xl font-bold font-mono-tabular text-[#B91C1C]">
            {wrongCount}{' '}
            <span className="text-base font-normal text-[#614D53]">
              / {unansweredCount} kosong
            </span>
          </p>
          <p className="mt-1 text-xs text-[#614D53]">Perlu latihan ulang</p>
        </div>

        <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
          <p className="text-xs text-[#614D53]">Persentase Penguasaan</p>
          <p className="mt-1 text-3xl font-bold font-mono-tabular text-[#1E1417]">
            {masteryPct}%
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-[#EFE8EA] overflow-hidden">
            <div
              className="h-full bg-[#6B0F24] transition-all duration-300"
              style={{ width: `${masteryPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Breakdown + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-[#E7DFE2] bg-white p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#1E1417]">
            Rincian Penguasaan per Tahap (1–5)
          </h2>
          <div className="space-y-4">
            {stageStats.map(({ stage, qs, solved, pct }) => (
              <div key={stage.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#1E1417]">{stage.title}</span>
                  <span className="font-mono-tabular text-xs font-semibold text-[#6B0F24]">
                    {solved}/{qs.length} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#EFE8EA] overflow-hidden">
                  <div
                    className="h-full bg-[#6B0F24] transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-[#614D53]">{stage.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-[#DFC99B] bg-[#FBF7EE] p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#8C5810]">
            <Award className="w-5 h-5" />
            <h2 className="text-lg font-bold text-[#1E1417]">
              Rekomendasi Belajar Mister Jo
            </h2>
          </div>

          {weakStages.length === 0 ? (
            <div className="space-y-3 text-sm text-[#14532D]">
              <p className="font-semibold">
                Luar biasa! Anda telah menaklukkan seluruh 15 tantangan OSK 2026 Soal 12!
              </p>
              <p className="text-xs leading-relaxed">
                Anda siap menghadapi variasi soal dinamika massa variabel di tingkat
                Kabupaten/Kota maupun Provinsi.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[#3A272C] leading-relaxed">
                Fokuskan pendalaman pada tahap yang belum mencapai 100% di bawah ini:
              </p>
              <ul className="space-y-2">
                {weakStages.slice(0, 3).map(({ stage }) => (
                  <li
                    key={stage.id}
                    className="rounded-xl border border-[#E7D8B6] bg-white p-3 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#6B0F24]">{stage.title}</p>
                      <p className="text-[11px] text-[#614D53]">
                        Soal {stage.questionRange[0]}–{stage.questionRange[1]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('bank-soal', stage.questionRange[0])}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] cursor-pointer"
                    >
                      <span>Latih</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onNavigate('akademi')}
                className="w-full py-2.5 rounded-xl border border-[#6B0F24] bg-white text-xs font-semibold text-[#6B0F24] hover:bg-[#FBF6F7] cursor-pointer"
              >
                Pelajari Ulang Teori di Akademi Konsep
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Question-by-Question Table */}
      <div className="rounded-2xl border border-[#E7DFE2] bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EFE8EA]">
          <h2 className="text-base font-bold text-[#1E1417]">
            Rekapitulasi Skor per Nomor Soal
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#FAF7F8] border-b border-[#EFE8EA] text-[#614D53]">
              <tr>
                <th className="px-4 py-3 font-semibold">No</th>
                <th className="px-4 py-3 font-semibold">Judul Soal</th>
                <th className="px-4 py-3 font-semibold">Tingkat</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Jawaban Terakhir</th>
                <th className="px-4 py-3 font-semibold text-right">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8EA]">
              {questions.map((q) => {
                const att = progress.attemptsById[q.id];
                return (
                  <tr key={q.id} className="hover:bg-[#FCFAFB]">
                    <td className="px-4 py-3 font-mono-tabular font-semibold text-[#6B0F24]">
                      {String(q.id).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onNavigate('bank-soal', q.id)}
                        className="font-semibold text-[#1E1417] hover:text-[#6B0F24] text-left cursor-pointer"
                      >
                        {q.title}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#614D53]">{q.difficultyLabel}</td>
                    <td className="px-4 py-3">
                      {att?.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-[#15803D] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Benar</span>
                        </span>
                      ) : att?.hasTried ? (
                        <span className="inline-flex items-center gap-1 text-[#B91C1C] font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Belum Tepat</span>
                        </span>
                      ) : (
                        <span className="text-[#614D53]">Belum Dikerjakan</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono-tabular text-[#1E1417]">
                      {att?.lastInput ? `${att.lastInput} ${q.unit}` : '—'}
                    </td>
                    <td className="px-4 py-3 font-mono-tabular font-bold text-right text-[#1E1417]">
                      {att?.isCorrect ? '100' : '0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
