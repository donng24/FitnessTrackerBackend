const express = require('express');
const routineActivitiesRouter = express.Router();
const jwt = require('jsonwebtoken')
const {
  getRoutineActivityById,
  destroyRoutineActivity,
  } = require("../db");
// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', (req, res, next) => {

}
)
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const routineActivityId = req.params.routineActivityId;
    const userId = decoded.id;

    const routineActivity = await getRoutineActivityById(routineActivityId);
    if (!routineActivity) {
      return res.status(404).send({ error: "Routine activity not found" });
    }
    if (routineActivity.userId !== userId) {
      return res.status(403).send();
    }

    await destroyRoutineActivity(routineActivityId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
module.exports = routineActivitiesRouter;
