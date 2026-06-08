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
        console.log("Status /filmes:", res.status);

        if (!res.ok) {
            msg.textContent = `Erro ${res.status}: Faça login de novo`;
            msg.style.color = "red";
            localStorage.clear();
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        let filmes = await res.json();
        console.log("Filmes recebidos:", filmes);

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

        if (filmes.length === 0) {
            filmes = filmesLocais;
        } else {
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
    const isLocal = filme.id === 9991 || filme.id === 9992;

    catalogo.innerHTML += `
        <div class="card">
            <img src="${img}" alt="${filme.titulo}">
            <h3>${filme.titulo}</h3>
            <div style="display:flex; gap:10px; padding:10px;">
                <button class="registrar" onclick="abrirTrailer('${trailer || ''}')" ${!trailer? 'disabled style="opacity:0.5"' : ''}>Assistir</button>
                ${!isLocal? `<button class="registrar" onclick="toggleFavorito(${filme.id}, this)" style="background:#e50914;">♥</button>` : ''}
            </div>
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
    if (!urlYoutube) return;
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

async function toggleFavorito(filme_id, btn) {
    const token = localStorage.getItem('token');
    const favoritado = btn.dataset.fav === 'true';

    try {
        const res = await fetch(`${API_URL}/favoritar${favoritado? '/' + filme_id : ''}`, {
            method: favoritado? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: favoritado? null : JSON.stringify({ filme_id })
        });

        const data = await res.json();
        btn.dataset.fav =!favoritado;
        btn.style.background = favoritado? '#e50914' : '#46d369';
        btn.textContent = favoritado? '♥' : '✓';

    } catch (err) {
        console.error(err);
    }
}

async function mostrarAba(aba) {
    document.getElementById('catalogo').style.display = aba === 'catalogo' ? 'grid' : 'none';
    document.getElementById('favoritos').style.display = aba === 'favoritos' ? 'grid' : 'none';
    
    document.getElementById('btnCatalogo').style.background = aba === 'catalogo' ? '#e50914' : '#333';
    document.getElementById('btnFavoritos').style.background = aba === 'favoritos' ? '#e50914' : '#333';

    if (aba === 'favoritos') {
        carregarFavoritos();
    }
}

async function carregarFavoritos() {
    const token = localStorage.getItem('token');
    const container = document.getElementById('favoritos');
    
    try {
        const res = await fetch(`${API_URL}/favoritos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const filmes = await res.json();
        
        if (filmes.length === 0) {
            container.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Você ainda não favoritou nenhum filme</p>';
            return;
        }
        
        container.innerHTML = filmes.map(filme => {
            const img = filme.imagem_url;
            const trailer = filme.url_trailer;
            return `
                <div class="card">
                    <img src="${img}" alt="${filme.titulo}">
                    <h3>${filme.titulo}</h3>
                    <div style="display:flex; gap:10px; padding:10px;">
                        <button class="registrar" onclick="abrirTrailer('${trailer || ''}')" ${!trailer? 'disabled style="opacity:0.5"' : ''}>Assistir</button>
                        <button class="registrar" onclick="toggleFavorito(${filme.id}, this)" style="background:#46d369;" data-fav="true">✓</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
    }
}