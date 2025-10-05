import test from 'node:test'
import assert from 'node:assert/strict'

import { captchaStore } from '../routes/captcha.js'
import { validateCaptcha } from '../services/captchaValidation.js'

test.beforeEach(() => {
  captchaStore.clear()
})

test('returns "Captcha expired or missing" if token not found', () => {
  const req = { headers: { cookie: 'captchaToken=missing123' } }

  const result = validateCaptcha(req, 'anything')

  assert.deepEqual(result, {
    valid: false,
    message: 'Captcha expired or missing'
  })
})

test('returns "Invalid captcha" if user input does not match', () => {
  const req = { headers: { cookie: 'captchaToken=abc123' } }

  captchaStore.set('abc123', 'XYZ789')

  const result = validateCaptcha(req, 'wrong')

  assert.deepEqual(result, {
    valid: false,
    message: 'Invalid captcha'
  })
})

test('returns valid=true and deletes token when captcha matches', () => {
  const req = { headers: { cookie: 'captchaToken=xyz999' } }

  captchaStore.set('xyz999', 'ABC123')

  const result = validateCaptcha(req, 'abc123')

  assert.deepEqual(result, { valid: true })
  assert.equal(captchaStore.has('xyz999'), false, 'token should be deleted')
})

test('returns "Captcha expired or missing" when no cookie header present', () => {
  const req = { headers: {} }

  const result = validateCaptcha(req, 'anything')

  assert.deepEqual(result, {
    valid: false,
    message: 'Captcha expired or missing'
  })
})