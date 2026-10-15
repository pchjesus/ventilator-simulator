import test from 'node:test';
import assert from 'node:assert/strict';
import {initialSettings} from '../src/sim-model.js';
import {generateWaveform} from '../src/waveform-model.js';
import {createPracticeSession, selectPracticeSetting, adjustPracticeValue, cancelPracticeEdit, applyPracticeEdit} from '../src/learning-room-state.js';

test('practice edits and cancellation cannot change the committed settings or another lesson', () => {
  const original = createPracticeSession('cancel');
  const other = createPracticeSession('apply');
  const selected = selectPracticeSetting(original, 'peep');
  const adjusted = adjustPracticeValue(selected, 1);
  assert.equal(adjusted.edit.pending, 6);
  assert.deepEqual(adjusted.settings, initialSettings());
  assert.deepEqual(generateWaveform(adjusted.settings), generateWaveform(original.settings));
  const cancelled = cancelPracticeEdit(adjusted);
  assert.equal(cancelled.completed, true);
  assert.equal(cancelled.edit, null);
  assert.equal(cancelled.settings.peep, 5);
  assert.deepEqual(other, createPracticeSession('apply'));
  assert.deepEqual(original, createPracticeSession('cancel'));
});

test('cancellation only completes after a pending change, including returning to the original value', () => {
  const selected = selectPracticeSetting(createPracticeSession('cancel'), 'peep');
  assert.equal(cancelPracticeEdit(selected).completed, false);
  const unchanged = adjustPracticeValue(adjustPracticeValue(selected, 1), -1);
  assert.equal(cancelPracticeEdit(unchanged).completed, false);
  assert.equal(applyPracticeEdit(adjustPracticeValue(selected, 1)).settings.peep, 5);
});

test('apply commits a changed value and updates the generated waveform only after confirmation', () => {
  const initial = createPracticeSession('apply');
  const selected = selectPracticeSetting(initial, 'peep');
  assert.equal(applyPracticeEdit(selected).completed, false);
  const pending = adjustPracticeValue(selected, 1);
  assert.deepEqual(generateWaveform(pending.settings), generateWaveform(initial.settings));
  const applied = applyPracticeEdit(pending);
  assert.equal(applied.completed, true);
  assert.equal(applied.settings.peep, 6);
  assert.equal(applied.edit, null);
  assert.notDeepEqual(generateWaveform(applied.settings), generateWaveform(initial.settings));
  assert.equal(cancelPracticeEdit(pending).completed, false);
  assert.equal(initial.settings.peep, 5);
});

test('finding the wrong setting does not complete a lesson or open an editor', () => {
  const session = createPracticeSession('find');
  const wrong = selectPracticeSetting(session, 'fio2');
  assert.equal(wrong.completed, false);
  assert.equal(wrong.edit, null);
  assert.ok(wrong.feedback);
  const found = selectPracticeSetting(wrong, 'peep');
  assert.equal(found.completed, true);
  assert.equal(found.edit, null);
  assert.deepEqual(found.settings, initialSettings());
});

test('practice reuses the existing setting bounds and ignores invalid adjustments', () => {
  let session = selectPracticeSetting(createPracticeSession('apply'), 'peep');
  assert.equal(adjustPracticeValue(session, NaN).edit.pending, 5);
  for (let i = 0; i < 40; i++) session = adjustPracticeValue(session, 1);
  assert.equal(session.edit.pending, 20);
  for (let i = 0; i < 40; i++) session = adjustPracticeValue(session, -1);
  assert.equal(session.edit.pending, 0);
  assert.equal(session.settings.peep, 5);
});
