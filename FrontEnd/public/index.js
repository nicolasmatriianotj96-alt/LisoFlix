async function login() {
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;
    const msg = document.getElementById('mensagem');

    if (!usuario ||!senha) {
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
            body: JSON.stringify({ usuario, senha }) // usuario = email
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            msg.textContent = "Login ok! Redirecionando...";
            msg.style.color = "#46d369";

            setTimeout(() => {
                window.location.href = 'index3.html'; // tua área logada
            }, 1000);
        } else {
            msg.textContent = data.message;
            msg.style.color = "red";
        }
    } catch (err) {
        msg.textContent = "Erro de conexão com servidor";
        msg.style.color = "red";
        console.error(err);
    }
}