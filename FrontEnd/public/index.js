const API_URL = 'https://lisoflix-g5ie.onrender.com';

async function login() {
    const login = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;
    const msg = document.getElementById('mensagem');

    if (!login ||!senha) {
        msg.textContent = "Preencha email/usuário e senha";
        msg.style.color = "red";
        return;
    }

    msg.textContent = "Entrando...";
    msg.style.color = "white";

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: login, email: login, senha })
        });

        const data = await res.json();
        console.log('Resposta:', data);

        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("nome", data.nome);
            msg.textContent = "Login ok! Redirecionando...";
            msg.style.color = "#46d369";
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            msg.textContent = data.mensagem;
            msg.style.color = "red";
        }
    } catch (err) {
        msg.textContent = "Erro de conexão com servidor";
        msg.style.color = "red";
        console.error(err);
    }
}