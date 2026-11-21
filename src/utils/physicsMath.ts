export interface AnswerCheckResult {
  isValidFormat: boolean;
  isCorrect: boolean;
  parsedValue: number | null;
  formatError?: string;
  feedbackTitle: string;
  feedbackMessage: string;
  guidanceChecks?: string[];
}

/**
 * Rounds a number to 1 decimal place using standard mathematical half-away-from-zero rounding.
 */
export function roundOneDecimal(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const scaled = Math.abs(value) * 10;
  // Avoid floating point representation quirks like 1.0000000000000002
  const rounded = Math.round(scaled + 1e-9);
  return (sign * rounded) / 10;
}

/**
 * Formats a number using Indonesian decimal comma with exactly one decimal place.
 */
export function formatIndonesianDecimal(value: number): string {
  const rounded = roundOneDecimal(value);
  return rounded.toFixed(1).replace('.', ',');
}

/**
 * Parses and validates a student's short-answer input according to Indonesian Olympiad rules:
 * - Decimal separator MUST be a comma (','), NEVER a dot ('.').
 * - Result must have exactly 1 decimal place.
 * - Accepts optional trailing unit matching acceptedUnitAliases (case-insensitive, flexible spacing).
 */
export function evaluateStudentAnswer(
  rawInput: string,
  expectedValue: number,
  tolerance: number,
  expectedUnit: string,
  acceptedUnitAliases: string[],
  options?: {
    naiveTrapValue?: number;
    conceptHint?: string;
    equationHint?: string;
    unitHint?: string;
  }
): AnswerCheckResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValidFormat: false,
      isCorrect: false,
      parsedValue: null,
      formatError: 'Kolom jawaban masih kosong.',
      feedbackTitle: 'Jawaban Belum Diisi',
      feedbackMessage:
        'Masukkan hasil perhitungan numerik Anda terlebih dahulu dengan satu angka desimal (contoh: 12,5).',
    };
  }

  // Extract leading numeric token and optional trailing unit
  const match = trimmed.match(/^([+-]?\s*[0-9.,]+)\s*(.*)$/);
  if (!match) {
    return {
      isValidFormat: false,
      isCorrect: false,
      parsedValue: null,
      formatError: 'Format angka tidak dikenali.',
      feedbackTitle: 'Periksa Format Penulisan',
      feedbackMessage:
        'Tuliskan angka numerik dengan koma sebagai pemisah desimal (contoh: 12,5).',
    };
  }

  const numPart = match[1].replace(/\s+/g, '');
  const unitPart = match[2].trim();

  // Check if dot is used
  if (numPart.includes('.')) {
    return {
      isValidFormat: false,
      isCorrect: false,
      parsedValue: null,
      formatError: 'Tanda titik tidak diperbolehkan sebagai pemisah desimal.',
      feedbackTitle: 'Gunakan Tanda Koma Desimal',
      feedbackMessage:
        'Jangan gunakan titik (.) sebagai pemisah desimal ataupun pemisah ribuan. Gunakan tanda koma (,) dengan tepat satu angka di belakang koma, misalnya 12,5.',
    };
  }

  // Must match integer,one-decimal format like 12,5 or -3,0
  const commaParts = numPart.split(',');
  if (commaParts.length !== 2 || commaParts[0] === '' || !/^[+-]?\d+$/.test(commaParts[0])) {
    return {
      isValidFormat: false,
      isCorrect: false,
      parsedValue: null,
      formatError: 'Wajib memiliki tepat satu angka desimal setelah tanda koma.',
      feedbackTitle: 'Format Satu Angka Desimal Diperlukan',
      feedbackMessage:
        'Hasil akhir wajib memiliki tepat satu angka desimal dengan tanda koma. Contoh: 2,0 atau 575,4.',
    };
  }

  if (commaParts[1].length !== 1 || !/^\d$/.test(commaParts[1])) {
    return {
      isValidFormat: false,
      isCorrect: false,
      parsedValue: null,
      formatError: 'Angka di belakang koma harus tepat satu digit.',
      feedbackTitle: 'Periksa Ketelitian Pembulatan',
      feedbackMessage:
        'Bulatkan jawaban Anda menjadi tepat satu angka di belakang koma (contoh: 12,5, bukan 12,54 atau 12).',
    };
  }

  // Validate unit if provided
  if (unitPart.length > 0) {
    const normalizedUnit = unitPart.toLowerCase().replace(/\s+/g, '');
    const validUnits = [expectedUnit, ...acceptedUnitAliases].map((u) =>
      u.toLowerCase().replace(/\s+/g, '')
    );
    if (!validUnits.includes(normalizedUnit)) {
      return {
        isValidFormat: false,
        isCorrect: false,
        parsedValue: null,
        formatError: `Satuan "${unitPart}" tidak sesuai dengan satuan yang diminta (${expectedUnit}).`,
        feedbackTitle: 'Periksa Satuan Jawaban',
        feedbackMessage: `Jawaban numerik untuk soal ini diminta dalam satuan ${expectedUnit}. Anda dapat menuliskan angkanya saja (misalnya ${formatIndonesianDecimal(
          expectedValue
        )}) atau menyertakan satuan ${expectedUnit}.`,
      };
    }
  }

  const parsedValue = Number(`${commaParts[0]}.${commaParts[1]}`);
  if (!Number.isFinite(parsedValue)) {
    return {
      isValidFormat: false,
      isCorrect: false,
      parsedValue: null,
      formatError: 'Nilai numerik tidak valid.',
      feedbackTitle: 'Format Angka Tidak Valid',
      feedbackMessage: 'Pastikan input berupa bilangan valid dengan satu angka desimal.',
    };
  }

  const diff = Math.abs(parsedValue - expectedValue);
  if (diff <= tolerance + 1e-9) {
    return {
      isValidFormat: true,
      isCorrect: true,
      parsedValue,
      feedbackTitle: 'Tepat! Analisis Fisika Anda Benar',
      feedbackMessage: `Hasil ${formatIndonesianDecimal(parsedValue)} ${expectedUnit} berada dalam batas ketelitian ilmiah soal ini. Anda telah menguasai penerapan prinsip massa variabel pada permasalahan ini.`,
    };
  }

  // Diagnostic guidance when numerically incorrect
  const guidanceChecks: string[] = [];

  if (
    options?.naiveTrapValue !== undefined &&
    Math.abs(parsedValue - options.naiveTrapValue) <= Math.max(tolerance * 2, 1.5)
  ) {
    guidanceChecks.push(
      'Nilai Anda mendekati hasil perhitungan dengan anggapan massa total mobil konstan. Ingat: saat bahan bakar terbakar, massa total M berkurang sehingga gaya hambat μMg ikut mengecil!'
    );
  }

  // Factor of 1000 unit error check (m vs km or J vs kJ)
  if (
    Math.abs(parsedValue / 1000 - expectedValue) <= Math.max(tolerance, 1.0) ||
    Math.abs(parsedValue * 1000 - expectedValue) <= Math.max(tolerance, 1.0)
  ) {
    guidanceChecks.push(
      `Terindikasi selisih faktor 1000! Periksa kembali konversi satuan energi (kJ ke J) dan jarak (m ke km) agar konsisten dengan satuan target (${expectedUnit}).`
    );
  }

  if (options?.conceptHint) guidanceChecks.push(`Konsep: ${options.conceptHint}`);
  if (options?.equationHint) guidanceChecks.push(`Persamaan: ${options.equationHint}`);
  if (options?.unitHint) guidanceChecks.push(`Satuan & Pembulatan: ${options.unitHint}`);

  if (guidanceChecks.length === 0) {
    guidanceChecks.push(
      'Periksa kembali apakah hukum kekekalan energi / usaha-energi sudah diterapkan secara diferensial (dE = f dx).',
      'Pastikan substitusi angka menggunakan satuan SI dasar (kg, m, s, J) sebelum mengubah ke satuan akhir.',
      'Periksa aturan pembulatan matematika hingga tepat satu angka di belakang koma.'
    );
  }

  return {
    isValidFormat: true,
    isCorrect: false,
    parsedValue,
    feedbackTitle: 'Belum Tepat — Tinjau Kembali Langkah Analisis Anda',
    feedbackMessage:
      'Jangan terburu-buru menyerah! Dalam fisika olimpiade, kesalahan sering muncul pada pemodelan massa variabel, konversi kJ/km, atau batas integral.',
    guidanceChecks,
  };
}

// ============================================================================
// PURE PHYSICS SOLVERS FOR ALL 15 QUESTIONS (Verified via node:test)
// ============================================================================

export function solveQ1(params: { E_kJ: number; mu: number; M: number; g: number }): number {
  const E = params.E_kJ * 1000;
  const f = params.mu * params.M * params.g;
  return E / f / 1000; // km
}

export function solveQ2(params: {
  mFuel: number;
  etaKJ: number;
  efficiency: number;
  mu: number;
  M: number;
  g: number;
}): number {
  const E_eff = params.efficiency * params.mFuel * params.etaKJ * 1000;
  const f = params.mu * params.M * params.g;
  return E_eff / f / 1000; // km
}

export function solveQ3TwoStage(params: {
  mEmpty: number;
  mFuel: number;
  etaKJ: number;
  mu: number;
  g: number;
}): number {
  const halfFuel = params.mFuel / 2;
  const E_stage = halfFuel * params.etaKJ * 1000;
  const M1 = params.mEmpty + params.mFuel;
  const M2 = params.mEmpty + halfFuel;
  const s1 = E_stage / (params.mu * M1 * params.g);
  const s2 = E_stage / (params.mu * M2 * params.g);
  return (s1 + s2) / 1000; // km
}

export function solveContinuousFlat(params: {
  mEmpty: number;
  mFuel: number;
  etaKJ: number;
  mu: number;
  g: number;
}): number {
  const eta = params.etaKJ * 1000;
  return ((eta / (params.mu * params.g)) * Math.log((params.mEmpty + params.mFuel) / params.mEmpty)) / 1000;
}

export function solveQ5EtaKJ(params: {
  ratioEmptyToFuel: number;
  mu: number;
  g: number;
  distanceKm: number;
}): number {
  const xM = params.distanceKm * 1000;
  const lnTerm = Math.log(1 + 1 / params.ratioEmptyToFuel);
  const etaJ = (params.mu * params.g * xM) / lnTerm;
  return etaJ / 1000; // kJ/kg
}

export function solveQ6DeltaX(params: {
  mEmpty: number;
  mFuel1: number;
  mFuel2: number;
  etaKJ: number;
  mu: number;
  g: number;
}): number {
  const x1 = solveContinuousFlat({
    mEmpty: params.mEmpty,
    mFuel: params.mFuel1,
    etaKJ: params.etaKJ,
    mu: params.mu,
    g: params.g,
  });
  const x2 = solveContinuousFlat({
    mEmpty: params.mEmpty,
    mFuel: params.mFuel2,
    etaKJ: params.etaKJ,
    mu: params.mu,
    g: params.g,
  });
  return x2 - x1;
}

export function solveQ7FromPoint(params: {
  M0: number;
  Mx1: number;
  x1Km: number;
  mEmpty: number;
}): number {
  return params.x1Km * (Math.log(params.M0 / params.mEmpty) / Math.log(params.M0 / params.Mx1));
}

export function solveQ8DiffExactVsNaive(params: {
  mEmpty: number;
  mFuel: number;
  etaKJ: number;
  mu: number;
  g: number;
}): { exactKm: number; naiveKm: number; diffKm: number } {
  const exactKm = solveContinuousFlat(params);
  const M0 = params.mEmpty + params.mFuel;
  const naiveKm = ((params.etaKJ * 1000 * params.mFuel) / (params.mu * M0 * params.g)) / 1000;
  return { exactKm, naiveKm, diffKm: exactKm - naiveKm };
}

export function solveQ9AddedCargo(params: {
  m1: number;
  deltaM: number;
  mFuel: number;
  x1Km: number;
}): number {
  const m2 = params.m1 + params.deltaM;
  return (
    params.x1Km *
    (Math.log(1 + params.mFuel / m2) / Math.log(1 + params.mFuel / params.m1))
  );
}

export function solveQ10Incline(params: {
  mEmpty: number;
  mFuel: number;
  sinTheta: number;
  cosTheta: number;
  mu: number;
  etaKJ: number;
  g: number;
}): number {
  const muEff = params.sinTheta + params.mu * params.cosTheta;
  return (
    ((params.etaKJ * 1000) / (muEff * params.g)) *
    Math.log((params.mEmpty + params.mFuel) / params.mEmpty) /
    1000
  );
}

export function solveQ11WithConstantDrag(params: {
  mEmpty: number;
  mFuel: number;
  mu: number;
  g: number;
  F0: number;
  etaKJ: number;
}): number {
  const eta = params.etaKJ * 1000;
  const num = params.mu * (params.mEmpty + params.mFuel) * params.g + params.F0;
  const den = params.mu * params.mEmpty * params.g + params.F0;
  return ((eta / (params.mu * params.g)) * Math.log(num / den)) / 1000;
}

export function solveQ12TwoSegments(params: {
  mEmpty: number;
  mFuel: number;
  etaKJ: number;
  g: number;
  mu1: number;
  d1Km: number;
  mu2: number;
}): number {
  const eta = params.etaKJ * 1000;
  const d1M = params.d1Km * 1000;
  const M0 = params.mEmpty + params.mFuel;
  const M1 = M0 * Math.exp((-params.mu1 * params.g * d1M) / eta);
  if (M1 <= params.mEmpty) {
    return solveContinuousFlat({
      mEmpty: params.mEmpty,
      mFuel: params.mFuel,
      etaKJ: params.etaKJ,
      mu: params.mu1,
      g: params.g,
    });
  }
  const d2Km = ((eta / (params.mu2 * params.g)) * Math.log(M1 / params.mEmpty)) / 1000;
  return params.d1Km + d2Km;
}

export function solveQ13StagingTankDrop(params: {
  mChassis: number;
  mTankExtEmpty: number;
  mFuel1: number;
  mFuel2: number;
  mu: number;
  g: number;
  etaKJ: number;
}): number {
  const eta = params.etaKJ * 1000;
  const factorKm = eta / (params.mu * params.g) / 1000;
  const M0 = params.mChassis + params.mTankExtEmpty + params.mFuel1 + params.mFuel2;
  const M1 = M0 - params.mFuel1; // before dropping external tank
  const M2 = M1 - params.mTankExtEmpty; // after dropping empty external tank
  const M3 = params.mChassis;
  const x1 = factorKm * Math.log(M0 / M1);
  const x2 = factorKm * Math.log(M2 / M3);
  return x1 + x2;
}

export function solveQ14FuelLeak(params: {
  mEmpty: number;
  mFuel: number;
  mu: number;
  g: number;
  etaKJ: number;
  speedMs: number;
  leakRateKgS: number;
}): number {
  const F_eq = (params.etaKJ * 1000 * params.leakRateKgS) / params.speedMs;
  return solveQ11WithConstantDrag({
    mEmpty: params.mEmpty,
    mFuel: params.mFuel,
    mu: params.mu,
    g: params.g,
    F0: F_eq,
    etaKJ: params.etaKJ,
  });
}

export function solveQ15LinearMuGradient(params: {
  mEmpty: number;
  mFuel: number;
  mu0: number;
  alphaPerM: number;
  g: number;
  etaKJ: number;
}): number {
  const C = ((params.etaKJ * 1000) / params.g) * Math.log((params.mEmpty + params.mFuel) / params.mEmpty);
  // 0.5 * alpha * x^2 + mu0 * x - C = 0
  const a = 0.5 * params.alphaPerM;
  const b = params.mu0;
  const c = -C;
  const xM = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return xM / 1000; // km
}
