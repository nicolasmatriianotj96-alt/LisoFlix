const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// CORS PRIMEIRO
app.use(cors({
    origin: 'https://liso-flix.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json());

const SECRET = "lisoflix_secret";

// Login
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === "admin@site.com" && senha === "123456") {
        const token = jwt.sign({ usuario }, SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }
    return res.status(401).json({ message: "Login inválido" });
});

// Auth middleware
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

// Rota filmes
app.get("/auth/filmes", auth, (req, res) => {
    const filmes = [
        { id: 1, titulo: "Batman", capa: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 2, titulo: "Free Guy", capa: "https://image.tmdb.org/t/p/w500/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" },
        { id: 3, titulo: "Dr. Strange", capa: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" }
    ];
    res.json(filmes);
});

app.get("/", (req, res) => res.send("API OK"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log("Servidor rodando na porta", PORT));