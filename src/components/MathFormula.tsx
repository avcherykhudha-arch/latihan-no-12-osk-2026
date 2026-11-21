import React, { useMemo } from 'react';
import katex from 'katex';
import { AcademyFormula } from '../types/physics';

interface MathFormulaProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  latex,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return latex;
    }
  }, [latex, displayMode]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface FormulaCardProps {
  formula: AcademyFormula;
}

export const FormulaShowcaseCard: React.FC<FormulaCardProps> = ({ formula }) => {
  return (
    <div className="rounded-xl border border-[#DFC99B] bg-[#FBF7EE] p-6 space-y-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-[#8C5810]">
          Persamaan Kunci Olimpiade
        </span>
        <h4 className="text-lg font-semibold text-[#2A181D]">{formula.title}</h4>
      </div>

      <div className="rounded-lg border border-[#E7D8B6] bg-white px-4 py-3 text-center overflow-x-auto">
        <MathFormula latex={formula.latex} displayMode />
      </div>

      <div>
        <h5 className="text-sm font-semibold text-[#2A181D] mb-2">Keterangan Variabel:</h5>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-[#3A272C]">
          {formula.variables.map((v) => (
            <li key={v.symbol} className="flex items-baseline gap-2">
              <span className="font-mono-tabular font-semibold text-[#6B0F24] shrink-0">
                {v.symbol}
              </span>
              <span>= {v.meaning} ({v.unit})</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E7D8B6] text-sm text-[#3A272C]">
        <div>
          <p className="font-semibold text-[#2A181D]">Makna Matematis</p>
          <p className="mt-0.5 leading-relaxed">{formula.mathMeaning}</p>
        </div>
        <div>
          <p className="font-semibold text-[#2A181D]">Makna Fisis</p>
          <p className="mt-0.5 leading-relaxed">{formula.physicsMeaning}</p>
        </div>
        <div>
          <p className="font-semibold text-[#2A181D]">Syarat Penggunaan</p>
          <p className="mt-0.5 leading-relaxed">{formula.conditions}</p>
        </div>
        <div>
          <p className="font-semibold text-[#2A181D]">Batasan Penggunaan</p>
          <p className="mt-0.5 leading-relaxed">{formula.limitations}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white/80 border border-[#E7D8B6] px-4 py-3 text-sm text-[#2A181D]">
        <span className="font-semibold text-[#6B0F24]">Contoh Penerapan: </span>
        {formula.applicationExample}
      </div>
    </div>
  );
};
