require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
    origin: 'https://liso-flix.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, async () => {
    console.log(`Servidor Rodando na porta ${PORT}`);
    
    // Cria tabela só depois que servidor subir
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('Tabela usuarios OK');
    } catch (err) {
        console.error('Erro ao criar tabela:', err.message);
    }
});