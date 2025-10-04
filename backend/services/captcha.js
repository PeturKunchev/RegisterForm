import { createCanvas } from "canvas";

export function generateText(length = 5) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
    let text = "";
    for (let index = 0; index < length; index++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}
export function generateCaptcha(text) {
    const width = 150;
    const height = 50;
    const canvas = createCanvas(width,height);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0,0,width,height);

    for (let index = 0; index < 5; index++) {
        ctx.strokeStyle = `rgba(0,0,0,${Math.random()})`;

            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.stroke();
    }
    ctx.font = "30px Sans";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

  return canvas.toBuffer("image/png"); 
}

