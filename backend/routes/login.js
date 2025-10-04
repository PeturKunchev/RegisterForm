import { query } from "../db/connection.js";
import { validateCaptcha } from "../services/captchaValidation.js";
import { setCors } from "../services/cors.js";
import { sendError } from "../services/responses.js";
import { verifyPassword } from "../services/security.js";
import { validateEmail } from "../services/validators.js";
import crypto from 'crypto';
export async function loginHandler(req,res) {
    let body = "";

    req.on("data", chunk => (body += chunk));

    req.on("end", async () => {
        setCors(res);
        try {
            const data = JSON.parse(body);
            const {email, password, captcha} = data;
                if (!validateEmail(email)) {
            return sendError(res, "Invalid email format");
            }
                if (!password || password.length < 1) {
            return sendError(res, "Password required");
            }

            const captchaResult = validateCaptcha(req, captcha);
                if (!captchaResult.valid) {
            return sendError(res, captchaResult.message);
            }

            const result = await query("SELECT id, pw_hash FROM users WHERE email = $1", [email]);
            if (result.rows.length === 0) {
                return sendError(res, "Invalid credentials");
            }
            const user = result.rows[0];

            console.log("Password entered:", password);
            console.log("Stored hash:", user.pw_hash);

            const match = await verifyPassword(password, user.pw_hash.toString());
            if (!match) {
                return sendError(res, "Invalid credentials");
            }

            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

            await query(
                  "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)",
                    [token, user.id, expiresAt]
            )
             res.writeHead(200, {
        "Content-Type": "application/json",
        "Set-Cookie": `session=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
      });
      return res.end(JSON.stringify({ success: true, message: "Login successful" }));
        } catch (error) {
            console.error("Login error:", error);
            return sendError(res, "Invalid JSON or server error")
        }
    })
}