const notes = require('express').Router();
const { logger } = require("../middleware/logger");
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const uuid = require('../helpers/uuid');

// import custom middleware
notes.use(logger);

// GET route for retrieving all notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST route for a new note
notes.post('/', (req, res) => {
     // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully`);
    } else {
        res.status(400).send(`Error in adding note`);
    }

});

module.exports = notes;