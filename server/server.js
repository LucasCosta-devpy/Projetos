const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express(); // Inicializa a aplicação Express
const PORT = 3000; // Defina a porta em que o servidor será executado

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: "junction.proxy.rlwy.net",
    user: "root",
    password: "kjkABMlboSpAUzpBheknHOWfBZyHuSPe",
    database: "railway",
    port: 38492
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para obter projetos
app.get('/api/projetos', (req, res) => {
    db.query('SELECT * FROM projetos', (err, results) => {
        if (err) {
            console.error('Erro ao buscar projetos:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Rota para adicionar projeto
app.post('/api/projetos', (req, res) => {
    const { imageUrl, videoUrl, description, author } = req.body;
    
    // Simulando uma validação simples
    if (!imageUrl || !videoUrl || !description || !author) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const query = 'INSERT INTO projetos (imageUrl, videoUrl, description, author) VALUES (?, ?, ?, ?)';
    db.query(query, [imageUrl, videoUrl, description, author], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar projeto:', err);
            return res.status(500).send(err);
        }
        res.status(201).json({ id: result.insertId, imageUrl, videoUrl, description, author });
    });
});

// Rota para deletar projeto
app.delete('/api/projetos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM projetos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar projeto:', err);
            return res.status(500).send(err);
        }
        res.sendStatus(204);
    });
});

// Rota para obter detalhes de um projeto
app.get('/api/projetos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM projetos WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send(err || 'Projeto não encontrado');
        }
        res.json(results[0]); // Retorna o primeiro (e único) projeto
    });
});

// Rota para atualizar um projeto
app.put('/api/projetos/:id', (req, res) => {
    const { id } = req.params;
    const { imageUrl, videoUrl, description, author } = req.body;
    const query = 'UPDATE projetos SET imageUrl = ?, videoUrl = ?, description = ?, author = ? WHERE id = ?';
    db.query(query, [imageUrl, videoUrl, description, author, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.sendStatus(204); // Sucesso, mas não retorna conteúdo
    });
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
