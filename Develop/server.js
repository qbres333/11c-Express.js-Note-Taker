const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");
const api = require("./routes/index.js");

const PORT = 3001;
const app = express();

// middleware for parsing JSON
app.use(express.json());
app.use("/api", api);
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

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);