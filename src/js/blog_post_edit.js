document.addEventListener("DOMContentLoaded", async () => {
  showLoader();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "/account/login.html";
    return;
  }

  const postId = getPostIdFromUrl();

  if (!postId) {
    console.error("No post ID found in URL.");
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/Jereriviel/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post details.");
    }

    const result = await response.json();
    const post = result.data;

    document.getElementById("title").value = post.title;
    document.getElementById("body").value = post.body || "";
    document.getElementById("topic").value = post.tags?.[0] || "";
    document.getElementById("image").value = post.media?.url || "";
    document.getElementById("alt").value = post.media?.alt || "";
  } catch (error) {
    console.error("Error fetching post details:", error);
  } finally {
    hideLoader();
  }

  const editPostForm = document.forms.edit;

  editPostForm.addEventListener("submit", (event) => {
    event.preventDefault();

    updatePostRequest();
  });
});

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function updatePostRequest() {
  showLoader();
  const postId = getPostIdFromUrl();

  if (!postId) {
    console.error("No post ID found for update.");
    return;
  }

  const editPostForm = document.forms.edit;
  const formData = new FormData(editPostForm);
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
      `https://v2.api.noroff.dev/blog/posts/Jereriviel/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      showSuccessMessageUpdate();

      setTimeout(() => {
        window.location.href = "../post/manage.html";
      }, 1000);
    } else {
      const result = await response.json();
      const errorMessage = result.errors
        ? result.errors[0].message
        : "Update post failed";
      showErrorModalUpdate(errorMessage);
      console.error("Create post error:", errorMessage);
    }
  } catch (error) {
    console.error("Update post error:", error);
    showErrorModalUpdate();
  } finally {
    hideLoader();
  }
}

async function deletePostRequest() {
  showLoader();

  const deleteButton = document.getElementById("delete_button_modal");
  const postId = deleteButton.getAttribute("data-post-id");

  if (!postId) {
    console.error("No post ID found for deletion.");
    return;
  }

  const accessToken = getAccessToken();

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/Jereriviel/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      showSuccessMessageDelete();
      setTimeout(() => {
        window.location.href = "../post/manage.html";
      }, 1000);
    } else {
      const result = await response.json();
      const errorMessage = result.errors
        ? result.errors[0].message
        : "Delete failed";
      showErrorModalDelete(errorMessage);
      console.error("Delete error:", errorMessage);
    }
  } catch (error) {
    console.error("Delete error:", error);
    showErrorModalDelete();
  } finally {
    hideLoader();
  }
}

const deleteButton = document.getElementById("delete_button_modal");

deleteButton.addEventListener("click", () => {
  const postId = getPostIdFromUrl();
  if (!postId) {
    console.error("Post ID is missing!");
    return;
  }
  deletePostRequest(postId);
});

//Modals

function showDeleteModal() {
  const dialog = document.getElementById("edit_delete_modal");
  dialog.showModal();

  const deleteButton = document.getElementById("delete_button_modal");

  deleteButton.setAttribute("data-post-id", getPostIdFromUrl());

  const closeModalX = document.getElementById("close_modal_x");
  const closeModalContinue = document.getElementById("close_modal_continue");

  closeModalX.addEventListener("click", () => {
    dialog.close();
  });

  closeModalContinue.addEventListener("click", () => {
    dialog.close();
  });
}

function showErrorModalUpdate(errorMessage) {
  const dialog = document.getElementById("update_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("update_error_message").innerHTML = errorMessage;
  }

  const closeModalX = document.getElementById("update_error_close_modal_x");
  const closeModalContinue = document.getElementById(
    "update_error_close_modal_continue"
  );

  closeModalX.addEventListener("click", () => {
    dialog.close();
  });

  closeModalContinue.addEventListener("click", () => {
    dialog.close();
  });
}

function showErrorModalDelete(errorMessage) {
  const dialog = document.getElementById("delete_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("delete_error_message").innerHTML = errorMessage;
  }

  const closeModalX = document.getElementById("delete_error_close_modal_x");
  const closeModalContinue = document.getElementById(
    "delete_error_close_modal_continue"
  );

  closeModalX.addEventListener("click", () => {
    dialog.close();
  });

  closeModalContinue.addEventListener("click", () => {
    dialog.close();
  });
}

function showSuccessMessageUpdate() {
  const updateSuccess = document.getElementById("snackbar_message");

  updateSuccess.className = "snackbar-show";

  setTimeout(function () {
    updateSuccess.className = updateSuccess.className.replace(
      "snackbar-show",
      ""
    );
  }, 3000);
}

function showSuccessMessageDelete() {
  const updateSuccess = document.getElementById("snackbar_delete");

  updateSuccess.className = "snackbar-show";

  setTimeout(function () {
    updateSuccess.className = updateSuccess.className.replace(
      "snackbar-show",
      ""
    );
  }, 3000);
}
