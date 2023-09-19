export { checkImgStatus, XHRequest, runTime, checkScreenSize };

const baseUrl = "https://api.themoviedb.org/3/"; //Movie DB Base Url
const imageUrl = "https://image.tmdb.org/t/p/w1280"; //Url to the image
const mediaQuery = window.matchMedia("(max-width: 1023px)"); //Media Query

/* Function to check if image exist */
function checkImgStatus(arg) {
  if (arg === null) {
    return "https://placehold.jp/3d4070/ffffff/300x300.png?text=Image%20Missing";
  } else if (arg.includes("http") || arg.includes("https")) {
    return "https://placehold.jp/3d4070/ffffff/300x300.png?text=Image%20Missing";
  } else {
    return imageUrl + arg;
  }
} //End checkImgStatus

/* API call fungtion to get data from Movie Db */
async function XHRequest(arg) {
  const response = await axios.get(baseUrl + arg);
  return response.data;
} // End getMovies

/* Check runtime of movie */
function runTime(time) {
  let hour = Math.floor(time / 60);
  let minutes = Math.round((time / 60 - hour) * 60);
  return hour + "h " + minutes + "m";
} //End runTim

/* Function to get screen size */
function checkScreenSize() {
  // Check if the media query is true
  if (mediaQuery.matches) {
    return true;
  } else {
    return false;
  }
} //End checkScreenSize
