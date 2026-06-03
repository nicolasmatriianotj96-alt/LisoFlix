// Pega URL do Vercel se existir, senão usa a correta direto
const API_URL = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) 
    ? process.env.NEXT_PUBLIC_API_URL 
    : 'https://lisoflix-g5ie.onrender.com';

async function registrar(){
    const usuario = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

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
        console.log('Enviando para:', API_URL + '/auth/register'); // debug

        const resposta = await fetch(
            API_URL + '/auth/register',
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, email, senha })
            }
        );

        const dados = await resposta.json();

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
        console.log('Erro fetch:', erro);
        mensagem.innerText = "Erro no servidor. Tente novamente.";
    }
}