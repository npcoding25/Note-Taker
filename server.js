const express = require('express');
const uuid = require('uuid');
const app = express();


var PORT = process.env.PORT || 3000;

// will share any static html files with the browser
app.use( express.static('public') );
// accept incoming POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbFile = './app/db.json';

let noteList = [{id: "0000-0000-0000-0000", title: 'note1', text: 'note1 text'}];

// Endpoints =================================================

app.get('/api/notes', function(req,res) {
    res.send(noteList)
})

app.post('/api/notes', function(req, res){
    console.log(req.body)
    let newNote = req.body;
    newNote.id = uuid.v4()
    console.log(newNote)
    noteList.push(newNote)
    res.send(newNote)
})
// for app.post: newNote.id = uuid.v4() // use a random unique id.


app.delete('/api/notes/:noteID', function(req, res){
    const noteID = req.params.noteID
    console.log(noteID)
    for( let i=0; i<noteList.length; i++) {
        if(noteID === noteList[i].id) {
            noteList.splice(i,1)
            break
        }
    }
    res.send( {message: 'Deleted Note'} )
})
// Listener ==================================================
app.listen(PORT, function() {
    console.log(`Serving notes on PORT ${PORT}`)
})
