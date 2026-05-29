async function registrar(){

    const usuario = document.getElementById("usuario").value;

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;

    const mensagem = document.getElementById("mensagem");

    console.log(usuario);
    console.log(email);
    console.log(senha);

try{
    
    const resposta = await fetch(
        "https://lisoflix-backend.onrender.com/auth/register",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                usuario,
                email,
                senha
            })

        }
    );

    const dados = await resposta.json();

    if(resposta.ok){        
        mensagem.innerText = "Cadastro Concluido!";

        document.getElementById("usuario").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";
    } else {
        const dados = await resposta.json();

mensagem.innerText = dados.mensagem;
    }

}catch(erro){
    mensagem.innerText = "Algo deu muito errado!";
}

    

}
