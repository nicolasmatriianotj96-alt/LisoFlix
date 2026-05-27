const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "/";

}


// BUSCAR FILMES
async function carregarFilmes() {

    try {

        const resposta = await fetch(

            "https://lisoflix-backend.onrender.com/auth/filmes"

        );

        const filmes = await resposta.json();

        const catalogo = document.querySelector(".catalogo");

        catalogo.innerHTML = "";

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

        });

    } catch (erro) {

        console.log(erro);

    }

}


// ABRIR VIDEO
function abrirVideo(video) {

    window.open(video, "_blank");

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


// INICIAR
carregarFilmes();
