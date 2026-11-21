import React from 'react';
import { ArrowRight, BookOpen, Compass, FlaskConical, Award } from 'lucide-react';
import { Question, StudentProgress, ViewId } from '../types/physics';
import { STAGES_META } from '../data/questionsData';
import { ACADEMY_SECTIONS } from '../data/academyData';
import { MathFormula } from '../components/MathFormula';

interface HomeViewProps {
  questions: Question[];
  progress: StudentProgress;
  onNavigate: (view: ViewId, questionId?: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  questions,
  progress,
  onNavigate,
}) => {
  const attempts = Object.values(progress.attemptsById);
  const triedCount = attempts.filter((a) => a.hasTried).length;
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const masteryPct = Math.round((correctCount / questions.length) * 100);
  const academyPct = Math.round(
    (progress.academyCompletedIds.length / ACADEMY_SECTIONS.length) * 100
  );

  // Find next unsolved question
  const nextQuestion =
    questions.find((q) => !progress.attemptsById[q.id]?.isCorrect) ?? questions[0];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 py-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-wide text-[#6B0F24]">
              15 Challenges · OSK Physics 2026 · Special Training: Question Number 12
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight text-[#1E1417]">
              MISTER JO
              <span className="block text-[#6B0F24] mt-1">
                PHYSICS OLYMPIAD TRAINING LAB
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#3A272C] max-w-2xl leading-relaxed">
              Belajar memahami fenomena. Menguasai prinsip fisika. Menaklukkan tantangan
              olimpiade melalui analisis sistem bermassa variabel pada Soal Nomor 12 OSK
              Fisika 2026.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('bank-soal', nextQuestion.id)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B0F24] text-white text-sm font-semibold hover:bg-[#8C1D35] transition-colors cursor-pointer"
            >
              <span>
                {triedCount > 0
                  ? `Lanjutkan Soal Nomor ${nextQuestion.id}`
                  : 'Mulai Tantangan Soal 1'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('akademi')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#D8CCD0] bg-white text-[#1E1417] text-sm font-semibold hover:bg-[#FAF7F8] transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#6B0F24]" />
              <span>Buka Akademi Konsep</span>
            </button>
          </div>
        </div>

        {/* Instructor & Core Equation Card */}
        <div className="lg:col-span-5 rounded-2xl border border-[#E7DFE2] bg-[#FAF7F8] p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#6B0F24] text-white font-display font-bold text-lg flex items-center justify-center shrink-0">
                MJ
              </div>
              <div>
                <p className="text-xs font-medium text-[#614D53]">Pembina & Narator Lab</p>
                <h2 className="text-lg font-bold text-[#1E1417]">Mister Jo</h2>
              </div>
            </div>
            <p className="text-sm text-[#3A272C] leading-relaxed">
              “Dalam soal olimpiade fisika, rumus hanyalah muara akhir. Kunci sebenarnya
              adalah melihat bagaimana setiap elemen kecil bahan bakar bekerja melawan
              gaya hambat sesaat di sepanjang lintasan.”
            </p>
          </div>

          <div className="rounded-xl border border-[#DFC99B] bg-[#FBF7EE] p-4 space-y-2">
            <p className="text-xs font-semibold text-[#8C5810]">
              Fokus Konsep Soal Nomor 12 (OSK 2026)
            </p>
            <div className="bg-white rounded-lg border border-[#E7D8B6] px-3 py-2 text-center overflow-x-auto">
              <MathFormula
                latex={String.raw`-\eta\,dM = \mu M g\,dx \implies x_{\text{maks}} = \frac{\eta}{\mu g}\ln\left(1 + \frac{m_b}{m}\right)`}
                displayMode
              />
            </div>
            <p className="text-xs text-[#614D53]">
              Usaha-Energi Sistem Bermassa Variabel · Gaya Hambat Bergantung Berat
            </p>
          </div>
        </div>
      </section>

      {/* 4-Column Progress KPI Strip */}
      <section aria-label="Ringkasan Progres Siswa">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
            <p className="text-xs text-[#614D53]">Progres Bank Soal</p>
            <p className="mt-1 text-2xl font-bold font-mono-tabular text-[#1E1417]">
              {triedCount} / {questions.length}
            </p>
            <p className="mt-1 text-xs text-[#614D53]">Soal sudah dicoba</p>
          </div>

          <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
            <p className="text-xs text-[#614D53]">Jawaban Tepat</p>
            <p className="mt-1 text-2xl font-bold font-mono-tabular text-[#15803D]">
              {correctCount} / {questions.length}
            </p>
            <p className="mt-1 text-xs text-[#614D53]">Terverifikasi desimal koma</p>
          </div>

          <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
            <p className="text-xs text-[#614D53]">Persentase Penguasaan</p>
            <p className="mt-1 text-2xl font-bold font-mono-tabular text-[#6B0F24]">
              {masteryPct}%
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[#EFE8EA] overflow-hidden">
              <div
                className="h-full bg-[#6B0F24] transition-all duration-300"
                style={{ width: `${masteryPct}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#E7DFE2] bg-white p-5">
            <p className="text-xs text-[#614D53]">Akademi Konsep</p>
            <p className="mt-1 text-2xl font-bold font-mono-tabular text-[#1E1417]">
              {academyPct}%
            </p>
            <p className="mt-1 text-xs text-[#614D53]">
              {progress.academyCompletedIds.length} dari {ACADEMY_SECTIONS.length} modul selesai
            </p>
          </div>
        </div>
      </section>

      {/* Learning Goals & 5-Stage Roadmap */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EFE8EA] pb-3">
          <div>
            <p className="text-xs font-semibold text-[#6B0F24]">Kurikulum Bertahap</p>
            <h2 className="text-2xl font-bold text-[#1E1417]">
              Lima Tahap Penguasaan Olimpiade
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('evaluasi')}
            className="text-xs font-semibold text-[#6B0F24] hover:underline cursor-pointer"
          >
            Lihat Rekap Evaluasi Lengkap →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STAGES_META.map((stage) => {
            const stageQs = questions.filter((q) => q.stage === stage.id);
            const stageSolved = stageQs.filter(
              (q) => progress.attemptsById[q.id]?.isCorrect
            ).length;

            return (
              <div
                key={stage.id}
                className="rounded-xl border border-[#E7DFE2] bg-white p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#614D53]">
                    <span>
                      Soal {stage.questionRange[0]}–{stage.questionRange[1]}
                    </span>
                    <span className="font-mono-tabular font-semibold text-[#6B0F24]">
                      {stageSolved}/{stageQs.length} Benar
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1E1417]">{stage.title}</h3>
                  <p className="text-sm text-[#3A272C] leading-relaxed">
                    {stage.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('bank-soal', stage.questionRange[0])}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B0F24] hover:text-[#8C1D35] cursor-pointer"
                >
                  <span>Kerjakan Tahap {stage.id}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Quick Lab Access Card */}
          <div className="rounded-xl border border-[#E7DFE2] bg-[#FAF7F8] p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6B0F24]">
                <FlaskConical className="w-4 h-4" />
                <span>Simulasi Interaktif & FBD</span>
              </div>
              <h3 className="text-base font-bold text-[#1E1417]">
                Laboratorium Animasi Fisika
              </h3>
              <p className="text-sm text-[#3A272C] leading-relaxed">
                Amati pembuktian langsung penurunan massa M(x), perubahan vektor gaya
                hambat, dan kurva integral kerja pada 15 skenario fisis.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('lab-animasi')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B0F24] hover:text-[#8C1D35] cursor-pointer"
            >
              <span>Masuk ke Laboratorium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pedagogical Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-[#EFE8EA]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1417]">
            <Compass className="w-4 h-4 text-[#6B0F24]" />
            <span>Validasi Desimal Olimpiade</span>
          </div>
          <p className="text-sm text-[#614D53] leading-relaxed">
            Seluruh isian singkat mewajibkan ketelitian satu angka di belakang koma
            dengan pemisah koma (contoh: 500,3), disertai umpan balik diagnostik.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1417]">
            <BookOpen className="w-4 h-4 text-[#6B0F24]" />
            <span>Pembahasan 14 Langkah</span>
          </div>
          <p className="text-sm text-[#614D53] leading-relaxed">
            Dari identifikasi data, FBD terperinci, penurunan kalkulus, hingga strategi
            cepat olimpiade dan jebakan umum peserta.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1417]">
            <Award className="w-4 h-4 text-[#6B0F24]" />
            <span>Narator Suara Mister Jo</span>
          </div>
          <p className="text-sm text-[#614D53] leading-relaxed">
            Dilengkapi sistem pembacaan rumus dan fenomena fisika berbahasa Indonesia
            yang membimbing siswa di setiap modul dan soal.
          </p>
        </div>
      </section>
    </div>
  );
};
