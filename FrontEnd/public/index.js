async function login() {

    const usuario = document.getElementById("usuario");

    const senha = document.getElementById("senha");

    const mensagem = document.getElementById("mensagem");

    try {

        const resposta = await fetch(
            "http://localhost:3000/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                
                body: JSON.stringify({
                    usuario: usuario.value,
                    senha: senha.value
                })
            }
        );

        const dados = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem("token", dados.token);

            mensagem.innerText = "Login realizado";
            window.location.href = "../private/index3.html";

            document.getElementById("usuario").value = "";

            document.getElementById("senha").value = "";

        } else {

            mensagem.innerText = dados.mensagem;

        }

    } catch (erro) {
    console.log(erro);
    mensagem.innerText = "Erro no servidor";
}
   

}

 