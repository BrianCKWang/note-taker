const {findById, createNewNote, validateNote, deleteNote } = require('../../lib/notes');
const { notes } = require('../../db/db');
const router = require('express').Router();
const { route } = require('.');

// const { json } = require("body-parser");

router.get('/notes/', (req, res) => {
  let results = notes;
  
  res.json(results);
});

router.get('/notes/:id', (req, res) => {
  const result = findById(req.params.id, notes);

  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
});



router.post('/notes', (req, res) => {
  // req.body.id = notes.length.toString();

  // console.log(req.body);
  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {


    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

router.delete('/notes/:id', (req, res) => {
  const note = deleteNote(req.params.id, notes);
  res.json(note);
});

module.exports  = router;