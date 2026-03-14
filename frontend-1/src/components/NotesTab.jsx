import { useState } from "react";

export default function NotesTab({ notes }) {
  const [noteText, setNoteText] = useState("");

  return (
    <div className="tab-content">
      <div className="notes-section">
        {notes.map((note, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot-col">
              <div className="timeline-dot" />
              {i < notes.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-actor">{note.actor}</span>
                <span className="timeline-time">{note.time}</span>
              </div>
              <p className="timeline-text">{note.text}</p>
            </div>
          </div>
        ))}

        <div className="notes-input-area">
          <h4>Add Officer Note</h4>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter review note or observations..."
          />
          <div className="notes-submit-row">
            <button
              className="btn-secondary"
              onClick={() => setNoteText("")}
              disabled={!noteText}
              style={{ opacity: noteText ? 1 : 0.5 }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
