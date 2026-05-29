const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

console.log("Auth routes carregadas");


// REGISTRO
router.post("/register", async (req, res) => {

    const { usuario, email, senha } = req.body;

    try {

        const hash = await bcrypt.hash(senha, 10);

        await db.query(

            "INSERT INTO usuarios (usuario, email, senha) VALUES ($1, $2, $3)",

            [usuario, email, hash]

        );

        res.json({

            mensagem: "Usuário criado"

        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({

            mensagem: "Erro ao criar usuário"

        });

    }

});


// LOGIN
router.post("/login", async (req, res) => {

    const { email, senha } = req.body;
    console.log(email);
    console.log(senha);

    try {

        const result = await db.query(

            "SELECT * FROM usuarios WHERE email = $1",

            [email]

        );
        console.log(result.rows);

        if (result.rows.length === 0) {

            return res.status(401).json({

                mensagem: "Usuário não existe"

            });

        }

        const usuarioBanco = result.rows[0];

        const senhaValida = await bcrypt.compare(

            senha,
            usuarioBanco.senha

        );

        if (!senhaValida) {

            return res.status(401).json({

                mensagem: "Senha incorreta"

            });

        }

        const token = jwt.sign(

            {

                id: usuarioBanco.id,
                email: usuarioBanco.email

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );

        res.json({

            mensagem: "Login realizado",
            token

        });

    } catch (erro) {

    console.log(erro);

    if (erro.code === "23505") {

        return res.status(400).json({
            mensagem: "Usuário ou email já existe"
        });

    }

    res.status(500).json({
        mensagem: "Erro no servidor"
    });

}

});

router.get("/filmes", async (req, res) => {

    try {

        const result = await db.query(

            "SELECT * FROM filmes"

        );

        res.json(result.rows);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({

            mensagem: "Erro ao buscar filmes"

        });

    }

});

module.exports = router;