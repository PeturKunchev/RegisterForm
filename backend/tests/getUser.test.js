import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const realDbPath = path.resolve('./db/connection.js')

const originalDbCode = fs.readFileSync(realDbPath, 'utf-8')

let mockQueryFn = async () => { throw new Error('mock not set') }
global.__mockQuery = (...args) => mockQueryFn(...args)

fs.writeFileSync(realDbPath, 'export const query = (...a) => global.__mockQuery(...a);')

const { getUserFromSession } = await import('../services/getUser.js')

test('returns null if no cookie header is present', async () => {
  const req = { headers: {} }
  const result = await getUserFromSession(req)
  assert.equal(result, null)
})

test('returns null if session cookie is missing', async () => {
  const req = { headers: { cookie: 'foo=bar; test=1' } }
  const result = await getUserFromSession(req)
  assert.equal(result, null)
})

test('returns user when valid token and db returns result', async () => {
  const req = { headers: { cookie: 'session=abc123' } }
  const fakeUser = { id: 1, email: 'john@doe.com', first_name: 'John', last_name: 'Doe' }

  mockQueryFn = async (sql, params) => {
    assert.match(sql, /SELECT u\.id/)
    assert.deepEqual(params, ['abc123'])
    return { rows: [fakeUser] }
  }

  const result = await getUserFromSession(req)
  assert.deepEqual(result, fakeUser)
})

test('returns null when db returns empty rows', async () => {
  const req = { headers: { cookie: 'session=expiredtoken' } }

  mockQueryFn = async () => ({ rows: [] })

  const result = await getUserFromSession(req)
  assert.equal(result, null)
})

test('returns null and logs error if query throws', async () => {
  const req = { headers: { cookie: 'session=abc123' } }

  let logged = ''
  const originalError = console.error
  console.error = (...args) => { logged = args.join(' ') }

  mockQueryFn = async () => { throw new Error('DB down') }

  const result = await getUserFromSession(req)

  console.error = originalError
  assert.equal(result, null)
  assert.match(logged, /getUserFromSession error:/)
})

test('cleanup', () => {
  fs.writeFileSync(realDbPath, originalDbCode)
})