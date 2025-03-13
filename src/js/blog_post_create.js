document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "/account/login.html";
    return;
  }

  const createPostForm = document.forms.create;

  createPostForm.addEventListener("submit", (event) => {
    event.preventDefault();

    createPostRequest();
  });
});

async function createPostRequest() {
  showLoader();
  const createPostForm = document.forms.create;
  const formData = new FormData(createPostForm);
  const title = formData.get("title");
  const body = formData.get("body");
  const topic = formData.get("topic");
  const imageUrl = formData.get("image");
  const imageAlt = formData.get("alt");
  const requestBody = {
    title,
    body: body || "",
    tags: topic ? [topic] : [],
    media: imageUrl ? { url: imageUrl, alt: imageAlt } : null,
  };

  const accessToken = getAccessToken();

  try {
    const response = await fetch(
      "https://v2.api.noroff.dev/blog/posts/Jereriviel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      showSuccessMessage();

      setTimeout(() => {
        window.location.href = "../post/manage.html";
      }, 1000);
    } else {
      const result = await response.json();
      const errorMessage = result.errors
        ? result.errors[0].message
        : "Create post failed";
      showErrorModal(errorMessage);
      console.error("Create post error:", errorMessage);
    }
  } catch (error) {
    console.error("Create post error:", error);
    showErrorModal();
  } finally {
    hideLoader();
  }
}

//Modals

function showErrorModal(errorMessage) {
  const dialog = document.getElementById("create_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("create_error_message").innerHTML = errorMessage;
  }
}

const closeModalX = document.getElementById("close_modal_x");
const closeModalContinue = document.getElementById("close_modal_continue");
const dialog = document.getElementById("create_error_modal");

closeModalX.addEventListener("click", () => {
  dialog.close();
});

closeModalContinue.addEventListener("click", () => {
  dialog.close();
});

function showSuccessMessage() {
  const createSuccess = document.getElementById("snackbar_message");

  createSuccess.className = "snackbar-show";

  setTimeout(function () {
    createSuccess.className = createSuccess.className.replace(
      "snackbar-show",
      ""
    );
  }, 3000);
}
