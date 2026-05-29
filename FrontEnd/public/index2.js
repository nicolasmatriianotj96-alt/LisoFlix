async function registrar(){
    const usuario = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem"); // move pra cima

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailValido.test(email)){
        mensagem.innerText = "Email invalido";
        return;
    }

    if(!usuario || !senha){
        mensagem.innerText = "Preencha todos os campos";
        return;
    }

    try{
        const resposta = await fetch(
            "https://lisoflix-backend.onrender.com/auth/register",
            {
                method:"POST",
                headers:{ "Content-Type":"application/json" },
                body:JSON.stringify({ usuario, email, senha })
            }
        );

        const dados = await resposta.json(); // lê só 1 vez

        if(resposta.ok){        
            mensagem.innerText = "Cadastro concluído! Redirecionando...";
            document.getElementById("usuario").value = "";
            document.getElementById("email").value = "";
            document.getElementById("senha").value = "";
            
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 1500);
        } else {
            mensagem.innerText = dados.mensagem || "Erro ao cadastrar";
        }

    } catch(erro){
        console.log(erro);
        mensagem.innerText = "Erro no servidor. Tente novamente.";
    }
}