import { setCors } from "./cors.js";


export function sendJSON(res, status, body) {
  setCors(res);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

export function sendOk(res, data = {}) {
  return sendJSON(res, 200, { success: true, ...data });
}

export function sendError(res, message = "Bad Request", status = 400, extra = {}) {
  return sendJSON(res, status, { success: false, message, ...extra });
}

export function notFound(res, message = "Not Found") {
  return sendError(res, message, 404);
}