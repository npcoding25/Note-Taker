const express = require('express');
const uuid = require('uuid');
const app = express();
const fs = require('fs')

var PORT = process.env.PORT || 3000;

// will share any static html files with the browser
app.use( express.static('public') );
// accept incoming POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbFile = './db/db.json';

let noteList = fs.existsSync(dbFile) ?
    JSON.parse( fs.readFileSync(dbFile) ) : []

app.get('/api/notes', function(req,res) {
    res.send(noteList)
});

app.post('/api/notes', function(req, res){
    let newNote = req.body
    console.log(req.body)

    newNote.id = uuid.v4();
    noteList.push(newNote)
    console.log(noteList)

    fs.writeFileSync( dbFile, JSON.stringify( noteList ) )
    res.send( noteList )
});

app.delete('/api/notes/:noteID', function(req, res){
    const noteID = req.params.noteID
    console.log(noteID)
    for( let i=0; i<noteList.length; i++) {
        if(noteID === noteList[i].id) {
            noteList.splice(i,1)
            break
        }
    }
    fs.writeFileSync( dbFile, JSON.stringify( noteList ) )
    console.log(noteList)
    res.send( {message: 'Deleted Note'} )
});

// Listener
app.listen(PORT, function() {
    console.log(`Serving notes on PORT ${PORT}`)
});
