"use strict";

//FASE 1: RECOGER DATOS DEL API Y PINTAR PELICULAS

//REFERENCIAS AL HTML

//botón search
const searchButton = document.querySelector(".js-searchButton");

//ARRAYS

let films = [];
let favorites = [];

// (2) Petición al API, para obtener los datos de las películas. Guardamos los datos en la variable 'films', previamente declarada globalmente.

function getDataFromApi() {
  //campo de búsqueda
  const searchField = document.querySelector(".js-searchField");
  const searchValue = searchField.value;
  // console.log(searchValue);
  fetch(`http://api.tvmaze.com/search/shows?q=${searchValue}`)
    .then((response) => response.json())
    .then((data) => {
      films = data;
      paintResults();
    });
}

// (3) Función para pintar los resultados de la búsqueda. //???? Y llamar al pintado de estilos de favoritos cuando se cilcka sobre una película
function paintResults() {
  let codeHTML = "";
  let favClass;

  for (const film of films) {
    // if (true) {
    //   favClass = "fav";
    // } else {
    //   favClass = "";
    // }
    codeHTML += `<li class="js-result-item ${favClass}" id= "${film.show.id}">`;
    codeHTML += `<div class = "js-result-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;
    if (film.show.image !== null) {
      codeHTML += `<img class ="js-result-item-img img" src="${film.show.image.medium}" alt="alt="${film.show.name} image">`;
    } else {
      codeHTML += `<img class ="js-result-item-img img" src="https://via.placeholder.com/210x295/ffffff/666666/?" alt="${film.show.name} image">`;
    }
    codeHTML += `</div> `;
    codeHTML += `<h4 class="js-result-item-name itemName">${film.show.name}  </h4>`;
    codeHTML += `<i id="js-result-item-heart${film.show.id}" class="far fa-heart itemHeart"></i>`;
    codeHTML += `</div>`;
    codeHTML += `</li>`;

    // for (film of films) {
    //   if (film.show.id === ) {

    //   }

    // }
  }
  // referencia al ul del HTML
  const resultsList = document.querySelector(".js-results-list-container");

  // pintamos en el elemento ul de mi html todo el código que hemos definido arriba y hemos guardado en codeHTML
  //REVISAR!!! Para eliminar los resultados de la búsqueda anterior y sobreescribir los nuevos

  if ((resultsList.innerHTML = " ")) {
    resultsList.innerHTML += codeHTML;
  }

  console.log(resultsList.innerHTML);
  listenFilmClicks();
}

//  (1) listener para escuchar evento click en el botón search. Botón search lo hemos definido previamente arriba
searchButton.addEventListener("click", handleSearch);

// función manejadora de la búsqueda
function handleSearch(ev) {
  ev.preventDefault();
  console.log("handleSearch funciona");

  getDataFromApi();
}

//----------------------
//FASE 2: MARCAR COMO FAVORITA

// Cuando se marca una película como favorita:
// 1) Color de fondo y texto cambian en la lista de resultados
// 2) Se pinta la película en la lista de favoritos
// 3) Se guarda esa película en LocalStorage

// Definimos el elemento que queremos escuchar, en este caso la propia tarjeta de la película, y después definimos un listener que recorra cada elemento del array a escuchar, y ejecute la función handleFilmClick

function listenFilmClicks() {
  const filmItems = document.querySelectorAll(".js-result-item");
  console.log(filmItems);

  for (const filmItem of filmItems) {
    filmItem.addEventListener("click", handleFilmClick);
  }
  console.log("listenFilmClicks funciona");
}

function handleFilmClick() {
  console.log("handleFilmClick funciona");
}

// Necesitamos identificar la película concreta clickada
// const handleFilmClick = (ev) => {
//   //El id de la película es un identificador único, por eso necesitamos obtener ese id.
//   const clickedId = Number(ev.currentTarget.id);
//   //Buscamos la película que tenga ese id concreto
//   const film = films.find((filmItem) => filmItem.id === clickedId);
//   favorites.push(film);
//   console.log(favorites);
// };

// function handleFavorite() {
//   markAsFavorite();
//   paintFavorite();
// }

getDataFromApi();
paintResults();
