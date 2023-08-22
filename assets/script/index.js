import * as Utils from "./utils.js";
import { showMovieModal } from "./movieModal.js";
import { genresInit } from "./genresModal.js";
import { serachInit } from "./searchModal.js";

const apiKey = "api_key=cebaa0500440eb0f48f42d229a57cc8b"; //API Key

let genresDB; /* Get all genres from server before running functions */
let condition;

/* Variabels and const */
let movieData; /* Reference to the trending movies */
let slideHeroNum; /* Referens to the var to translate slider*/
let clearTime; /* Clearing time out  in the beginnig of the function*/
let activeHeroBtn; /* Timer elements on hero */
// Initialize variabels and functions after page is loded

async function init() {
  slideHeroNum = 0;
  condition = Utils.checkScreenSize();
  genresDB = await genresData();
  let showMoreGenre =
    document.getElementById("showMoreGenre"); /* Show More Genre Btn */
  showMoreGenre.addEventListener("click", publushGenres);
  serachInit();
  genresInit();
  heroSlider();
} //End init
window.addEventListener("load", init);
//End init Function

/* Create slider on hero section */
async function heroSlider() {
  movieData = await Utils.XHRequest(
    "trending/movie/day?language=en-US&" + apiKey
  );

  let sliderContainer = document.querySelector(".hero_container");
  sliderContainer.innerHTML = "";

  /* Loop to create 5 hero elements */
  for (let i = 0; i < 5; i++) {
    let movieSlider = document.createElement("div");
    movieSlider.classList.add("hero_container_sections");
    movieSlider.innerHTML = `
      <div class= "hero_container_sections_container" >
        <div class="hero_container_sections_container_info">
          <h2 class="hero_container_sections_container_info-title">${
            movieData.results[i].title
          }</h2>
          <div class="hero_container_sections_container_info_reviews">
            <div class="hero_container_sections_container_info_score">
              <i class="fa-solid fa-star"></i>
              <span class="hero_container_sections_container_info_score-data">${movieData.results[
                i
              ].vote_average.toFixed(1)}
              </span>
              <span class="hero_container_sections_container_info_score-total">${
                movieData.results[i].vote_count
              }
              </span>
            </div>
            <p class="hero_container_sections_container_info-genres">${getGenres(
              movieData.results[i].genre_ids
            )}</p>
            <p class="hero_container_sections_container_info-year">${
              movieData.results[i].release_date.split("-")[0]
            }</p>
          </div>
          <div class="hero_container_sections_container_info_btns">
            <button role="button" role="button" data-id=${
              movieData.results[i].id
            } class="hero_container_sections_containers_info-btns-trailer showMovieInfo" >
              <i class="fa-sharp fa-solid fa-play"></i>play trailer</button>
            <button role="button" class="hero_container_sections_container_info-btns-next">
              <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </div>
      `;

    let bgImage = movieSlider.querySelector(
      ".hero_container_sections_container"
    );
    if (!condition) {
      bgImage.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 21.5%, #000000 85.81%), url("${Utils.checkImgStatus(
        movieData.results[i].backdrop_path
      )}")`;
    } else {
      bgImage.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 21.5%, #000000 85.81%), url("${Utils.checkImgStatus(
        movieData.results[i].poster_path
      )}")`;
    }
    /* Play trailer and next slide arrow */
    let playTrailerBtn = movieSlider.querySelector(
      ".hero_container_sections_containers_info-btns-trailer"
    );
    playTrailerBtn.addEventListener("click", showMovieModal);
    let nextSlideArrow = movieSlider.querySelector(
      ".hero_container_sections_container_info-btns-next"
    );
    nextSlideArrow.addEventListener("click", nextSlide);

    /* Appending created element to the container */
    sliderContainer.appendChild(movieSlider);
  } /* End of loop */
  heroTimerBtns();
} /* End of  heroSlider*/

/* Creating smal timer btns */
function heroTimerBtns() {
  let btnsContainer = document.querySelector(".hero_next_container");
  for (let i = 0; i < 5; i++) {
    let timerBtn = document.createElement("button");
    timerBtn.classList.add("hero_next_container_timer");
    timerBtn.setAttribute("data-number", i);
    timerBtn.addEventListener("click", nextSlide);
    timerBtn.innerHTML = `
      <img src="${Utils.checkImgStatus(
        movieData.results[i].backdrop_path
      )}" alt="${movieData.results[i].title}">
      <div class="hero_next_container-half"></div>
      <div class="hero_next_container-half"></div>
      <div class="hero_next_container-top"></div>
    `;
    btnsContainer.appendChild(timerBtn);
  }
  activeHeroBtn = document.querySelectorAll(".hero_next_container_timer");
  changeHero();
  publishTrending();
} //End timerBtns

/* Create Trending Movies Function */
function publishTrending() {
  let trending = document.getElementById("trending");
  trending.innerHTML = `
    <h2 class="tending-header">Trending Now</h2>
    <a role="link" href="./genres/?trending" class="tending_more">Show More
      <i class="fa-solid fa-chevron-right"></i></a>
    <div class="trending_container"></div>
    `;
  showTrendingMovies();
} //publishTrending

/* Trending Movies Function */
function showTrendingMovies() {
  let trendingContainer = document.querySelector(".trending_container");

  for (let i = 0; i < 6; i++) {
    let trendingMovie = document.createElement("div");
    trendingMovie.classList.add("trending_container_content", "showMovieInfo");
    trendingMovie.setAttribute("data-id", movieData.results[i + 5].id);
    trendingMovie.innerHTML = `
        <picture class="trending_container_content-image" role="img">
          <source media="(max-width:1023px)" srcset="${Utils.checkImgStatus(
            movieData.results[i + 5].poster_path
          )}">
          <img src="https://image.tmdb.org/t/p/w1280${
            i == 1
              ? movieData.results[i + 5].poster_path
              : movieData.results[i + 5].backdrop_path
          }" alt="${movieData.results[i + 5].title}">
        </picture>
        <div class="trending_container_content_info">
          <span class="trending_container_content_info-num">#0${i + 1}</span>
          <div class="trending_container_content_info_titel">
            <h3 class="trending_container_content_info_titel-name">${
              movieData.results[i + 5].title
            }</h3>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          <div class="trending_container_content_info_score">
            <i class="fa-solid fa-star"></i>
            <span class="trending_container_content_info-data">${movieData.results[
              i + 5
            ].vote_average.toFixed(1)}</span>
            <span class="trending_container_content_info-total">${
              movieData.results[i + 5].vote_count
            }</span>
          </div>
          <div class="trending_container_content_info_genre">
            <p class="trending_container_content_info_genre-genres">${getGenres(
              movieData.results[i + 5].genre_ids
            )}</p>
            <p class="trending_container_content_info_genre-year">${
              movieData.results[i + 5].release_date.split("-")[0]
            }</p>
          </div>
        </div>
      `;
    trendingContainer.appendChild(trendingMovie);
  }
  publushGenres();
} //End trending movies

/* Create Genres Function */
function publushGenres() {
  let randomGenre; /* Generate random gener number */
  let genresContainer = document.getElementById("genres_container");

  randomGenre = Math.floor(Math.random() * genresDB.length);

  if (genresDB.length === 0) {
    showMoreGenre.style.display = "none";
    return;
  }

  let genreSection = document.createElement("section");
  genreSection.classList.add("genre");
  genreSection.innerHTML = `
      <h2 class="genre-header">${genresDB[randomGenre].name}</h2>
      <a href="./genres/?${encodeURIComponent(
        genresDB[randomGenre].name
      ).toLowerCase()}" class="genre_more" >Show More
      <i class="fa-solid fa-chevron-right"></i></a>
      <div class="genre_container"></div>
      `;
  genresContainer.appendChild(genreSection);

  getGenresContent(genresDB[randomGenre].id);
  genresDB.splice(randomGenre, 1);
} //End publushGenres

/* Publish Genres Content */
async function getGenresContent(genre) {
  let genresUrl = "discover/movie?with_genres=" + genre + "&";
  let genreContainer = document.querySelectorAll(".genre_container");

  let genresData = await Utils.XHRequest(genresUrl + apiKey);

  for (let i = 0; i < 5; i++) {
    let genresContent = document.createElement("div");
    genresContent.classList.add("genre_container_content", "showMovieInfo");
    genresContent.setAttribute("data-id", genresData.results[i].id);
    genresContent.innerHTML = ` 
        <picture class="trending_container_content-image" role="img">
          <source media="(max-width:1023px)" srcset="${Utils.checkImgStatus(
            genresData.results[i].poster_path
          )}">
          <img src="${Utils.checkImgStatus(
            genresData.results[i].backdrop_path
          )}" alt="${genresData.results[i].title}">
        </picture>
        <div class="genre_container_content_info">
          <div class="genre_container_content_info_titel">
          <h3 class="genre_container_content_info_titel-name">${
            genresData.results[i].title
          }</h3>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="genre_container_content_info_score">
          <i class="fa-solid fa-star"></i>
          <span class="genre_container_content_info-data">${
            genresData.results[i].vote_average
          }</span>
          <span class="genre_container_content_info-total">${
            genresData.results[i].vote_count
          }</span>
        </div>`;
    genreContainer[genreContainer.length - 1].appendChild(genresContent);
  }

  activeModal();
} //End getGenresContent

/* Next slide */
function nextSlide() {
  clearTimeout(clearTime);
  if (this.getAttribute("data-number")) {
    slideHeroNum = Number(this.getAttribute("data-number"));
  }
  changeHero();
} //End nextSlide

/* Change Hero Slider */
function changeHero() {
  let heroContainer = document.querySelector(".hero_container"); /* Container */
  let heroElems = document.querySelectorAll(
    ".hero_container_sections"
  ); /* Child element whithin container */
  activeHeroBtn.forEach((active, idx) => {
    active.classList.remove("active");
    heroElems[idx].classList.remove("active");
  });
  activeHeroBtn[slideHeroNum].classList.add("active");

  //Media Query Condition
  if (!condition) {
    heroContainer.style.transform = `translateX(-${slideHeroNum}00vw)`;
    activeHeroBtn[slideHeroNum].classList.add("active");
  } else {
    heroElems[slideHeroNum].classList.add("active");
  }

  if (slideHeroNum < activeHeroBtn.length - 1) {
    slideHeroNum++;
    showTimer();
  } else {
    slideHeroNum = 0;
    showTimer();
  }
  clearTime = setTimeout(changeHero, 5000);
} //End chnageHero

/* Function to show timer on smal images */
function showTimer() {
  let runCounter = 0;
  let activeHeroHalf = document.querySelectorAll(
    ".hero_next_container_timer.active .hero_next_container-half"
  );
  let activeHerotop = document.querySelector(
    ".hero_next_container_timer.active .hero_next_container-top"
  );
  activeHerotop.style.backgroundColor = "#FFF";
  activeHeroHalf[0].style.transform = `rotate(0deg)`;
  activeHeroHalf[1].style.transform = `rotate(0deg)`;

  setInterval(() => {
    if (runCounter < 21) {
      activeHeroHalf[0].style.transform = `rotate(${runCounter * 9}deg)`;
      activeHeroHalf[1].style.transform = `rotate(${runCounter * 9}deg)`;
      runCounter++;
    } else if (runCounter <= 40) {
      activeHeroHalf[1].style.transform = `rotate(${runCounter * 9}deg)`;
      activeHerotop.style.backgroundColor = "transparent";
      runCounter++;
    }
  }, 100);
} //End showTimer

/* Adding click function to every movie */
function activeModal() {
  let clickedMovie = document.querySelectorAll(".showMovieInfo");
  clickedMovie.forEach((btn) => {
    btn.addEventListener("click", showMovieModal);
  });
} // End activeModal

/* Request genres */
async function genresData() {
  const response = await axios.get("./assets/script/genresDb.json");
  return response.data.genres;
} //End genresData

/* Get genres from ids */
function getGenres(genres) {
  let allGenres = "";
  if (genres.length < 2) {
    allGenres += genresDB.find((genre) => genre.id === genres[0]).name + " ";
  } else {
    for (let i = 0; i < 2; i++) {
      allGenres +=
        genresDB.find((genre) => genre.id === genres[i]).name +
        (i === 1 ? "" : ", ");
    }
  }
  return allGenres;
} //End getGenres
