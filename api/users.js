/* eslint-disable no-useless-catch */
const jwt = require("jsonwebtoken");
const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");

const { createUser, getUserByUsername, getUser } = require("../db/users");

const {
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db/routines");
const { requireUser } = require("./utils");

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = req.body;
    const _user = await getUserByUsername(newUser.username);
    if (_user) {
      next({
        name: "UserNameExistsError",
        message: `User ${newUser.username} is already taken.`,
      });
      res.status(401);
    } else if (newUser.password.length < 8) {
      res.status(401);
      next({
        name: "PasswordTooShortError",
        message: `Password Too Short!`,
      });
    } else {
      const user = await createUser(newUser);
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.send({
        user: user,
        message: "User created!",
        token: token,
      });
    }
  } catch (error) {
    console.log(error, "got here!");
    next(error);
  }
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401);
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });
    if (user) {
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect.",
      });
    }
  } catch (error) {
    next(error);
  }
});
// GET /api/users/me

usersRouter.get("/me", (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  const user = await getUserByUsername(username);
  try {
    if (!user) {
      next({
        name: "User Doesn't Exist",
        message: "User Doesn't Exist",
      });
    } else if (user.id === req.user.id) {
      const routinesByUser = await getAllRoutinesByUser({ username });
      res.send(routinesByUser);
    } else {
      const publicRoutinesByUser = await getPublicRoutinesByUser({ username });
      res.send(publicRoutinesByUser);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = usersRouter;
