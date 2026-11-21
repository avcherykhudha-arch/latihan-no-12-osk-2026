export type ViewId =
  | 'beranda'
  | 'akademi'
  | 'bank-soal'
  | 'lab-animasi'
  | 'pembahasan'
  | 'evaluasi';

export type StageId = 1 | 2 | 3 | 4 | 5;

export interface StageMeta {
  id: StageId;
  title: string;
  subtitle: string;
  questionRange: [number, number];
}

export type AnimationModelType =
  | 'constant-mass'
  | 'two-stage-discrete'
  | 'continuous-flat'
  | 'inclined-plane'
  | 'aero-drag'
  | 'two-segment-road'
  | 'tank-drop-staging'
  | 'fuel-leak'
  | 'linear-mu-gradient';

export interface FBDVector {
  id: string;
  symbol: string;
  label: string;
  directionText: string;
  color: string;
  angleDeg: number; // standard screen angle or physics angle handled in FBD component
  magnitudeDesc: string;
  description: string;
}

export interface FBDConfig {
  title: string;
  surfaceAngleDeg: number;
  isMovingUpIncline?: boolean;
  showAccelerationArrow?: boolean;
  accelerationLabel?: string;
  vectors: FBDVector[];
  ttsSummary: string;
}

export interface ExplanationSteps {
  langkah1Memahami: string;
  langkah2Data: string[];
  langkah3Target: string;
  langkah4ModelFisika: string;
  langkah5DiagramNote: string;
  langkah6Persamaan: { latex: string; caption: string }[];
  langkah7Penurunan: string[];
  langkah8Substitusi: string[];
  langkah9Perhitungan: string[];
  langkah10Pembulatan: string;
  langkah11JawabanAkhir: string;
  langkah12Interpretasi: string;
  langkah13StrategiOlimpiade: string;
  langkah14KesalahanUmum: string[];
}

export interface AnimationConfig {
  modelType: AnimationModelType;
  mEmpty: number; // kg
  mFuel: number; // kg
  mu: number; // primary mu or mu0
  mu2?: number; // secondary mu (Q12) or alpha*1e6 (Q15)
  etaKJ: number; // kJ/kg
  efficiency?: number; // 0..1
  g: number; // m/s^2
  inclineDeg?: number;
  sinTheta?: number;
  cosTheta?: number;
  aeroDragN?: number;
  segment1Km?: number;
  tankMassKg?: number;
  fuel1Kg?: number;
  fuel2Kg?: number;
  speedMs?: number;
  leakRateKgS?: number;
  alphaPerM?: number;
  expectedDistanceKm: number;
  naiveDistanceKm?: number;
  stages: {
    title: string;
    description: string;
    progressStart: number;
    progressEnd: number;
  }[];
  ttsStages: string[];
}

export interface Question {
  id: number;
  stage: StageId;
  stageLabel: string;
  title: string;
  difficultyLabel: string;
  topicTag: string;
  narrative: string;
  givenData: { label: string; symbol: string; value: string }[];
  questionPrompt: string;
  unit: string;
  acceptedUnitAliases: string[];
  expectedAnswerNum: number;
  expectedAnswerFormatted: string; // e.g. "575,4"
  tolerance: number;
  toleranceRationale: string;
  naiveTrapValue?: number;
  diagnosticHints: {
    conceptHint: string;
    equationHint: string;
    unitHint: string;
    roundingHint: string;
  };
  stimulusType:
    | 'flat-constant'
    | 'efficiency-flow'
    | 'two-stage-bar'
    | 'continuous-car'
    | 'test-track'
    | 'dual-comparison'
    | 'mass-distance-graph'
    | 'error-comparison'
    | 'cargo-load'
    | 'inclined-car'
    | 'aero-car'
    | 'two-surface-road'
    | 'dual-tank-staging'
    | 'fuel-leak-car'
    | 'gradient-road';
  stimulusCaption: string;
  stimulusData?: Record<string, number | string>;
  fbd: FBDConfig;
  explanation: ExplanationSteps;
  animation: AnimationConfig;
  ttsFullQuestion: string;
  ttsExplanationSummary: string;
}

export interface QuestionAttempt {
  questionId: number;
  lastInput: string;
  attempts: number;
  isCorrect: boolean;
  hasTried: boolean;
  explanationOpened: boolean;
  answeredAt?: string;
}

export interface StudentProgress {
  attemptsById: Record<number, QuestionAttempt>;
  academyCompletedIds: number[];
}

export interface AcademyFormula {
  latex: string;
  title: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  mathMeaning: string;
  physicsMeaning: string;
  conditions: string;
  limitations: string;
  applicationExample: string;
}

export interface AcademySection {
  id: number;
  numberLabel: string;
  title: string;
  category: string;
  summary: string;
  contentParagraphs: string[];
  bullets?: string[];
  formula?: AcademyFormula;
  diagramType?:
    | 'phenomenon'
    | 'forces-fbd'
    | 'work-integral'
    | 'log-vs-linear'
    | 'osk-12-model';
  ttsScript: string;
}
