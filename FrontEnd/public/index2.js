async function registrar() {
    const nome = document.getElementById('usuario').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const msg = document.getElementById('mensagem');

    // Validação frontend
    if (!nome ||!email ||!senha) {
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
        const res = await fetch('https://lisoflix-g5ie.onrender.com/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await res.json();
        msg.textContent = data.message;
        msg.style.color = res.ok? '#46d369' : 'red';

        if (res.ok) {
            // Limpa campos
            document.getElementById('usuario').value = '';
            document.getElementById('email').value = '';
            document.getElementById('senha').value = '';
            
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