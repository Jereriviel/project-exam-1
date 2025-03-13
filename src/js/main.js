function showLoader() {
  var loader = document.querySelector(".loader");
  loader.style.display = "flex";
}

function hideLoader() {
  var loader = document.querySelector(".loader");
  loader.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.getElementById("nav_links");
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    navLinks.innerHTML = `
    
    <span class="nav__username">Logged in as ${user.name}</span>
        <p>|</p>
        <a href="/post/manage.html" class="nav__logout">Manage</a>
    <p>|</p>    
        <a href="#" id="logout_button" class="nav__logout">Log out</a>
      `;

    document.getElementById("logout_button").addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      showLogoutMessage();
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 2000);
    });
  }
});

function showLogoutMessage() {
  const logoutSuccess = document.getElementById("snackbar_logout");

  logoutSuccess.className = "snackbar-show";

  setTimeout(function () {
    logoutSuccess.className = logoutSuccess.className.replace(
      "snackbar-show",
      ""
    );
  }, 3000);
}

function getAccessToken() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("No accessToken found in localStorage.");
    alert("You must be logged in to create a post.");
    return;
  }
  return accessToken;
}

async function getPosts(tag, sort, page = 1, limit = 12) {
  showLoader();
  try {
    const params = new URLSearchParams();

    if (page) {
      params.append("limit", limit);
      params.append("page", page);
    }

    if (tag) {
      params.append("_tag", tag);
    }

    if (sort) {
      params.append("sort", "created");
      params.append("sortOrder", sort);
    }

    const url =
      "https://v2.api.noroff.dev/blog/posts/Jereriviel?" + params.toString();

    const response = await fetch(url);
    if (response.ok && response.status === 200) {
      const result = await response.json();
      return result;
    } else {
      const errorMessage = result.errors
        ? result.errors[0].message
        : "Getting posts failed";
      showErrorModal(errorMessage);
      console.error("Get posts error:", errorMessage);
    }
  } catch (error) {
    console.error("Get posts error:", error);
    showErrorModal();
  } finally {
    hideLoader();
  }
}
