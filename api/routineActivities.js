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
// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch("/:routineActivityId", (req, res, next) => {});
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', async (req, res, next) => {
  try {
    // Verify the authenticity of the user
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const routineActivityId = req.params.routineActivityId;
    const userId = decoded.id;

    // Check if the user is the owner of the routine activity
    const routineActivity = await getRoutineActivityById(routineActivityId);
    if (routineActivity.userId !== userId) {
      return res.status(401).send({ error: "You are not authorized to perform this action" });
    }

    // Delete the routine activity
    await destroyRoutineActivity(routineActivityId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
module.exports = routineActivitiesRouter;
