import http from 'http'
import { query } from './db/connection.js';

const port = 3000;

function sendJSON(res,status,data) {
    setCors(res)
    res.writeHead(status, {"Content-Type":"application/json"});
    res.end(JSON.stringify(data));
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = http.createServer(async (req,res)=>{
    const {url,method} = req;
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

    sendJSON(res, 404, {error: "Not Found"});
});

server.listen(port, ()=>{
    console.log(`API running at http://localhost:${port}`);
    
})