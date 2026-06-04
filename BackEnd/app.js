require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
const authRoutes = require('./routes/auth');

const app = express();

// CORS - CORRIGIDO
app.use(cors({
    origin: ['https://liso-flix.vercel.app', 'http://localhost:3000'], // corrigi versel -> vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Responde preflight OPTIONS
app.options('*', cors());

app.use(express.json());
app.use('/auth', authRoutes);

const SECRET = process.env.JWT_SECRET || "lisoflix_secret";

// Rota de login
app.post("/login", async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [usuario]);
        const user = result.rows[0];

        if (!user || user.senha !== senha) { // depois troca pra bcrypt
            return res.status(401).json({ message: "Login inválido" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "1h" });
        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ message: "Erro servidor" });
    }
});

// Middleware auth pra rotas protegidas
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

// Rota de filmes - protegida
app.get("/auth/filmes", auth, async (req, res) => {
    try {
        // Exemplo: pega filmes do banco. Troca pela tua query
        const filmes = [
            { id: 1, titulo: "Batman", capa: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
            { id: 2, titulo: "Free Guy", capa: "https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
            { id: 3, titulo: "Dr. Strange", capa: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" }
        ];
        res.json(filmes);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar filmes" });
    }
});

app.get('/', (req, res) => res.send('API OK'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Servidor Rodando na porta ${PORT}`);
    
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS usuarios (id SERIAL PRIMARY KEY, usuario VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL, criado_em TIMESTAMP DEFAULT NOW());`);
        console.log('Tabela usuarios OK');
    } catch (err) {
        console.error('Erro tabela:', err.message);
    }
});

process.on('uncaughtException', (err) => {
    console.error('Erro não tratado:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('Promise rejeitada:', err);
});