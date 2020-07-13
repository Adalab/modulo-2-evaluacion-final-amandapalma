"use strict";

//ARRAYS CON LOS QUE VAMOS A TRABAJAR PARA LOS BLOQUES 'FAVORITES' Y 'RESULTS'

let films = [];
let favorites = [];

//FASE 1: CREAR ESTRUCTURA HTML (VER INDEX.HTML)
//FASE 2: OBTENER DATOS DEL API Y PINTAR RESULTADOS DE LA BUSQUEDA

// (2) Petición al API, para obtener los datos de las películas. Asignamos los datos a la variable ```films```, que previamente hemos declarado a nivel global. Además hemos creado un objeto que recoge únicamente los datos que vamos a necesitar (imagen, nombre e id), y será ese objeto lo que guardemos en la variable.

const getDataFromApi = () => {
  // Necesitamos:
  //1. Selector del campo de búsqueda en el DOM
  //2. Obtener el valor de ese campo para filtrar la petición al servidor en función de los datos introducidos por el usuario en la búsqueda. Ese valor lo guardamos en la constante ```searchValue```.
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
};

// (3) (6) (8) Función para pintar los resultados de la búsqueda, y establecer el estilo correspondiente al item de la película ('default' o 'favorite'), cuando se produce el evento 'click' sobre ella.

const paintResults = () => {
  let codeHTML = "";
  let favClass;

  // Selector del elemento <ul> de la sección 'results' del DOM.
  const resultsList = document.querySelector(".js-results-list-container");

  //Reseteamos cualquier código que hubiese previamente para que los resultados de la búsqueda no se dupliquen.
  resultsList.innerHTML = "";

  for (const film of films) {
    //Comprobamos si el item está guardado en nuestro array ```favorites```. Si no está, se le aplica el estilo 'default' a través de la variable ```favClass```. Si sí está, se le aplica el estilo de 'favorite'.
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

  // Pintamos dentro del elemento <ul> del DOM todo el código que hemos definido y guardado en la variable ```codeHTML```.
  resultsList.innerHTML = codeHTML;

  listenFilmClicks();
};

//(1) Función listener para escuchar el evento 'click' en el botón 'search' y ejecutar la correspondiente función manejadora ```handleSearch```.

//Selector del botón search en el DOM
const listenSearchButton = () => {
  const searchButton = document.querySelector(".js-searchButton");
  searchButton.addEventListener("click", handleSearch);
};

// función manejadora de la búsqueda que llama a la función ```getDataFromApi```. Para que no se envíe el formulario por defecto necesitamos prevenir dicho envío con un ```preventDefault```.
function handleSearch(ev) {
  ev.preventDefault();

  getDataFromApi();
}

//----------------------
//FASE 3: MARCAR COMO FAVORITO

// (4) Cuando se hace 'click' sobre una película la marcamos como favorita y suceden varias acciones:
// 1) El color de fondo y texto cambian en el item de lista de resultados.
// 2) Se pinta la película en la lista de favoritos.
// 3) Se guarda esa película en LocalStorage.

const listenFilmClicks = () => {
  //Selector de todos los elementos resultantes de la búsqueda.
  const filmItems = document.querySelectorAll(".js-result-item");

  // Función Listener, que recorre el array de resultados y escucha el evento 'click' en cada item para ejecutar a la función ```addOrRemoveFavorite``` que se encarga de añadir o eliminar del array ```favorites``` ese item sobre el que se ha efectuado el evento 'click'.
  for (const filmItem of filmItems) {
    filmItem.addEventListener("click", addOrRemoveFavorite);
  }
};

//=============================

// (5) El id de la película es un identificador único, así que necesitamos obtenerlo para localizar el item que ha sido 'clickado'. En el array, el id es un tipo de dato numérico, por eso debemos cambiar el formato del id del item a tipo de dato número, con ParseInt.
//Si el id del item 'clickado' es el mismo que el de alguno dentro de ```favorites``` se elimina de ese array, y si no es el mismo, se añade. El método funcional `findIndex` trabaja con los índices de los items. Cuando develve -1, quiere decir que ese elemento no se ha encontrado dentro del array. Pintaríamos con esta nueva versión de los datos en ```favorites```.

//además al volver a pintar dichos items (```paintResults```)se eliminaría la clase 'default' y se añadiría la clase 'favorite' o viceversa, a dicho item en 'films'.

//También necesitaríamos posteriormente guardar esta nueva versión datos en LocalStorage.

const addOrRemoveFavorite = (ev) => {
  const clickedId = parseInt(ev.currentTarget.id);
  const foundedFavoriteIndex = favorites.findIndex(
    (favorite) => favorite.id === clickedId
  );

  if (foundedFavoriteIndex === -1) {
    const film = films.find((film) => film.id === clickedId);
    favorites.push(film);
  } else {
    favorites.splice(foundedFavoriteIndex, 1);
  }
  setLocalStorage();
  paintFavorites();
  paintResults();
};

//(6) (8) //También serían ``` setLocalStorage``` y de nuevo ```paintResults```
const paintFavorites = () => {
  let codeHTML = "";

  // Selector del elemento <ul> de la sección 'favorites' del DOM.
  const favoritesList = document.querySelector(".js-favorites-list-container");

  //Reseteamos cualquier código previo para no duplicar elementos.
  favoritesList.innerHTML = "";

  for (const favorite of favorites) {
    //Recorremos el array favorites y pintamos el código html relativo a cada item.
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
  listenCloseIcon();
};

//FASE 4: ALMACENAR LISTA DE FAVORITOS EN LOCALSTORAGE

//LOCAL STORAGE

// (6) (8) En localStorage solo podemos guardar datos de tipo primitivo. Como en este caso necesitamos guardar un array, debemos convertirlo previamente a string para poder almacenarlo.

const setLocalStorage = () => {
  const favoritesString = JSON.stringify(favorites);
  localStorage.setItem("favorite films", favoritesString);
};

// JSON.parse cambia a formato JSON los datos que previamente habíamos transformado en string para poder almacenalros en LocalSotrage.
const getLocalStorage = () => {
  const favoritesString = localStorage.getItem("favorite films");
  if (favoritesString !== null) {
    favorites = JSON.parse(favoritesString);
  }
  paintFavorites();
};

//FASE 5: BORRAR FAVORITOS

// 1. Eliminar todos los elementos de la lista favoritos al clickar sobre el botón 'delete all favorites'

//  (7)  Escuchamos el botón 'delete all favorites' para, cuando se poruzca el evento 'click' sobre él se ejecute la función ```removeAll```. Esta última, elimina los datos del localStorage asignando a la variable ```favorites``` un array vacío, y por tanto esos datos también se eliminarían del listado `favorites` y `results` cuando volvemos a pintarlos.
const listenRemoveAll = () => {
  const resetBtn = document.querySelector(".js-reset-favorites");
  resetBtn.addEventListener("click", removeAll);
};

const removeAll = () => {
  favorites = [];

  paintFavorites();
  setLocalStorage();
  paintResults();
};

// 2. Eliminar un elemento de la lista `favorites`` al 'clickar' sobre el icono ```closeIcon```.

// (7) Función listener para escuchar el evento 'click' sobre ```closeIcon```.
const listenCloseIcon = () => {
  //Selector de todos los ```closeIcon``` del DOM.
  const closeIcons = document.querySelectorAll(".js-favorite-closeIcon");
  //Con `for of` recorremos el array favoritos para escuchar el evento 'click' sobre cada uno de los items, mediante el listener ```listenCloseIcon```. Este listener ejecuta la función ```removeFavorite``` una vez se haya producido el evento.
  for (const closeIcon of closeIcons) {
    closeIcon.addEventListener("click", removeFavorite);
  }
};
// Esta función localiza el elemento 'clickado' a través de su ```closeIcon``` (ev.target.id) mediante su id, y lo compara con los elementos del array ```favorites```. Si los id coinciden, se eliminará el elemento de dicho array.
const removeFavorite = (ev) => {
  const closeIconClickedId = parseInt(ev.target.id);
  const foundedFavoriteIndex = favorites.findIndex(
    (favorite) => favorite.id === closeIconClickedId
  );

  favorites.splice(foundedFavoriteIndex, 1);

  paintFavorites();
  setLocalStorage();
  paintResults();
};

// (0) Al arrancar la página necesitamos obtener los datos del 'LocalStorage' para conservar pintados los elementos que hemos marcado como favoritos cada vez que se refresque la página. Y necesitamos escuchar el botón 'searchButton', sobre este se realizará la primera acción posible, la primera vez que se entra en la página.
getLocalStorage();
listenSearchButton();
