const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");
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

// GET request for a specific note to be rendered
app.get("/notes/:id", (req, res) => {
    const { id } = req.params;
    // get single note to display on the right
    
    if(!id) {
        return res.status(400).send('Review ID not found!');
    }

    console.info(`${req.method} request received to view a note`);

    const singleNote = notes.find((note) => note.id === id);

    if(!singleNote) {
        return res.status(404).json("Note not found!");
    }

    res.status(200).json(singleNote);
    
});

// DELETE route for specific note
app.delete("/notes/:id", (req, res) => {
    const { id } = req.params;
    console.info(`${req.method}  request received to delete a note`);
    const singleNote = notes.findIndex((note) => note.id === id);

    // read the notes in the JSON file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(400).send('Note ID not found!');
        } else {


            if (!singleNote) {
            return res.status(400).json("Note not found!");
            }

            res.status(200).json(singleNote);
        }
     

    })
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);