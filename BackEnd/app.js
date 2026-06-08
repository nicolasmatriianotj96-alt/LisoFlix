const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const multer = require("multer");

const app = express();

app.use(express.json());

// CORS
app.use(cors({
    origin: 'https://liso-flix.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


// Configuração do banco
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta_mudar_depois';

// Middleware auth
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ mensagem: "Token não enviado" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ mensagem: "Token inválido" });
    }
}

// Multer em memória - não salva arquivo no disco
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas'));
        }
    }
});

// ROTAS DE AUTH
app.post("/cadastro", async (req, res) => {
    const { usuario, email, senha } = req.body;
    if (!usuario ||!email ||!senha) return res.status(400).json({ mensagem: "Preencha todos os campos" });
    if (senha.length < 8) return res.status(400).json({ mensagem: "Senha precisa ter mínimo 8 caracteres" });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ mensagem: "Email inválido" });

    try {
        const hash = await bcrypt.hash(senha, 10);
        const result = await pool.query(
            "INSERT INTO usuarios (usuario, email, senha) VALUES ($1, $2, $3) RETURNING id, usuario, email",
            [usuario, email, hash]
        );
        const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, nome: usuario });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ mensagem: "Email ou usuário já cadastrado" });
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

app.post("/login", async (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario ||!senha) return res.status(400).json({ mensagem: "Preencha todos os campos" });

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario]);
        if (result.rows.length === 0) return res.status(400).json({ mensagem: "Usuário ou senha incorretos" });

        const user = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) return res.status(400).json({ mensagem: "Usuário ou senha incorretos" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, nome: user.usuario });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

// ROTAS PERFIL
app.get("/usuario", auth, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, usuario, email, foto_url FROM usuarios WHERE id = $1",
            [req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ mensagem: "Usuário não encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});

app.put("/usuario", auth, async (req, res) => {
    const { usuario, email } = req.body;
    if (!usuario ||!email) return res.status(400).json({ mensagem: "Preencha todos os campos" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ mensagem: "Email inválido" });

    try {
        const existe = await pool.query("SELECT id FROM usuarios WHERE email = $1 AND id!= $2", [email, req.user.id]);
        if (existe.rows.length > 0) return res.status(400).json({ mensagem: "Este email já está em uso" });

        await pool.query("UPDATE usuarios SET usuario = $1, email = $2 WHERE id = $3", [usuario, email, req.user.id]);
        res.json({ mensagem: "Perfil atualizado com sucesso" });
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao atualizar" });
    }
});

// ROTA UPLOAD FOTO - VERSÃO BASE64 FUNCIONA NO RENDER
app.post("/upload-foto", auth, upload.single('foto'), async (req, res) => {
    if (!req.file) return res.status(400).json({ mensagem: "Nenhuma foto enviada" });

    try {
        const base64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        const fotoUrl = `data:${mimeType};base64,${base64}`;

        await pool.query("UPDATE usuarios SET foto_url = $1 WHERE id = $2", [fotoUrl, req.user.id]);
        res.json({ mensagem: "Foto atualizada", foto_url: fotoUrl });
    } catch (err) {
        console.error("ERRO UPLOAD:", err);
        res.status(500).json({ mensagem: "Erro ao salvar foto" });
    }
});

// ROTA FILMES
// ROTA FILMES - pública, catálogo não precisa login
app.get("/filmes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM filmes ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ mensagem: "Erro ao buscar filmes" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));