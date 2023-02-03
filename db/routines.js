const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
    `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    console.log(error);
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
      SELECT *
      FROM routines
      WHERE id=${id}
      `);
    if (!routine) {
      return null;
    }
    return routine;
  } catch (error) {
    console.log(error);
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routine } = await client.query(`
    SELECT *
    FROM routines
    `);
    return routine;
  } catch (error) {
    console.log(error);
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      JOIN users u 
      ON u.id = r."creatorId"
    `);
    const routineIds = routines.map((routine) => routine.id); //array of ids for each routine
    const { rows: routineActivities } = await client.query(
      `
      SELECT a.*, ra.duration, ra.count, ra.id AS "routineActivityId", ra."routineId"
      FROM activities a
      JOIN routine_activities ra
      ON ra."activityId" = a.id
      WHERE ra."routineId" 
      IN (${routineIds})
    `
    );

    return routines.map((r) => {
      r.activities = routineActivities.filter((ra) => ra.routineId === r.id);
      return r;
    });
  } catch (error) {
    console.log(error);
  }
}
// SELECT a.name AS "activityName", r.name as "routineName", description, duration, count, username AS "creatorName"
// FROM routines r
// JOIN routine_activities ra
// ON ra."routineId" = r.id
// JOIN activites a
// ON ra."activityId" = a.id
// JOIN users u
// ON u.id = "creatorId"
async function getAllPublicRoutines() {
  try {
    const routines = await getAllRoutines();

    return routines.filter((routine) => routine.isPublic === true);
  } catch (error) {
    console.log(error);
  }
}
async function getAllRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutines();

    return routines.filter((routine) => routine.creatorName === username);
  } catch (error) {
    console.log(error);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutinesByUser({ username });

    return routines.filter((routine) => routine.isPublic === true);
  } catch (error) {
    console.log(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const routines = await getAllPublicRoutines();
    const activity = routines.filter((routine) => {
      const hasActivity = routine.activities.some(
        (activity) => activity.id === id
      );
      return hasActivity;
    });

    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return routines;
  } catch (error) {
    console.log(error);
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(
      `
    DELETE FROM routine_activities
    WHERE "routineId"=$1;`,
      [id]
    );

    await client.query(
      `
    DELETE FROM routines
    WHERE id=$1;`,
      [id]
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
