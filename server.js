const fs = require('fs')
const express = require('express');
const uuid = require('uuid');
const app = express();

// Choosing the port
var PORT = process.env.PORT || 3000;

// Will share any static html files with the browser
app.use( express.static('public') );

// Accept incoming POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// File that has stored note info
const dbFile = './db/db.json';

// If file exists parse the data inside, otherwise it's an empty array
let noteList = fs.existsSync(dbFile) ?
    JSON.parse( fs.readFileSync(dbFile) ) : []

// Get all saved notes
app.get('/api/notes', function(req,res) {
    res.send(noteList)
});

// Post new note
app.post('/api/notes', function(req, res){
    let newNote = req.body
    console.log(req.body)

    // Assigning random id
    newNote.id = uuid.v4();

    // Adding new note to the note list
    noteList.push(newNote)
    console.log(noteList)

    // Write the list of notes to file
    fs.writeFileSync( dbFile, JSON.stringify( noteList ) )
    res.send( noteList )
});

// Delete note
app.delete('/api/notes/:noteID', function(req, res){
    const noteID = req.params.noteID
    console.log(noteID)

    // Loop through note list array to find selected note and remove it
    for( let i=0; i<noteList.length; i++) {
        if(noteID === noteList[i].id) {
            noteList.splice(i,1)
            break
        }
    }

    // Write the new list of notes to file
    fs.writeFileSync( dbFile, JSON.stringify( noteList ) )
    console.log(noteList)
    res.send( {message: 'Deleted Note'} )
});

// Listener
app.listen(PORT, function() {
    console.log(`Serving notes on PORT ${PORT}`)
});
