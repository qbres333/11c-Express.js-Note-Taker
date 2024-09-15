const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");
const { deleteFromFile } = require("./helpers/fsUtils");
const api = require("./routes/index.js");
const notes = require("./db/db");
const fs = require("fs");

const PORT = 3001;
const app = express();

// middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);
// import custom middleware
app.use(logger);
// tell the app to serve static files from the public directory
app.use(express.static("public"));

// GET route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET route for notes page
app.get("/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/notes.html"))

    
);

// -------------------POST request is in the notes.js route file ------------------


// GET request for a specific note to be rendered
app.get("/notes/:id", (req, res) => {
  
    const { id } = req.params;

    // get single note to display on the right
    if(!id) {
        return res.status(400).send('Review ID not found!');
    }

    const singleNote = notes.find((note) => note.id === id);

    if(!singleNote) {
        return res.status(404).json("Note not found!");
    }

    res.status(200).json(singleNote);    
});

// GET request to get all notes
app.get('/api/notes', (req, res) => res.json(notes));

// DELETE route for specific note
app.delete("/api/notes/:id", (req, res) => {

    const noteID = req.params.id;
    // iterate through the notes to find the matching note ID
    for(let i = 0; i < notes.length; i++) {
        if(noteID === notes[i].id) {
            deleteFromFile(noteID, "./db/db.json");
            return res.status(200).json("Note deleted successfully");
                   
        } 
    }
    // return message if there's no such note
    return res.status(400).send(`Error in deleting note`); 
    
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);