const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  createActivity,
  updateActivity,
  getActivityById,
} = require("../db");

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
    if (!req.user) {
      next({
        name: "UserAuthorizationError",
        message: "Please log in to create an activity.",
      });
    } else {
      const { name, description } = req.body;
      const newActivity = await createActivity({ name, description });
      res.send(newActivity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  try {
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
        message: "Activity 10000 not found",
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
