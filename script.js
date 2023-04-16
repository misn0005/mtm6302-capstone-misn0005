const grid = document.getElementById('pokemon-grid');
const loadMoreBtn = document.getElementById('load-more');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const favoriteBtn = document.getElementById('favorite-pokemon-btn');

let offset = 0;
let limit = 20;

// Fetch the first 20 pokemon and display them in the grid
fetchPokemon();

// When the "Load More" button is clicked, fetch the next 20 pokemon
loadMoreBtn.addEventListener('click', fetchPokemon);


async function fetchPokemon() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  const data = await response.json();
  const pokemon = data.results;
  
  pokemon.forEach(async (p) => {
    const response = await fetch(p.url);
    const data = await response.json();
    const { id, name, sprites, stats } = data;

    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const img = document.createElement('img');
    img.src = sprites.front_default;
    img.addEventListener('click', () => showPopup(sprites.front_default, name, stats));

    const nameEl = document.createElement('h3');
    nameEl.textContent = name;

    const idEl = document.createElement('p');
    idEl.textContent = `#${id.toString().padStart(3, '0')}`;

    pokemonCard.appendChild(img);
    pokemonCard.appendChild(nameEl);
    pokemonCard.appendChild(idEl);

    grid.appendChild(pokemonCard);
  });

  // Increase the offset and limit for the next fetch
  offset += limit;
}

function showPopup(imageUrl, name, stats) {
  const popupImage = document.getElementById('popup-image');
  const popupName = document.getElementById('popup-name');
  const popupStats = document.getElementById('popup-stats');

  popupImage.src = imageUrl;
  popupName.textContent = name;
  popupStats.innerHTML = '';

  stats.slice(0, 3).forEach((stat) => {
    const statEl = document.createElement('p');
    statEl.textContent = `${stat.stat.name}: ${stat.base_stat}`;
    popupStats.appendChild(statEl);
  });

  overlay.style.display = 'block';
}

function hidePopup() {
  overlay.style.display = 'none';
}

function favoritePokemon(url) {
  if (!favorites.includes(url)) {
    favorites.push(url);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${url} has been added to favorites!`);
  } else {
    alert(`${url} is already in favorites!`);
  }
}


function handleFavoriteBtnClick(name) {
  favoritePokemon(name);
}

document.getElementById('close-popup').addEventListener('click', hidePopup);

favoriteBtn.addEventListener('click', () => {
  const popupName = document.getElementById('popup-name').textContent;
  handleFavoriteBtnClick(popupName);
});


// Get the list of favorited Pokémon from local storage
const favoritedPokemon = JSON.parse(localStorage.getItem('favorites')) || [];
let favorites = favoritedPokemon;

async function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  for (const url of favorites) {
    const response = await fetch(url);
    const data = await response.json();
    const { id, name, sprites, stats } = data;

    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const img = document.createElement('img');
    img.src = sprites.front_default;

    const nameEl = document.createElement('h3');
    nameEl.textContent = name;

    const idEl = document.createElement('p');
    idEl.textContent = `#${id.toString().padStart(3, '0')}`;

    pokemonCard.appendChild(img);
    pokemonCard.appendChild(nameEl);
    pokemonCard.appendChild(idEl);

    favoritesList.appendChild(pokemonCard);
  }
}


const favoritesList = document.querySelector('#favorites-list');

// loop through the favorited pokemon and append them to the favoritesList element
favorites.forEach(pokemon => {
  const pokemonMarkup = `
    <div class="favorite-pokemon">
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <p>${pokemon.name}</p>
    </div>
  `;
  favoritesList.innerHTML += pokemonMarkup;
});