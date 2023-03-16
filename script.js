const grid = document.getElementById('pokemon-grid');
const loadMoreBtn = document.getElementById('load-more');

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
    const { id, name, sprites } = data;

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

    grid.appendChild(pokemonCard);
  });

  // Increase the offset and limit for the next fetch
  offset += limit;
}

