import { refreshCaptcha } from "./app";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const refreshBtn = document.getElementById("loginRefreshCaptcha");

  refreshBtn.addEventListener("click", () => {
    refreshCaptcha("loginCaptchaImg");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const captcha = document.getElementById("loginCaptchaInput").value;

    const data = await apiFetch("http://127.0.0.1:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password, captcha })
    });

    if (data.success) {
      showMessage("loginMsg", "Successful login!", "success");
      window.location.href = "profile.html";
    } else {
      showMessage("loginMsg", data.message || "Login error!", "error");
      refreshCaptcha("loginCaptchaImg");
    }
  });
});
