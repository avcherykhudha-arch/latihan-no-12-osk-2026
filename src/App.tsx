import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ALL_QUESTIONS } from './data/questionsData';
import { StudentProgress, ViewId } from './types/physics';
import { useMisterJoTTS } from './hooks/useMisterJoTTS';
import { MisterJoNarratorBar } from './components/MisterJoNarratorBar';
import { HomeView } from './views/HomeView';
import { AcademyView } from './views/AcademyView';
import { BankSoalView } from './views/BankSoalView';
import { LabAnimasiView } from './views/LabAnimasiView';
import { PembahasanView } from './views/PembahasanView';
import { EvaluasiView } from './views/EvaluasiView';

const STORAGE_KEY = 'misterjo_osk2026_q12_progress_v1';

const DEFAULT_PROGRESS: StudentProgress = {
  attemptsById: {},
  academyCompletedIds: [],
};

const NAV_ITEMS: { id: ViewId; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'akademi', label: 'Akademi Konsep' },
  { id: 'bank-soal', label: 'Bank Soal' },
  { id: 'lab-animasi', label: 'Lab Animasi' },
  { id: 'pembahasan', label: 'Pembahasan' },
  { id: 'evaluasi', label: 'Evaluasi' },
];

function loadProgress(): StudentProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as StudentProgress;
    return {
      attemptsById: parsed.attemptsById ?? {},
      academyCompletedIds: Array.isArray(parsed.academyCompletedIds)
        ? parsed.academyCompletedIds
        : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as ViewId | null;
      if (viewParam && NAV_ITEMS.some((n) => n.id === viewParam)) {
        return viewParam;
      }
      if (params.get('autostart') === '1') {
        return 'bank-soal';
      }
    }
    return 'beranda';
  });

  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [progress, setProgress] = useState<StudentProgress>(loadProgress);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tts = useMisterJoTTS();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [progress]);

  const handleNavigate = (view: ViewId, questionId?: number) => {
    setActiveView(view);
    if (questionId !== undefined) {
      setSelectedQuestionId(questionId);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordAttempt = (
    questionId: number,
    input: string,
    isCorrect: boolean
  ) => {
    setProgress((prev) => {
      const existing = prev.attemptsById[questionId];
      return {
        ...prev,
        attemptsById: {
          ...prev.attemptsById,
          [questionId]: {
            questionId,
            lastInput: input,
            attempts: (existing?.attempts ?? 0) + 1,
            isCorrect: existing?.isCorrect || isCorrect,
            hasTried: true,
            explanationOpened: existing?.explanationOpened ?? false,
            answeredAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const handleToggleExplanation = (questionId: number) => {
    setProgress((prev) => {
      const existing = prev.attemptsById[questionId];
      return {
        ...prev,
        attemptsById: {
          ...prev.attemptsById,
          [questionId]: {
            questionId,
            lastInput: existing?.lastInput ?? '',
            attempts: existing?.attempts ?? 0,
            isCorrect: existing?.isCorrect ?? false,
            hasTried: existing?.hasTried ?? false,
            explanationOpened: !existing?.explanationOpened,
            answeredAt: existing?.answeredAt,
          },
        },
      };
    });
  };

  const handleToggleAcademyComplete = (sectionId: number) => {
    setProgress((prev) => {
      const exists = prev.academyCompletedIds.includes(sectionId);
      return {
        ...prev,
        academyCompletedIds: exists
          ? prev.academyCompletedIds.filter((id) => id !== sectionId)
          : [...prev.academyCompletedIds, sectionId],
      };
    });
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const defaultSpeechForView = () => {
    if (activeView === 'beranda') {
      tts.speak(
        'Selamat datang di Mister Jo Physics Olympiad Training Lab. Program ini dirancang khusus untuk membimbing Anda menaklukkan 15 tantangan Olimpiade Sains Fisika tingkat Kabupaten dan Kota berdasarkan Soal Nomor 12 OSK Fisika 2026 tentang sistem bermassa variabel.',
        'Pengantar Laboratorium Mister Jo'
      );
      return;
    }
    const currentQ =
      ALL_QUESTIONS.find((q) => q.id === selectedQuestionId) ?? ALL_QUESTIONS[0];
    if (activeView === 'bank-soal' || activeView === 'lab-animasi') {
      tts.speak(currentQ.ttsFullQuestion, `Soal Nomor ${currentQ.id}`);
      return;
    }
    if (activeView === 'pembahasan') {
      tts.speak(currentQ.ttsExplanationSummary, `Ringkasan Soal ${currentQ.id}`);
      return;
    }
    if (activeView === 'akademi') {
      tts.speak(
        'Silakan pilih modul akademi konsep fisika dan tekan tombol putar penjelasan suara pada modul yang sedang Anda pelajari.',
        'Panduan Akademi Konsep'
      );
      return;
    }
    tts.speak(
      'Di halaman evaluasi ini Anda dapat memantau skor, persentase penguasaan dari lima belas tantangan, serta rekomendasi materi yang perlu diperkuat.',
      'Panduan Evaluasi Belajar'
    );
  };

  const nextUnsolvedId =
    ALL_QUESTIONS.find((q) => !progress.attemptsById[q.id]?.isCorrect)?.id ?? 1;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E1417]">
      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E7DFE2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Wordmark */}
          <a
            href="#beranda"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('beranda');
            }}
            className="font-display text-lg font-bold tracking-tight text-[#6B0F24] whitespace-nowrap shrink-0"
          >
            Mister Jo Lab
          </a>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#614D53]"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                    active
                      ? 'text-[#6B0F24] border-[#6B0F24] font-semibold'
                      : 'border-transparent hover:text-[#1E1417]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary CTA + Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNavigate('bank-soal', nextUnsolvedId)}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Mulai Tantangan
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-lg border border-[#E7DFE2] text-[#1E1417] hover:bg-[#FAF7F8] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="Menu Navigasi Seluler"
            className="lg:hidden border-t border-[#E7DFE2] bg-white px-4 py-3 space-y-1"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                    active
                      ? 'bg-[#FBF6F7] text-[#6B0F24] font-semibold'
                      : 'text-[#3A272C] hover:bg-[#FAF7F8]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Global Mister Jo Narrator Bar */}
        <MisterJoNarratorBar
          supported={tts.supported}
          status={tts.status}
          activeLabel={tts.activeLabel}
          rate={tts.rate}
          onRateChange={tts.setRate}
          onPlayDefault={defaultSpeechForView}
          onPause={tts.pause}
          onResume={tts.resume}
          onRepeat={tts.repeat}
          onStop={tts.stop}
        />

        {activeView === 'beranda' && (
          <HomeView
            questions={ALL_QUESTIONS}
            progress={progress}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'akademi' && (
          <AcademyView
            completedIds={progress.academyCompletedIds}
            onToggleComplete={handleToggleAcademyComplete}
            onSpeakText={(txt, label) => tts.speak(txt, label)}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'bank-soal' && (
          <BankSoalView
            questions={ALL_QUESTIONS}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={setSelectedQuestionId}
            attemptsById={progress.attemptsById}
            onRecordAttempt={handleRecordAttempt}
            onToggleExplanation={handleToggleExplanation}
            onSpeakText={(txt, label) => tts.speak(txt, label)}
          />
        )}

        {activeView === 'lab-animasi' && (
          <LabAnimasiView
            questions={ALL_QUESTIONS}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={setSelectedQuestionId}
            onSpeakText={(txt, label) => tts.speak(txt, label)}
          />
        )}

        {activeView === 'pembahasan' && (
          <PembahasanView
            questions={ALL_QUESTIONS}
            attemptsById={progress.attemptsById}
            onSpeakText={(txt, label) => tts.speak(txt, label)}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'evaluasi' && (
          <EvaluasiView
            questions={ALL_QUESTIONS}
            progress={progress}
            onNavigate={handleNavigate}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-[#E7DFE2] bg-[#FAF7F8] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#614D53]">
          <p className="font-semibold text-[#1E1417]">
            MISTER JO · PHYSICS OLYMPIAD TRAINING LAB (OSK FISIKA 2026 SOAL 12)
          </p>
          <p>
            15 Tantangan Progresif · Akademi Konsep · Laboratorium Animasi · Pembahasan 14 Langkah
          </p>
        </div>
      </footer>
    </div>
  );
}
