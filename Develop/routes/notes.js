const notes = require("express").Router();
const { logger } = require("../middleware/logger");
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const uuid = require("../helpers/uuid");
// const allNotes = require("../db/db");

// import custom middleware
notes.use(logger);

// GET route for retrieving all notes
notes.get("/", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => res.json(JSON.parse(data))) //data is parsed if read is successful
    .catch((err) => res.status(400).json({ error: err }));
});

// POST route for a new note
notes.post("/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    // readAndAppend needs to complete BEFORE the server responds
    readAndAppend(newNote, "./db/db.json")
      .then(() => res.json({ message: `Success!` }))
      .catch((err) => res.status(400).json({ error: err }));
  } else {
        res.status(400).send(`Error in adding note`);
  }
});

module.exports = notes;
