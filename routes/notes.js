const notes = require("express").Router();
const { logger } = require("../middleware/logger");
const { readFromFile, readAndAppend, deleteFromFile } = require("../helpers/fsUtils");
const uuid = require("../helpers/uuid");

// import custom middleware
notes.use(logger);

// GET route for retrieving all notes
notes.get("/", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => res.json(JSON.parse(data))) //data is parsed if read is successful
    .catch((err) => res.status(500).json({ error: err }));
});

// POST route for a new note
notes.post("/", (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        // readAndAppend needs to complete BEFORE the server responds
        readAndAppend(newNote, "./db/db.json")
          .then(() => {
            return readFromFile("./db/db.json");
          }) //read the updated notes to return them
          .then((updatedNotes) => {
            updatedNotes = JSON.parse(updatedNotes); //parse the updated notes
            res.json(updatedNotes);
          })
          .catch((err) => res.status(500).json({ error: err }));
    } else {
        res.status(400).json(`Error in adding note`);
    }
});

module.exports = notes;
