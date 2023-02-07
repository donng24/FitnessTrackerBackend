const express = require("express");
const apiRouter = express.Router();

// GET /api/health
apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({
      message: "All is well",
    });
  } catch (error) {
    next(error);
  }
});

// ROUTER: /api/users
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
apiRouter.use("/routine_activities", routineActivitiesRouter);

apiRouter.use((error, req, res, next) => {
  res.send({
    error: error.name,
    name: error.name,
    message: error.message,
  });
});
module.exports = apiRouter;
