"use strict";

//FASE 1: RECOGER DATOS DEL API Y PINTAR PELICULAS

//REFERENCIAS AL HTML

//botón search
const searchButton = document.querySelector(".js-searchButton");

//campo de búsqueda
const searchField = document.querySelector(".js-searchField");
const searchValue = searchField.value;

//ARRAYS

let films = [];
let favorites = [];

// Petición al API, para obtener los datos de las películas. Guardamos los datos en la variable 'films', previamente declarada globalmente.

function getDataFromApi() {
  // console.log(searchValue);
  fetch(`http://api.tvmaze.com/search/shows?q=${searchValue}`)
    .then((response) => response.json())
    .then((data) => {
      films = data;
      paintResults();
      // console.log(films);
    });
}

function paintResults() {
  let codeHTML = "";

  for (const film of films) {
    codeHTML += `<li class="js-result-item">`;
    codeHTML += `<div id= "${film.show.id}" class = "js-result-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;
    codeHTML += `<img class ="js-result-item-img img" src="${film.show.image.medium}" alt="imagen de ${film.show.name}">`;
    codeHTML += `</div> `;
    codeHTML += `<h4 class="js-result-item-name itemName">${film.show.name}  </h4>`;
    codeHTML += `<i id="js-result-item-heart${film.show.id}" class="far fa-heart itemHeart"></i>`;
    codeHTML += `</div>`;
    codeHTML += `</li>`;
  }
  // referencia al ul del HTML
  const resultsList = document.querySelector(".js-results-list-container");

  resultsList.innerHTML += codeHTML;
}

// listener para escuchar evento click en el botón search
searchButton.addEventListener("click", handleSearch());

// función manejadora de la búsqueda
function handleSearch(ev) {
  // ev.preventDefault(); //PROBLEMA. RECONOCE EV COMO UNDEFINED
  console.log("la función manejadora funciona");

  getDataFromApi();
}
