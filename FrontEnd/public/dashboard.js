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
        if (!res.ok) {
            msg.textContent = `Erro ${res.status}: Faça login de novo`;
            msg.style.color = "red";
            localStorage.clear();
            setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

        let filmes = await res.json();
        const filmesLocais = [
            {id: 9991, titulo: 'A Origem', url_imagem: '/imagens/origem.jpg', url_trailer: 'https://youtube.com/watch?v=YoHD9XEInc0'},
            {id: 9992, titulo: 'Alice no País das Maravilhas', url_imagem: '/imagens/alice.jpg', url_trailer: 'https://youtube.com/watch?v=9XEuoFwr24Y'}
        ];

        if (filmes.length === 0) filmes = filmesLocais;
        else filmes.splice(0, 2,...filmesLocais);

        const catalogo = document.getElementById('catalogo');
        catalogo.innerHTML = '';

        filmes.forEach(filme => {
            const img = filme.url_imagem || filme.imagem_url;
            const trailer = filme.url_trailer;
            const isLocal = filme.id === 9991 || filme.id === 9992;

            catalogo.innerHTML += `
                <div class="card">
                    <img src="${img}" alt="${filme.titulo}">
                    <h3>${filme.titulo}</h3>
                    <div class="card-botoes">
                        <button class="registrar" onclick="abrirTrailer('${trailer || ''}')" ${!trailer? 'disabled' : ''}>Assistir</button>
                        ${!isLocal? `<button class="registrar btn-fav" onclick="toggleFavorito(${filme.id}, this)">♥</button>` : ''}
                    </div>
                </div>
            `;
        });

        const resFav = await fetch(`${API_URL}/favoritos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const favs = await resFav.json();
        const idsFavoritos = favs.map(f => f.id);

        document.querySelectorAll('.btn-fav').forEach(btn => {
            const match = btn.getAttribute('onclick').match(/toggleFavorito\((\d+),/);
            const id = match? Number(match[1]) : null;
            if (id && idsFavoritos.includes(id)) {
                btn.dataset.fav = 'true';
                btn.style.background = '#46d369';
                btn.textContent = '✓';
            }
        });

        msg.textContent = "";
    } catch (err) {
        console.error("ERRO:", err);
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
    const urlEmbed = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    document.getElementById('modalTrailer').style.display = 'flex';
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
        await fetch(`${API_URL}/favoritar${favoritado? '/' + filme_id : ''}`, {
            method: favoritado? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: favoritado? null : JSON.stringify({ filme_id })
        });

        const novoEstado =!favoritado;
        document.querySelectorAll(`button[onclick*="toggleFavorito(${filme_id},"]`).forEach(b => {
            b.dataset.fav = novoEstado;
            b.style.background = novoEstado? '#46d369' : '#e50914';
            b.textContent = novoEstado? '✓' : '♥';
        });

        if (favoritado && document.getElementById('favoritos').style.display === 'grid') {
            btn.closest('.card').remove();
            document.getElementById('countFav').textContent = document.querySelectorAll('#favoritos.card').length;
        }
    } catch (err) {
        console.error(err);
    }
}

async function mostrarAba(aba) {
    document.getElementById('catalogo').style.display = aba === 'catalogo'? 'grid' : 'none';
    document.getElementById('favoritos').style.display = aba === 'favoritos'? 'grid' : 'none';
    document.getElementById('btnCatalogo').style.background = aba === 'catalogo'? '#e50914' : '#333';
    document.getElementById('btnFavoritos').style.background = aba === 'favoritos'? '#e50914' : '#333';
    if (aba === 'favoritos') carregarFavoritos();
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
            document.getElementById('countFav').textContent = '0';
            return;
        }

        container.innerHTML = filmes.map(filme => `
            <div class="card">
                <img src="${filme.imagem_url}" alt="${filme.titulo}">
                <h3>${filme.titulo}</h3>
                <div class="card-botoes">
                    <button class="registrar" onclick="abrirTrailer('${filme.url_trailer || ''}')" ${!filme.url_trailer? 'disabled' : ''}>Assistir</button>
                    <button class="registrar btn-fav" onclick="toggleFavorito(${filme.id}, this)" style="background:#46d369;" data-fav="true">✓</button>
                </div>
            </div>
        `).join('');

        document.getElementById('countFav').textContent = filmes.length;
    } catch (err) {
        container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:red;">Erro ao carregar favoritos</p>';
    }
}

function filtrarFilmes() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const abaAtiva = document.getElementById('catalogo').style.display === 'grid'? 'catalogo' : 'favoritos';
    document.querySelectorAll(`#${abaAtiva}.card`).forEach(card => {
        const titulo = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = titulo.includes(termo)? 'flex' : 'none';
    });
}

function abrirPerfil() {
    document.getElementById('novoNome').value = localStorage.getItem('nome');
    document.getElementById('modalPerfil').style.display = 'flex';
}

function fecharPerfil(e) {
    if(e.target.id === 'modalPerfil' || e.target.tagName === 'BUTTON') {
        document.getElementById('modalPerfil').style.display = 'none';
        document.getElementById('msgPerfil').textContent = '';
    }
}

async function salvarPerfil() {
    const token = localStorage.getItem('token');
    const nome = document.getElementById('novoNome').value;
    const senha = document.getElementById('novaSenha').value;
    const msg = document.getElementById('msgPerfil');

    if (!nome) {
        msg.textContent = 'Digite um nome';
        msg.style.color = 'red';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/perfil`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome, senha })
        });

        if (res.ok) {
            localStorage.setItem('nome', nome);
            document.getElementById('boasvindas').textContent = `Olá, ${nome}!`;
            msg.textContent = 'Perfil atualizado!';
            msg.style.color = '#46d369';
            setTimeout(() => fecharPerfil({target: document.getElementById('modalPerfil')}), 1500);
        } else {
            msg.textContent = 'Erro ao atualizar';
            msg.style.color = 'red';
        }
    } catch (err) {
        msg.textContent = 'Erro: ' + err.message;
        msg.style.color = 'red';
    }
}