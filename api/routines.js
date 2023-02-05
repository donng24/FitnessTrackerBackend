const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
} = require("../db");
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
routinesRouter.delete("/:routineId", async (req, res, next) => {
  try {
    const { routineId } = req.params;

    const { creatorId } = await getRoutineById(routineId);

    if (creatorId === req.user.id) {
      const routineDelete = await destroyRoutine(routineId);

      res.send(routineDelete);
    } else {
      next({ message: "Invalid" });
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  try {
    const { activityId, count, duration } = req.body;
    const { routineId } = req.params;
    
    const routineActivityAttach = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });

    if (routineActivityAttach) {
      res.send(routineActivityAttach);
    } else {
      next({ message: "Duplicate activityId and routineId" });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = routinesRouter;
