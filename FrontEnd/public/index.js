const form = document.getElementById('form-login');
const msg = document.getElementById('mensagem');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        msg.textContent = "Preencha email e senha";
        msg.style.color = "red";
        return;
    }

    msg.textContent = "Entrando...";
    msg.style.color = "white";

    try {
        const res = await fetch('https://lisoflix-g5ie.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await res.json();

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
});