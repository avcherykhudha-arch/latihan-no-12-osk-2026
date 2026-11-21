import { useCallback, useEffect, useRef, useState } from 'react';
import { formatTextForMisterJoSpeech, selectIndonesianVoice } from '../utils/ttsFormatter';

export type TTSStatus = 'idle' | 'playing' | 'paused';

export function useMisterJoTTS() {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<TTSStatus>('idle');
  const [activeLabel, setActiveLabel] = useState<string>('');
  const [rate, setRate] = useState<number>(0.96);
  const lastTextRef = useRef<string>('');
  const lastLabelRef = useRef<string>('');
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const hasSynth = typeof window !== 'undefined' && 'speechSynthesis' in window;
    setSupported(hasSynth);
    if (!hasSynth) return;

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
  }, []);

  const speak = useCallback(
    (rawText: string, label = 'Narasi Mister Jo', customRate?: number) => {
      const cleaned = formatTextForMisterJoSpeech(rawText);
      lastTextRef.current = cleaned;
      lastLabelRef.current = label;
      setActiveLabel(label);

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setStatus('idle');
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'id-ID';
      utterance.rate = customRate ?? rate;
      utterance.pitch = 0.92; // Authoritative adult male tone

      const voice = selectIndonesianVoice(voicesRef.current);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setStatus('playing');
      utterance.onpause = () => setStatus('paused');
      utterance.onresume = () => setStatus('playing');
      utterance.onend = () => setStatus('idle');
      utterance.onerror = () => setStatus('idle');

      setStatus('playing');
      window.speechSynthesis.speak(utterance);
    },
    [rate]
  );

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && status === 'playing') {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  }, [status]);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('playing');
    }
  }, [status]);

  const repeat = useCallback(() => {
    if (lastTextRef.current) {
      speak(lastTextRef.current, lastLabelRef.current || 'Ulangi Narasi');
    }
  }, [speak]);

  return {
    supported,
    status,
    activeLabel,
    rate,
    setRate,
    speak,
    pause,
    resume,
    repeat,
    stop,
  };
}
