document.forms.register.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validatePassword()) {
    return;
  }

  registerRequest();
});

async function registerRequest() {
  showLoader();
  const registerForm = document.forms.register;
  const formData = new FormData(registerForm);
  const nameRegister = formData.get("name-register");
  const emailRegister = formData.get("email-register");
  const passwordRegister = formData.get("password-register");
  const requestBody = {
    name: nameRegister,
    email: emailRegister,
    password: passwordRegister,
  };

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (response.ok && response.status === 201) {
      showSuccessModal();
    } else {
      const result = await response.json();
      const errorMessage = result.errors ? result.errors[0].message : "";
      showErrorModal(errorMessage);
      console.error("Registration error:", errorMessage);
    }
  } catch (error) {
    console.error("Registration error:", error);
    showErrorModal();
  } finally {
    hideLoader();
  }
}

//Validation

document
  .getElementById("name_register")
  .addEventListener("input", validateName);

document
  .getElementById("email_register")
  .addEventListener("input", validateEmail);

function validateName(event) {
  const inputName = document.getElementById("name_register");

  if (event.target === inputName) {
    if (!/^[a-zA-Z0-9_ ]+$/.test(inputName.value)) {
      inputName.setCustomValidity(
        "Username can only contain letters, numbers, spaces and underscores."
      );
    } else {
      inputName.setCustomValidity("");
    }
  }
}

function validateEmail(event) {
  const inputEmail = document.getElementById("email_register");

  if (event.target === inputEmail) {
    if (!/^[\w\.-]+@stud\.noroff\.no$/.test(inputEmail.value)) {
      inputEmail.setCustomValidity(
        "Email must be a valid stud.noroff.no address."
      );
    } else {
      inputEmail.setCustomValidity("");
    }
  }
}

document
  .getElementById("password_register")
  .addEventListener("input", validatePassword);
document
  .getElementById("password_confirm")
  .addEventListener("input", validatePassword);

function validatePassword() {
  const password = document.getElementById("password_register");
  const passwordConfirm = document.getElementById("password_confirm");

  if (password.value !== passwordConfirm.value) {
    passwordConfirm.setCustomValidity("Passwords do not match.");
    return false;
  } else {
    passwordConfirm.setCustomValidity("");
    return true;
  }
}

//Modals

function showSuccessModal() {
  const dialog = document.getElementById("register_success_modal");
  dialog.showModal();
}

function showErrorModal(errorMessage) {
  const dialog = document.getElementById("register_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("register_error_message").innerHTML = errorMessage;
  }
}

const closeModalX = document.getElementById("close_modal_x");
const closeModalContinue = document.getElementById("close_modal_continue");
const dialog = document.getElementById("register_error_modal");

closeModalX.addEventListener("click", () => {
  dialog.close();
});

closeModalContinue.addEventListener("click", () => {
  dialog.close();
});
