const fs = require("fs");
const path = require("path");

function findById(id, notesArray) {
  const result = notesArray.filter(note => note.id === id)[0];
  return result;
}

function createNewNote(body, notesArray) {
  const note = body;
  
  let index = notesArray.findIndex(note => note.id == body.id);
  if(index != -1){
    notesArray[index] = note;
  }
  else{
    notesArray.push(note);
  }
  
  fs.writeFileSync(
    path.join(__dirname, '../db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );

  return note;
}

function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.id || typeof note.id !== 'string') {
    return false;
  }

  return true;
}

function deleteNote(id, notesArray){

  
  let index = notesArray.findIndex(note => note.id == id);
  if(index != -1){
    notesArray.splice(index, 1);
  }
  else{
    return false;
  }
  
  fs.writeFileSync(
    path.join(__dirname, '../db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );

  return true;
}

module.exports = {
  findById,
  createNewNote,
  validateNote,
  deleteNote
};