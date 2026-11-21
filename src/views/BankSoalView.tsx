import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Volume2,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Question, QuestionAttempt, StageId } from '../types/physics';
import { STAGES_META } from '../data/questionsData';
import { evaluateStudentAnswer, AnswerCheckResult } from '../utils/physicsMath';
import { StimulusDiagram } from '../components/StimulusDiagram';
import { PhysicsAnimationLab } from '../components/PhysicsAnimationLab';
import { FreeBodyDiagram } from '../components/FreeBodyDiagram';
import { PembahasanAccordion } from '../components/PembahasanAccordion';

interface BankSoalViewProps {
  questions: Question[];
  selectedQuestionId: number;
  onSelectQuestion: (id: number) => void;
  attemptsById: Record<number, QuestionAttempt>;
  onRecordAttempt: (questionId: number, input: string, isCorrect: boolean) => void;
  onToggleExplanation: (questionId: number) => void;
  onSpeakText: (text: string, label: string) => void;
}

export const BankSoalView: React.FC<BankSoalViewProps> = ({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  attemptsById,
  onRecordAttempt,
  onToggleExplanation,
  onSpeakText,
}) => {
  const [stageFilter, setStageFilter] = useState<StageId | 'all'>('all');
  const [inputValue, setInputValue] = useState<string>('');
  const [checkResult, setCheckResult] = useState<AnswerCheckResult | null>(null);
  const [tryPromptMsg, setTryPromptMsg] = useState<string | null>(null);

  const currentQuestion =
    questions.find((q) => q.id === selectedQuestionId) ?? questions[0];
  const currentAttempt = attemptsById[currentQuestion.id];

  useEffect(() => {
    setInputValue(currentAttempt?.lastInput ?? '');
    setCheckResult(null);
    setTryPromptMsg(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion.id]);

  const filteredQuestions =
    stageFilter === 'all'
      ? questions
      : questions.filter((q) => q.stage === stageFilter);

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setTryPromptMsg(null);
    const result = evaluateStudentAnswer(
      inputValue,
      currentQuestion.expectedAnswerNum,
      currentQuestion.tolerance,
      currentQuestion.unit,
      currentQuestion.acceptedUnitAliases,
      {
        naiveTrapValue: currentQuestion.naiveTrapValue,
        conceptHint: currentQuestion.diagnosticHints.conceptHint,
        equationHint: currentQuestion.diagnosticHints.equationHint,
        unitHint: currentQuestion.diagnosticHints.unitHint,
      }
    );
    setCheckResult(result);
    if (result.isValidFormat) {
      onRecordAttempt(currentQuestion.id, inputValue, result.isCorrect);
    }
  };

  const handleTogglePembahasan = () => {
    if (!currentAttempt?.hasTried && !checkResult?.isValidFormat) {
      setTryPromptMsg(
        'Silakan tuliskan perkiraan jawaban Anda dan tekan PERIKSA JAWABAN terlebih dahulu sebelum membuka pembahasan lengkap.'
      );
      return;
    }
    setTryPromptMsg(null);
    onToggleExplanation(currentQuestion.id);
  };

  const isExplanationOpen = Boolean(currentAttempt?.explanationOpened);

  return (
    <div className="space-y-8">
      {/* Header & Stage Filters */}
      <div className="space-y-4 border-b border-[#EFE8EA] pb-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#6B0F24]">
              Latihan Progresif OSK Fisika 2026 · Soal Nomor 12
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1417]">
              Bank Soal 15 Tantangan
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F1F2] rounded-xl">
            <button
              type="button"
              onClick={() => setStageFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                stageFilter === 'all'
                  ? 'bg-white text-[#6B0F24] shadow-sm'
                  : 'text-[#614D53] hover:text-[#1E1417]'
              }`}
            >
              Semua (15)
            </button>
            {STAGES_META.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStageFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

        {/* 15-Question Selector Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredQuestions.map((q) => {
            const att = attemptsById[q.id];
            const active = q.id === currentQuestion.id;
            const statusText = att?.isCorrect
              ? 'Benar (100)'
              : att?.hasTried
              ? 'Belum Tepat'
              : 'Belum Dikerjakan';

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(q.id)}
                className={`text-left px-3.5 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'border-[#6B0F24] bg-[#FBF6F7]'
                    : 'border-[#E7DFE2] bg-white hover:bg-[#FAF7F8]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#614D53]">
                  <span className="font-mono-tabular font-semibold text-[#6B0F24]">
                    Soal {String(q.id).padStart(2, '0')} · {q.difficultyLabel}
                  </span>
                  <span
                    className={`font-medium ${
                      att?.isCorrect
                        ? 'text-[#15803D]'
                        : att?.hasTried
                        ? 'text-[#B91C1C]'
                        : 'text-[#614D53]'
                    }`}
                  >
                    {statusText}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-[#1E1417] truncate">
                  {q.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focused Question Workspace */}
      <div className="space-y-6">
        {/* Question Narrative & Data */}
        <section className="rounded-2xl border border-[#E7DFE2] bg-white p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EFE8EA] pb-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#6B0F24]">
                Soal {currentQuestion.id} dari 15 · {currentQuestion.stageLabel} · Tingkat{' '}
                {currentQuestion.difficultyLabel}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E1417]">
                {currentQuestion.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                onSpeakText(
                  currentQuestion.ttsFullQuestion,
                  `Naskah Soal Nomor ${currentQuestion.id}`
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D8CCD0] bg-[#FAF7F8] text-xs font-semibold text-[#6B0F24] hover:bg-[#F2ECEE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Bacakan Soal (Mister Jo)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-[15px] text-[#1E1417] leading-relaxed">
                {currentQuestion.narrative}
              </p>

              <div className="rounded-xl border border-[#EFE8EA] bg-[#FAF7F8] p-4">
                <h3 className="text-xs font-bold text-[#6B0F24] mb-2">
                  DATA NUMERIK DIKETAHUI
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentQuestion.givenData.map((d) => (
                    <div
                      key={d.symbol}
                      className="flex items-baseline justify-between gap-2 bg-white rounded-lg border border-[#EFE8EA] px-3 py-2"
                    >
                      <span className="text-[#614D53]">
                        {d.label} (<strong className="text-[#1E1417]">{d.symbol}</strong>)
                      </span>
                      <span className="font-mono-tabular font-semibold text-[#1E1417] shrink-0">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <StimulusDiagram question={currentQuestion} />
            </div>
          </div>

          {/* Answer Submission Form */}
          <form
            onSubmit={handleCheckAnswer}
            className="rounded-xl border border-[#DFC99B] bg-[#FBF7EE] p-5 space-y-4"
          >
            <div className="space-y-1">
              <label
                htmlFor="student-answer-input"
                className="block text-sm font-bold text-[#1E1417]"
              >
                {currentQuestion.questionPrompt}
              </label>
              <p className="text-xs text-[#614D53]">
                Ketentuan: Isian singkat numerik wajib tepat <strong>satu angka desimal</strong>{' '}
                menggunakan tanda <strong>koma (,)</strong> — contoh: <code>12,5</code>.
                Jangan gunakan titik.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border border-[#C8B9BE] bg-white overflow-hidden focus-within:border-[#6B0F24]">
                <input
                  id="student-answer-input"
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Contoh: 12,5"
                  className="px-4 py-2.5 w-48 text-base font-mono-tabular font-semibold text-[#1E1417] outline-none"
                />
                <span className="px-3.5 py-2.5 bg-[#FAF7F8] border-l border-[#E7DFE2] text-xs font-mono-tabular font-semibold text-[#614D53]">
                  {currentQuestion.unit}
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#6B0F24] text-white text-sm font-semibold hover:bg-[#8C1D35] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                PERIKSA JAWABAN
              </button>

              {currentAttempt?.hasTried && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    currentAttempt.isCorrect ? 'text-[#15803D]' : 'text-[#B91C1C]'
                  }`}
                >
                  {currentAttempt.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Status: Benar (Skor 100)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Status: Belum Tepat ({currentAttempt.attempts}× percobaan)</span>
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Instant Validation / Conceptual Feedback */}
            {checkResult && (
              <div
                role="status"
                className={`rounded-xl border p-4 space-y-2 ${
                  checkResult.isCorrect
                    ? 'border-[#86EFAC] bg-[#ECFDF5] text-[#14532D]'
                    : checkResult.isValidFormat
                    ? 'border-[#FCA5A5] bg-[#FEF2F2] text-[#7F1D1D]'
                    : 'border-[#FCD34D] bg-[#FFFBEB] text-[#78350F]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {checkResult.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{checkResult.feedbackTitle}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {checkResult.feedbackMessage}
                </p>
                {checkResult.guidanceChecks && (
                  <ul className="list-disc pl-5 text-xs space-y-1 pt-1">
                    {checkResult.guidanceChecks.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tryPromptMsg && (
              <div className="rounded-lg border border-[#FCD34D] bg-[#FFFBEB] px-3.5 py-2.5 text-xs text-[#78350F] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>{tryPromptMsg}</span>
              </div>
            )}
          </form>
        </section>

        {/* Interactive Proof Animation & Free Body Diagram */}
        <PhysicsAnimationLab
          title={`Pembuktian Visual Soal ${currentQuestion.id}: ${currentQuestion.title}`}
          animation={currentQuestion.animation}
          onSpeakStage={onSpeakText}
        />

        <FreeBodyDiagram
          fbd={currentQuestion.fbd}
          onSpeakFBD={(txt) =>
            onSpeakText(txt, `Diagram Gaya FBD Soal ${currentQuestion.id}`)
          }
        />

        {/* Collapsible 14-Step Solution */}
        <PembahasanAccordion
          question={currentQuestion}
          isOpen={isExplanationOpen}
          onToggle={handleTogglePembahasan}
          onSpeakText={onSpeakText}
        />

        {/* Prev / Next Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={currentQuestion.id <= 1}
            onClick={() => onSelectQuestion(currentQuestion.id - 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D8CCD0] bg-white text-xs font-semibold text-[#1E1417] hover:bg-[#FAF7F8] disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Soal Sebelumnya</span>
          </button>
          <button
            type="button"
            disabled={currentQuestion.id >= questions.length}
            onClick={() => onSelectQuestion(currentQuestion.id + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] disabled:opacity-40 cursor-pointer"
          >
            <span>Soal Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
