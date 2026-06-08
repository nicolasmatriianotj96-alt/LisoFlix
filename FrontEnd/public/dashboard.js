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

        // 20 FILMES FALLBACK - só aparece se banco tiver vazio
        const filmesLocais = [
            {id: 1001, titulo: 'Interestelar', url_imagem: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', url_trailer: 'https://youtube.com/watch?v=zSWdZVtXT7E'},
            {id: 1002, titulo: 'Matrix', url_imagem: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', url_trailer: 'https://youtube.com/watch?v=vKQi3bBA1y8'},
            {id: 1003, titulo: 'Oppenheimer', url_imagem: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', url_trailer: 'https://youtube.com/watch?v=8CUaIPGEQXs'},
            {id: 1004, titulo: 'Barbie', url_imagem: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', url_trailer: 'https://youtube.com/watch?v=8zIf0XvoL9Y'},
            {id: 1005, titulo: 'Duna', url_imagem: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', url_trailer: 'https://youtube.com/watch?v=8g18jFHCLXk'},
            {id: 1006, titulo: 'Avatar', url_imagem: 'https://image.tmdb.org/t/p/w500/6dbi2KM0f5bJaeib0Yt1byYxUBb.jpg', url_trailer: 'https://youtube.com/watch?v=5PSNL1qE6VY'},
            {id: 1007, titulo: 'Vingadores Ultimato', url_imagem: 'https://image.tmdb.org/t/p/w500/cezWGskPY5x7GaglTTRN4Fugfb8.jpg', url_trailer: 'https://youtube.com/watch?v=6ZfuNTqbHE8'},
            {id: 1008, titulo: 'Batman', url_imagem: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo4LEMUWPd6JC.jpg', url_trailer: 'https://youtube.com/watch?v=mqqft2x_Aa4'},
            {id: 1009, titulo: 'Cor curingas', url_imagem: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', url_trailer: 'https://youtube.com/watch?v=zAGVQLHvwOY'},
            {id: 1010, titulo: 'Top Gun Maverick', url_imagem: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', url_trailer: 'https://youtube.com/watch?v=qSqVVswa420'},
            {id: 1011, titulo: 'Pantera Negra', url_imagem: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', url_trailer: 'https://youtube.com/watch?v=xjDjIWPwcPU'},
            {id: 1012, titulo: 'Velozes 10', url_imagem: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg', url_trailer: 'https://youtube.com/watch?v=32RAq6JzY-w'},
            {id: 1013, titulo: 'Guardiões 3', url_imagem: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgp55fU9.jpg', url_trailer: 'https://youtube.com/watch?v=u3V5KDhphxg'},
            {id: 1014, titulo: 'Missão Impossível 7', url_imagem: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg', url_trailer: 'https://youtube.com/watch?v=avz06PDqDbM'},
            {id: 1015, titulo: 'Elementos', url_imagem: 'https://image.tmdb.org/t/p/w500/8riWcADI1ekEiBguVB9vkilhiQm.jpg', url_trailer: 'https://youtube.com/watch?v=hXzcyx9V0xw'},
            {id: 1016, titulo: 'Homem-Aranha', url_imagem: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', url_trailer: 'https://youtube.com/watch?v=cqGjhVJWtEA'},
            {id: 1017, titulo: 'John Wick 4', url_imagem: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF4WHa09iI.jpg', url_trailer: 'https://youtube.com/watch?v=qEVUtrk8_B4'},
            {id: 1018, titulo: 'Transformers', url_imagem: 'https://image.tmdb.org/t/p/w500/gJE2z3YPiqgAmEJ36nRaLSWBqsl.jpg', url_trailer: 'https://youtube.com/watch?v=itnqE3MrrRA'},
            {id: 1019, titulo: 'Indiana Jones 5', url_imagem: 'https://image.tmdb.org/t/p/w500/Af4bXE63pVsb2FtbW8uYIyPBadD.jpg', url_trailer: 'https://youtube.com/watch?v=eQwpfVWEy1M'},
            {id: 1020, titulo: 'Sonic 2', url_imagem: 'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg', url_trailer: 'https://youtube.com/watch?v=47jDe-zE3r8'}
        ];

        // Se banco vazio usa os 20 filmes, senão usa só o banco
        if (filmes.length === 0) filmes = filmesLocais;

        const catalogo = document.getElementById('catalogo');
        catalogo.innerHTML = '';

        filmes.forEach(filme => {
            const img = filme.url_imagem || filme.imagem_url;
            const trailer = filme.url_trailer;
            const isLocal = filme.id >= 1001 && filme.id <= 1020;

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