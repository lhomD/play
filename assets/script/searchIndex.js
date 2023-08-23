/* import * as Utils from "./utils.js"; */
/* import { showMovieModal } from "./movieModal.js"; */
import { serachInit } from "./searchModal.js";
import { genresInit } from "./genresModal.js";
function init() {
  console.log("Init");
  serachInit();
  genresInit();
} //End init
window.addEventListener("load", init);
