// showSlides();

async function fetchLatestPosts() {
  showLoader();
  try {
    const result = await getPosts(null, "desc", 1, 3);
    updateCarousel(result.data);
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
    showErrorModal();
  } finally {
    hideLoader();
  }
}

function updateCarousel(posts) {
  const carouselCards = document.querySelector(".carousel__cards");
  carouselCards.innerHTML = "";

  posts.forEach((post, index) => {
    const slide = document.createElement("div");
    slide.classList.add("carousel-card", "slide-effect", "flex__column");
    if (index === 0) slide.style.display = "flex";
    else slide.style.display = "none";

    slide.innerHTML = `
      <figure class="carousel-image">
        <img src="${post.media?.url || "./assets/images/default.jpg"}" 
             alt="${post.media?.alt || "Blog post image"}" />
      </figure>
      <div class="carousel-card__title-${index + 1} flex__column container">
        <p class="post__topic">${post.tags?.[0] || "Uncategorized"}</p>
        <h1>${post.title || "Untitled"}</h1>
        <a href="./post/index.html?id=${
          post.id
        }" class="button button__primary flex__row">Read</a>
      </div>
    `;
    carouselCards.appendChild(slide);
  });
  setupCarousel();
}

function setupCarousel() {
  let slideIndex = 1;
  createDots();
  showSlide(slideIndex);

  document
    .querySelector(".arrow__back")
    .addEventListener("click", () => plusSlides(-1));
  document
    .querySelector(".arrow__forward")
    .addEventListener("click", () => plusSlides(1));

  function plusSlides(n) {
    showSlide((slideIndex += n));
  }

  function showSlide(n) {
    const slides = document.getElementsByClassName("carousel-card");
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    for (let slide of slides) {
      slide.style.display = "none";
    }
    slides[slideIndex - 1].style.display = "flex";

    const dots = document.getElementsByClassName("carousel__dot");
    for (let dot of dots) {
      dot.classList.remove("dot__active");
    }
    dots[slideIndex - 1].classList.add("dot__active");
  }

  function createDots() {
    const slides = document.getElementsByClassName("carousel-card");
    const carouselDots = document.querySelector(".carousel__dots");
    carouselDots.innerHTML = "";

    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("div");
      dot.classList.add("carousel__dot");
      dot.addEventListener("click", () => {
        return showSlide((slideIndex = i + 1));
      });
      carouselDots.appendChild(dot);
    }
  }
}

fetchLatestPosts();
