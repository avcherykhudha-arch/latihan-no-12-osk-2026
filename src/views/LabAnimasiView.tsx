import React from 'react';
import { Question } from '../types/physics';
import { PhysicsAnimationLab } from '../components/PhysicsAnimationLab';
import { FreeBodyDiagram } from '../components/FreeBodyDiagram';
import { MathFormula } from '../components/MathFormula';

interface LabAnimasiViewProps {
  questions: Question[];
  selectedQuestionId: number;
  onSelectQuestion: (id: number) => void;
  onSpeakText: (text: string, label: string) => void;
}

export const LabAnimasiView: React.FC<LabAnimasiViewProps> = ({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onSpeakText,
}) => {
  const current = questions.find((q) => q.id === selectedQuestionId) ?? questions[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EFE8EA] pb-4">
        <div>
          <p className="text-xs font-semibold text-[#6B0F24]">
            Simulasi Fenomena & Pembuktian Persamaan
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E1417]">
            Laboratorium Animasi Fisika
          </h1>
          <p className="text-sm text-[#614D53] mt-1">
            Amati bagaimana perubahan massa, sudut tanjakan, hambatan udara, atau kebocoran
            memengaruhi vektor gaya dan luas kurva usaha ∫f(x) dx.
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1417]">
          <span>Pilih Skenario Soal:</span>
          <select
            aria-label="Pilih skenario soal untuk simulasi laboratorium"
            value={current.id}
            onChange={(e) => onSelectQuestion(Number(e.target.value))}
            className="rounded-xl border border-[#D8CCD0] bg-white px-3 py-2 text-xs font-medium text-[#1E1417]"
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                Soal {q.id}: {q.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Quick Scenario Number Strip */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Navigasi cepat skenario animasi">
        {questions.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelectQuestion(q.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tabular font-semibold transition-colors cursor-pointer ${
              q.id === current.id
                ? 'bg-[#6B0F24] text-white'
                : 'border border-[#E7DFE2] bg-white text-[#3A272C] hover:bg-[#FAF7F8]'
            }`}
          >
            #{q.id}
          </button>
        ))}
      </div>

      {/* Primary Interactive Simulation */}
      <PhysicsAnimationLab
        title={`Simulasi Skenario ${current.id}: ${current.title}`}
        animation={current.animation}
        onSpeakStage={onSpeakText}
      />

      {/* Governing Equation Summary + Interactive FBD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 rounded-xl border border-[#DFC99B] bg-[#FBF7EE] p-5 space-y-3">
          <p className="text-xs font-bold text-[#8C5810]">
            PERSAMAAN PEMBUKTIAN SKENARIO #{current.id}
          </p>
          <p className="text-sm text-[#2A181D] leading-relaxed">
            {current.explanation.langkah4ModelFisika}
          </p>
          {current.explanation.langkah6Persamaan.map((eq, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#E7D8B6] bg-white px-3 py-2 overflow-x-auto"
            >
              <p className="text-[11px] text-[#8C5810] font-medium">{eq.caption}</p>
              <MathFormula latex={eq.latex} displayMode />
            </div>
          ))}
        </div>

        <div className="lg:col-span-7">
          <FreeBodyDiagram
            fbd={current.fbd}
            onSpeakFBD={(txt) => onSpeakText(txt, `FBD Skenario ${current.id}`)}
          />
        </div>
      </div>
    </div>
  );
};
