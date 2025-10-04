import { setCors } from "./cors.js";


/** Low-level JSON sender used by all helpers */
export function sendJSON(res, status, body) {
  setCors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

/** Convenience: 200 OK with { success: true, ...data } */
export function sendOk(res, data = {}) {
  return sendJSON(res, 200, { success: true, ...data });
}

/** Convenience: error with status (default 400) and message */
export function sendError(res, message = "Bad Request", status = 400, extra = {}) {
  return sendJSON(res, status, { success: false, message, ...extra });
}

/** 404 helper */
export function notFound(res, message = "Not Found") {
  return sendError(res, message, 404);
}