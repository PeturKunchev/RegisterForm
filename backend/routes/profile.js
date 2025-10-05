import { query } from "../db/connection.js";
import { setCors } from "../services/cors.js";
import { getUserFromSession } from "../services/getUser.js";
import { sendError, sendOk } from "../services/responses.js";
import { hashPassword, verifyPassword } from "../services/security.js";
import { validateEmail, validateName, validatePassword } from "../services/validators.js";

export async function profileRouter(req,res) {
    setCors(res);
    const {url, method} = req;

    if (url === "/api/profile" && method === "GET") {
        const user = await getUserFromSession(req);
        
        if (!user) {
            return sendError(res, "Not authenticated", 401);
        }
        return sendOk(res, {user});
    }

    if (url === "/api/profile" && method === "PUT") {
        const user = await getUserFromSession(req);
        if (!user) {
            return sendError(res, "Not authenticated", 401);
        }

        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end",async ()=>{
            try {
                const data = JSON.parse(body);
                const {email, firstName, lastName } = data;

                if (!validateName(firstName) || !validateName(lastName)) {
          return sendError(res, "Invalid name format");
        }
        if (!validateEmail(email)) {
          return sendError(res, "Invalid email format");
        }

        const existing = await query(
          "SELECT id FROM users WHERE email = $1 AND id != $2",
          [email, user.id]
        );
        if (existing.rows.length > 0) {
          return sendError(res, "Email already in use");
        }

        await query(
          "UPDATE users SET email = $1, first_name = $2, last_name = $3 WHERE id = $4",
          [email, firstName, lastName, user.id]
        );

        return sendOk(res, { message: "Profile updated successfully" });
            } catch (error) {
                console.error("Profile update error:", error);
                return sendError(res, "Invalid JSON or server error");
            }
        });
        return;
    }

    if (url === "/api/profile/password" && method === "PUT") {
        const user = await getUserFromSession(req);
        if (!user) {
            return sendError(res, "Not authenticated", 401);
        }

        let body = "";
        req.on("data",chunk => (body += chunk));
        req.on("end", async ()=>{
            try {
                const data = JSON.parse(body);
                const {currentPassword, newPassword} = data;

                 if (!validatePassword(newPassword)) {
            return sendError(res, "Password too weak (min 8 chars)");
        }

        const dbUser = await query("SELECT pw_hash FROM users WHERE id = $1", [user.id]);
        const match = await verifyPassword(currentPassword, dbUser.rows[0].pw_hash);
        if (!match) return sendError(res, "Current password incorrect");

        const newHash = await hashPassword(newPassword);
        await query("UPDATE users SET pw_hash = $1 WHERE id = $2",[newHash,user.id]);

        return sendOk(res, {message: "Password updated successfully"});
            } catch (error) {
                console.error("Password update error",error);
                return sendError(res, "Invalid JSON or server error");
            }
        });
        return;
    }

    if (url === "/api/logout" && method === "POST") {
        const cookie = (req.headers.cookie || "")
      .split(";")
      .find(c => c.trim().startsWith("session="));
    const token = cookie ? cookie.split("=")[1] : null;
    if (token) await query("DELETE FROM sessions WHERE id = $1", [token]);

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Set-Cookie": "session=; HttpOnly; Path=/; Max-Age=0;"
    });
    return res.end(JSON.stringify({ success: true, message: "Logged out" }));

    }
    sendError(res, "Not found",404);
}