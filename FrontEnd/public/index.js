async function login() {
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const mensagem = document.getElementById("mensagem");
    const btn = document.querySelector('button[onclick="login()"]'); // pega o botao

    // Validacao do email
    if (!email.value.includes('@') || !email.value.includes('.')) {
        mensagem.innerText = 'Digite um email valido';
        return;
    }

    if (senha.value.length < 6) {
        mensagem.innerText = 'Senha precisa ter 8 ou mais caracteres';
        return;
    }

    btn.disabled = true;
    btn.innerText = 'Carregando...';
    mensagem.innerText = '';

    try {
        // 1. REMOVIDO console.log(email.value) e console.log(senha.value)
        
        const resposta = await fetch(
            "https://lisoflix-backend.onrender.com/auth/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.value,
                    senha: senha.value
                })
                // 2. Envia email e senha pro backend validar
            }
        );

        const dados = await resposta.json();
        // 3. Pega a resposta: se deu certo vem {token: "..."}

        if (resposta.ok) {
            localStorage.setItem("token", dados.token);
            // 4. Salva o token no navegador. É a "chave" pra acessar as outras páginas

            mensagem.innerText = "Login realizado";
            window.location.href = "/index3.html";
            // 5. Manda pro catálogo

        } else {
            mensagem.innerText = dados.mensagem;
            // 6. Se errou senha, mostra o erro que o backend mandou
        }

    } catch (erro) {
        console.log(erro);
        mensagem.innerText = "Erro no servidor";
    }

    btn.disabled = false;
    btn.innerText = 'Login';
}