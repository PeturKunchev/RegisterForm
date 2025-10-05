import { test, mock } from "node:test";
import { strict as assert } from "assert";

// ✅ Dynamically import with mocked dependency
const mockCors = { setCors: () => {} };
const { sendJSON, sendOk, sendError, notFound } = await import(
  "../services/responses.js"
);

function createMockRes() {
  return {
    headers: {},
    statusCode: null,
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
    },
    writeHead(status, headers) {
      this.statusCode = status;
      Object.assign(this.headers, headers);
    },
    end(data) {
      this.body = data;
    },
  };
}

test("sendJSON should send correct headers and JSON body", () => {
  // Monkeypatch setCors locally — no module mutation
  mockCors.setCors = () => {};

  const res = createMockRes();
  sendJSON(res, 201, { ok: true });

  assert.equal(res.statusCode, 201);
  assert.equal(res.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(res.body), { ok: true });
});

test("sendOk should send success=true with data", () => {
  const res = createMockRes();
  sendOk(res, { message: "Done" });

  const body = JSON.parse(res.body);
  assert.equal(res.statusCode, 200);
  assert.equal(body.success, true);
  assert.equal(body.message, "Done");
});

test("sendError should send success=false and custom status/message", () => {
  const res = createMockRes();
  sendError(res, "Invalid", 422, { field: "email" });

  const body = JSON.parse(res.body);
  assert.equal(res.statusCode, 422);
  assert.equal(body.success, false);
  assert.equal(body.message, "Invalid");
  assert.equal(body.field, "email");
});

test("notFound should send a 404 error response", () => {
  const res = createMockRes();
  notFound(res);

  const body = JSON.parse(res.body);
  assert.equal(res.statusCode, 404);
  assert.equal(body.success, false);
  assert.equal(body.message, "Not Found");
});