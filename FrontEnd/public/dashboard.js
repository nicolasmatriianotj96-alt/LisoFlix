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
        
        // URLs do TMDB que funcionam sem baixar
        const filmesFallback = [
            {
                id: 1,
                titulo: 'A Origem',
                url_imagem: 'https://image.tmdb.org/t/p/w500/edv5CZvsDJNuEwwkgmAXJffDglZ.jpg'
            },
            {
                id: 2,
                titulo: 'Alice no País das Maravilhas',
                url_imagem: 'https://image.tmdb.org/t/p/w500/6XTb2QZBz5LVE5hKzrvUF6XOs7s.jpg'
            }
        ];

        if (filmes.length === 0) {
            filmes = filmesFallback;
        } else {
            // Se faltar imagem, preenche com fallback
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
                    <img src="${filme.url_imagem}" alt="${filme.titulo}" onerror="this.src='https://via.placeholder.com/180x270?text=${encodeURIComponent(filme.titulo)}'">
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