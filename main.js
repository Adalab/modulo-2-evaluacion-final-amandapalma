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
  //2. Obtener el valor de ese campo, que guardamos en una constante, para filtrar la petición al servidor, en función del valor que introduzca el usuario en la búsqueda.
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
          filmsObject.image =
            "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
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

  for (const film of films) {
    //Comprobamos si el item está guardado en nuestro array favoritos. Si no está, se le aplica el estilo 'default'. Si sí está, se le aplica el estilo de 'favorito'.
    const isFavorite = favorites.find((favorite) => favorite.id === film.id);

    if (isFavorite === true) {
      favClass = "favorite";
    } else {
      favClass = "default";
    }
    //recorremos el array films y pintamos el código html relativo a cada item
    codeHTML += `<li class="js-result-item ${favClass}" id= "${film.id}">`;
    codeHTML += `<div class = "js-result-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;
    codeHTML += `<img class ="js-result-item-img img" src="${film.image}" alt="alt="${film.name} image">`;
    codeHTML += `</div> `;
    codeHTML += `<h4 class="js-result-item-name itemName">${film.name}  </h4>`;
    codeHTML += `<i id="js-result-item-heart${film.id}" class="far fa-heart itemHeart"></i>`;
    codeHTML += `</div>`;
    codeHTML += `</li>`;
  }
  // Selector del elemento <ul> de la sección 'results'del DOM
  const resultsList = document.querySelector(".js-results-list-container");

  // pintamos dentro del elemento <ul> del DOM todo el código que hemos definido y guardado en codeHTML
  if ((resultsList.innerHTML = " ")) {
    resultsList.innerHTML += codeHTML;
  }
  listenFilmClicks();
}
//REVISAR EL CONDICIONAL!!! La intención era sobreescribir los nuevos resultados de la búqueda sobre los resultados previos. FUNCIONA PERO NO ENTIENDO MUY BIEN POR QUE´ :)

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

  // Función Listener, que recorre el array de resultados y escucha el evento 'click' en cada elemento para ejecutar a la función que añade ese elemento a favoritos (addAsFavorites)
  for (const filmItem of filmItems) {
    filmItem.addEventListener("click", addAsFavorite);
  }
}

//=============================

//El id de la película es un identificador único, así que necesitamos obtenerlo para localizar la película clickada.En el array, el id es un tipo de dato numérico, por eso debemos cambiar su formato a número con ParseInt.
//Si el id de la película clicada es el mismo que el de alguna película en favoritos, se elimina esa película del array favoritos
//Si el id de la película clicada no es el mismo, se añade esa película al array favoritos.

//----opción 1:
// const addAsFavorite = (ev) => {
//   const clickedId = parseInt(ev.currentTarget.id);

//   const favoriteItem = favorites.find((filmItem) => filmItem.id === clickedId);
//   const filmItem = films.find((filmItem) => filmItem.id === clickedId);
//   if (filmItem === undefined) {
//     favorites.push(film);
//   } else {
//     favorites.splice(film);
//   }
//   paintFavorites();
//   setLocalStorage();
// };

//---opción 2:
const addAsFavorite = (ev) => {
  const clickedId = parseInt(ev.currentTarget.id);

  for (const film of films) {
    if (film.id === clickedId) {
      favorites.push(film);
    }
  }
  paintFavorites();
  setLocalStorage();
};

const paintFavorites = () => {
  let codeHTML = "";
  let favClass;
  // console.log(favorites);

  for (const favorite of favorites) {
    //recorremos el array favorites y pintamos el código html relativo a cada item
    codeHTML += `<li class="js-favorite-item ${favClass}" id= "${favorite.id}">`;
    codeHTML += `<div class = "js-favorite-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;
    codeHTML += `<img class ="js-favorite-item-img img" src="${favorite.image}" alt="alt="${favorite.name} image">`;
    codeHTML += `</div> `;
    codeHTML += `<h4 class="js-favorite-item-name itemName">${favorite.name}  </h4>`;
    codeHTML += `<i id="js-favorite-item-cross${favorite.id}" class="fa fa-window-close itemCross" aria-hidden="true"></i>`;
    codeHTML += `</div>`;
    codeHTML += `</li>`;
  }

  // Selector del elemento <ul> de la sección 'favorites' del DOM
  const favoritesList = document.querySelector(".js-favorite-list-container");

  // pintamos dentro del elemento <ul> del DOM todo el código que hemos definido y guardado en codeHTML

  if ((favoritesList.innerHTML = " ")) {
    favoritesList.innerHTML += codeHTML;
  }

  listenFilmClicks();
};

//REVISAR EL CONDICIONAL!!! La intención era sobreescribir los nuevos resultados de la búqueda sobre los resultados previos. FUNCIONA PERO NO ENTIENDO MUY BIEN POR QUE´ :)

//FASE 4: ALMACENAR LISTA DE FAVORITOS EN LOCALSTORAGE

//LOCAL STORAGE

const setLocalStorage = () => {
  const FavoritesString = JSON.stringify(favorites);
  localStorage.setItem("favorite films", FavoritesString);
};

const getLocalStorage = () => {
  const FavoritesString = localStorage.getItem("favorite films");
  if (FavoritesString !== null) {
    favorites = JSON.parse(FavoritesString);
    paintFavorites();
  }
};

//FASE 5: BORRAR FAVORITOS

// Eliminar un elemento de la lista de favoritos al clickar sobre el icono 'cross'

// Eliminar todos los elementos de la lista favoritos al clickar sobre el botón 'delete all favorites'

//-------------------------------------------------------
//Al arrancar la página
getDataFromApi();
getLocalStorage();
paintResults();
