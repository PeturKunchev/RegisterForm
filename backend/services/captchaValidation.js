import { captchaStore } from "../routes/captcha.js";

export function validateCaptcha(req,userInput) {
    
    const cookies = req.headers.cookie || "";
    const token = cookies
    .split(";")
    .find(c => c.trim().startsWith("captchaToken="))
    ?.split("=")[1];

    const expected = captchaStore.get(token);

    if (!expected) {
        return {valid: false, message: "Captcha expired or missing"}
    }

    if (expected.toLowerCase() !== userInput.toLowerCase()) {
        return {valid: false, message: "Invalid captcha"};
    }

    captchaStore.delete(token);

    return {valid: true};
}