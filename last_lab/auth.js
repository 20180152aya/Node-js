const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const JWT_SECRET = '6764kgkkgj995959jkkjg446';

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), 
    age: Joi.number().integer().min(13).max(120).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required() 
});

router.post('/register', async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const { name, email, password, age } = req.body;
        const [existing] = await db.execute('SELECT id FROM users WHERE email=?', [email]);
        if (existing.length > 0) return res.status(409).json({ message: 'Email already in use' });
        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, age) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, age]
        );

        res.status(201).json({ 
            user: { id: result.insertId, name, email, age } 
        });

    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        const [rows] = await db.execute('SELECT * FROM users WHERE email=?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Access denied, no token' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied, malformed token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('JWT Error:', err);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email, age, created_at FROM users WHERE id=?', 
            [req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ user: rows[0] });
    } catch (err) {
        console.error('Profile Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
