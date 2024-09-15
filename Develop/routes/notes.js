const notes = require('express').Router();
const { readFromFile, readAndAppend } = require("../helpers/fsUtils");
const uuid = require('../helpers/uuid');

// GET route for retrieving all notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST route for a new note
notes.post('/', (req, res) => {
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
        res.errored(`Error in adding note`);
    }

});

module.exports = notes;