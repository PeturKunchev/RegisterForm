import http from 'http'
import { query } from './db/connection.js';
import { captchaRouter } from './routes/captcha.js';
import { authRouter } from './routes/auth.js';
import { setCors } from './services/cors.js';
import { notFound } from './services/responses.js';
import { loginHandler } from './routes/login.js';
import { profileRouter } from './routes/profile.js';

const port = 3000;

function sendJSON(res,status,data) {
    setCors(res)
    res.writeHead(status, {"Content-Type":"application/json"});
    res.end(JSON.stringify(data));
}


const server = http.createServer(async (req,res)=>{
    const {url,method} = req;

    if (method === "OPTIONS") {
    setCors(res);
    res.writeHead(204); 
    return res.end();
  }


    if (url === "/api/ping" && method === "GET") {
        return sendJSON(res, 200, {message: "PONG"})
    }

    if (url === "/api/db-test" && method === "GET") {
        try {
            const result = await query("SELECT NOW()");
            return sendJSON(res, 200, {dbTime: result.rows[0]})
        } catch (error) {
            return sendJSON(res,500,{error: error.message})
        }
    }

    if (url.startsWith("/api/captcha")) {
        return captchaRouter(req,res);
    }

    if (url.startsWith("/api/register")) {
        return authRouter(req,res);
    }
    if (url.startsWith("/api/login")) {
        return loginHandler(req,res);
    }
    if (url.startsWith("/api/profile") || url.startsWith("/api/logout")) {
  return profileRouter(req, res);
}
    return notFound(res);
});

server.listen(port, ()=>{
    console.log(`API running at http://127.0.0.1:${port}`);
    
})