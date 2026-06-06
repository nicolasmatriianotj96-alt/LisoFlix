const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // mantive bcryptjs como estava
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

app.use(cors({
    origin: 'https://liso-flix.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const SECRET = process.env.JWT_SECRET || 'chave_teste_123';

app.get("/", (req, res) => res.send("API OK"));

app.post("/login", async (req, res) => {
    console.log("Recebi login:", req.body);
    const { usuario, email, senha } = req.body;
    const login = usuario || email;

    if (!login ||!senha) {
        return res.status(400).json({ mensagem: "Preencha email/usuário e senha" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1 OR usuario = $1",
            [login]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ mensagem: "Usuário não encontrado" });
        }

        const user = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha errada" });
        }

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
        res.json({
            mensagem: "Login realizado",
            token,
            nome: user.usuario
        });
    } catch (err) {
        console.error("ERRO LOGIN:", err);
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

app.post("/cadastro", async (req, res) => {
    console.log("Recebi cadastro:", req.body);
    const { nome, usuario, email, senha } = req.body;
    if (!usuario ||!email ||!senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

     if (senha.length < 8) {
        return res.status(400).json({ mensagem: "Senha precisa ter mínimo 8 caracteres" });
     }

     if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ mensagem: "Email inválido. Use formato: nome@email.com" });
}
}

    try {
        const existe = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1 OR usuario = $2",
            [email, usuario]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ mensagem: "Usuário ou email já cadastrado" });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await pool.query(
            "INSERT INTO usuarios (usuario, email, senha) VALUES ($1, $2, $3)",
            [usuario, email, senhaHash]
        );

        res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.error("ERRO CADASTRO:", err);
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

app.get("/filmes", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, titulo, url_imagem, url_trailer FROM filmes ORDER BY id DESC");
    } catch (erro) {
        console.error('ERRO FILMES:', erro);
        res.status(500).json({ mensagem: "Erro ao buscar filmes" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));