const API_URL = 'https://lisoflix-g5ie.onrender.com';

async function login() {
    // FORÇA valores fixos pra testar
    const login = 'teste@teste.com';
    const senha = '123456';
    const msg = document.getElementById('mensagem');

    const payload = { email: login, senha };
    console.log('PAYLOAD ENVIADO:', JSON.stringify(payload));

    msg.textContent = "Testando...";
    
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Resposta:', data);

        msg.textContent = data.mensagem;
    } catch (err) {
        console.error(err);
    }
}