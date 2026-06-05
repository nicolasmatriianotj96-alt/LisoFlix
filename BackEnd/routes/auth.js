const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

console.log("Auth routes carregadas");

// REGISTRO
router.post("/register", async (req, res) => {
    console.log('Body recebido:', req.body);

    const { usuario, email, senha } = req.body;

    if (!usuario ||!email ||!senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

    try {
        const hash = await bcrypt.hash(senha, 10);

        const result = await db.query(
            "INSERT INTO usuarios (usuario, email, senha) VALUES ($1, $2, $3) RETURNING id, usuario, email",
            [usuario, email, hash]
        );

        console.log('Usuário criado:', result.rows[0]);
        res.status(201).json({ mensagem: "Usuário criado com sucesso" });

    } catch (erro) {
        console.error('ERRO NO REGISTER:', erro);

        // Erro de email/usuario duplicado Postgres
        if (erro.code === "23505") {
            return res.status(400).json({ mensagem: "Email ou usuário já cadastrado" });
        }

        res.status(500).json({ mensagem: "Erro ao criar usuário: " + erro.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    console.log('Login:', email);

    try {
        const result = await db.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ mensagem: "Usuário não existe" });
        }

        const usuarioBanco = result.rows[0];

        const senhaValida = await bcrypt.compare(senha, usuarioBanco.senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha incorreta" });
        }

        const token = jwt.sign(
            { id: usuarioBanco.id, email: usuarioBanco.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
    mensagem: "Login realizado", 
    token,
    nome: usuarioBanco.usuario
});

    } catch (erro) {
        console.error('ERRO NO LOGIN:', erro);
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

// COLA ISSO ANTES DA ROTA /FILMES, DEPOIS DO LOGIN
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({ mensagem: 'Token faltando' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ mensagem: 'Token inválido' });
    }
}

// SUBSTITUI A ROTA /FILMES INTEIRA POR ESSA
router.get("/filmes", auth, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM filmes");
        res.json(result.rows);
    } catch (erro) {
        console.error('ERRO FILMES:', erro);
        res.status(500).json({ mensagem: "Erro ao buscar filmes" });
    }
});

module.exports = router;