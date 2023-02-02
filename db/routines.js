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
    const routineIds = routines.map((r) => r.id);

    const { rows: routineActivities } = await client.query(`
    SELECT ra.*
    FROM routine_activities ra
    WHERE "routineId"
    in(${routineIds});
    `);

    return routines;
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
    const { rows: routines } = await client.query(`
    SELECT * 
    FROM routines
    WHERE "isPublic" = true
    `);
    return routines;
  } catch (error) {
    console.log(error);
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT * 
    FROM routines
    `);
    return routines;
  } catch (error) {
    console.log(error);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
    SELECT * 
    FROM routines
    WHERE "isPublic" = true
    `);
    return routines;
  } catch (error) {
    console.log(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {}

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
    const {
      rows: [routine],
    } = await client.query(
      `
    DELETE 
    FROM routines 
    WHERE id=$1 
    RETURNING *`,
      [id]
    );
    return routine;
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
