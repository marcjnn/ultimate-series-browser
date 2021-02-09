"use strict";

console.log("A gruffalo? What's a gruffalo?");

// ---------- START ----------

const searchBtnElement = document.querySelector(".js-search-btn");

let searchResults = [];
let favoriteShows = [];

// search

function search() {
  getSearchResults()
    .then(parseResponse)
    .then(createSearchList)
    .then(renderSearchResults)
    .then(addListnerToShowCard);
}

function getSearchResults() {
  const searchInputElement = document.querySelector(".js-search-input");
  return fetch(
    `http://api.tvmaze.com/search/shows?q=${searchInputElement.value}`
  );
}

function parseResponse(response) {
  return response.json();
}

function createSearchList(data) {
  searchResults = [];
  if (data !== null) {
    const showsList = data;
    for (const result of showsList) {
      searchResults.push(result.show);
    }
  }
  updateImageProperty();
}

function updateImageProperty() {
  for (const result of searchResults) {
    if (result.image !== null) {
      result.image = result.image.medium;
    } else {
      result.image =
        "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    }
  }
}

// render search results

function renderSearchResults() {
  const searchResultsElement = document.querySelector(".js-search-results");
  // remove all children before appending from new search
  while (searchResultsElement.lastChild) {
    searchResultsElement.lastChild.remove();
  }
  for (const result of searchResults) {
    // create containers
    // if I have time to make the grid - remove li and put directly articles inside section
    const li = createElement("li");
    const article = createElement("article");
    const img = createElement("img");
    const h2 = createElement("h2");
    // add attributes and classes
    img.setAttribute("src", result.image);
    img.setAttribute("alt", result.name);
    article.setAttribute("data-id", result.id);
    article.classList.add("js-show-card");
    // create content
    const h2Text = createTextNode(`${result.name}`);
    // nest
    h2.appendChild(h2Text);
    article.appendChild(img);
    article.appendChild(h2);
    li.appendChild(article);
    searchResultsElement.appendChild(li);
  }
}

function createElement(element) {
  return document.createElement(element);
}

function createTextNode(data) {
  return document.createTextNode(data);
}

// update favorites

function updateFavoriteList(show) {
  // parseInt because data-id comes as a string

  if (!checkIfFavorite(show.id)) {
    addToFavorites(show);
  } else {
    removeFromFavorites(show);
  }
  renderFavoriteShows();
  addListnerToRemoveFromFavBtn();
  saveToLocalStorage();
}

function getShow(showId) {
  for (const result of searchResults) {
    if (result.id === showId) {
      return result;
    }
  }
}

function checkIfFavorite(selectedShowId) {
  const favShow = favoriteShows.find((show) => show.id === selectedShowId);
  return favShow ? true : false;
}

function addToFavorites(show) {
  favoriteShows.push(show);
}

function removeFromFavorites(showToRemove) {
  const indexShowToRemove = favoriteShows.findIndex(
    (show) => show.name === showToRemove.name
  );
  favoriteShows.splice(indexShowToRemove, 1);
}

// render favorite shows

function renderFavoriteShows() {
  const favoriteShowsElement = document.querySelector(".js-favorite-shows");
  while (favoriteShowsElement.lastChild) {
    favoriteShowsElement.lastChild.remove();
  }
  for (const favShow of favoriteShows) {
    // create containers
    const li = createElement("li");
    const article = createElement("article");
    const img = createElement("img");
    const h3 = createElement("h3");
    const rmvBtn = createElement("button");
    // btn for remove
    // add attributes and classes
    img.setAttribute("src", favShow.image);
    img.setAttribute("alt", favShow.name);
    rmvBtn.setAttribute("data-id", favShow.id);
    article.setAttribute("data-id", favShow.id);
    img.classList.add("favourite__img");
    rmvBtn.classList.add("favourite__btn");
    article.classList.add("js-favorite-card");
    article.classList.add("favourite__card");
    // create content
    const h3Text = createTextNode(`${favShow.name}`);
    const rmvBtnText = createTextNode("x");
    // nest
    h3.appendChild(h3Text);
    rmvBtn.appendChild(rmvBtnText);
    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(rmvBtn);
    li.appendChild(article);
    favoriteShowsElement.appendChild(li);
  }
}

// local storage

function saveToLocalStorage() {
  const dataInString = JSON.stringify(favoriteShows);
  localStorage.setItem("favoriteShows", dataInString);
}

function getFromLocalStorage() {
  const savedFavoritesInString = localStorage.getItem("favoriteShows");
  if (savedFavoritesInString !== null) {
    const savedFavorites = JSON.parse(savedFavoritesInString);
    favoriteShows = savedFavorites;
  }
}

// events

function handleSearchBtn(event) {
  event.preventDefault();
  // show, creat, manage, render? but render in another function, then I'd have to change its name
  search();
}

searchBtnElement.addEventListener("click", handleSearchBtn);

// function handleAddToFavorites(event) {
//   const selectedShowId = event.currentTarget.getAttribute("data-id");

//   // parseInt because data-id comes as a string
//   addToFavorites(parseInt(selectedShowId));
// }
// I cannot use handleFavorites for x btn because it loops through search results not favorites
function handleFavorites(event) {
  const selectedShowId = event.currentTarget.getAttribute("data-id");
  const show = getShow(parseInt(selectedShowId));
  updateFavoriteList(show);
}

function addListnerToShowCard() {
  const showElements = document.querySelectorAll(".js-show-card");
  for (const showElement of showElements) {
    // showElement.addEventListener("click", handleAddToFavorites);
    showElement.addEventListener("click", handleFavorites);
  }
}

function handleRemoveFromFavBtn(event) {
  const selectedShowId = parseInt(event.currentTarget.getAttribute("data-id"));
  for (const favShow of favoriteShows) {
    if (favShow.id === selectedShowId) {
      updateFavoriteList(favShow);
    }
  }
}

function addListnerToRemoveFromFavBtn() {
  const rmvBtnElements = document.querySelectorAll(".favourite__btn");
  for (const btn of rmvBtnElements) {
    btn.addEventListener("click", handleRemoveFromFavBtn);
  }
}

// run app

function runApp() {
  getFromLocalStorage();
  console.log(favoriteShows);
  renderFavoriteShows();
  addListnerToRemoveFromFavBtn();
}

runApp();
