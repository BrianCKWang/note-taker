// const { json } = require("body-parser");

let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let saveBtnIsActive;
let firstPass;
let savingNote;
let currentNoteId;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  if(elem !== undefined){
    elem.style.display = 'inline';
    saveBtnIsActive = true;
  }
};

// Hide an element
const hide = (elem) => {
  if(elem !== undefined){
    elem.style.display = 'none';
    saveBtnIsActive = false;
  }
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () => 
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

const saveNote = (note) => 
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
});

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const getNewUuid = () =>
  fetch(`/api/uuid/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  if(!firstPass && !savingNote && saveBtnIsActive )
  {
    if(!confirm('You have unsaved changes. Discard the changes?')){      
      return;
    }
  }

  hide(saveNoteBtn);
  let saveNoteBtnOnListEl = document.querySelectorAll('.fa-asterisk');
  if(saveNoteBtnOnListEl){
    saveNoteBtnOnListEl.forEach(elem => elem.style.display = 'none');
    
  }

  if (activeNote.id) {
    // noteTitle.setAttribute('readonly', true);
    // noteText.setAttribute('readonly', true);
    
    noteTitle.value = activeNote.title?activeNote.title:'';
    noteText.value = activeNote.text?activeNote.text:'';
    
  } else {
    noteTitle.value = '';
    noteText.value = '';
    getNewUuid()
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
    })
    .then(newID => {
      activeNote.id = newID;
    });

  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
    id: activeNote.id
  };
  activeNote.title = newNote.title;
  activeNote.text = newNote.text;
  saveNote(newNote).then(() => {
    savingNote = true;
    getAndRenderNotes();
    renderActiveNote();
    savingNote = false;
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  
  deleteNote(noteId).then(() => {
    if(noteId == activeNote.id){
      getAndRenderNotesThenClear();
    }
    else{
      getAndRenderNotes();
    }
    
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();

  currentNoteId = activeNote.id;

  if(JSON.parse(e.target.parentElement.getAttribute('data-note'))){
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  }
  if(JSON.parse(e.target.getAttribute('data-note'))){
    activeNote = JSON.parse(e.target.getAttribute('data-note'));
  }

  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {

  let saveNoteBtnOnList = document.getElementById(activeNote.id);
  if(saveNoteBtnOnList){
    saveNoteBtnOnList = document.getElementById(activeNote.id).querySelector('.fa-asterisk');
  }

  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
    if(saveNoteBtnOnList){
      hide(saveNoteBtnOnList);
    }
  } else {
    show(saveNoteBtn);
    if(saveNoteBtnOnList){
      show(saveNoteBtnOnList);
    }
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();

  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true, id = '') => {
    const liEl = document.createElement('li');
    liEl.id = id;
    liEl.classList.add('list-group-item');
    liEl.addEventListener('click', handleNoteView);

    const modifiedIconEl = document.createElement('i');
    modifiedIconEl.classList.add(
      'fas',
      'fa-asterisk',
      'float-left',
      'fa-fw'
    );
    modifiedIconEl.style.display = "none";
    modifiedIconEl.addEventListener('click', handleNoteSave);

    liEl.append(modifiedIconEl);

    const spanEl = document.createElement('span');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note',
        'fa-fw'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }



    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }
  
  jsonNotes.forEach((note) => {
    
    const li = createLi(note.title, true, note.id);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);
const getAndRenderNotesThenClear = () => getNotes()
.then(renderNoteList)
.then(handleNewNoteView)
.then(() => {
  firstPass = false;
});

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);

  firstPass = true;
  getAndRenderNotesThenClear();
  saveBtnIsActive = false;
  
}

