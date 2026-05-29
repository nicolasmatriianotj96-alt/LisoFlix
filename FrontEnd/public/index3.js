const token = localStorage.getItem("token");
// 1. Pega o token que salvamos no login. Se não tiver, usuário não está logado.

if (!token) {
    window.location.href = "/";
    // 2. Se não achou token, manda o usuário de volta pro login. Segurança básica.
}

async function carregarFilmes() {
    try {
        const resposta = await fetch(
            "https://lisoflix-backend.onrender.com/auth/filmes",
            {
                headers: {
                    "Authorization": `Bearer ${token}` // 3. CORREÇÃO PRINCIPAL
                }
            }
        );
        // 4. Faz GET na API. O header Authorization envia o token pro backend validar.
        // Sem isso o backend barra com 401 Unauthorized.

        const filmes = await resposta.json();
        // 5. Transforma a resposta da API em objeto JS pra gente usar.

        const catalogo = document.querySelector(".catalogo");
        // 6. Pega a div onde os cards vão entrar.

        catalogo.innerHTML = "";
        // 7. Limpa tudo que tinha antes. Evita duplicar filme se chamar 2x.

        filmes.forEach((filme) => {
            catalogo.innerHTML += `
                <div class="card">
                    <img src="${filme.imagem}">
                    <h3>${filme.titulo}</h3>
                    <button onclick="abrirVideo('${filme.video}')">
                        Assistir
                    </button>
                </div>
            `;
            // 8. Pra cada filme que veio da API, cria um card em HTML.
            // Usa template string pra injetar imagem, titulo e link do vídeo.
        });

    } catch (erro) {
        console.log(erro);
        // 9. Se a API cair ou der erro, mostra no console pra debug.
    }
}

function abrirVideo(video) {
    window.open(video, "_blank");
    // 10. Abre o link do vídeo numa nova aba quando clica em "Assistir".
}

function logout() {
    localStorage.removeItem("token");
    // 11. Apaga o token do navegador.
    
    window.location.href = "/";
    // 12. Manda de volta pro login.
}

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
// 13. Impede o usuário de voltar pra tela de login pelo botão "voltar" do navegador.

carregarFilmes();
// 14. Executa a função assim que o JS carrega. Popula a tela.