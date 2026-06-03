const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const fs = require('fs');
const sql = fs.readFileSync('./database.sql').toString();
db.query(sql).then(() => console.log('Tabelas verificadas')).catch(console.error);

// 1. LOG de todas requisições - pra ver no Render se tá chegando
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Origin: ${req.headers.origin || 'sem origin'}`);
    next();
});

// 2. CORS MANUAL - responde OPTIONS antes de tudo
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Responde preflight imediatamente
    if (req.method === 'OPTIONS') {
        console.log('Respondendo OPTIONS preflight');
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// 3. FRONTEND estático
app.use(express.static(path.join(__dirname, "../Frontend/public")));
app.use("/private", express.static(path.join(__dirname, "../Frontend/private")));

// 4. ROTAS
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const verificarToken = require("./middleware/auth");
app.get("/painel", verificarToken, (req, res) => {
    res.json({ mensagem: "Acesso autorizado", usuario: req.usuario });
});

// 5. Rota teste
app.get('/', (req, res) => {
    res.json({ status: 'Backend online', port: process.env.PORT, time: new Date().toISOString() });
});

// 6. Tratamento de erro - pra não crashar sem log
app.use((err, req, res, next) => {
    console.error('ERRO NO SERVIDOR:', err);
    res.status(500).json({ error: 'Erro interno', details: err.message });
});

// 7. SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Rodando na porta ${PORT}`);
});