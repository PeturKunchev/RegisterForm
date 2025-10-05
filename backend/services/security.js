import bcrypt from 'bcrypt';
export async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password,saltRounds);
}
export async function verifyPassword(password,hash) {
    if (typeof password !== "string" || typeof hash !== "string") return false;
    try {
        return await bcrypt.compare(password, hash);
    } catch {
        return false;
    }
}