"use strict";

console.log("A gruffalo? What's a gruffalo?");

// ---------- START ----------

const searchInputElement = document.querySelector(".js-search-input");
const searchBtnElement = document.querySelector(".js-search-btn");

let searchResults = [];
let favoriteShows = [];

// search

function showSearchResults() {
  getSearchResults()
    .then(parseResponse)
    .then(createSearchList)
    .then(renderSearchResults)
    .then(addListnerOnShowCard);
}

function getSearchResults() {
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
}

// render search results

function renderSearchResults() {
  const searchResultsElement = document.querySelector(".js-search-results");
  // remove all children before appending from new search
  while (searchResultsElement.lastChild) {
    searchResultsElement.lastChild.remove();
  }
  for (const result of searchResults) {
    // checks if the show comes with foto: returns medium size url or default placeholder if empty
    const imgUrl = checkForPhoto(result);
    // create containers
    // if I have time to make the grid - remove li and put directly articles inside section
    const li = createElement("li");
    const article = createElement("article");
    const img = createElement("img");
    const h2 = createElement("h2");
    // add attributes and classes
    img.setAttribute("src", imgUrl);
    img.setAttribute("alt", result.name);
    article.setAttribute("data-id", result.id);
    article.classList.add("js-serie-card");
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

function checkForPhoto(result) {
  if (result.image !== null) {
    return result.image.medium;
  } else {
    return "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
  }
}

function createElement(element) {
  return document.createElement(element);
}

function createTextNode(data) {
  return document.createTextNode(data);
}

// add to / remove from favorites

function addToFavorites(showId) {
  const show = getShow(showId);

  if (!checkIfFavorite(show.id)) {
    favoriteShows.push(show);
  }

  // saveInLocalStorage()
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

// render list - favorites

// events

function handleSearchBtn(event) {
  event.preventDefault();
  // show, creat, manage, render? but render in another function, then I'd have to change its name
  showSearchResults();
}

searchBtnElement.addEventListener("click", handleSearchBtn);

function handleAddToFavorites(event) {
  const selectedShowId = event.currentTarget.getAttribute("data-id");

  // parseInt because data-id comes as a string
  addToFavorites(parseInt(selectedShowId));
}

function addListnerOnShowCard() {
  const showElements = document.querySelectorAll(".js-serie-card");
  for (const showElement of showElements) {
    showElement.addEventListener("click", handleAddToFavorites);
  }
}
