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
        // Removi o const token duplicado daqui
        const res = await fetch(`${API_URL}/filmes`);         
        

        console.log("Status /filmes:", res.status); // Log pra debugar

        if (!res.ok) {
            msg.textContent = `Erro ${res.status}: Faça login de novo`;
            msg.style.color = "red";
            localStorage.clear();
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        let filmes = await res.json();
        console.log("Filmes recebidos:", filmes);

        // Tuas imagens locais
        const filmesLocais = [
            {
                id: 9991,
                titulo: 'A Origem',
                url_imagem: '/imagens/origem.jpg',
                url_trailer: 'https://youtube.com/watch?v=YoHD9XEInc0'
            },
            {
                id: 9992,
                titulo: 'Alice no País das Maravilhas',
                url_imagem: '/imagens/alice.jpg',
                url_trailer: 'https://youtube.com/watch?v=9XEuoFwr24Y'
            }
        ];

        // Se banco vazio, usa só os locais
        if (filmes.length === 0) {
            filmes = filmesLocais;
        } else {
            // Substitui os 2 primeiros do banco pelos locais
            filmes.splice(0, 2,...filmesLocais);
        }

        const catalogo = document.getElementById('catalogo');
        if (!catalogo) {
            console.error("Erro: div #catalogo não encontrada no HTML");
            return;
        }
        catalogo.innerHTML = '';

        filmes.forEach(filme => {
    const img = filme.url_imagem || filme.imagem_url;
    const trailer = filme.url_trailer;
    
    catalogo.innerHTML += `
        <div class="card">
            <img src="${img}" alt="${filme.titulo}">
            <h3>${filme.titulo}</h3>
            <button class="registrar" onclick="abrirTrailer('${trailer || ''}')" ${!trailer ? 'disabled style="opacity:0.5"' : ''}>Assistir</button>
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

function abrirTrailer(urlYoutube) {
    const videoId = urlYoutube.split(/v=|\/be\//)[1].split('&')[0];
    const urlEmbed = `https://www.youtube.com/embed/${videoId}?hl=pt&cc_lang_pref=pt&cc_load_policy=1&autoplay=1&rel=0`;

    document.getElementById('modalTrailer').style.display = 'block';
    document.getElementById('playerTrailer').src = urlEmbed;
}

function fecharTrailer(e) {
    if(e.target.id === 'modalTrailer' || e.target.tagName === 'BUTTON') {
        document.getElementById('playerTrailer').src = '';
        document.getElementById('modalTrailer').style.display = 'none';
    }
}