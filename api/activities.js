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

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const publicRoutines = await getPublicRoutinesByActivity({
      id: activityId,
    });

    res.send(publicRoutines);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  const data = {};

  try {
    data.name = name;
    data.description = description;

    const addActivity = await createActivity(data);

    if (addActivity) {
      res.send(addActivity);
    } else {
      next({
        name: "InvalidPostFormat",
        message: "Post is missing data",
      });
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

module.exports = activitiesRouter;
