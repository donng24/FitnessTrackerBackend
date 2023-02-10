const { Pool } = require("pg");
require("dotenv").config();
const connectionString =
  process.env.DATABASE_URL || "https://localhost:5432/fitness-dev";
console.log(connectionString, "HEREE");
const client = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
