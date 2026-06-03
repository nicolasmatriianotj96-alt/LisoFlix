const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    family: 4
});

pool.query('SELECT 1')
    .then(() => console.log('DB conectado'))
    .catch(e => console.log('Erro no banco:', e.message));

module.exports = pool;