const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => console.log('DB erro:', err.message));
pool.query('SELECT 1').then(() => console.log('DB conectado')).catch(() => {});

module.exports = pool;