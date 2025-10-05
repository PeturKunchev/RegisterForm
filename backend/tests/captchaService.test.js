import test from 'node:test'
import assert from 'node:assert/strict'
import { generateText, generateCaptcha } from '../services/captcha.js'

test('generateText returns a string of correct length', () => {
  const result = generateText(8)
  assert.equal(typeof result, 'string')
  assert.equal(result.length, 8)
})

test('generateText uses only allowed characters', () => {
  const allowed = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789]+$/
  const result = generateText(20)
  assert.match(result, allowed)
})

test('generateCaptcha returns a PNG buffer', () => {
  const text = 'ABCDE'
  const result = generateCaptcha(text)

  assert.ok(Buffer.isBuffer(result))
  assert.equal(result[0], 0x89)
  assert.equal(result[1], 0x50)
  assert.equal(result[2], 0x4E)
  assert.equal(result[3], 0x47)
})

test('generateCaptcha draws something even with empty text', () => {
  const result = generateCaptcha('')
  assert.ok(Buffer.isBuffer(result))
  assert.equal(result[0], 0x89) 
})