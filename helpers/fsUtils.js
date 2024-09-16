const fs = require("fs");
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
        let parsedData;
        try {
          //if there's no error, parse the data (if it exists) and append new note. Otherwise initialize an new array
          parsedData = data.trim() === "" ? [] : JSON.parse(data);
        } catch (parseErr) {
          reject(parseErr);
          
        }

        // add new note to the array
        parsedData.push(newNote);
        // handle writeToFile asynchonously (write updated data back to the file)
        writeToFile(file, parsedData)
          .then(() => resolve(`Success!`)) //resolve if write is successful
          .catch((writeErr) => reject(writeErr)); //reject if writing fails
      }
    });
  });
};

// add method to delete a note
const deleteFromFile = (noteID, file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            //if there's no error find the index of the note and delete it
            let parsedData;
            try {
                parsedData = JSON.parse(data);
            } catch (parseErr) {
                reject(parseErr);
                return;
            }
            
            // find the note index
            const noteIndex = parsedData.findIndex(
              (note) => note.id === noteID
            );

            if (noteIndex === -1) {
              reject(`Note not found!`);
            } else {
              // if found, delete note from array of note objects
              parsedData.splice(noteIndex, 1);
              // update file data sans deleted note
              writeToFile(file, parsedData)
              .then(() => resolve(`Note with ID ${noteID} deleted successfully`))
              .catch((writeErr) => reject(writeErr));
            }
          }
        });
    });
};

module.exports = { readFromFile, writeToFile, readAndAppend, deleteFromFile };
