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

// (3) Función para pintar los resultados de la búsqueda. //???? Y llamar al pintado de estilos de favoritos cuando se cilcka sobre una película
function paintResults() {
  let codeHTML = "";
  let favClass;
  // console.log(favorites);

  for (const film of films) {
    //Comprobamos si el item está guardado en nuestro array favoritos, si no está, se le aplica el estilo por defecto del item. Si sí está, se le aplica el estilo de favorito.
    const isFavorite = favorites.find((favorite) => favorite.id === film.id);
    // console.log(isFavorite);
    // console.log(favorites);

    if (isFavorite === true) {
      favClass = "favorite";
      // addAsFavorite();
    } else {
      favClass = "default";
    }
    //recorremos el array films y pintamos el código html relativo a cada item
    codeHTML += `<li class="js-result-item ${favClass}" id= "${film.id}">`;
    codeHTML += `<div class = "js-result-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;

    // //si el item no tiene imagen le establecemos una imagen por defecto
    // if (film.show.image !== null) {
    //   codeHTML += `<img class ="js-result-item-img img" src="${film.show.image.medium}" alt="alt="${film.show.name} image">`;
    // } else {
    //   codeHTML += `<img class ="js-result-item-img img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${film.show.name} image">`;
    // }
    codeHTML += `<img class ="js-result-item-img img" src="${film.image}" alt="alt="${film.name} image">`;
    codeHTML += `</div> `;
    codeHTML += `<h4 class="js-result-item-name itemName">${film.name}  </h4>`;
    codeHTML += `<i id="js-result-item-heart${film.id}" class="far fa-heart itemHeart"></i>`;
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
  //El id de la película es un identificador único, así que necesitamos obtenerlo para localizar la película clickada.En el array, el id es un tipo de dato numérico, por eso debemos cambiar su formato a número con ParseInt.
  const clickedId = parseInt(ev.currentTarget.id);
  const clickedFilm = ev.currentTarget;
  console.log(clickedFilm);
  for (const favorite of favorites) {
    //Si el id de la película clicada es el mismo que el de alguna película en favoritos, se elimina esa película del array favoritos
    //Si el id de la película clicada no es el mismo, se añade esa película al array favoritos.

    if (clickedId === favorite.id) {
      favorites.splice(film);
      //elimina esa película de favoritos
    } else {
      //añade esa película a favoritos
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
    codeHTML += `<li class="js-favorite-item ${favClass}" id= "${favorite.id}">`;
    codeHTML += `<div class = "js-favorite-item-card itemCard" >`;
    codeHTML += `<div class ="itemImg">`;

    //si el item no tiene imagen le establecemos una imagen por defecto
    // if (favorite.show.image !== null) {
    //   codeHTML += `<img class ="js-favorite-item-img img" src="${favorite.show.image.medium}" alt="alt="${favorite.show.name} image">`;
    // } else {
    //   codeHTML += `<img class ="js-favorite-item-img img" src="https://via.placeholder.com/210x295/ffffff/666666/?" alt="${favorite.show.name} image">`;
    // }
    codeHTML += `<img class ="js-favorite-item-img img" src="${favorite.image}" alt="alt="${favorite.name} image">`;
    codeHTML += `</div> `;
    codeHTML += `<h4 class="js-favorite-item-name itemName">${favorite.name}  </h4>`;
    codeHTML += `<i id="js-favorite-item-cross${favorite.id}" class="fa fa-window-close itemCross" aria-hidden="true"></i>`;
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

//   if (LocalStorageData !== null) {
//     LocalStorageData.show.name = favorites.show.name;
//     // handleUpdateJob();

//     LocalStorageData.id = favorites.show.id;
//     // handleUpdateEmail();
//     LocalStorageData.image = favorites.show.image.medium;
//   }
// };

//Al arrancar la página
getDataFromApi();
getLocalStorage();
paintResults();
