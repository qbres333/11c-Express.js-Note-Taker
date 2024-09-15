const router = require("express").Router();

// Import custom middleware
const { logger } = require("../middleware/logger");

// Import modular router for /notes
const notesRouter = require("./notes");

router.use("/notes", notesRouter);

// Initialize custom middleware
router.use(logger);

module.exports = router;
