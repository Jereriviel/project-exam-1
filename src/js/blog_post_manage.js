document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "/account/login.html";
    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const welcomeUser = document.getElementById("welcome_user");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    welcomeUser.innerHTML = `${user.name}`;
  }
});

async function preparePosts() {
  showLoader();
  try {
    const result = await getPosts(null, "desc", null);
    showUserPosts(result.data);
  } catch (error) {
    showErrorModal();
    console.error("Error while rendering data.", error.message);
  } finally {
    hideLoader();
  }
}

preparePosts();

function showUserPosts(userPosts) {
  const feed = document.getElementById("user_feed");

  feed.innerHTML = "";

  for (let i = 0; i < userPosts.length; i++) {
    const post = userPosts[i];

    feed.innerHTML += `
            <article>
          ${
            post.media
              ? `<figure>
            <img id="image" src="${post.media.url}"
              alt="${post.media.alt}"/>
          </figure>`
              : ""
          }
          <div class="article__header flex__column">
            <div class="article__text flex__column">
              <p class="post__topic" id="topic">${post.tags}</p>
              <h3 id="title">${post.title}</h3>
            </div>
            <div class="article__buttons flex__row">
              <a href="edit.html?id=${
                post.id
              }" class="button button__secondary flex__row">Edit</a>
              <button class="button button__delete flex__row" onclick="showDeleteModal('${
                post.id
              }')">Delete</button>
            </div>
          </div>
        </article>
    `;
  }
}

async function deletePostRequest(id) {
  showLoader();

  const accessToken = getAccessToken();

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/Jereriviel/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
        : "Delete failed";
      showErrorModal(errorMessage);
      console.error("Login error:", errorMessage);
    }
  } catch (error) {
    console.error("Delete error:", error);
    showErrorModal();
  } finally {
    hideLoader();
  }
}

const deleteButton = document.getElementById("delete_button_modal");

deleteButton.addEventListener("click", (event) => {
  const postId = event.target.getAttribute("id");
  deletePostRequest(postId);
});

//Modals

function showDeleteModal(id) {
  const dialog = document.getElementById("manage_delete_modal");
  dialog.showModal();

  document.getElementById("delete_button_modal").setAttribute("id", id);

  const closeModalExit = document.getElementById("close_modal_exit");
  const closeModalCancel = document.getElementById("close_modal_cancel");

  closeModalExit.addEventListener("click", () => {
    dialog.close();
  });

  closeModalCancel.addEventListener("click", () => {
    dialog.close();
  });
}

function showSuccessMessage() {
  const deleteSuccess = document.getElementById("snackbar_delete");

  deleteSuccess.className = "snackbar-show";

  setTimeout(function () {
    deleteSuccess.className = deleteSuccess.className.replace(
      "snackbar-show",
      ""
    );
  }, 3000);
}

function showErrorModal(errorMessage) {
  const dialog = document.getElementById("manage_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("manage_error_message").innerHTML = errorMessage;
  }

  const closeModalX = document.getElementById("close_modal_x");
  const closeModalContinue = document.getElementById("close_modal_continue");

  closeModalX.addEventListener("click", () => {
    dialog.close();
  });

  closeModalContinue.addEventListener("click", () => {
    dialog.close();
  });
}
