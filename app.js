require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const { client } = require("./db");
const morgan = require("morgan");

// Setup your Middleware and API Router here
app.use(cors());
client.connect();

app.use(morgan("dev"));
app.use(express.json());

const apiRouter = require("./api");
app.use("/api", apiRouter);

module.exports = app;
