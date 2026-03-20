import React from "react";
import "../../../Styling/Patient/Home/HealthNote.css";

const QuickHealthNote = () => {
  return (
    <div className="quick-note-card">
      <h3>Quick Health Note</h3>
      <p>Log any side effects or symptoms for your caregiver.</p>
      <button className="add-note-btn">
        <span className="note-icon">doctor book</span> Add Note
      </button>
    </div>
  );
};

export default QuickHealthNote;