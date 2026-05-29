async function login() {

    const email = document.getElementById("email");

    const senha = document.getElementById("senha");

    const mensagem = document.getElementById("mensagem");

    try {
        console.log(email.value);
console.log(senha.value);

        const resposta = await fetch(
            "https://lisoflix-backend.onrender.com/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                
                body: JSON.stringify({
                    email: email.value,
                    senha: senha.value
                })
            }
        );

        const dados = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem("token", dados.token);

            mensagem.innerText = "Login realizado";
            window.location.href = "/index3.html";

            document.getElementById("email").value = "";

            document.getElementById("senha").value = "";

        } else {

            mensagem.innerText = dados.mensagem;

        }

    } catch (erro) {

    console.log(erro);

    mensagem.innerText = "Erro no servidor";

}
}
   



 
