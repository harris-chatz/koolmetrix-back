const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database('./NodeSql.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            address TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Table creation error: " + err.message);
            }
        });
    }
});

// CRUD Routes

// Create a new user
app.post('/users', (req, res) => {
    const { name, email, address } = req.body;
    const sql = 'INSERT INTO users (name, email, address) VALUES (?, ?, ?)';
    db.run(sql, [name, email, address], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, name, email, address });
        }
    });
});

// READ ALL USERS
app.get('/users', cors(), (req, res) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ users: rows });
        }
    });
});

// READ BY ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json({ user: row });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

// UPDATE BY ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, address } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ?, address = ? WHERE id = ?';
    db.run(sql, [name, email, address, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json({ message: "User updated successfully" });
        }
    });
});

// DELETE BY ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json({ message: "User deleted successfully" });
        }
    });
});

// START SERVER
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})
