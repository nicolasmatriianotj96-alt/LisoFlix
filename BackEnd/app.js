const express = require("express");
const cors = require("cors");
const path = require("path");
const verificarToken = require("./middleware/auth");

require("dotenv").config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// FRONTEND estático
app.use(express.static(path.join(__dirname, "../Frontend/public")));
app.use("/private", express.static(path.join(__dirname, "../Frontend/private")));

// ROTAS
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.get("/painel", verificarToken, (req, res) => {
    res.json({ mensagem: "Acesso autorizado", usuario: req.usuario });
});

app.get('/', (req, res) => {
    res.json({ status: 'Backend online', port: process.env.PORT });
});

// SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Rodando na porta ${PORT}`);
});