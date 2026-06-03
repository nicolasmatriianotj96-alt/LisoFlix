const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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