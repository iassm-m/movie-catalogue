const apiKey = "b7a6351d";
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || {};

function updateFavorites() {
  const container = document.getElementById("favoritesContainer");
  container.innerHTML = "";

  let somaNotas = 0;
  let qtdNotas = 0;

  favoritos.forEach(id => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
      .then(response => response.json())
      .then(movie => {
        const nota = avaliacoes[id] || 0;
        if (nota > 0) {
          somaNotas += nota;
          qtdNotas++;
        }

        container.innerHTML += `
          <div class="movie">
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>⭐ IMDb: ${movie.imdbRating}</p>
            <p>⭐ Minha nota: ${nota > 0 ? nota + "/5" : "Não avaliado"}</p>
            <div class="rating">
              ${[1,2,3,4,5].map(n => `
                <span onclick="avaliarFilme('${id}', ${n})" 
                      class="star ${n <= nota ? 'active' : ''}">★</span>
              `).join('')}
            </div>
            <button onclick="removeFavorite('${movie.imdbID}')">Remover</button>
          </div>
        `;

        // Atualiza média geral
        const mediaContainer = document.getElementById("mediaGeral");
        if (qtdNotas > 0) {
          const media = (somaNotas / qtdNotas).toFixed(2);
          mediaContainer.innerHTML = `<h3>Média geral das minhas avaliações: ⭐ ${media}/5</h3>`;
        } else {
          mediaContainer.innerHTML = `<h3>Ainda não há avaliações</h3>`;
        }
      });
  });
}

function avaliarFilme(id, nota) {
  avaliacoes[id] = nota;
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  updateFavorites();
}

function removeFavorite(id) {
  favoritos = favoritos.filter(fav => fav !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  updateFavorites();
}

updateFavorites();
