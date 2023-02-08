const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  createActivity,
  updateActivity,
  getActivityById,
  getActivityByName,
} = require("../db");

const { requireUser } = require("./utils");

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const activity = await getActivityByName(name);
    if (activity) {
      next({
        error: "Error",
        message: `An activity with name ${name} already exists`,
        name: "Error",
      });
    } else {
      const newActivity = await createActivity({ name, description });
      res.send(newActivity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const activity = await getActivityById(activityId);
  try {
    if (!activity) {
      next({
        error: "Error",
        message: `Activity ${activityId} not found`,
        name: "Error",
      });
    }

    const existingActivity = await getActivityByName(name);
    if (existingActivity && existingActivity.id !== activityId) {
      next({
        error: "Error",
        message: `An activity with name ${name} already exists`,
        name: "Error",
      });
    }

    const updatedActivity = await updateActivity({
      id: activityId,
      name,
      description,
    });

    res.send(updatedActivity);
  } catch (error) {
    next(error);
  }
});

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  const activity = await getActivityById(activityId);
  try {
    if (!activity) {
      next({
        error: "ActivityNotFoundError",
        message: `Activity ${activityId} not found`,
        name: "ActivityNotFoundError",
      });
    } else {
      const routines = await getPublicRoutinesByActivity(activity);
      res.send(routines);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
