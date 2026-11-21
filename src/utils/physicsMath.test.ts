import test from 'node:test';
import assert from 'node:assert/strict';
import {
  roundOneDecimal,
  formatIndonesianDecimal,
  evaluateStudentAnswer,
  solveQ1,
  solveQ2,
  solveQ3TwoStage,
  solveContinuousFlat,
  solveQ5EtaKJ,
  solveQ6DeltaX,
  solveQ7FromPoint,
  solveQ8DiffExactVsNaive,
  solveQ9AddedCargo,
  solveQ10Incline,
  solveQ11WithConstantDrag,
  solveQ12TwoSegments,
  solveQ13StagingTankDrop,
  solveQ14FuelLeak,
  solveQ15LinearMuGradient,
} from './physicsMath';

test('rounding and Indonesian decimal formatting', () => {
  assert.equal(roundOneDecimal(12.54), 12.5);
  assert.equal(roundOneDecimal(12.55), 12.6);
  assert.equal(roundOneDecimal(2.0), 2.0);
  assert.equal(formatIndonesianDecimal(575.364), '575,4');
  assert.equal(formatIndonesianDecimal(2.0), '2,0');
});

test('answer evaluator enforces comma decimal, single decimal place, and recognizes valid unit spacing', () => {
  const ok1 = evaluateStudentAnswer('575,4', 575.4, 0.3, 'km', ['kilometer']);
  assert.equal(ok1.isValidFormat, true);
  assert.equal(ok1.isCorrect, true);

  const ok2 = evaluateStudentAnswer('  575,4   km ', 575.4, 0.3, 'km', ['kilometer']);
  assert.equal(ok2.isValidFormat, true);
  assert.equal(ok2.isCorrect, true);

  const dotErr = evaluateStudentAnswer('575.4', 575.4, 0.3, 'km', ['kilometer']);
  assert.equal(dotErr.isValidFormat, false);
  assert.equal(dotErr.isCorrect, false);

  const twoDecErr = evaluateStudentAnswer('575,36', 575.4, 0.3, 'km', ['kilometer']);
  assert.equal(twoDecErr.isValidFormat, false);
  assert.equal(twoDecErr.isCorrect, false);

  const noDecErr = evaluateStudentAnswer('2', 2.0, 0.1, 'km', ['kilometer']);
  assert.equal(noDecErr.isValidFormat, false);
  assert.equal(noDecErr.isCorrect, false);

  const naiveTrap = evaluateStudentAnswer('400,0', 46.3, 0.2, 'km', ['kilometer'], {
    naiveTrapValue: 400.0,
  });
  assert.equal(naiveTrap.isValidFormat, true);
  assert.equal(naiveTrap.isCorrect, false);
});

test('all 15 physics solvers produce exact verified answers to 1 decimal place', () => {
  // Original OSK 2026 #12 check: mu=0.1, eta=2197.3 kJ/kg, m=4*mb, g=9.8
  const osk12 = solveContinuousFlat({
    mEmpty: 800,
    mFuel: 200,
    etaKJ: 2197.3,
    mu: 0.1,
    g: 9.8,
  });
  assert.equal(formatIndonesianDecimal(osk12), '500,3');

  // Q1
  const q1 = solveQ1({ E_kJ: 1568, mu: 0.08, M: 1000, g: 9.8 });
  assert.equal(formatIndonesianDecimal(q1), '2,0');

  // Q2
  const q2 = solveQ2({ mFuel: 15, etaKJ: 4200, efficiency: 0.25, mu: 0.05, M: 1200, g: 9.8 });
  assert.equal(formatIndonesianDecimal(q2), '26,8');

  // Q3
  const q3 = solveQ3TwoStage({ mEmpty: 800, mFuel: 200, etaKJ: 1960, mu: 0.1, g: 9.8 });
  assert.equal(formatIndonesianDecimal(q3), '422,2');

  // Q4
  const q4 = solveContinuousFlat({ mEmpty: 900, mFuel: 300, etaKJ: 2352, mu: 0.12, g: 9.8 });
  assert.equal(formatIndonesianDecimal(q4), '575,4');

  // Q5
  const q5 = solveQ5EtaKJ({ ratioEmptyToFuel: 5, mu: 0.08, g: 9.8, distanceKm: 450 });
  assert.equal(formatIndonesianDecimal(q5), '1935,0');

  // Q6
  const q6 = solveQ6DeltaX({ mEmpty: 1000, mFuel1: 200, mFuel2: 400, etaKJ: 2450, mu: 0.1, g: 9.8 });
  assert.equal(formatIndonesianDecimal(q6), '385,4');

  // Q7
  const q7 = solveQ7FromPoint({ M0: 1500, Mx1: 1250, x1Km: 300, mEmpty: 1000 });
  assert.equal(formatIndonesianDecimal(q7), '667,2');

  // Q8
  const q8 = solveQ8DiffExactVsNaive({ mEmpty: 800, mFuel: 200, etaKJ: 1960, mu: 0.1, g: 9.8 });
  assert.equal(formatIndonesianDecimal(q8.naiveKm), '400,0');
  assert.equal(formatIndonesianDecimal(q8.diffKm), '46,3');

  // Q9
  const q9 = solveQ9AddedCargo({ m1: 600, deltaM: 300, mFuel: 150, x1Km: 400.0 });
  assert.equal(formatIndonesianDecimal(q9), '276,3');

  // Q10
  const q10 = solveQ10Incline({
    mEmpty: 1000,
    mFuel: 250,
    sinTheta: 0.28,
    cosTheta: 0.96,
    mu: 0.125,
    etaKJ: 3920,
    g: 9.8,
  });
  assert.equal(formatIndonesianDecimal(q10), '223,1');

  // Q11
  const q11 = solveQ11WithConstantDrag({
    mEmpty: 800,
    mFuel: 200,
    mu: 0.1,
    g: 9.8,
    F0: 216,
    etaKJ: 2450,
  });
  assert.equal(formatIndonesianDecimal(q11), '447,5');

  // Q12
  const q12 = solveQ12TwoSegments({
    mEmpty: 1000,
    mFuel: 250,
    etaKJ: 2940,
    g: 9.8,
    mu1: 0.08,
    d1Km: 300,
    mu2: 0.15,
  });
  assert.equal(formatIndonesianDecimal(q12), '586,3');

  // Q13
  const q13 = solveQ13StagingTankDrop({
    mChassis: 800,
    mTankExtEmpty: 100,
    mFuel1: 150,
    mFuel2: 150,
    mu: 0.1,
    g: 9.8,
    etaKJ: 2940,
  });
  assert.equal(formatIndonesianDecimal(q13), '916,1');

  // Q14
  const q14 = solveQ14FuelLeak({
    mEmpty: 900,
    mFuel: 300,
    mu: 0.1,
    g: 9.8,
    etaKJ: 2940,
    speedMs: 20,
    leakRateKgS: 0.004,
  });
  assert.equal(formatIndonesianDecimal(q14), '547,0');

  // Q15
  const q15 = solveQ15LinearMuGradient({
    mEmpty: 1000,
    mFuel: 250,
    mu0: 0.05,
    alphaPerM: 2.0e-7,
    g: 9.8,
    etaKJ: 2197.3,
  });
  assert.equal(formatIndonesianDecimal(q15), '500,2');
});
