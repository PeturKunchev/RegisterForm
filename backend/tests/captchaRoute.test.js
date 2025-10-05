import test from "node:test";
import assert from "node:assert/strict";
import { captchaRouter, captchaStore } from "../routes/captcha.js";

function createMockRes() {
  const headers = {};
  const chunks = [];
  return {
    headers,
    chunks,
    statusCode: null,
    setHeader(key, value) {
      headers[key] = value;
    },
    writeHead(code, hdrs) {
      this.statusCode = code;
      if (hdrs) Object.assign(headers, hdrs);
    },
    end(chunk) {
      if (chunk) chunks.push(chunk);
    },
  };
}

test.beforeEach(() => captchaStore.clear());

test("GET /api/captcha generates captcha and sets cookie", () => {
  const req = { method: "GET", url: "/api/captcha" };
  const res = createMockRes();

  captchaRouter(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["Content-Type"], "image/png");
  assert.match(res.headers["Set-Cookie"], /captchaToken=/);

  const token = res.headers["Set-Cookie"].match(/captchaToken=([^;]+)/)[1];
  assert.ok(captchaStore.has(token), "captchaStore should contain the token");
  const stored = captchaStore.get(token);
  assert.ok(typeof stored === "string" && stored.length > 0);
});

test("POST /api/verify-captcha returns valid=true on match", async () => {
  const token = "tok123";
  captchaStore.set(token, "abcde");

  const req = {
    method: "POST",
    url: "/api/verify-captcha",
    headers: { cookie: `captchaToken=${token}` },
    on(event, cb) {
      if (event === "data") cb(JSON.stringify({ captcha: "AbCdE" }));
      if (event === "end") cb();
    },
  };
  const res = createMockRes();

  await captchaRouter(req, res);

  assert.equal(res.statusCode, 200);
  assert.match(res.chunks[0].toString(), /"valid":true/);
  assert.equal(captchaStore.has(token), false);
});

test("POST /api/verify-captcha returns valid=false on mismatch", async () => {
  const token = "tok456";
  captchaStore.set(token, "abcde");

  const req = {
    method: "POST",
    url: "/api/verify-captcha",
    headers: { cookie: `captchaToken=${token}` },
    on(event, cb) {
      if (event === "data") cb(JSON.stringify({ captcha: "WRONG" }));
      if (event === "end") cb();
    },
  };
  const res = createMockRes();

  await captchaRouter(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.chunks[0].toString(), /"valid":false/);
});

test("ignores unrelated routes", () => {
  const req = { method: "DELETE", url: "/not-captcha" };
  const res = createMockRes();

  captchaRouter(req, res);

  assert.equal(res.statusCode, null);
});
test('POST /api/verify-captcha handles missing cookie header gracefully', async () => {

  const req = {
    method: 'POST',
    url: '/api/verify-captcha',
    headers: {}, 
    on(event, cb) {
      if (event === 'data') cb(JSON.stringify({ captcha: 'anything' }))
      if (event === 'end') cb()
    }
  }

  const res = (() => {
    const headers = {}
    const chunks = []
    return {
      headers,
      chunks,
      statusCode: null,
      setHeader(k, v) { headers[k] = v },
      writeHead(code, hdrs) {
        this.statusCode = code
        if (hdrs) Object.assign(headers, hdrs)
      },
      end(chunk) {
        if (chunk) chunks.push(chunk)
      }
    }
  })()

  await captchaRouter(req, res)

  assert.equal(res.statusCode, 400)
  assert.match(res.chunks[0].toString(), /"valid":false/)
})