const API_URL = 'https://lisoflix-g5ie.onrender.com';

window.onload = async function() {
    const token = localStorage.getItem('token');
    const boasvindas = document.getElementById('boasvindas');
    const msg = document.getElementById('mensagem');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const nome = localStorage.getItem('nome') || 'usuário';
    boasvindas.textContent = `Olá, ${nome}!`;

    try {
        const res = await fetch(`${API_URL}/filmes`);
        let filmes = await res.json();
        
        // Força usar tuas imagens locais pros 2 filmes
        const filmesForcados = [
            {
                id: 1,
                titulo: 'A Origem',
                url_imagem: '/imagens/origem.jpg'
            },
            {
                id: 2,
                titulo: 'Alice no País das Maravilhas',
                url_imagem: '/imagens/alice.jpg'
            }
        ];

        // Se banco vazio, usa só os 2 locais
        if (filmes.length === 0) {
            filmes = filmesForcados;
        } else {
            // Se tiver filmes no banco, adiciona os 2 no final
            filmes = [...filmes, ...filmesForcados];
        }

        const catalogo = document.getElementById('catalogo');
        catalogo.innerHTML = '';

        filmes.forEach(filme => {
            console.log('Carregando imagem:', filme.titulo, filme.url_imagem);
            catalogo.innerHTML += `
                <div class="card">
                    <img src="${filme.url_imagem}" alt="${filme.titulo}">
                    <h3>${filme.titulo}</h3>
                    <button class="registrar">Assistir</button>
                </div>
            `;
        });

        msg.textContent = "";

    } catch (err) {
        console.error("ERRO COMPLETO:", err);
        msg.textContent = "Erro: " + err.message;
        msg.style.color = "red";
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    window.location.href = 'index.html';
}