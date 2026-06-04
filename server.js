const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

function authPage(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.redirect("/");
    }

    try { 
        jwt.verify(token, SECRET);
        next();
    } catch (err) {
        return res.redirect("/");
    }
}

const app = express();
app.use(cors({
    origin: ['https://liso-flix.versel.app', 'http://localhost:3000'],

    credentials: true
}));
app.use(express.json());

const path = require("path");

app.use(express.static(path.join(__dirname, "frontend/public")));

app.get("/private/index3.html", authPage, (req, res) => {
    res.sendFile(__dirname + "/frontend/private/index3.html");
});



const SECRET = "lisoflix_secret";

const user = {
    email: "admin@site.com",
    password: "123456"
};

app.post("/login", (req, res) => {

    console.log(req.body);

    const { usuario, senha } = req.body;

    if (usuario === user.email && senha === user.password) {

        const token = jwt.sign(
            { usuario },
            SECRET,
            { expiresIn: "1h" }
        );

        return res.json({ token });
    }

    return res.status(401).json({ message: "Login inválido" });
});

function auth(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.sendStatus(403);

    try {
        jwt.verify(token, SECRET);
        next();
    } catch {
        return res.sendStatus(403);
    }
}

app.get("/private", auth, (req, res) => {
    res.json({ message: "Voce esta logado" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));