import test from 'node:test';
import assert from 'node:assert';
import { validateEmail, validateName, validatePassword } from '../services/validators.js';

test('validateEmail should accept valid emails', () => {
  assert.strictEqual(validateEmail('user@example.com'), true);
});

test('validateEmail should reject invalid emails', () => {
  assert.strictEqual(validateEmail('not-an-email'), false);
});

test('validateName should accept normal names', () => {
  assert.strictEqual(validateName('John'), true);
});

test('validateName should reject empty or invalid names', () => {
  assert.strictEqual(validateName(''), false);
  assert.strictEqual(validateName('1234'), false);
});

test('validatePassword should enforce minimum length', () => {
  assert.strictEqual(validatePassword('short'), false);
  assert.strictEqual(validatePassword('longenoughpassword'), true);
});

test('validateEmail should reject emails with spaces or missing domain', () => {
  assert.strictEqual(validateEmail('user @example.com'), false);
  assert.strictEqual(validateEmail('userexample.com'), false);
  assert.strictEqual(validateEmail('@example.com'), false);
  assert.strictEqual(validateEmail('user@.com'), false);
});

test('validateEmail should handle non-string inputs gracefully', () => {
  assert.strictEqual(validateEmail(null), false);
  assert.strictEqual(validateEmail(undefined), false);
  assert.strictEqual(validateEmail(12345), false);
});

test('validateName should reject names that are too short or too long', () => {
  assert.strictEqual(validateName('A'), false);
  assert.strictEqual(validateName('A'.repeat(60)), false);
});

test('validateName should reject symbols and numbers', () => {
  assert.strictEqual(validateName('John123'), false);
  assert.strictEqual(validateName('!@#$%^'), false);
});
test('validateName should return false for non-string input', () => {
  assert.strictEqual(validateName(12345), false);
  assert.strictEqual(validateName(undefined), false);
  assert.strictEqual(validateName(null), false);
});

test('validatePassword should reject non-string values', () => {
  assert.strictEqual(validatePassword(12345678), false);
  assert.strictEqual(validatePassword(null), false);
  assert.strictEqual(validatePassword(undefined), false);
});

test('validatePassword should handle empty or whitespace-only strings', () => {
  assert.strictEqual(validatePassword(''), false);
  assert.strictEqual(validatePassword('     '), false);
});