
const images = [
  {
    title: "Mountain Paradise",
    category: "nature",
    description: "Beautiful mountains reflected in a peaceful lake.",
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  },
  {
    title: "City Skyline",
    category: "cities",
    description: "A colorful sunset over the city skyline.",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390"
  },
  {
    title: "Cute Cat",
    category: "animals",
    description: "A curious cat enjoying the outdoors.",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
  },
  {
    title: "Golden Sunset",
    category: "nature",
    description: "Warm sunset colors over the ocean.",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    title: "Forest Lake",
    category: "nature",
    description: "A quiet lake surrounded by green forests.",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
  },
  {
    title: "Mountain Explorer",
    category: "people",
    description: "An explorer enjoying the mountain view.",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
  },
  {
    title: "City Streets",
    category: "cities",
    description: "Busy streets and bright city lights.",
    url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455"
  },
  {
    title: "Beautiful Butterfly",
    category: "animals",
    description: "A butterfly resting on a flower.",
    url: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba"
  }
];

// Elements
const galleryGrid = document.getElementById("galleryGrid");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const imageTitle = document.getElementById("imageTitle");
const imageDescription = document.getElementById("imageDescription");
const imageCounter = document.getElementById("imageCounter");
const thumbnails = document.getElementById("thumbnails");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentCategory = "all";
let currentIndex = 0;
let lastFocusedElement = null;

const favorites = new Set();

function getVisibleImages() {
  return images
    .map((image, index) => ({ ...image, index }))
    .filter(image =>
      currentCategory === "all" ||
      image.category === currentCategory
    );
}

// Create gallery cards
function renderGallery() {
  const visibleImages = getVisibleImages();

  galleryGrid.innerHTML = visibleImages.map(image => `
    <article class="gallery-card"
      data-index="${image.index}"
      tabindex="0"
      aria-label="Open ${image.title}">

      <img
        src="${image.url}?auto=format&fit=crop&w=700&q=80"
        alt="${image.title}"
        loading="lazy">

      <span class="category-tag">${image.category}</span>

      <button class="favorite-btn ${favorites.has(image.index) ? "liked" : ""}"
        data-favorite="${image.index}"
        aria-label="${favorites.has(image.index) ? "Remove favorite" : "Add favorite"}"
        aria-pressed="${favorites.has(image.index)}">
        ${favorites.has(image.index) ? "♥" : "♡"}
      </button>

      <div class="card-caption">
        <h3>${image.title}</h3>
        <p>${image.description}</p>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = visibleImages.length > 0;
}

// Category filters
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;

    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    renderGallery();
  });
});

// Gallery click handling
galleryGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");

  if (favoriteButton) {
    const index = Number(favoriteButton.dataset.favorite);

    if (favorites.has(index)) {
      favorites.delete(index);
    } else {
      favorites.add(index);
    }

    renderGallery();
    return;
  }

  const card = event.target.closest(".gallery-card");

  if (card) {
    openLightbox(Number(card.dataset.index));
  }
});

// Open with Enter or Space
galleryGrid.addEventListener("keydown", event => {
  const card = event.target.closest(".gallery-card");

  if (
    card &&
    !event.target.closest("button") &&
    (event.key === "Enter" || event.key === " ")
  ) {
    event.preventDefault();
    openLightbox(Number(card.dataset.index));
  }
});

// Open lightbox
function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  currentIndex = index;

  updateLightbox();

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  closeBtn.focus();
}

// Update displayed image
function updateLightbox() {
  const image = images[currentIndex];

  lightboxImage.src = `${image.url}?auto=format&fit=max&w=1400&q=85`;
  lightboxImage.alt = image.title;
  imageTitle.textContent = image.title;
  imageDescription.textContent = image.description;
  imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;

  // Build thumbnail navigation
  thumbnails.innerHTML = images.map((item, index) => `
    <img
      src="${item.url}?auto=format&fit=crop&w=160&h=100&q=70"
      alt="${item.title}"
      class="${index === currentIndex ? "selected" : ""}"
      data-thumbnail="${index}"
      tabindex="0"
      aria-label="View ${item.title}"
      ${index === currentIndex ? 'aria-current="true"' : ""}>
  `).join("");
}

// Previous and next buttons
function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  updateLightbox();
}

function showPrevious() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightbox();
}

nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrevious);

// Thumbnail clicks and keyboard navigation
thumbnails.addEventListener("click", event => {
  const thumbnail = event.target.closest("[data-thumbnail]");

  if (thumbnail) {
    currentIndex = Number(thumbnail.dataset.thumbnail);
    updateLightbox();
  }
});

thumbnails.addEventListener("keydown", event => {
  const thumbnail = event.target.closest("[data-thumbnail]");

  if (
    thumbnail &&
    (event.key === "Enter" || event.key === " ")
  ) {
    event.preventDefault();
    currentIndex = Number(thumbnail.dataset.thumbnail);
    updateLightbox();
  }
});

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Keyboard controls
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrevious();
  if (event.key === "Escape") closeLightbox();
});

// Start the gallery
renderGallery();
