import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTextForMisterJoSpeech } from './ttsFormatter';

test('converts physics formulas and symbols to natural Indonesian speech without raw LaTeX', () => {
  const speech1 = formatTextForMisterJoSpeech('ΣF = ma dengan f = μMg dan η = 2197,3 kJ/kg.');
  assert.ok(speech1.includes('sigma gaya'));
  assert.ok(speech1.includes('miu'));
  assert.ok(speech1.includes('eta'));
  assert.ok(speech1.includes('2197 koma 3'));
  assert.ok(speech1.includes('kilojoule per kilogram'));
  assert.ok(!speech1.includes('\\'));

  const speech2 = formatTextForMisterJoSpeech(
    '$x = \\frac{\\eta}{\\mu g} \\ln\\left(1 + \\frac{m_b}{m}\\right)$'
  );
  assert.ok(speech2.includes('logaritma natural'));
  assert.ok(speech2.includes('dibagi'));
  assert.ok(!speech2.includes('$'));
  assert.ok(!speech2.includes('\\frac'));
});
