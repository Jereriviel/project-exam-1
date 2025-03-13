function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function getPost() {
  showLoader();
  try {
    const postId = getPostIdFromUrl();
    const response = await fetch(
      `https://v2.api.noroff.dev/blog/posts/Jereriviel/${postId}`
    );
    if (response.ok) {
      const result = await response.json();
      return result.data;
    } else {
      const errorMessage = result.errors
        ? result.errors[0].message
        : "Getting post failed";
      showErrorModal(errorMessage);
      console.error("Get post error:", errorMessage);
    }
  } catch (error) {
    console.error("Get post error:", error);
    showErrorModal();
  }
}

async function preparePost() {
  showLoader();
  try {
    const post = await getPost();
    showPublicPost(post);
  } catch (error) {
    showErrorModal();
    console.error("Error while rendering data.", error.message);
  } finally {
    hideLoader();
  }
}

preparePost();

function showPublicPost(post) {
  const postContent = document.getElementById("post_content");

  document.querySelector(
    "title"
  ).textContent = `${post.title} | Back to Basics`;

  postContent.innerHTML = `
  <article class="flex__column">
    ${
      post.media && post.media.url
        ? `<figure class="post__figure">
            <img id="image" src="${post.media.url}" alt="${
            post.media.alt || "Image"
          }"/>
          </figure>`
        : ""
    }
    <div class="post__heading-and-copy container flex__column">
      <div class="post__heading flex__column">
        <p class="post__topic" id="topic">${
          Array.isArray(post.tags) ? post.tags.join(", ") : "No topic"
        }</p>
        <h1>${post.title || "Untitled"}</h1>
        <div class="post__information flex__row">
          <div class="post__author-and-date flex__column">
            <p>By: ${post.author?.name || "Unknown Author"}</p>
            <p>Published: ${new Date(post.created).toLocaleDateString()}</p>
          </div>
          <a class="post__share flex__row" onclick="sharePost()">
            <p>Share</p>
            <span class="material-symbols-outlined"> share </span>
          </a>
        </div>
      </div>
      <div class="post__copy flex__column">${
        post.body ? post.body.replaceAll("\n", "<br>") : "No content available."
      }</div>
    </div>
  </article>
`;
}

async function sharePost() {
  const shareData = {
    url: `https://fed-jereriviel-pe1.netlify.app/post/index.html?id=${getPostIdFromUrl()}`,
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.error(err);
  }
}

//Modals

function showErrorModal(errorMessage) {
  const dialog = document.getElementById("public_post_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("public_post_error_message").innerHTML =
      errorMessage;
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
