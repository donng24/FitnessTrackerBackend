function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      error: "Error",
      message: "You must be logged in to perform this action",
      name: "Error",
    });
  }

  next();
}

module.exports = {
  requireUser,
};
