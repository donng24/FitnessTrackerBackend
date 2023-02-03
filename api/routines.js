const express = require("express");
const { getAllPublicRoutines, createRoutine } = require("../db");
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {
  try {
    const publicRoutines = await getAllPublicRoutines();
    res.send(publicRoutines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
routinesRouter.post("/", async (req, res, next) => {
  const { id } = req.user;
  const { isPublic, name, goal } = req.body;

  try {
    const creatorId = id;
    const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });
    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", async (req, res, next) => {});

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", async (req, res, next) => {});

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
