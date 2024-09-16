const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");
const { readFromFile, deleteFromFile } = require("./helpers/fsUtils");
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

// -------------------POST & DELETE requests are in the notes.js route file ------------------


// GET request for a specific note to be rendered
app.get("/notes/:id", (req, res) => {
      const { id } = req.params;

    // get single note to display on the right
    if(!id) {
        return res.status(400).json('Note ID not found!');
    }
    // find the note ID in the database
    const singleNote = notes.find((note) => note.id === id);

    if(!singleNote) {
        return res.status(400).json("Note not found!");
    }
    // render note if found
    res.status(200).json(singleNote);    
});

// GET request to get all notes
// needed for deletion
// app.get("/notes", (req, res) => res.json(notes));

// DELETE request to delete a specific note
app.delete("/api/notes/:id", (req, res) => {
    // const noteID = req.params.id;
    const { id } = req.params;
    // console.log(id); //check
    
    if(!id) {
        return res.status(400).json("Note ID not found!");
    }
    // find the note ID in the database
    const noteIndex = notes.findIndex((note) => note.id === id);

    if(noteIndex === -1) {
        return res.status(400).json("Note not found!");
    }
    deleteFromFile(id, "./db/db.json")
    .then(() => res.status(200).json(`Success!`))
    .catch((err) => res.status(400).json(err));

});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

