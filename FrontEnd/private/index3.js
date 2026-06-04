const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/";
}

// BUSCAR FILMES
async function carregarFilmes() {
    try {
        const resposta = await fetch(
            "https://lisoflix-backend.onrender.com/auth/filmes",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token // AQUI: manda o token pro backend
                }
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar filmes: " + resposta.status);
        }

        const filmes = await resposta.json();
        const catalogo = document.querySelector(".catalogo");
        catalogo.innerHTML = "";

        filmes.forEach((filme) => {
            catalogo.innerHTML += `
                <div class="card" onclick="abrirVideo('${filme.url}', '${filme.titulo}')">
                    <img src="${filme.capa}" alt="${filme.titulo}">
                    <h3>${filme.titulo}</h3>
                </div>
            `;
        });

    } catch (erro) {
        console.log("Erro carregarFilmes:", erro);
        document.querySelector(".catalogo").innerHTML = "<p style='color:white'>Erro ao carregar filmes. Confere o CORS no backend.</p>";
    }
}

// ABRIR VIDEO NO MODAL
function abrirVideo(url, titulo) {
    const modal = document.getElementById('modalVideo');
    const player = document.getElementById('player');
    const tituloEl = document.getElementById('tituloVideo');
    
    if (modal && player && tituloEl) {
        tituloEl.textContent = titulo;
        player.src = url;
        modal.style.display = 'flex';
        player.play();
    } else {
        window.open(url, "_blank"); // fallback
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

// BLOQUEAR VOLTAR
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

// FECHAR MODAL
function fecharVideo() {
    const modal = document.getElementById('modalVideo');
    const player = document.getElementById('player');
    
    if (player) {
        player.pause();
        player.src = '';
    }
    if (modal) modal.style.display = 'none';
}

// Fecha modal clicando fora
window.onclick = function(event) {
    const modal = document.getElementById('modalVideo');
    if (event.target == modal) {
        fecharVideo();
    }
}

// INICIAR
carregarFilmes();