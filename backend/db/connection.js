import pkg from "pg"
import "dotenv/config";
const {Pool} = pkg;

const URL = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: URL
});

export async function query(text,params) {
    const res = await pool.query(text, params);
    return res;
}