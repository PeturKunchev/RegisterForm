import { query } from "../db/connection.js";

export async function getUserFromSession(req) {
    const cookie = (req.headers.cookie || "").split(";").find(c => c.trim().startsWith("session="));

    const token = cookie ? cookie.split("=")[1] : null;

    if (!token) {
        return null;
    }
    try {
        const result = await query(
         `SELECT u.id, u.email, u.first_name, u.last_name
   FROM sessions s
   JOIN users u ON s.user_id = u.id
   WHERE s.id = $1 AND s.expires_at > NOW()`,
      [token]
    );

    return result.rows[0] || null;
    } catch (error) {
        console.error("getUserFromSession error:", error);
        return null;
    }
}