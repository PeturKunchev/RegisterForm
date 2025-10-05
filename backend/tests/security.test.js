import test from 'node:test';
import assert from 'assert';
import { hashPassword, verifyPassword } from '../services/security.js';
import bcrypt from 'bcrypt';

test('hashPassword should return a hash string different from the original password', async ()=>{
    const password = "mySecurePass123"
    const hash = await hashPassword(password);
    assert.ok(typeof hash === 'string', "hash should be a string");
    assert.notStrictEqual(hash,password, 'hash should not match plain password');
    assert.ok(hash.length > 20, 'hash should be reasonably long');
});

test('verifyPassword should return true for correct password', async () => {
  const password = 'superSecret!';
  const hash = await hashPassword(password);
  const result = await verifyPassword(password, hash);
  assert.strictEqual(result, true);
});

test('verifyPassword should return false for wrong password', async () => {
  const password = 'superSecret!';
  const hash = await hashPassword(password);
  const result = await verifyPassword('wrongPass', hash);
  assert.strictEqual(result, false);
});
test('verifyPassword should handle invalid inputs gracefully', async () => {
  const result1 = await verifyPassword("", "$2b$10$someFakeHash");
  const result2 = await verifyPassword(null, null);
  assert.strictEqual(result1, false);
  assert.strictEqual(result2, false);
});

test('verifyPassword should handle bcrypt internal error', async () => {
  const originalCompare = bcrypt.compare;
  bcrypt.compare = async () => { throw new Error("bcrypt failed"); };
  const result = await verifyPassword("pass", "$2b$fakehash");
  assert.strictEqual(result, false);
  bcrypt.compare = originalCompare;
});