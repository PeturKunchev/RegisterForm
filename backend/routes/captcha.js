import { generateCaptcha, generateText } from "../services/captcha.js";
import { setCors } from "../services/cors.js";

const captchaStore = new Map();

export function captchaRouter(req,res) {
    if (req.method === "GET" && req.url.startsWith("/api/captcha")) {
        setCors(res);
        const text = generateText(5);
        const image = generateCaptcha(text);
        const token = Math.random().toString(36).substring(2,15);
        captchaStore.set(token,text);

        res.writeHead(200,{
            "Content-Type":"image/png",
            "Set-Cookie": `captchaToken=${token}; HttpOnly; Path=/`
        });
        res.end(image);
        return;
    }

    if (req.method === "POST" && req.url === "/api/verify-captcha") {
        let body = "";
        req.on("data",chunk => (body += chunk));
        req.on("end",()=>{
            const {captcha} = JSON.parse(body);
            const token = (req.headers.cookie || "").split(";").find(c => c.trim().startsWith("captchaToken="))?.split("=")[1];

            const expected = captchaStore.get(token);
            if (expected && expected.toLowerCase() === captcha.toLowerCase()) {
                captchaStore.delete(token);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ valid: true }));
            } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ valid: false }));
            }
        });
    }

}
export {captchaStore};

