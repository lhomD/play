export { genresInit };
let genresDB; /* Some of the may be temporary if it makes changes on modal js */
let counter = 0;
let genresContainer;
let documentBody = document.querySelector("body");
const showModalWindow = document.getElementById("modal");
/* Function to show genres modal */
function genresInit() {
  let menuBtns = document.querySelectorAll("nav a");
  menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", showGenresModal);
  });
} // End init
/* Function to modal with genres */
function showGenresModal(e) {
  e.preventDefault();
  documentBody.style.overflowY = "hidden";
  let menuBtns = document.querySelectorAll("nav a");
  menuBtns.forEach((menuBtn) => {
    menuBtn.classList.remove("active");
  });

  if (this.innerText === "Genres") {
    this.classList.add("active");
    showGenres();
  } else {
    this.classList.add("active");
    hideGenres();
  }
} //End showGenresModal
/* Publishin genres to the modal */
function showGenres() {
  showModalWindow.classList.add("genres");
  /* Create an loop to go through genresDB */
  showModalWindow.innerHTML = `
    <div class="genres_container">
      <button role="button" id="scrollLeft" class="genres_container_btn">
      <i class="fa-solid fa-arrow-left"></i>
      </button>
      <button role="button" id="scrollRight" class="genres_container_btn" id="">
      <i class="fa-solid fa-arrow-right"></i>
      </button>
      <div class="genres_container_cards"></div>
    </div>
  `;

  /* Slide left and right */
  let slideLeft = document.getElementById("scrollLeft");
  slideLeft.addEventListener("click", () => {
    if (counter === 0) {
      slideLeft.disabled = true;
      return;
    } else {
      slideLeft.disabled = false;
      slideRight.disabled = false;
      counter--;
    }
    slideGenres();
  });

  let slideRight = document.getElementById("scrollRight");
  slideRight.addEventListener("click", () => {
    if (counter === 7) {
      slideRight.disabled = true;
      return;
    } else {
      counter++;
      slideRight.disabled = false;
      slideLeft.disabled = false;
    }
    slideGenres();
  });
  publishGenres();
} // End showGenres
/* Publishing cards to the modal */
async function publishGenres() {
  genresDB = await genresData();
  genresContainer = document.querySelector(".genres_container_cards");
  genresDB.forEach((genre) => {
    let singleGenre = document.createElement("a");
    singleGenre.href = "./genres/?" + genre.name;
    singleGenre.innerHTML = `
      <img src=".${genre.img}" alt="${genre.alt}">
      <h3 class="genres_container_cards-titel">${genre.name}</h3>
    `;
    genresContainer.appendChild(singleGenre);
  });
} //End publishGenres
/* Function to hide genres modal */
function hideGenres() {
  showModalWindow.classList.remove("genres");
  showModalWindow.innerHTML = "";
  documentBody.style.overflowY = "scroll";
} // End hideGenres
/* Function to scrill genres */
function slideGenres() {
  genresContainer.scrollTo({
    top: 0,
    left: counter * 500,
    behavior: "smooth",
  });
} // End slideGenres
/* Request genres */
async function genresData() {
  const response = await axios.get("../assets/script/genresDb.json");
  return response.data.genres;
} //End genresData
