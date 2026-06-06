async function registrar() {
    // Pega os elementos primeiro pra não quebrar se não existir
    const usuarioEl = document.getElementById('usuario');
    const emailEl = document.getElementById('email');
    const senhaEl = document.getElementById('senha');
    const msg = document.getElementById('mensagem');

    // Check se os elementos existem na página
    if (!usuarioEl || !emailEl || !senhaEl || !msg) {
        console.error("Erro: Um dos campos não foi encontrado. Confere os id no HTML");
        alert("Erro interno: campos não encontrados");
        return;
    }

    const usuario = usuarioEl.value.trim();
    const email = emailEl.value.trim();
    const senha = senhaEl.value;

    // Validação frontend
    if (!usuario || !email || !senha) {
        msg.textContent = "Preencha todos os campos";
        msg.style.color = "red";
        return;
    }
    if (senha.length < 8) {
        msg.textContent = "Senha precisa ter 8+ caracteres";
        msg.style.color = "red";
        return;
    }

    msg.textContent = "Cadastrando...";
    msg.style.color = "white";

    try {
        console.log("Enviando:", { usuario, email, senha }); // log antes do fetch

        const res = await fetch('https://lisoflix-g5ie.onrender.com/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, email, senha })
        });

        const data = await res.json();
        msg.textContent = data.messagem;
        msg.style.color = res.ok ? '#46d369' : 'red';

        if (res.ok) {
            // Limpa campos
            usuarioEl.value = '';
            emailEl.value = '';
            senhaEl.value = '';
            
            // Redireciona pro login depois de 2s
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    } catch (err) {
        msg.textContent = "Erro de conexão com servidor";
        msg.style.color = "red";
        console.error(err);
    }
}