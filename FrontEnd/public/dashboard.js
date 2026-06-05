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
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            throw new Error(`Erro HTTP ${res.status}`);
        }

        let filmes = await res.json();
        
        // Se não tiver filmes ou faltar imagem, usa fallback
        const filmesFallback = [
            {
                id: 1,
                titulo: 'A Origem',
                url_imagem: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg'
            },
            {
                id: 2,
                titulo: 'Alice no País das Maravilhas',
                url_imagem: 'https://m.media-amazon.com/images/MV5BMTY3OTI5NDczNV5BMl5BanBnXkFtZTcwNDUxNzU1OQ@@._V1_.jpg'
            }
        ];

        if (filmes.length === 0) {
            filmes = filmesFallback;
        } else {
            // Preenche imagem faltando
            filmes = filmes.map((f, i) => ({
                ...f,
                url_imagem: f.url_imagem || filmesFallback[i % 2].url_imagem
            }));
        }

        const catalogo = document.getElementById('catalogo');
        catalogo.innerHTML = '';

        filmes.forEach(filme => {
            catalogo.innerHTML += `
                <div class="card">
                    <img src="${filme.url_imagem}" alt="${filme.titulo}" onerror="this.src='https://via.placeholder.com/180x260?text=Sem+Imagem'">
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
        boasvindas.textContent = "Falha ao carregar";
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    window.location.href = 'index.html';
}