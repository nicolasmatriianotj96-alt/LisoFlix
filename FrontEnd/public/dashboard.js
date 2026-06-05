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
        
        // Fallback com tuas imagens locais
        const filmesFallback = [
            {
                id: 1,
                titulo: 'A Origem',
                url_imagem: './imagens/origem.jpg'  // usa a imagem que tu baixou
            },
            {
                id: 2,
                titulo: 'Alice no País das Maravilhas',
                url_imagem: './imagens/alice.jpg'   // usa a imagem que tu baixou
            }
        ];

        if (filmes.length === 0) {
            filmes = filmesFallback;
        } else {
            // Se algum filme do banco não tiver imagem, usa local
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
                    <img src="${filme.url_imagem}" alt="${filme.titulo}" onerror="this.src='https://via.placeholder.com/180x270?text=Sem+Imagem'">
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