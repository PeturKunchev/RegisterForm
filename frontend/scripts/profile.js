import { apiFetch, loadUserHeader, showMessage } from "./app.js";
import { validateEmail, validateName } from "./validators.js";

document.addEventListener("DOMContentLoaded",()=>{
    loadUserHeader();
    const updateNameForm = document.getElementById("updateNameForm");
    const updatePasswordForm = document.getElementById("updatePasswordForm");
    const logoutBtn = document.getElementById("logoutBtn");
    async function loadProfile() {
        const data = await apiFetch("http://127.0.0.1:3000/api/profile");

        if (data.success)  {
            document.getElementById("profileEmail").value = data.user.email;
            document.getElementById("profileFirst").value = data.user.first_name;
            document.getElementById("profileLast").value = data.user.last_name;
        } else {
            window.location.href = "login.html";
        }
    }

    loadProfile();

    updateNameForm.addEventListener("submit", async(e)=>{
        e.preventDefault();
        const firstName = document.getElementById("profileFirst").value;
        const lastName = document.getElementById("profileLast").value;
        const email = document.getElementById("profileEmail").value;

        if (!validateEmail(email)) {
               showMessage("profileNameMsg", "Please enter a valid email!", "error");
               return;
        }
        if (!validateName(firstName)) {
               showMessage("profileNameMsg", "Please enter a valid first name!", "error");
               return;
        }
        if (!validateName(lastName)) {
               showMessage("profileNameMsg", "Please enter a valid last name!!", "error");
               return;
        }

        const data = await apiFetch("http://127.0.0.1:3000/api/profile",{
            method: "PUT",
            body: JSON.stringify({email,firstName,lastName})
        });
        if (data.success) {
        showMessage("profileNameMsg", "Profile updated!", "success");
        } else {
        showMessage("profileNameMsg", data.message || "Error with update!", "error");
        }
    })
updatePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const newPassword2 = document.getElementById("newPassword2").value;

    if (newPassword !== newPassword2) {
      showMessage("profilePassMsg", "Password missmatch!", "error");
      return;
    }

    const data = await apiFetch("http://127.0.0.1:3000/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (data.success) {
      showMessage("profilePassMsg", "Password changed successfully!", "success");
      updatePasswordForm.reset();
    } else {
      showMessage("profilePassMsg", data.message || "Грешка при смяна", "error");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    const data = await apiFetch("http://127.0.0.1:3000/api/logout", { method: "POST" });
    if (data.success) {
      window.location.href = "login.html";
    }
  });


})