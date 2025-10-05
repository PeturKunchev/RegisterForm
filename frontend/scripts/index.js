import { apiFetch, loadUserHeader } from "./app.js";

document.addEventListener("DOMContentLoaded" , async () => {
    const data = await apiFetch("http://127.0.0.1:3000/api/profile");

  if (!data.success) {
    window.location.href = "./login.html";
    return;
  }
  loadUserHeader();
})