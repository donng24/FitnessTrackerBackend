const express = require("express");
const id = require("faker/lib/locales/id_ID");
const routineActivitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getRoutineActivityById,
  destroyRoutineActivity,
  canEditRoutineActivity,
  getRoutineById,
} = require("../db");
const { UnauthorizedDeleteError } = require("../errors");
const { requireUser } = require("./utils");
// PATCH /api/routine_activities/:routineActivityId :)
routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;
    const currentUser = req.user;

    const routineActivity = await getRoutineActivityById(routineActivityId);

    if (routineActivity && routineActivity.creatorId === req.user.id) {
      const updatedRoutineActivity = await updateRoutineActivity({
        id: routineId,
        ...req.body,
      });
      res.send(updatedRoutineActivity);
    } else if (routineActivity.createdBy !== currentUser.id) {
      res.status(403);
      next({
        error: "Error",
        message: `User ${req.user.username} is not allowed to update Every day`,
        name: "Error",
      });
    }
  } catch (error) {
    next(error);
  }
});
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      const routineActivity = await getRoutineActivityById(routineActivityId);

      const id = routineActivityId;
      const deleteRoutineActivity = await destroyRoutineActivity(id);

      const routine = await getRoutineById(routineActivity.routineId);
      console.log(routine, "here", req.user);
      if (routine.creatorId === req.user.id) {
        res.send(deleteRoutineActivity);
      } else {
        res.status(403);
        next({
          error: "error",
          message: UnauthorizedDeleteError(req.user.username, routine.name),
          name: "error",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);
module.exports = routineActivitiesRouter;
