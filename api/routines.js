const express = require("express");
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
  updateRoutine,
} = require("../db");
const { requireUser } = require("./utils");

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
routinesRouter.post("/", requireUser, async (req, res, next) => {
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
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;

    const routine = await updateRoutine({ id: routineId, ...req.body });

    res.send(routine);
  } catch (error) {
    next(error);
  }
});
// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
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
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;

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
