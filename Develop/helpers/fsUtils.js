const fs = require("fs");
const { start } = require("repl");
const util = require("util");

// promise version of the fs.readFile Node function
const readFromFile = util.promisify(fs.readFile);

// function to write data to the JSON file
// destination is the path where note will be written
const writeToFile = (destination, newNote) => {
  // add promise to manage asyncronicity
  return new Promise((resolve, reject) => {
    // convert note to JSON string
    fs.writeFile(destination, JSON.stringify(newNote, null, 4), (err) => {
      //callback function to handle errors
      if (err) {
        reject(err); //reject the promise if writing fails
      } else {
        resolve(); //resolve if writing is successful
      }
    });
  });
};

// function to read/parse data from a file and add new note to it
//trying to complete writeToFile before outer promise resolves
const readAndAppend = (newNote, file) => {
  // add promise, try/catch to manage asyncronicity
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        reject(err); //reject if there's a read error
      } else {
        try {
          //if there's no error, parse the data and append new note
          const parsedData = JSON.parse(data);
          parsedData.push(newNote);
          // handle writeToFile asynchonously
          writeToFile(file, parsedData)
            .then(() => {
              resolve(`Success!`); //resolve if write is successful
            })
            .catch((writeErr) => {
              reject(writeErr); //reject if writing fails
            });
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    });
  });
};

// add method to delete a note
const deleteFromFile = (noteID, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      //if there's no error find the index of the note and delete it
      const parsedData = JSON.parse(data);
      const noteIndex = parsedData.findIndex((note) => note.id === noteID);

      if (!noteIndex) {
        console.log(`Note not found!`);
      } else {
        // if found, delete note from array of note objects
        parsedData.splice(noteIndex, 1);
        // update file data sans deleted note
        writeToFile(file, parsedData);
        console.log(`Note with ID ${noteID} deleted successfully`);
      }
    }
  });
};

module.exports = { readFromFile, writeToFile, readAndAppend, deleteFromFile };
