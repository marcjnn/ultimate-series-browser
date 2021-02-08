"use strict";

console.log("A gruffalo? What's a gruffalo?");

// ---------- START ----------

const searchInputElement = document.querySelector(".js-search-input");
const searchBtnElement = document.querySelector(".js-search-btn");
const searchResultsElement = document.querySelector(".js-search-results");

let searchResults = [];

function getSearchResults() {
  const searchedTitle = getSearchQuery();
  fetch(`http://api.tvmaze.com/search/shows?q=${searchedTitle}`)
    .then((response) => response.json())
    .then(createSearchList)
    .then(renderSearchResults);
}

function getSearchQuery() {
  return searchInputElement.value;
}

function createSearchList(data) {
  searchResults = [];
  if (data !== null) {
    const showsList = data;
    for (const show of showsList) {
      searchResults.push(show.show);
    }
  }
}

function renderSearchResults() {
  // remove all children before appending from new search
  while (searchResultsElement.firstChild) {
    searchResultsElement.firstChild.remove();
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
    // add (CLASSES for later) and attributes
    img.setAttribute("src", imgUrl);
    img.setAttribute("alt", result.name);
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

function checkForPhoto(result) {
  if (result.image !== null) {
    return result.image.medium;
  } else {
    return "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
  }
}

function handleSearchBtn(event) {
  event.preventDefault();
  getSearchResults();
}

searchBtnElement.addEventListener("click", handleSearchBtn);
