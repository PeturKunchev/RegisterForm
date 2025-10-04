import pkg from "pg"

const {Pool} = pkg;

const pool = new Pool({
    connectionString: "postgres://postgres:1234@localhost:5432/myapp"
});

export async function query(text,params) {
    const res = await pool.query(text, params);
    return res;
}