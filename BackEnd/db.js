const { Pool } = require("pg");

console.log("DATABASE_URL lida pelo db.js:", process.env.DATABASE_URL)

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

module.exports = pool

require("dotenv").config();

const db = new Pool({

    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    },

    family: 4

});

db.connect()
    .then(() => {

        console.log("Supabase conectado");

    })
    .catch((err) => {

        console.log("Erro no banco:", err);

    });

module.exports = db;