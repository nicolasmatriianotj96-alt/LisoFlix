const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./db'); // teu db.js atual

const app = express();

app.use(cors({
    origin: 'https://liso-flix.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "lisoflix_secret";

// Cria tabela se não existir - roda 1x no start
pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// CADASTRO
app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome ||!email ||!senha) {
        return res.status(400).json({ message: "Preencha todos os campos" });
    }
    if (senha.length < 8) {
        return res.status(400).json({ message: "Senha precisa ter 8+ caracteres" });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);

        const result = await pool.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome",
            [nome, email, hashSenha]
        );

        res.status(201).json({ message: "Usuário criado com sucesso!", usuario: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') { // erro unique do Postgres
            return res.status(409).json({ message: "Email já cadastrado" });
        }
        console.error(err);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

// LOGIN com bcrypt
app.post("/login", async (req, res) => {
    const { usuario, senha } = req.body; // usuario = email

    if (!usuario ||!senha) {
        return res.status(400).json({ message: "Preencha email e senha" });
    }

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [usuario]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        // Compara senha digitada com hash do banco
        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, nome: user.nome },
            SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, nome: user.nome });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro no servidor" });
    }
});

// Auth middleware igual antes
function auth(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.sendStatus(403);
    try {
        jwt.verify(token, SECRET);
        next();
    } catch {
        return res.sendStatus(403);
    }
}

app.get("/auth/filmes", auth, (req, res) => {
    res.json([
        { id: 1, titulo: "Batman", capa: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 2, titulo: "Free Guy", capa: "https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" }
    ]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log("Servidor rodando", PORT));