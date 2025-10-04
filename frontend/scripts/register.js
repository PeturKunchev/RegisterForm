import { apiFetch, refreshCaptcha, showMessage } from "./app.js";

document.addEventListener("DOMContentLoaded",()=>{
    const form = document.getElementById("registerForm");
    const refreshBtn = document.getElementById("refreshCaptcha");

    refreshBtn.addEventListener("click",()=>{
        refreshCaptcha("captchaImg")
    });

    form.addEventListener("submit", async (e)=>{
        e.preventDefault();

        const email = document.getElementById("email").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const password = document.getElementById("password").value;
        const password2 = document.getElementById("password2").value;
        const captcha = document.getElementById("captchaInput").value;

    if (password !== password2) {
      showMessage("registerMsg", "Password missmatch!", "error");
      return;
    }

    const data = await apiFetch("http://127.0.0.1:3000/api/register",{
        method: "POST",
        body: JSON.stringify({email,firstName,lastName,password,captcha})
    });
    if (data.success) {
        
        showMessage("registerMsg", "Successful registration!", "success");
        form.reset();
        refreshCaptcha("captchaImg");
        window.location.href = "./login.html";
    }
    else {
        showMessage("registerMsg", data.message || "Registration error", "error");
        refreshCaptcha("captchaImg");
    }


    })
})