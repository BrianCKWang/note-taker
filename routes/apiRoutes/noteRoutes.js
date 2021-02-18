const { filterByQuery, findById, createNewNote, validateNote } = require('../../lib/notes');
const { notes } = require('../../db/db');
const router = require('express').Router();

router.get('/notes/', (req, res) => {
  let results = notes;

  console.log(notes);
  
  if(req.query){
    results = filterByQuery(req.query, results);
  }
  
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
  req.body.id = notes.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateNote(req.body)) {
    res.status(400).send('The Nnote is not properly formatted.');
  } else {
    const Nnote = createNewNote(req.body, notes);
    res.json(note);
  }
});

module.exports  = router;