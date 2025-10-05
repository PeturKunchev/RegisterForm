
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  return res.json();
}

export function showMessage(elementId, msg, type = "error") {
  const el = document.getElementById(elementId);
  el.textContent = msg;
  el.className = `message ${type}`;
}

export function refreshCaptcha(imgId, endpoint = "http://127.0.0.1:3000/api/captcha") {
  const img = document.getElementById(imgId);
  img.src = `${endpoint}?_=${Date.now()}`;
}
export async function loadUserHeader() {
  try {
    const data = await apiFetch("http://127.0.0.1:3000/api/profile");
    const userHeader = document.getElementById("userHeader");
    console.log(data);
    
    if (data.success && data.user) {
      userHeader.textContent = `Welcome, ${data.user.first_name}!`
    }
  } catch (error) {
    console.error("Error loading user header:",error);
    
  }
}