"use strict";

//ARRAYS

let films = [];
let favorites = [];

//FASE 1: CREAR ESTRUCTURA HTML (VER INDEX.HTML)
//FASE 2: OBTENER DATOS DEL API Y PINTAR RESULTADOS DE LA BUSQUEDA

// (2) Petición al API, para obtener los datos de las películas. Asignamos los datos a la variable 'films', que previamente hemos declarado a nivel global.

function getDataFromApi() {
  // Necesitamos:
  //1. Selector del campo de búsqueda en el DOM
  //2. Obtener el valor de ese campo para filtrar la petición al servidor en función de los datos introducidos por el usuario en la búsqueda. Ese valor lo guardamos en la constante constante searchValue.
  const searchField = document.querySelector(".js-searchField");
  const searchValue = searchField.value;

  fetch(`http://api.tvmaze.com/search/shows?q=${searchValue}`)
    .then((response) => response.json())
    .then((data) => {
      films = [];
      for (const film of data) {
        const filmsObject = {
          id: film.show.id,
          name: film.show.name,
          image: film.show.image,
        };

        if (film.show.image === null) {
          filmsObject.image = "./images/default_image.png";
        } else {
          filmsObject.image = film.show.image.medium;
        }
        films.push(filmsObject);
      }
      paintResults();
    });
}

// (3) Función para pintar los resultados de la búsqueda, y establecer el estilo correspondiente al item de la película, cuando se produce el evento 'click' sobre ella.

function paintResults() {
  let codeHTML = "";
  let favClass;

  // Selector del elemento <ul> de la sección 'results'del DOM
  const resultsList = document.querySelector(".js-results-list-container");

  //Reseteo cualquier código que hubiese previamente para que los resultados de la búsqueda no se dupliquen
  resultsList.innerHTML = "";

  for (const film of films) {
    //Comprobamos si el item está guardado en nuestro array favoritos. Si no está, se le aplica el estilo 'default'. Si sí está, se le aplica el estilo de 'favorito'.
    const isFavorite = favorites.find((favorite) => favorite.id === film.id);

    if (isFavorite) {
      favClass = "favorite";
    } else {
      favClass = "default";
    }
    //recorremos el array films y pintamos el código html relativo a cada item
    codeHTML += `<li class="js-result-item ${favClass}" id= "${film.id}">`;
    // codeHTML += `<div class = "js-result-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;
    codeHTML += `<img class ="js-result-item-img img" src="${film.image}" alt="alt="${film.name} image">`;
    codeHTML += `</div> `;
    codeHTML += `<h3 class="js-result-item-name itemName">${film.name} </h3>`;
    // codeHTML += `<i id="${film.id}" class="js-result-item-heart far fa-heart heartItem"></i>`;
    codeHTML += `</div>`;
    codeHTML += `</li>`;
  }

  // pintamos dentro del elemento <ul> del DOM todo el código que hemos definido y guardado en codeHTML
  resultsList.innerHTML = codeHTML;

  listenFilmClicks();
}

//(1) Función listener para escuchar el evento 'click' en el botón search.

//Selector del botón search en el DOM
const searchButton = document.querySelector(".js-searchButton");
searchButton.addEventListener("click", handleSearch);

// función manejadora de la búsqueda
function handleSearch(ev) {
  ev.preventDefault();

  getDataFromApi();
}

//----------------------
//FASE 3: MARCAR COMO FAVORITO

// Cuando se marca una película como favorita:
// 1) Color de fondo y texto cambian en el item de lista de resultados
// 2) Se pinta la película en la lista de favoritos
// 3) Se guarda esa película en LocalStorage

function listenFilmClicks() {
  //Selector de todos los elementos resultantes de la búsqueda
  const filmItems = document.querySelectorAll(".js-result-item");

  // Función Listener, que recorre el array de resultados y escucha el evento 'click' en cada elemento para ejecutar a la función que añade ese elemento a favoritos (handleResultsClick)
  for (const filmItem of filmItems) {
    filmItem.addEventListener("click", addOrRemoveFavorite);
  }
}

//=============================

//El id de la película es un identificador único, así que necesitamos obtenerlo para localizar la película clickada.En el array, el id es un tipo de dato numérico, por eso debemos cambiar su formato a número con ParseInt.
//Si el id de la película clicada es el mismo que el de alguna película en favoritos, se elimina esa película del array favoritos
//Si el id de la película clicada no es el mismo, se añade esa película al array favoritos.

function addOrRemoveFavorite(ev) {
  const clickedId = parseInt(ev.currentTarget.id);
  const foundedFavoriteIndex = favorites.findIndex(
    (favorite) => favorite.id === clickedId
  );

  if (foundedFavoriteIndex === -1) {
    const film = films.find((film) => film.id === clickedId);
    favorites.push(film);

    //además elimina la clase default' y añade la clase 'favorite'  del <li> de results
  } else {
    favorites.splice(foundedFavoriteIndex, 1);
    //además elimina la clase 'favorite' y añade la clase 'default' del <li> de results
  }
  setLocalStorage();
  paintFavorites();
  paintResults();
  // closeIconListener();
}

const paintFavorites = () => {
  let codeHTML = "";
  let favClass;

  // Selector del elemento <ul> de la sección 'favorites' del DOM
  const favoritesList = document.querySelector(".js-favorites-list-container");

  favoritesList.innerHTML = "";

  for (const favorite of favorites) {
    //Recorremos el array favorites y pintamos el código html relativo a cada item
    codeHTML += `<li class="js-favorite-item favoriteItem" id= "${favorite.id}">`;
    // codeHTML += `<div class = "js-favorite-item-card itemCard" >`;
    codeHTML += `<div class ="favItemImg">`;
    codeHTML += `<img class ="js-favorite-item-img favImg" src="${favorite.image}" alt="alt="${favorite.name} image">`;
    codeHTML += `</div> `;
    codeHTML += `<h3 class="js-favorite-item-name favItemName">${favorite.name}  </h3>`;
    codeHTML += `<i id="${favorite.id}" class="js-favorite-closeIcon fa fa-times closeIcon" aria-hidden="true"></i>`;
    // <i class="fa fa-times" aria-hidden="true">fa fa-window-close-</i>
    codeHTML += `</div>`;
    codeHTML += `</li>`;
  }

  // Pintamos dentro del elemento <ul> del DOM todo el código que hemos definido y guardado en codeHTML
  favoritesList.innerHTML += codeHTML;

  listenFilmClicks();
  listenRemoveAll();
  ListenCloseIcon();
};

//FASE 4: ALMACENAR LISTA DE FAVORITOS EN LOCALSTORAGE

//LOCAL STORAGE

//En localStorage solo podemos guardar datos de tipo primitivo. Como en este caso necesitamos guardar un array, debemos convertirlo a una cadena para poder guardarlo.

const setLocalStorage = () => {
  const FavoritesString = JSON.stringify(favorites);
  localStorage.setItem("favorite films", FavoritesString);
};

// JSON.parse cambia a formato JSON los datos que previamente habíamos transformado en string para poder almacenalros en LocalSotrage.
const getLocalStorage = () => {
  const FavoritesString = localStorage.getItem("favorite films");
  if (FavoritesString !== null) {
    favorites = JSON.parse(FavoritesString);
  }
  paintFavorites();
};

//FASE 5: BORRAR FAVORITOS

// Eliminar todos los elementos de la lista favoritos al clickar sobre el botón 'delete all favorites'

// Borrar los datos del localStorage y asigno a la variable 'favorites' un array vacío.
const listenRemoveAll = () => {
  const resetBtn = document.querySelector(".js-reset-favorites");
  resetBtn.addEventListener("click", removeAll);
  // console.log("listenRemoveAll funciona");
};

const removeAll = () => {
  favorites = [];

  paintFavorites();
  setLocalStorage();
  paintResults();
};

// Eliminar un elemento de la lista de favoritos al clickar sobre el icono 'cross'

//Función listener para escuchar el evento 'click' sobre closeIcon
function ListenCloseIcon() {
  //Selector de todos los close icons del DOM
  const closeIcons = document.querySelectorAll(".js-favorite-closeIcon");

  for (const closeIcon of closeIcons) {
    closeIcon.addEventListener("click", removeFavorite);
  }
}

function removeFavorite(ev) {
  console.log("removeFavorite funciona");
  const closeIconClickedId = parseInt(ev.target.id);
  const foundedFavoriteIndex = favorites.findIndex(
    (favorite) => favorite.id === closeIconClickedId
  );
  console.log(closeIconClickedId);
  favorites.splice(foundedFavoriteIndex, 1);

  paintFavorites();
  setLocalStorage();
  paintResults();
}

//Al arrancar la página
getLocalStorage();
