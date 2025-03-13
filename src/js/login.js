document.forms.login.addEventListener("submit", (event) => {
  event.preventDefault();

  loginRequest();
});

async function loginRequest() {
  showLoader();
  const loginForm = document.forms.login;
  const formData = new FormData(loginForm);
  const emailLogin = formData.get("email-login");
  const passwordLogin = formData.get("password-login");
  const requestBody = {
    email: emailLogin,
    password: passwordLogin,
  };

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (response.ok && response.status === 200) {
      const result = await response.json();

      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data));

      showSuccessMessage();

      setTimeout(() => {
        window.location.href = "../post/manage.html";
      }, 1000);
    } else {
      const result = await response.json();
      const errorMessage = result.errors
        ? result.errors[0].message
        : "Login failed";
      showErrorModal(errorMessage);
      console.error("Login error:", errorMessage);
    }
  } catch (error) {
    console.error("Login error:", error);
    showErrorModal();
  } finally {
    hideLoader();
  }
}

//Modals

function showSuccessMessage() {
  const loginSuccess = document.getElementById("snackbar_message");

  loginSuccess.className = "snackbar-show";

  setTimeout(function () {
    loginSuccess.className = loginSuccess.className.replace(
      "snackbar-show",
      ""
    );
  }, 3000);
}

function showErrorModal(errorMessage) {
  const dialog = document.getElementById("login_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("login_error_message").innerHTML = errorMessage;
  }
}

const closeModalX = document.getElementById("close_modal_x");
const closeModalContinue = document.getElementById("close_modal_continue");
const dialog = document.getElementById("login_error_modal");

closeModalX.addEventListener("click", () => {
  dialog.close();
});

closeModalContinue.addEventListener("click", () => {
  dialog.close();
});

//Validation

document
  .getElementById("email_login")
  .addEventListener("input", validateUsername);

function validateUsername(event) {
  const emailLogin = document.getElementById("email_login");

  if (event.target === emailLogin) {
    if (!/^[\w\.-]+@stud\.noroff\.no$/.test(emailLogin.value)) {
      emailLogin.setCustomValidity(
        "Username must be a valid stud.noroff.no address."
      );
    } else {
      emailLogin.setCustomValidity("");
    }
  }
}
