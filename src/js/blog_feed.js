async function preparePosts(page = 1) {
  showLoader();
  const tag = document.getElementById("filter").value;
  const sort = document.getElementById("sort").value;
  try {
    const result = await getPosts(tag, sort, page);
    const allPosts = result.data;
    const publicPosts = tag || page > 1 ? allPosts : allPosts.slice(3);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    for (let i = 1; i <= result.meta.pageCount; i++) {
      const pageButton = document.createElement("button");
      pageButton.classList.add(
        "button__icon",
        "button__icon-number",
        "flex__row"
      );
      if (result.meta.currentPage === i) {
        pageButton.classList.add("active");
      }

      pageButton.innerHTML = i;

      pageButton.addEventListener("click", () => preparePosts(i));
      pagination.appendChild(pageButton);
    }

    if (!tag) {
      const tags = [];
      publicPosts.forEach((p) =>
        p.tags.forEach((t) => {
          if (!tags.includes(t)) tags.push(t);
        })
      );
      const sortedTags = tags.sort((a, b) => a.localeCompare(b));
      addTagsToSelect(sortedTags);
    }
    showPublicPosts(publicPosts);
  } catch (error) {
    showErrorModal();
    console.error("Error while rendering data.", error.message);
  } finally {
    hideLoader();
  }
}

preparePosts();

function showPublicPosts(publicPosts) {
  const feed = document.getElementById("public_feed");

  feed.innerHTML = "";

  for (let i = 0; i < publicPosts.length; i++) {
    const post = publicPosts[i];

    feed.innerHTML += `
              <article>
              <a href="./post/index.html?id=${post.id}">
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
              <a
                href="./post/index.html?id=${post.id}"
                class="button button__primary flex__row"
                >Read</a
              >
            </div>
             </a>
          </article>
      `;
  }
}

function filterPostsByTag(posts, tag) {
  const filteredPosts = posts.filter((post) => post.tags.includes(tag));

  return filteredPosts;
}

const tagFilter = document.getElementById("filter");
tagFilter.addEventListener("change", (ev) => preparePosts());

function addTagsToSelect(tags) {
  const filterSelect = document.getElementById("filter");
  filterSelect.innerHTML = '<option value="">Filter by...</option>';
  for (const tag of tags) {
    const option = document.createElement("option");
    option.value = tag;
    option.innerHTML = tag;
    filterSelect.appendChild(option);
  }
}

const sort = document.getElementById("sort");
sort.addEventListener("change", (ev) => preparePosts());

//Modals

function showErrorModal(errorMessage) {
  const dialog = document.getElementById("public_error_modal");
  dialog.showModal();

  if (errorMessage) {
    document.getElementById("public_error_message").innerHTML = errorMessage;
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
