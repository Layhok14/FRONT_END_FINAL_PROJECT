import React from "react";
import "../../../Styling/Patient/Home/Doses.css";

const doses = [
  {
    time: "09:00 AM",
    name: "Lisinopril 10mg",
    status: "UPCOMING",
    note: null,
  },
  {
    time: "07:00 AM",
    name: "Atorvastatin 20mg",
    status: "COMPLETED",
    note: null,
  },
  {
    time: "08:00 PM",
    name: "Metformin 500mg",
    status: null,
    note: "Take with food",
  },
];

const statusClass = {
  UPCOMING: "badge-upcoming",
  COMPLETED: "badge-completed",
};

const dotClass = {
  UPCOMING: "dot-upcoming",
  COMPLETED: "dot-completed",
  null: "dot-pending",
};

const TodaysDoses = () => {
  return (
    <div className="doses-card">
      <h3>⏱ Today's Doses</h3>
      <ul className="doses-list">
        {doses.map((dose, i) => (
          <li key={i} className="dose-item">
            <span className={`dose-dot ${dotClass[dose.status] ?? "dot-pending"}`} />
            <div className="dose-info">
              <span className="dose-time">{dose.time}</span>
              <span className={`dose-name ${dose.status === "COMPLETED" ? "strikethrough" : ""}`}>
                {dose.name}
              </span>
              {dose.status && (
                <span className={`dose-badge ${statusClass[dose.status]}`}>
                  {dose.status}
                </span>
              )}
              {dose.note && <span className="dose-note">{dose.note}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodaysDoses;