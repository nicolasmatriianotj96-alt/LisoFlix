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
        const res = await fetch(`${API_URL}/filmes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Erro HTTP ${res.status}`);
        }

        const filmes = await res.json();
        const catalogo = document.getElementById('catalogo');
        catalogo.innerHTML = '';

        if (filmes.length === 0) {
            catalogo.innerHTML = '<h3>Nenhum filme cadastrado ainda</h3>';
        } else {
            filmes.forEach(filme => {
                catalogo.innerHTML += `
                    <div class="card">
                        <img src="${filme.url_imagem || 'https://via.placeholder.com/180x260'}" alt="${filme.titulo}">
                        <h3>${filme.titulo}</h3>
                        <button class="registrar">Assistir</button>
                    </div>
                `;
            });
        }

        msg.textContent = "";

    } catch (err) {
        console.error("ERRO COMPLETO:", err);
        msg.textContent = "Erro: " + err.message;
        msg.style.color = "red";
        boasvindas.textContent = "Falha ao carregar";
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    window.location.href = 'index.html';
}