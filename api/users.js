/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserDoesNotExistError } = require("../errors");

const { JWT_SECRET } = process.env
const users = [];

// POST /api/users/register
usersRouter.post('/register', async (req, res) => {
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
    

    const token = jwt.sign({ username }, {JWT_SECRET});
    res.send({ message: 'User created successfully', token });
  });
      
// POST /api/users/login
usersRouter.post('/login', async (req, res) => {
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
usersRouter.get('/me', async (req, res, next) => {
    try {
        if (!req.user){
            next({
                name: "Authorization error", 
                message: "You must be logged in to perform the task"
            });
        }else{
            res.send(req.user);
        }
    } catch ({name, message}) {
        next({name, message})
    }
}
)





// GET /api/users/:username/routines

module.exports = usersRouter;
