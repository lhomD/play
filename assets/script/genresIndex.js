import * as Utils from "./utils.js";
import { showMovieModal } from "./movieModal.js";
import { serachInit } from "./searchModal.js";
import { genresInit } from "./genresModal.js";

let genresDB; /* Get all genres from server before running functions */
let getGenresData; /* Save genres data */
let genreresArr = []; /* Save part of genres data */
let trendingData; /* Save trending data */
let heroData; /* Save actual genre movies */

const apiKey = "api_key=cebaa0500440eb0f48f42d229a57cc8b"; //API Key
let pageNr = 1; /* Page numbers to API Call */

/* Initialize */
async function init() {
  /*Query on Url adress  */
  let genreFromUrl = decodeURIComponent(window.location.search.substring(1));

  genresDB = await genresData();
  heroData = genresDB.find((genre) => genre.name === genreFromUrl);
  trendingData = await Utils.XHRequest(
    "trending/movie/day?language=en-US&" + apiKey
  );
  /* Check url to determine what to show on page */
  if (genreFromUrl == "" || heroData === undefined) {
    wrongGenre();
  } else if (genreFromUrl == "trending") {
    getGenresData = await Utils.XHRequest(
      "trending/movie/day?language=en-US&" + apiKey + "&page=" + pageNr
    );
    createHeroSection();
  } else {
    getGenresData = await Utils.XHRequest(
      "discover/movie?" +
      apiKey +
      "&with_genres=" +
      heroData.id +
      "&page=" +
      pageNr
    );
    createHeroSection();
  }
  serachInit();
  genresInit();
} //End init
window.addEventListener("load", init);

/* Function to handle if user writes wrong genre */
function wrongGenre() {
  let mainDocument = document.querySelector("main");
  mainDocument.innerHTML = `
    <div class="empty_genre">
      <section class="empty_genre_header">
        <h2 class="empty_genre_heade-titel">Oops! Here it was empty. Please select an appropriate genre below to proceed.</h2>
      </section>
      <div class="empty_genre_links"></div>
    </div>
  `;
  publishGenresLinks();
} // End wrongGenre

/* Function to create genres link */
function publishGenresLinks() {
  let linksContainer = document.querySelector(".empty_genre_links");
  genresDB.forEach((genre) => {
    let singleGenre = document.createElement("a");
    singleGenre.href = "./?" + genre.name;
    singleGenre.innerHTML = genre.name;
    linksContainer.appendChild(singleGenre);
  });
} //End publishLinks

/* Create hero section function */
function createHeroSection() {
  let getHeroSection = document.querySelector(".hero");

  getHeroSection.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%), url(".${heroData.img}")`;
  getHeroSection.innerHTML = `
    <div class="hero_text">
      <img src=".${heroData.img}" alt="${heroData.alt}">
      <h1 class="hero_text-titel">${heroData.name}</h1>
      <p class="hero_text-counter">${getGenresData.total_results} movies</p>
  </div>
  `;
  publishTrending();
} //End createHeroSection

/* Create Trending Movies Function */
function publishTrending() {
  let trending = document.getElementById("trending");
  trending.innerHTML = `
    <h2 class="tending-header">Trending Now</h2>
    <a role="link" href="./?trending" class="tending_more">Show More
        <i class="fa-solid fa-chevron-right"></i></a>
    <div class="trending_container"></div>
    `;
  showTrendingMovies();
} //End publishTrending
/* Trending Movies Function */

function showTrendingMovies() {
  let trendingContainer = document.querySelector(".trending_container");

  for (let i = 0; i < 6; i++) {
    let trendingMovie = document.createElement("div");
    trendingMovie.classList.add("trending_container_content", "showMovieInfo");
    trendingMovie.setAttribute("data-id", trendingData.results[i].id);
    trendingMovie.innerHTML = `
        <picture class="trending_container_content-image" role="img">
          <source media="(max-width:1023px)" srcset="${Utils.checkImgStatus(
      trendingData.results[i].poster_path
    )}">
          <img src="https://image.tmdb.org/t/p/w1280${i == 1
        ? trendingData.results[i].poster_path
        : trendingData.results[i].backdrop_path
      }" alt="${trendingData.results[i].title}">
        </picture>
        <div class="trending_container_content_info">
          <span class="trending_container_content_info-num">#0${i + 1}</span>
          <div class="trending_container_content_info_titel">
            <h3 class="trending_container_content_info_titel-name">${trendingData.results[i].title
      }</h3>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          <div class="trending_container_content_info_score">
            <i class="fa-solid fa-star"></i>
            <span class="trending_container_content_info-data">${trendingData.results[
        i
      ].vote_average.toFixed(1)}</span>
            <span class="trending_container_content_info-total">${trendingData.results[i + 5].vote_count
      }</span>
          </div>
          <div class="trending_container_content_info_genre">
            <p class="trending_container_content_info_genre-genres">${getGenres(
        trendingData.results[i].genre_ids
      )}</p>
            <p class="trending_container_content_info_genre-year">${trendingData.results[i].release_date.split("-")[0]
      }</p>
          </div>
        </div>
      `;
    trendingContainer.appendChild(trendingMovie);
  }
  createGenresSection();
} //End trending movies

/* Create genres section */
function createGenresSection() {
  let genres = document.getElementById("genres");
  genres.innerHTML = `
    <h2 class="genre-header">${heroData.name}</h2>
    <div class="genre_container"></div>
    `;
  createGenresArr();
} //End createGenresSection

/* Function to create new array with 10 movies */
async function createGenresArr() {
  genreresArr = [];
  if (getGenresData.results.length === 0) {
    pageNr++;
    getGenresData = await Utils.XHRequest(
      "discover/movie?" +
      apiKey +
      "&with_genres=" +
      heroData.id +
      "&page=" +
      pageNr
    );
    genreresArr = getGenresData.results.splice(0, 10);
  } else {
    genreresArr = getGenresData.results.splice(0, 10);
  }
  publishGenresSection();
} // End createGenresArr

/* Publish genres on the page */
function publishGenresSection() {
  let genresContainer = document.querySelector(".genre_container");
  genreresArr.forEach((genre) => {
    let genreContent = document.createElement("div");
    genreContent.classList.add("genre_container_content", "showMovieInfo");
    genreContent.setAttribute("data-id", genre.id);
    genreContent.innerHTML = `
        <picture class="genre_container_content-image" role="img">
          <source media="(max-width:1023px)" srcset="${Utils.checkImgStatus(
      genre.poster_path
    )}">
          <img src="${Utils.checkImgStatus(genre.backdrop_path)}" alt="${genre.title
      }">
        </picture>
        <div class="genre_container_content_info">
          <div class="genre_container_content_info_titel">
            <h3 class="genre_container_content_info_titel-name">${genre.title
      }</h3>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          <div class="genre_container_content_info_score">
            <i class="fa-solid fa-star"></i>
            <span class="genre_container_content_info-data">${genre.vote_average
      }</span>
            <span class="genre_container_content_info-total">${genre.vote_count
      }</span>
          </div>
        </div>
      `;
    genresContainer.appendChild(genreContent);
  });
  let showMoreGenre =
    document.getElementById("showMoreGenre"); /* Show More Genre Btn */
  showMoreGenre.addEventListener("click", createGenresArr);
  activeModal();
} //End publishGenresSection

/* Request genres */
async function genresData() {
  const response = await axios.get("../assets/script/genresDb.json");
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
} //End getGenre

/* Adding click function to every movie */
function activeModal() {
  let clickedMovie = document.querySelectorAll(".showMovieInfo");
  clickedMovie.forEach((btn) => {
    btn.addEventListener("click", showMovieModal);
  });
} // End activeModal
