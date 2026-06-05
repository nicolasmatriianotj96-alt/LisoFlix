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
        
        // Tuas imagens locais
        const filmesLocais = [
            {
                id: 9991,
                titulo: 'A Origem',
                url_imagem: '/imagens/origem.jpg'
            },
            {
                id: 9992,
                titulo: 'Alice no País das Maravilhas',
                url_imagem: '/imagens/alice.jpg'
            }
        ];

        // Se banco vazio, usa só os locais
        if (filmes.length === 0) {
            filmes = filmesLocais;
        } else {
            // Substitui os 2 primeiros do banco pelos locais
            filmes.splice(0, 2, ...filmesLocais);
        }

        const catalogo = document.getElementById('catalogo');
        catalogo.innerHTML = '';

        filmes.forEach(filme => {
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