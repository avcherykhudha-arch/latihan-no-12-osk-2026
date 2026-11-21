/**
 * Converts text containing physics symbols or simple math expressions into
 * natural spoken Indonesian suitable for Web Speech API (Mister Jo Narrator).
 * Never leaves raw LaTeX tokens like \frac, \ln, \mu, ^, _ in spoken output.
 */
export function formatTextForMisterJoSpeech(rawText: string): string {
  let text = rawText;

  // Strip LaTeX delimiters
  text = text.replace(/\$\$/g, ' ').replace(/\$/g, ' ');

  // Replace common LaTeX constructs first
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 dibagi $2');
  text = text.replace(/\\ln\s*\(([^)]+)\)/g, 'logaritma natural dari $1');
  text = text.replace(/\\ln/g, 'logaritma natural');
  text = text.replace(/\\sqrt\{([^}]+)\}/g, 'akar kuadrat dari $1');
  text = text.replace(/\\times/g, ' dikali ');
  text = text.replace(/\\cdot/g, ' dikali ');
  text = text.replace(/\\approx/g, ' kira-kira sama dengan ');
  text = text.replace(/\\implies/g, ' menghasilkan ');
  text = text.replace(/\\Rightarrow/g, ' menghasilkan ');
  text = text.replace(/\\rightarrow/g, ' menuju ');
  text = text.replace(/\\int/g, ' integral ');
  text = text.replace(/\\sum/g, ' sigma ');
  text = text.replace(/\\Delta/g, ' delta ');
  text = text.replace(/\\alpha/g, ' alfa ');
  text = text.replace(/\\theta/g, ' teta ');
  text = text.replace(/\\mu/g, ' miu ');
  text = text.replace(/\\eta/g, ' eta ');
  text = text.replace(/\\varepsilon/g, ' epsilon ');
  text = text.replace(/\\sin/g, ' sinus ');
  text = text.replace(/\\cos/g, ' kosinus ');
  text = text.replace(/\\exp/g, ' eksponensial ');
  text = text.replace(/\\vec\{([^}]+)\}/g, 'vektor $1');
  text = text.replace(/\\text\{([^}]+)\}/g, '$1');
  text = text.replace(/\\left|\\right/g, '');
  text = text.replace(/\\[a-zA-Z]+/g, ' ');

  // Replace Unicode physics symbols
  const symbolMap: [RegExp, string][] = [
    [/ΣF/g, 'sigma gaya'],
    [/Σ/g, 'sigma'],
    [/ΔM/g, 'delta M'],
    [/Δx/g, 'delta x'],
    [/Δℓ/g, 'delta l'],
    [/Δ/g, 'delta '],
    [/η/g, 'eta'],
    [/μ₀|μ_0/g, 'miu nol'],
    [/μ₁|μ_1/g, 'miu satu'],
    [/μ₂|μ_2/g, 'miu dua'],
    [/μ/g, 'miu'],
    [/ε/g, 'efisiensi epsilon'],
    [/θ/g, 'teta'],
    [/α/g, 'alfa'],
    [/≈/g, ' kira-kira sama dengan '],
    [/≤/g, ' kurang dari atau sama dengan '],
    [/≥/g, ' lebih dari atau sama dengan '],
    [/⇒/g, ' maka '],
    [/→/g, ' menuju '],
    [/∫/g, ' integral '],
    [/×/g, ' dikali '],
    [/·/g, ' dikali '],
    [/m\/s²/g, 'meter per sekon kuadrat'],
    [/m\/s\^2/g, 'meter per sekon kuadrat'],
    [/kJ\/kg/g, 'kilojoule per kilogram'],
    [/J\/kg/g, 'joule per kilogram'],
    [/kg\/s/g, 'kilogram per sekon'],
    [/m\/s/g, 'meter per sekon'],
    [/m⁻¹/g, 'per meter'],
    [/km/g, 'kilometer'],
    [/N·m/g, 'newton meter'],
    [/m_b/g, 'm b'],
    [/m_c/g, 'm c'],
    [/m_t/g, 'm t'],
    [/F_0/g, 'F nol'],
    [/x_\{?maks\}?|x_\{?max\}?/g, 'x maksimum'],
    [/\^2/g, ' kuadrat'],
    [/²/g, ' kuadrat'],
  ];

  for (const [pattern, replacement] of symbolMap) {
    text = text.replace(pattern, replacement);
  }

  // Replace Indonesian decimal comma between digits: 12,5 -> 12 koma 5
  text = text.replace(/(\d+),(\d+)/g, '$1 koma $2');

  // Clean remaining braces and excessive whitespace
  text = text.replace(/[{}]/g, ' ').replace(/\s+/g, ' ').trim();

  return text;
}

export interface SpeechControllerState {
  supported: boolean;
  status: 'idle' | 'playing' | 'paused';
  activeLabel: string;
  rate: number;
}

/**
 * Selects the best available Indonesian male/authoritative voice in SpeechSynthesis.
 */
export function selectIndonesianVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  const idVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('id'));
  if (idVoices.length > 0) {
    // Prefer male-sounding or Google Bahasa Indonesia voice if available
    const preferred = idVoices.find((v) =>
      /male|laki|ardi|andika|damayanti|google bahasa indonesia/i.test(v.name)
    );
    return preferred || idVoices[0];
  }
  return voices[0];
}
