const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  createActivity,
  updateActivity,
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
    } catch ({ name, message }) {
      next({ name, message });
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

  try {
    if (!activityId) {
      return;
    }
    const id = activityId;
    const routines = await getPublicRoutinesByActivity({ id });
    if (routines.length <= 0) {
      next({
        name: "NoResultsFoundError",
        message: "There are no routines associated with that activity.",
      });
    } else {
      res.send(routines);
    }
  } catch ({ name, message }) {
    console.error({ name, message });
    next({ name, message });
  }
});

module.exports = activitiesRouter;
