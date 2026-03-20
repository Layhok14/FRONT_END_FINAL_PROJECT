import React, { useState } from "react";
import "../../../Styling/Patient/Home/Calendar.css";
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const dates = [26, 27, 28, 29, 30, 31, 1];
const todayIndex = 3; // THU = index 3

// dot types: 'taken' | 'missed' | 'upcoming' | null
const dotData = {
  2: ["taken", "missed", "taken"],
  3: ["taken", "upcoming"],
  4: ["upcoming"],
  5: ["upcoming"],
};

const dotColors = {
  taken: "#4fb3e8",
  missed: "#e05c5c",
  upcoming: "#1a6fa8",
};

const MedicationCalendar = () => {
  const [view, setView] = useState("Weekly");

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h2>Medication Calendar</h2>
        <div className="calendar-controls">
          <button className="arrow-btn">&#8249;</button>
          <button className="arrow-btn">&#8250;</button>
          <div className="view-toggle">
            <button
              className={view === "Weekly" ? "toggle-active" : ""}
              onClick={() => setView("Weekly")}
            >
              Weekly
            </button>
            <button
              className={view === "Monthly" ? "toggle-active" : ""}
              onClick={() => setView("Monthly")}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {days.map((day, i) => (
          <div
            key={day}
            className={`calendar-day ${i === todayIndex ? "today" : ""}`}
          >
            <span className="day-label">{day}</span>
            <span className="day-date">{dates[i]}</span>
            <div className="day-dots">
              {(dotData[i] || []).map((type, j) => (
                <span
                  key={j}
                  className="dot"
                  style={{ backgroundColor: dotColors[type] }}
                />
              ))}
            </div>
            {i === todayIndex && <span className="today-label">TODAY</span>}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <span><span className="dot" style={{ backgroundColor: "#4fb3e8" }} /> Dose Taken</span>
        <span><span className="dot" style={{ backgroundColor: "#e05c5c" }} /> Missed Dose</span>
        <span><span className="dot" style={{ backgroundColor: "#1a6fa8" }} /> Upcoming</span>
      </div>
    </div>
  );
};

export default MedicationCalendar;