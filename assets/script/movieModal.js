export { showMovieModal };
import * as Utils from "./utils.js";

const apiKey = "api_key=cebaa0500440eb0f48f42d229a57cc8b"; //API Key

let movieRespons; //Saving movie data
let cast; //Saving data about actres
let reviews; //Saving riviews
let actingActers = []; //picking up actres with images
let documentBody = document.querySelector("body");
const showModalWindow = document.getElementById("modal");
async function showMovieModal() {
  showModalWindow.classList.add("active");
  documentBody.style.overflowY = "hidden";

  /*  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  }); */

  let movieId = this.getAttribute("data-id"); //Get movie Id

  movieRespons = await Utils.XHRequest(
    "movie/" +
      movieId +
      "?language=en-US&" +
      apiKey +
      "&append_to_response=videos"
  );

  cast = await Utils.XHRequest(
    "movie/" + movieId + "/credits?language=en-US&" + apiKey
  );

  reviews = await Utils.XHRequest(
    "movie/" + movieId + "/reviews?language=en-US&" + apiKey
  );
  publushMovie();
} // End showModal
/* Function to get and publish movie */
async function publushMovie() {
  let modalContainer = document.createElement("div");
  modalContainer.classList.add("modal_container");
  modalContainer.innerHTML = `
    <div id="closeModal" class="modal_container_close">
      <i class="fa-solid fa-xmark"></i>
    </div>

    <picture class="modal_container_img">
      <source media="(max-width:1023px)" srcset="${Utils.checkImgStatus(
        movieRespons.poster_path
      )}">
      <img src="${Utils.checkImgStatus(movieRespons.backdrop_path)}" alt="${
    movieRespons.title
  }">
    </picture>

    <div class="modal_container_hero">
      <span class="modal_container_hero_time">${Utils.runTime(
        movieRespons.runtime
      )}</span>
      <h2 class="modal_container_hero-title">${movieRespons.title}</h2>
      <div class="modal_container_hero_info">
        <div class="modal_container_hero_info_score">
          <i class="fa-solid fa-star"></i>
          <span class="modal_container_hero_info-data">${
            movieRespons.vote_average
          }</span>
          <span class="modal_container_hero_info-total">${
            movieRespons.vote_count
          }</span>
        </div>
        <div class="modal_container_hero_info_genre">
          <p class="modal_container_hero_info_genre-genres">${getGenres(
            movieRespons.genres
          )}</p>
          <p class="modal_container_hero_info_genre-year">${
            movieRespons.release_date
          }</p>
        </div>
      </div>
    </div>

    <div class="modal_container_hero_overview">
      <h3 class="modal_container_hero_overview-titel">Overview</h3>
      <p class="modal_container_hero_overview-text">${movieRespons.overview}</p>
      <div class="modal_container_hero_overview_director">
        <span class="modal_container_hero_overview_director-position">Director:</span>
        <img src="${directedByImg(movieRespons.id)}" alt="${directedBy(
    movieRespons.id
  )}">
        <div class="modal_container_hero_overview_director-name">${directedBy(
          movieRespons.id
        )}</div>
      </div>
    </div>
    `;

  showModalWindow.appendChild(modalContainer);
  let closeModal = document.getElementById("closeModal");

  closeModal.addEventListener("click", () => {
    showModalWindow.classList.remove("active");
    documentBody.style.overflowY = "scroll";
    showModalWindow.innerHTML = "";
  });
  //--------------------------------------------------//
  sortingCastPersons();
} //End publishMovie
/* Check genres and return name */
function getGenres(genresArr) {
  let genres = "";
  if (genresArr.length <= 1) {
    genres += genresArr[0].name;
    return genres;
  } else {
    for (let i = 0; i < 2; i++) {
      genres += genresArr[i].name + (i === 1 ? "" : ", ");
    }
    return genres;
  }
} //End getGenres
/* Directed by. Find */
function directedBy() {
  let directorName;
  if (cast.crew) {
    directorName = cast.crew.find(
      (person) => person.known_for_department === "Directing"
    );
    if (!directorName) {
      return "";
    } else {
      return directorName.name;
    }
  }
} // End directedBy
/* Find img of director */
function directedByImg() {
  let profileImage;
  if (cast.crew) {
    profileImage = cast.crew.find(
      (person) => person.known_for_department === "Directing"
    );
    if (!profileImage) {
      return "https://placehold.jp/3d4070/ffffff/300x300.png?text=Image%20Missing";
    } else {
      return "https://image.tmdb.org/t/p/w300" + profileImage.profile_path;
    }
  }
} // End directedByImg
/* Publish other actreses */
function sortingCastPersons() {
  let overviewContainer = document.querySelector(
    ".modal_container_hero_overview"
  );

  actingActers = [];
  actingActers = cast.cast
    .filter((person) => person.known_for_department === "Acting")
    .filter((person) => person.profile_path != null);

  if (cast.cast.length > 0) {
    let actingActers = document.createElement("div");
    actingActers.classList.add("modal_container_hero_overview_cast");
    actingActers.innerHTML = `
      <h3 class="modal_container_hero_overview_cast-titel">top cast</h3>
      <div class="modal_container_hero_overview_cast_images"></div>
      <button role="button" id="moreCast" class="modal_container_hero_overview_cast_btn">
      <i class="fa-solid fa-chevron-down"></i>show more</button>
    `;
    overviewContainer.appendChild(actingActers);
    publishActers();
  }
} // End sortingCastPersons
/* Publishin Acters to the modal */
function publishActers() {
  let moreCast = document.getElementById("moreCast"); //Referens to the button to show more actres
  moreCast.addEventListener("click", publishActers);

  let containerEl = document.querySelector(
    ".modal_container_hero_overview_cast_images"
  );

  if (actingActers.length > 6) {
    for (let i = 0; i < 6; i++) {
      containerEl.innerHTML += `
        <div class="modal_container_hero_overview_cast_images_content">
          <img src="https://image.tmdb.org/t/p/w300${actingActers[i].profile_path}" alt="${actingActers[i].original_name}">
          <p class="modal_container_hero_overview_cast_images_content-realname">${actingActers[i].original_name}</p>
          <p class="modal_container_hero_overview_cast_images_content-name">${actingActers[i].character}</p>
        </div>
       `;
    }
    actingActers.splice(0, 6);
  } else {
    for (let i = 0; i < actingActers.length; i++) {
      containerEl.innerHTML += `
        <div class="modal_container_hero_overview_cast_images_content">
          <img src="https://image.tmdb.org/t/p/w300${actingActers[i].profile_path}" alt="${actingActers[i].original_name}">
          <p class="modal_container_hero_overview_cast_images_content-realname">${actingActers[i].original_name}</p>
          <p class="modal_container_hero_overview_cast_images_content-name">${actingActers[i].character}</p>
        </div>
       `;
    }
    moreCast.style.display = "none";
  }
  let checkMedia = document.querySelector(
    ".modal_container_hero_overview_media"
  );
  let checkReview = document.querySelector(
    ".modal_container_hero_overview_reviews"
  );

  if (checkMedia === null && checkReview === null) {
    publishMedia();
  }
} //End publishActers
/* Get  Trailer of Movie*/
function publishMedia() {
  let overviewContainer = document.querySelector(
    ".modal_container_hero_overview"
  );
  let movieTrailer = movieRespons.videos.results;
  if (movieTrailer.length > 0) {
    let mediaContainer = document.createElement("div");
    mediaContainer.classList.add("modal_container_hero_overview_media");
    mediaContainer.innerHTML = `
      <h3 class="modal_container_hero_overview_media-titel">media</h3>
    `;
    if (movieTrailer.length < 3) {
      for (let i = 0; i < movieTrailer.length; i++) {
        mediaContainer.innerHTML += `
        <iframe src="https://www.youtube.com/embed/${movieTrailer[i].key}" title="YouTube video player" web-share" allowfullscreen></iframe>`;
      }
    } else {
      for (let i = 0; i < 3; i++) {
        mediaContainer.innerHTML += `
        <iframe src="https://www.youtube.com/embed/${movieTrailer[i].key}" title="YouTube video player" web-share" allowfullscreen></iframe>`;
      }
    }
    overviewContainer.appendChild(mediaContainer);
    publishReviews();
    return;
  } else {
    publishReviews();
    return;
  }
} // End publishMedia
/* Get reviews of movie */
function publishReviews() {
  let overviewContainer = document.querySelector(
    ".modal_container_hero_overview"
  );
  let allReviews = reviews.results;

  if (allReviews.length > 0) {
    let reviewsContainer = document.createElement("div");
    reviewsContainer.classList.add("modal_container_hero_overview_reviews");
    reviewsContainer.innerHTML = `
      <h3 class="modal_container_hero_overview_reviews-titel">reviews</h3>
      <div class="modal_container_hero_overview_reviews_review"></div>
      `;
    overviewContainer.appendChild(reviewsContainer);
  } else {
    return;
  }
  let reviewContent = document.querySelector(
    ".modal_container_hero_overview_reviews_review"
  );
  for (let i = 0; i < allReviews.length; i++) {
    let singleReview = document.createElement("div");
    singleReview.classList.add(
      "modal_container_hero_overview_reviews_review_profile"
    );
    singleReview.innerHTML = `
      <div class="modal_container_hero_overview_reviews_review_profile_data">
        <img src="${Utils.checkImgStatus(
          allReviews[i].author_details.avatar_path
        )}" alt="${allReviews[i].author}">
        <h4 class="modal_container_hero_overview_reviews_review_profile-name">${
          allReviews[i].author
        }</h4>
        <p class="modal_container_hero_overview_reviews_review_profile-date">${
          allReviews[i].created_at.split("T")[0]
        }</p>
      </div>
        <span class="modal_container_hero_overview_reviews_review_profile-vote">
          <i class="fa-solid fa-star"></i> ${
            allReviews[i].author_details.rating
              ? allReviews[i].author_details.rating
              : 0
          }/10
        </span>
        <p class="modal_container_hero_overview_reviews_review_profile-text">${
          allReviews[i].content
        }</p> 
    `;
    reviewContent.appendChild(singleReview);
  }
}
