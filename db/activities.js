const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO activities(name , description)
    VALUES($1,$2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [name, description]
    );
    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities;
    `);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE id=${id}
    `);
    if (!activity) {
      return null;
    }

    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE name=$1;
  `,
      [name]
    );

    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  try {
    const { activity } = await client.query(
      `
    SELECT *
    FROM activities
    WHERE routines = $1
    `,
      [routines]
    );
    return activity;
  } catch (error) {
    console.log(error);
  }
}
// if (setString.length === 0) {
//   return;
// }

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  // build the set string

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return activities;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
