"use strict";

//FASE 1: RECOGER DATOS DEL API Y PINTAR PELICULAS

//REFERENCIAS AL HTML

//botón search
const searchButton = document.querySelector(".js-searchButton");

//ARRAYS

let films = [];
let favorites = [];

// (2) Petición al API, para obtener los datos de las películas. Asignamos los datos a la variable 'films', que previamente hemos declarado a nivel global.

function getDataFromApi() {
  //Referencia al campo de búsqueda y obtención de su valor, que guardamos en una constante para filtrar la petición al servidor por el dato introducido por el usuario.
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
  // console.log(favorites);

  for (const film of films) {
    //Comprobamos si el item está guardado en nuestro array favoritos, si no está, se le aplica el estilo por defecto del item. Si sí está, se le aplica el estilo de favorito.
    const isFavorite = favorites.find(
      (favorite) => favorite.show.id === film.show.id
    );
    // console.log(isFavorite);
    // console.log(favorites);

    if (isFavorite === true) {
      favClass = "favorite";
      // addAsFavorite();
    } else {
      favClass = "default";
    }
    //recorremos el array films y pintamos el código html relativo a cada item
    codeHTML += `<li class="js-result-item ${favClass}" id= "${film.show.id}">`;
    codeHTML += `<div class = "js-result-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;

    //si el item no tiene imagen le establecemos una imagen por defecto
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
  }
  // referencia al ul del HTML
  const resultsList = document.querySelector(".js-results-list-container");

  // pintamos en el elemento ul de mi html todo el código que hemos definido arriba y hemos guardado en codeHTML
  //REVISAR EL CONDICIONAL!!! Para eliminar los resultados de la búsqueda anterior y sobreescribir los nuevos. FUNCIONA PERO NO ENTIENDO MUY BIEN POR QUE´

  if ((resultsList.innerHTML = " ")) {
    resultsList.innerHTML += codeHTML;
  }

  // console.log(resultsList.innerHTML);
  listenFilmClicks();
}

//  (1) listener para escuchar evento click en el botón search. Botón search lo hemos definido previamente arriba
searchButton.addEventListener("click", handleSearch);

// función manejadora de la búsqueda
function handleSearch(ev) {
  ev.preventDefault();
  // console.log("handleSearch funciona");

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
  // console.log(filmItems);

  for (const filmItem of filmItems) {
    filmItem.addEventListener("click", addAsFavorite);
  }
  // console.log("listenFilmClicks funciona");
}

// Necesitamos identificar la película concreta clickada
const addAsFavorite = (ev) => {
  //El id de la película es un identificador único, por eso necesitamos obtener ese id, y lo pasamos a valor numérico con parseInt, ya que en nuestro array es un valor numérico.
  const clickedId = parseInt(ev.currentTarget.id);

  for (const film of films) {
    if (film.show.id === clickedId) {
      favorites.push(film);
      console.log(favorites);
      paintFavorites();
    }
  }
};

const paintFavorites = () => {
  let codeHTML = "";
  let favClass;
  // console.log(favorites);

  for (const favorite of favorites) {
    // const isFavorite = favorites.find(
    //   (favorite) => favorite.show.id === film.show.id
    // );
    // // console.log(isFavorite);
    // // console.log(favorites);

    // if (isFavorite === true) {
    //   favClass = "favorite";
    //   // addAsFavorite();
    // } else {
    //   favClass = "default";
    // }

    //recorremos el array favorites y pintamos el código html relativo a cada item
    codeHTML += `<li class="js-favorite-item ${favClass}" id= "${favorite.show.id}">`;
    codeHTML += `<div class = "js-favorite-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;

    //si el item no tiene imagen le establecemos una imagen por defecto
    if (favorite.show.image !== null) {
      codeHTML += `<img class ="js-favorite-item-img img" src="${favorite.show.image.medium}" alt="alt="${favorite.show.name} image">`;
    } else {
      codeHTML += `<img class ="js-favorite-item-img img" src="https://via.placeholder.com/210x295/ffffff/666666/?" alt="${favorite.show.name} image">`;
    }
    codeHTML += `</div> `;
    codeHTML += `<h4 class="js-favorite-item-name itemName">${favorite.show.name}  </h4>`;
    codeHTML += `<i id="js-favorite-item-cross${favorite.show.id}" class="fa fa-window-close itemCross" aria-hidden="true"></i>`;
    codeHTML += `</div>`;
    codeHTML += `</li>`;
  }
  // referencia al ul del HTML
  const favoritesList = document.querySelector(".js-favorite-list-container");

  // pintamos en el elemento ul de mi html todo el código que hemos definido arriba y hemos guardado en codeHTML
  //REVISAR EL CONDICIONAL!!! Para eliminar los resultados de la búsqueda anterior y sobreescribir los nuevos. FUNCIONA PERO NO ENTIENDO MUY BIEN POR QUE´

  if ((favoritesList.innerHTML = " ")) {
    favoritesList.innerHTML += codeHTML;
  }

  // console.log(favoritesList.innerHTML);
  listenFilmClicks();
};

getDataFromApi();
paintResults();
