const express = require("express");
const id = require("faker/lib/locales/id_ID");
const routineActivitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getRoutineActivityById,
  destroyRoutineActivity,
  canEditRoutineActivity,
} = require("../db");
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
  async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const routineActivityId = req.params.routineActivityId;
      const userId = decoded.id;

      const routineActivity = await getRoutineActivityById(routineActivityId);
      if (routineActivity.id !== userId) {
        return res.status(401).send({
          activityId: activityId,
          count: count,
          duration: duration,
          id: id,
          routineId: routineId,
        });
      }

      await destroyRoutineActivity(routineActivityId);
      res.status(204).send;
    } catch (error) {
      next(error);
    }
  }
);
module.exports = routineActivitiesRouter;
