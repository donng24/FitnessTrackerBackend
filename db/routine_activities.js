const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [activityroutine] } = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3 , $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING 
    RETURNING *;
    `,
    [routineId, activityId, count, duration]
    )
    return activityroutine
  } catch (error) {
    console.log(error);
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [activityroutine] } = await client.query( `SELECT * FROM routine_activities WHERE id = $1` ,
      [id]
    )
  return activityroutine
} catch (error) {
  console.log(error);
  }
}
  
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(`SELECT * FROM routine_activities WHERE "routineId"= $1`, 
    [id])
    return rows
  }catch (error){
    console.log(error)
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const {count, duration} = fields;
    const { rows: [activityroutine] } = await client.query(
      `UPDATE routine_activities SET count=$1, duration=$2 WHERE id=$3 RETURNING *`,
      [count, duration, id]
    );
    return activityroutine;
  }catch (error) {
    console.log(error)
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [activityroutine] } = await client.query(`DELETE FROM routine_activities WHERE id=$1 RETURNING *`,
    [id]
    );
    return activityroutine;
  }catch (error) {
    console.log(error);
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routineActivity] } = await client.query(
      `SELECT routines.* FROM routine_activities 
      JOIN routines ON routine_activities."routineId" = routines.id 
      WHERE routine_activities.id = $1 AND routines."creatorId" = $2;` , 
    [routineActivityId, userId]);

  return !!routineActivity;

} catch (error) {
  console.log(error);
  }
}


module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
