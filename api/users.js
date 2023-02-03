/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = [];
// POST /api/users/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
        if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' });
    }
  
         if (password.length < 8) {
        return res.status(400).send({ error: 'Password must be at least 8 characters' });
    }
  
    const existingUser = users.find(user => user.username === username);
         if (existingUser) {
        return res.status(400).send({ error: 'Username already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    users.push(user);
    
    res.send({ message: 'User created successfully' });
  });
      
// POST /api/users/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
        if (!username || !password) {
        return res.status(400).send({ error: 'Username and password are required' });
    }
  
    const user = users.find(user => user.username === username);
        if (!user) {
        return res.status(400).send({ error: 'User not found' });
    }
  
    const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
        return res.status(400).send({ error: 'Incorrect password' });
    }
  
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    res.send({ user, token });
  });
// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
