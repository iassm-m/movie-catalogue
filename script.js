// Chave da API do OMDb (usada para autenticar as requisições)
const apiKey = "b7a6351d";

// Recupera a lista de favoritos do navegador (localStorage).
// Se não existir nada salvo, cria um array vazio.
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];


function searchMovie() {
  // Limpa a área de favoritos quando o usuário faz uma nova busca
  document.getElementById("favoritesContainer").innerHTML = "";

  // Pega o texto digitado no campo de busca
  const query = document.getElementById("searchInput").value;

  // Faz uma requisição à API do OMDb buscando pelo título exato
  fetch(`https://www.omdbapi.com/?t=${query}&apikey=${apiKey}`)
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
      // Se o filme foi encontrado, exibe na tela
      if (data.Response === "True") {
        displayMovie(data);
      } else {
        // Caso contrário, mostra um alerta
        alert("Filme não encontrado!");
      }
    });
}

function displayMovie(movie) {
  // Seleciona o container onde o filme será mostrado
  const container = document.getElementById("movieContainer");

  // Insere o HTML com pôster, título, nota e botão de favoritos
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

  // Busca por vários filmes relacionados ao termo
  fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("movieContainer");
      container.innerHTML = ""; // Limpa resultados anteriores

      if (data.Response === "True") {
        // Para cada filme encontrado, adiciona um bloco na tela
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
  // Busca informações detalhadas pelo ID do filme
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(movie => {
      const detail = document.getElementById("movieDetail");

      // Exibe título, pôster, ano, nota e descrição
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
  // Só adiciona se ainda não estiver na lista
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    // Salva a lista atualizada no localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    showNotification("✔ Filme adicionado aos favoritos!");
  }
  // Redireciona para a página de favoritos
 // window.location.href = "favoritos.html"; (se quiser redirecionar automaticamente para o menu inicial sem selecionar vários filmes, descomente esta linha{retirando as barrinhas do início da linha})
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove após 2 segundos
  setTimeout(() => {
    notification.remove();
  }, 2000);
}


function updateFavoritesOnHome() {
  const container = document.getElementById("favoritesContainer");
  container.innerHTML = ""; // Limpa antes de exibir

  // Para cada ID salvo em favoritos, busca os dados do filme
  favoritos.forEach(id => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
      .then(response => response.json())
      .then(movie => {
        // Exibe pôster, título, nota e botão de remover
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
  // Filtra a lista, removendo o ID selecionado
  favoritos = favoritos.filter(fav => fav !== id);

  // Atualiza o localStorage com a nova lista
  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  // Atualiza a exibição na tela
  updateFavoritesOnHome();
}

// Atualiza favoritos ao carregar a página inicial
updateFavoritesOnHome();
