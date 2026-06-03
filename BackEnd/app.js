require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
    origin: 'https://liso-flix.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.options('*', cors());
app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('API OK')); // health check pro Render

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Servidor Rodando na porta ${PORT}`);
    
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS usuarios (id SERIAL PRIMARY KEY, usuario VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, senha VARCHAR(255) NOT NULL, criado_em TIMESTAMP DEFAULT NOW());`);
        console.log('Tabela usuarios OK');
    } catch (err) {
        console.error('Erro tabela:', err.message);
        // não dá process.exit aqui, deixa servidor vivo
    }
});

// Evita crash se der erro não tratado
process.on('uncaughtException', (err) => {
    console.error('Erro não tratado:', err);
});
process.on('unhandledRejection', (err) => {
    console.error('Promise rejeitada:', err);
});