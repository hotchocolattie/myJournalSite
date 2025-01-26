import React from 'react'
import { useState, useEffect } from 'react';
import './NewNote.css';


const NewNote = () => {

// making journal objects
  const [notes, setNotes] = useState({});
  // sets and gets the current journal entry user is editing
  const [currentNote, setCurrentNote] = useState("");
  // sets and gets the name the user wants to save the journal entry as
  const [noteName, setNoteName] = useState("");

  // journal entries are stored on local storage for now, where we get them from.
  // So this basically just loads the entries saved on local storage to the site
  // yippee for local storage!! lets use up all the user's space!!!
  // guys i dont know how to use mongodb
  useEffect(() => {
    const savedNotes = localStorage.getItem("journalNotes");

    if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
    } else {
        setNotes({});
    }
  }, []);

  // whenever the entries are changed by the user, make sure the local storage changes too!!
  useEffect(() => {
    const notesStringify = JSON.stringify(notes);
    localStorage.setItem("journalNotes", notesStringify);
  }, [notes]); // [notes] is here because whether the storage needs to be updated or not depends on the entries variable (apparently..? i had to google to get this part to work)

  // this code handles saving a new journal entry to local storage
  // saveNote is as a funct because it's called when the save button is clicked!
const saveEntry = () => {
    const trimTitle = noteName.trim();
    const trimEntry = currentNote.trim();

    if (trimEntry === "") {
            alert("Brevity is the wit of the soul, but it is not shameful to express your thoughts. Please enter some text!");
            return;
    }

    let finalTitle = trimTitle;
    if (trimTitle === "") {
            finalTitle = "Untitled" + Object.keys(notes).length;
    }

    const updateNotes = {
            ...notes,
            [finalTitle]: currentNote,
    };

    setNotes(updateNotes);

    setNoteName("");
    setCurrentNote("");
}

  const viewNote = (name) => {
    const oldNote = notes[name];
    setNoteName(name);
    setCurrentNote(oldNote);
  }


return (
    <div class="body">
        <div class="new-note-container" style={{display: "inline-block", flexDirection: "column", position: "relative", width:"97%"}}>
            <input
                type="text"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
                placeholder="Name your entry..." 
                class="new-note-title"
                style={{ width: "99%" }}
            />

            <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Write your thoughts..."
                rows={6}
                class="new-note-content"
                style={{ width: "98%", resize: "none" }}
            />

            <br />
            <br />
            <button class="buttons" onClick={saveEntry} style={{position: "absolute", left:"20px", bottom:"8px"}}>Save</button>
        </div>
        
        <br /> <br /> 

        <div class="old-notes-container">
            <h2>Entries</h2>

            {
                Object.keys(notes).map((name) => {
                    const titleLines = name.length > 14 ? 2 : 1; // Example condition to set data-title-lines
                    return (
                      <div
                        className="old-note-card"
                        key={name}
                        data-title-lines={titleLines}
                        style={{ display: "inline-block", flexDirection: "column", position: "relative" }}
                      >
                        <h3 className="old-note-title">{name}</h3>
                        <p className="old-note-content">{notes[name]}</p>
                        <button className="buttons" onClick={() => viewNote(name)} style={{ position: "absolute", bottom: "10px" }}>View</button>
                      </div>
                    );
                  })}
                </div>
              </div>
)
}

export default NewNote
