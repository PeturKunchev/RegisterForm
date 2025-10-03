export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
export function validateName(name) {
  return /^[A-Za-zА-Яа-я]{2,}$/.test(name); 
}

export function validatePassword(password) {
  return password.length >= 8;
}
