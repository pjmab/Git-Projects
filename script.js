const poke_container = document.getElementById('poke-container')
const pokemon_count = 1300
const colors = {
    fire: '#f69476',
    grass: '#DEFDE0',
    electric: '#fae471',
    water: '#ade5ff',
    ground: '#f9cfa6',
    rock: '#c8a35d',
    fairy: '#FFC5D3',
    poison: '#7f708a',
    bug: '#e9f8a3af',
    dragon: '#97b3e6',
    psychic: '#ebcaf1',
    flying: '#A2CAFF',
    fighting: '#af3e3e',
    normal: '#F5F5F5',
    steel: '#9ea0a1',
    dark: '#4d4c4c',
    ghost: '#645394',
    ice: '#CEEAF6'
}

const main_types = Object.keys(colors)

const fetchPokemons = async () => {
    for(let i = 1; i <= pokemon_count; i++) {
        await getPokemon(i)
    }
}

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const data = await res.json()

    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`
    const speciesRes = await fetch(speciesUrl)
    const speciesData = await speciesRes.json()

    createPokemonCard(data, speciesData)
}

const createPokemonCard = (pokemon, species) => {
    const pokemonEl = document.createElement('div')
    pokemonEl.classList.add('pokemon')

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
    const id = pokemon.id.toString().padStart(3, '0')
    const poke_types = pokemon.types.map(type => type.type.name)
    const type = main_types.find(type => poke_types.indexOf(type) > -1)
    const color = colors[type]

    if (species.is_legendary) {
    pokemonEl.classList.add('legendary')
    // set type colors as the gradient base
    if (poke_types.length > 1) {
        pokemonEl.style.background = `linear-gradient(270deg, ${colors[poke_types[0]]}, ${colors[poke_types[1]]}, ${colors[poke_types[0]]})`
    } else {
        pokemonEl.style.background = `linear-gradient(270deg, ${color}, white, ${color})`
    }
    pokemonEl.style.backgroundSize = '300% 300%'
    } 
    else if (species.is_mythical) {
    pokemonEl.classList.add('mythical')
    // same type color logic
    if (poke_types.length > 1) {
        pokemonEl.style.background = `linear-gradient(to bottom left, ${colors[poke_types[0]]} 30%, ${colors[poke_types[1]]} 70%)`
    } else {
        pokemonEl.style.background = `linear-gradient(to bottom left, ${color}, rgba(255,255,255,0.3))`
    }
    } 
    else if (poke_types.length > 1) {
    pokemonEl.style.background = `linear-gradient(to bottom left, ${colors[poke_types[0]]} 30%, ${colors[poke_types[1]]} 70%)`
    } 
    else {
    pokemonEl.style.background = `linear-gradient(to bottom left, ${color}, rgba(255,255,255,0.3))`
    }

    const statsHTML = pokemon.stats.map(s => `<p>${s.stat.name[0].toUpperCase() + s.stat.name.slice(1)}: ${s.base_stat}</p>`).join('')

    const pokemonInnerHTML = `
    <div class="img-container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${name}">
    </div>
    <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name" style="font-weight: 700;">${name}</h3>
        <small class="type" style="font-weight: 550;">Type: <span>${poke_types.map(type => type[0].toUpperCase() + type.slice(1)).join(' / ')}</span></small>
    </div>
    <button class="stats-btn">Stats ▼</button>
    <div class="stats">
        ${statsHTML}
    </div>
    `

    pokemonEl.innerHTML = pokemonInnerHTML

    pokemonEl.querySelector('.stats-btn').addEventListener('click', () => {
        const stats = pokemonEl.querySelector('.stats')
        const btn = pokemonEl.querySelector('.stats-btn')
        stats.classList.toggle('expanded')
        btn.textContent = stats.classList.contains('expanded') ? 'Stats ▲' : 'Stats ▼'
    })

    poke_container.appendChild(pokemonEl)
}

fetchPokemons()

