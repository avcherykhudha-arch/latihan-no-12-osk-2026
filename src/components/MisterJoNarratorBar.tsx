import React from 'react';
import { Volume2, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { TTSStatus } from '../hooks/useMisterJoTTS';

interface MisterJoNarratorBarProps {
  supported: boolean;
  status: TTSStatus;
  activeLabel: string;
  rate: number;
  onRateChange: (rate: number) => void;
  onPlayDefault: () => void;
  onPause: () => void;
  onResume: () => void;
  onRepeat: () => void;
  onStop: () => void;
  defaultButtonLabel?: string;
}

export const MisterJoNarratorBar: React.FC<MisterJoNarratorBarProps> = ({
  supported,
  status,
  activeLabel,
  rate,
  onRateChange,
  onPlayDefault,
  onPause,
  onResume,
  onRepeat,
  onStop,
  defaultButtonLabel = 'Putar Suara Mister Jo',
}) => {
  return (
    <div
      className="rounded-xl border border-[#E7DFE2] bg-[#FAF7F8] px-4 py-3 flex flex-wrap items-center justify-between gap-3"
      role="region"
      aria-label="Kontrol Narator Suara Mister Jo"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-[#6B0F24] text-white flex items-center justify-center shrink-0">
          <Volume2 className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1E1417] truncate">
            Narator Suara – Mister Jo
          </p>
          <p className="text-xs text-[#614D53] truncate">
            {!supported
              ? 'Browser tidak mendukung Web Speech API'
              : status === 'playing'
              ? `Sedang membacakan: ${activeLabel}`
              : status === 'paused'
              ? `Dijeda: ${activeLabel}`
              : 'Siap membacakan materi, soal, FBD, dan pembahasan (id-ID)'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {status === 'idle' && (
          <button
            type="button"
            onClick={onPlayDefault}
            disabled={!supported}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{defaultButtonLabel}</span>
          </button>
        )}

        {status === 'playing' && (
          <button
            type="button"
            onClick={onPause}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        )}

        {status === 'paused' && (
          <button
            type="button"
            onClick={onResume}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#6B0F24] text-white text-xs font-semibold hover:bg-[#8C1D35] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Lanjutkan</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRepeat}
          disabled={!supported}
          aria-label="Ulangi narasi suara"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D8CCD0] bg-white text-[#2A181D] text-xs font-medium hover:bg-[#F5F1F2] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ulangi</span>
        </button>

        <button
          type="button"
          onClick={onStop}
          disabled={status === 'idle'}
          aria-label="Hentikan narasi suara"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D8CCD0] bg-white text-[#2A181D] text-xs font-medium hover:bg-[#F5F1F2] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Square className="w-3.5 h-3.5" />
          <span>Hentikan</span>
        </button>

        <label className="inline-flex items-center gap-1.5 text-xs text-[#614D53] ml-1">
          <span>Tempo:</span>
          <select
            aria-label="Kecepatan suara narator"
            value={rate}
            onChange={(e) => onRateChange(Number(e.target.value))}
            className="rounded-lg border border-[#D8CCD0] bg-white px-2 py-1.5 text-xs font-mono-tabular text-[#1E1417]"
          >
            <option value={0.85}>0,85x</option>
            <option value={0.96}>1,0x</option>
            <option value={1.15}>1,15x</option>
          </select>
        </label>
      </div>
    </div>
  );
};
