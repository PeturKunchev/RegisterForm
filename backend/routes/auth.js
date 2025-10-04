import { validateCaptcha } from "../services/captchaValidation.js";
import { validateEmail, validateName, validatePassword } from "../services/validators.js";
import { sendError, sendOk } from "../services/responses.js";
import { query } from "../db/connection.js";
import { hashPassword } from "../services/security.js";

export async function authRouter(req, res) {
  const { url, method } = req;

  if (url === "/api/register" && method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { email, firstName, lastName, password, captcha } = data;

        if (!validateEmail(email)) {
          return sendError(res, "Invalid email format");
        }
        if (!validateName(firstName) || !validateName(lastName)) {
          return sendError(res,"Invalid name format");
        }
        if (!validatePassword(password)) {
           return sendError(res,"Password too weak (min 8 chars)");
        }

        const existing = await query("SELECT id FROM users WHERE email = $1",[email]);
        if (existing.rows.length >= 1) {
          return sendError(res,"Email already in use")
        }
        
        const captchaResult = validateCaptcha(req, captcha);
        if (!captchaResult.valid) {
          return sendError(res, captchaResult.message);
        }
        const  hash = hashPassword(password);

        await query(
          "INSERT INTO users (email, first_name, last_name, pw_hash) VALUES ($1, $2, $3, $4)",
          [email, firstName, lastName, hash]
          );
        return sendOk(res, { message: "Data received successfully" });

      } catch (err) {
        console.error("JSON parse error:", err);
        return sendError(res, "Invalid JSON", 400);
      }
    });

    return;
  }
}