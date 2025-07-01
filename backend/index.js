require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// Configuração do banco de dados PostgreSQL
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors({
    origin: "https://biourb.vercel.app",
    credentials: true
}));
app.use(express.json());

// Conectar ao banco de dados
db.connect()
    .then(() => console.log("Conexão com o banco de dados bem-sucedida"))
    .catch(err => console.error("Erro ao conectar ao banco de dados:", err.message));

// Rota para registrar usuário
app.post("/register", async (req, res) => {
    const { cpf, name, email, password } = req.body;

    try {
        const userCheck = await db.query("SELECT * FROM usuario WHERE email = $1", [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ msg: "Email já cadastrado" });
        }

        const hash = await bcrypt.hash(password, saltRounds);

        await db.query(
            "INSERT INTO usuario (cpf, nome, email, senha) VALUES ($1, $2, $3, $4)",
            [cpf, name, email, hash]
        );

        res.status(201).json({ msg: "Usuário cadastrado com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCheck = await db.query("SELECT * FROM usuario WHERE email = $1", [email]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ msg: "Usuário não registrado!" });
        }

        const user = userCheck.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.senha);

        if (isPasswordValid) {
            const jwt = require("jsonwebtoken");
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });


            res.json({
                msg: "Usuário logado",
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    isAdmin: user.is_admin,
                },
                token,
            });
        } else {
            res.status(401).json({ msg: "Senha incorreta" });
        }
    } catch (err) {
        console.error("Erro no login:", err.message);  // Logando o erro no console
        res.status(500).json({ error: "Erro interno no servidor", details: err.message });
    }
});


// Rota para cadastrar árvore (com base no ID do usuário)
app.post("/trees", async (req, res) => {
    const { treeName, lifecondition, location, plantingDate, usuario_id } = req.body;

    if (!usuario_id || !treeName || !lifecondition || !location || !plantingDate) {
        return res.status(400).json({ msg: "Por favor, forneça todos os campos necessários." });
    }

    try {
        const result = await db.query(
            `INSERT INTO arvore (nome_cientifico, data_plantio, estado_saude, localizacao, usuario_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [treeName, plantingDate, lifecondition, location, usuario_id]
        );
        res.status(201).json({ msg: "Árvore registrada com sucesso!", insertedId: result.rows[0].id });
    } catch (err) {
        console.error("Erro ao registrar árvore:", err); // Log de erro
        res.status(500).json({ error: err.message });
    }
});

// Rota para listar árvores
app.get("/trees", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                arvore.id, 
                arvore.nome_cientifico, 
                arvore.data_plantio, 
                arvore.estado_saude, 
                arvore.localizacao,
                arvore.usuario_id,
                usuario.nome AS nome_registrante
            FROM arvore
            JOIN usuario ON arvore.usuario_id = usuario.id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Atualizar árvore
app.put("/trees/:id", async (req, res) => {
    const { id } = req.params;
    const { treeName, lifecondition, location, plantingDate } = req.body;

    if (!treeName || !lifecondition || !location || !plantingDate) {
        return res.status(400).json({ msg: "Todos os campos são obrigatórios." });
    }

    try {
        await db.query(
            `UPDATE arvore
             SET nome_cientifico = $1, data_plantio = $2, estado_saude = $3, localizacao = $4
             WHERE id = $5`,
            [treeName, plantingDate, lifecondition, location, id]
        );

        res.json({ msg: "Árvore atualizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deletar árvore
app.delete("/trees/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM arvore WHERE id = $1", [id]);
        res.json({ msg: "Árvore excluída com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});