const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

// CORS liberado pra tudo
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const SECRET = process.env.JWT_SECRET || 'chave_teste_123';

app.get("/", (req, res) => {
    res.send("API OK");
});

app.post("/login", async (req, res) => {
    console.log("Recebi login:", req.body); // pra ver no log
    const { usuario, senha } = req.body;

    if (!usuario ||!senha) {
        return res.status(400).json({ message: "Preencha tudo" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1 OR usuario = $1",
            [usuario]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const user = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: "Senha errada" });
        }

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
        res.json({ token, nome: user.usuario });
    } catch (err) {
        console.error("ERRO LOGIN:", err);
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));.listen(process.env.PORT || 3000);