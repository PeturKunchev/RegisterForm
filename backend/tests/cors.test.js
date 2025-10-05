import test from 'node:test'
import assert from 'node:assert/strict'
import { setCors } from '../services/cors.js'

test('setCors sets the correct CORS headers', () => {
  const headers = {}
  const res = {
    setHeader(key, value) {
      headers[key] = value
    }
  }

  setCors(res)

  assert.equal(headers['Access-Control-Allow-Origin'], 'http://127.0.0.1:5500')
  assert.equal(headers['Access-Control-Allow-Methods'], 'GET, POST, PUT, DELETE, OPTIONS')
  assert.equal(headers['Access-Control-Allow-Headers'], 'Content-Type')
  assert.equal(headers['Access-Control-Allow-Credentials'], 'true')
})

test('setCors overwrites existing headers if they already exist', () => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://old-origin.com',
    'Access-Control-Allow-Methods': 'PATCH'
  }

  const res = {
    setHeader(key, value) {
      headers[key] = value
    }
  }

  setCors(res)

  assert.equal(headers['Access-Control-Allow-Origin'], 'http://127.0.0.1:5500')
  assert.equal(headers['Access-Control-Allow-Methods'], 'GET, POST, PUT, DELETE, OPTIONS')
  assert.equal(headers['Access-Control-Allow-Headers'], 'Content-Type')
  assert.equal(headers['Access-Control-Allow-Credentials'], 'true')
})