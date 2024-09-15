const express = require("express");

// Import custom middleware
const { logger } = require("../middleware/logger");

// Import modular routers for /notes
const notesRouter = require("./notes");

const app = express();

app.use("/notes", notesRouter);

// Initialize custom middleware
app.use(logger);

module.exports = app;
