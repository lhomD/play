import * as Utils from "./utils.js";
import { showMovieModal } from "./movieModal.js";
import { serachInit } from "./searchModal.js";
import { genresInit } from "./genresModal.js";

const apiKey = "api_key=cebaa0500440eb0f48f42d229a57cc8b"; //API Key
let pageNr = 1; /* Page numbers to API Call */
let searchTerm; /* Search term from URL */
let searchResult; /* Save movies */
let movieArr = []; /* Save part of genres data */

async function init() {
  searchTerm = decodeURIComponent(window.location.search.substring(1));

  searchResult = await Utils.XHRequest(
    "search/movie?query=" +
      searchTerm +
      "&api_key=cebaa0500440eb0f48f42d229a57cc8b&page=" +
      pageNr
  );

  if (searchTerm === "" || searchResult === undefined) {
    nothingFound();
  } else {
    searchHeader();
  }
  serachInit();
  genresInit();
} //End init
window.addEventListener("load", init);
/* Function runs if nothing is found */
function nothingFound() {
  let mainDocument = document.querySelector("main");
  mainDocument.innerHTML = `
    <section>
      <h2 class="empty_search">Oops! Here it was empty. Please type in the search field <span  class="empty_search-above">above</span> <span class="empty_search-below">below</span> the movie you want to find.</h2>
    </section>`;
}
/* Function to publish search header */
function searchHeader() {
  let searchContainer = document.getElementById("search");
  searchContainer.innerHTML = `
    <div class="search_page_header">
      <p>Searched for: </p>
      <span>${searchTerm}</span>
      <span>${searchResult.total_results} movies</span>
      <span>${searchResult.total_pages * 2 - 1} pages</span>
    </div>
    <div class="genre_container"></div>`;
  createMovieArr();
} //End searchHeader
/* Function to create an array with ten movies */
async function createMovieArr() {
  movieArr = [];
  if (searchResult.results.length === 0) {
    pageNr++;
    searchResult = await Utils.XHRequest(
      "search/movie?query=" +
        searchTerm +
        "&api_key=cebaa0500440eb0f48f42d229a57cc8b&page=" +
        pageNr
    );
    movieArr = searchResult.results.splice(0, 10);
  } else {
    movieArr = searchResult.results.splice(0, 10);
  }
  publishMovies();
} //End createMovieArr
/* Function to publish search results */
function publishMovies() {
  let searchResultContainer = document.querySelector(".genre_container");
  movieArr.forEach((movie) => {
    let genreContent = document.createElement("div");
    genreContent.classList.add("genre_container_content", "showMovieInfo");
    genreContent.setAttribute("data-id", movie.id);
    genreContent.innerHTML = `
        <picture class="genre_container_content-image">
          <source media="(max-width:1023px)" srcset="${Utils.checkImgStatus(
            movie.poster_path
          )}">
          <img src="${Utils.checkImgStatus(movie.backdrop_path)}" alt="${
      movie.title
    }">
        </picture>
        <div class="genre_container_content_info">
          <div class="genre_container_content_info_titel">
            <h3 class="genre_container_content_info_titel-name">${
              movie.title
            }</h3>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          <div class="genre_container_content_info_score">
            <i class="fa-solid fa-star"></i>
            <span class="genre_container_content_info-data">${movie.vote_average.toFixed(
              1
            )}</span>
            <span class="genre_container_content_info-total">${
              movie.vote_count
            }</span>
          </div>
        </div>
      `;
    searchResultContainer.appendChild(genreContent);
  });
  let showMoreMovie =
    document.getElementById("showMoreMovie"); /* Show More Movie Btn */
  showMoreMovie.addEventListener("click", createMovieArr);
  if (pageNr === searchResult.total_pages) {
    showMoreMovie.style.display = "none";
  }
  activeModal();
} //End publishMovies

/* Adding click function to every movie */
function activeModal() {
  let clickedMovie = document.querySelectorAll(".showMovieInfo");
  clickedMovie.forEach((btn) => {
    btn.addEventListener("click", showMovieModal);
  });
} // End activeModal
