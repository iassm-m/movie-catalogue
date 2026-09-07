const apiKey = "b7a6351d";
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function searchMovie() {
  document.getElementById("favoritesContainer").innerHTML = ""; // Limpa a lista de favoritos ao buscar um filme
  const query = document.getElementById("searchInput").value;
  fetch(`https://www.omdbapi.com/?t=${query}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        displayMovie(data);
      } else {
        alert("Filme não encontrado!");
      }
    });
}

function displayMovie(movie) {
  const container = document.getElementById("movieContainer");
  container.innerHTML = `
    <div class="movie">
      <img src="${movie.Poster}" alt="${movie.Title}" onclick="showDetails('${movie.imdbID}')">
      <h3>${movie.Title}</h3>
      <p>⭐ ${movie.imdbRating}</p>
      <button onclick="addFavorite('${movie.imdbID}')">Adicionar aos Favoritos</button>
    </div>
  `;
}

function searchMovies() {
  const query = document.getElementById("searchInput").value;
  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("movieContainer");
      container.innerHTML = "";

      if (data.Response === "True") {
        data.Search.forEach(movie => {
          container.innerHTML += `
            <div class="movie">
              <img src="${movie.Poster}" alt="${movie.Title}" onclick="showDetails('${movie.imdbID}')">
              <h3>${movie.Title}</h3>
              <p>${movie.Year}</p>
              <button onclick="addFavorite('${movie.imdbID}')">Favoritar</button>
            </div>
          `;
        });
      } else {
        alert("Nenhum resultado encontrado!");
      }
    });
}

function showDetails(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(movie => {
      const detail = document.getElementById("movieDetail");
      detail.innerHTML = `
        <h2>${movie.Title}</h2>
        <img src="${movie.Poster}" alt="${movie.Title}">
        <p><strong>Ano:</strong> ${movie.Year}</p>
        <p><strong>⭐ Avaliação:</strong> ${movie.imdbRating}</p>
        <p><strong>Descrição:</strong> ${movie.Plot}</p>
      `;
    });
}

function addFavorite(id) {
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }
  window.location.href = "favoritos.html";
}
function updateFavoritesOnHome() {
  const container = document.getElementById("favoritesContainer");
  container.innerHTML = ""; // não adiciona título


  favoritos.forEach(id => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
      .then(response => response.json())
      .then(movie => {
        container.innerHTML += `
          <div class="movie">
            <img src="${movie.Poster}" alt="${movie.Title}" onclick="showDetails('${movie.imdbID}')">
            <h3>${movie.Title}</h3>
            <p>⭐ ${movie.imdbRating}</p>
            <button onclick="removeFavorite('${movie.imdbID}')">Remover</button>
          </div>
        `;
      });
  });
}

function removeFavorite(id) {
  favoritos = favoritos.filter(fav => fav !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  updateFavoritesOnHome();
}

// Atualiza favoritos ao carregar a página inicial
updateFavoritesOnHome();
