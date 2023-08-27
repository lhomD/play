export { serachInit };
let documentBody = document.querySelector("body");
const showModalWindow = document.getElementById("modal");

/* Initialize serach init */
function serachInit() {
  let searchTerm = document.getElementById("searchDesktop");
  let searchTermMobile = document.getElementById("searchMobile");
  let desktopForm = document.getElementById("searchForm");
  let mobileForm = document.getElementById("searchFormMobile");

  /* Dsektop searchfield */
  desktopForm.addEventListener("focusin", onFocuse);
  searchDesktop.addEventListener("focusout", unFocuse);
  desktopForm.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmit(searchTerm.value);
  });

  /* Mobile search field */
  mobileForm.addEventListener("focusin", onFocuse);
  mobileForm.addEventListener("focusout", unFocuse);
  mobileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmit(searchTermMobile.value);
  });
} //End searchInit

/* Focus on search field */
function onFocuse() {
  showModalWindow.classList.add("search");
  documentBody.style.overflowY = "hidden";
} // End onFocus

/* Un Focus on search field */
function unFocuse() {
  showModalWindow.classList.remove("search");
  documentBody.style.overflowY = "scroll";
} //End unFocus

/* On submit function */
function onSubmit(searchTerm) {
  if (searchTerm == "" || !searchTerm) {
    return
  } else {
    window.location.href = "../search/?" + encodeURIComponent(searchTerm);
  }
} // End iónSubmit
