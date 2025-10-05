export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
export function validateName(name) {
  if (typeof name !== 'string') return false;
  return /^[A-Za-zА-Яа-я]{2,50}$/.test(name.trim()); 
}

export function validatePassword(password) {
  if(typeof password !== 'string') return false;
  if(password.trim().length < 8) return false;
  return true;
}
