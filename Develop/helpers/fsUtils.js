const fs = require("fs");
const util = require("util");

// promise version of the fs.readFile Node function
const readFromFile = util.promisify(fs.readFile);

// function to write data to the JSON file
// destination is the path where note will be written, content is the note
const writeToFile = (destination, newNote) =>
    // convert note to JSON string
    fs.writeFile(destination, JSON.stringify(newNote, null, 4), (err) => {
        //callback function to handle errors
        if (err) {
            console.error(err);
        } else {
            console.info(`\nNew note written to ${destination}`);
        }
    }
  );

// function to read data from a file and add new note to it
const readAndAppend = (newNote, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else { //if there's no error, parse the data and append new note
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            writeToFile(file, parsedData);
        }
    });
};

module.exports = { readFromFile, writeToFile, readAndAppend };