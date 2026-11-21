import { Question } from '../types/physics';
import { QUESTIONS_1_TO_8 } from './questionsStage1to3';
import { QUESTIONS_9_TO_15, } from './questionsStage4to5';

export { STAGES_META } from './questionsStage1to3';

export const ALL_QUESTIONS: Question[] = [...QUESTIONS_1_TO_8, ...QUESTIONS_9_TO_15];

export function getQuestionById(id: number): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}
