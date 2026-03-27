import dose_dict from "../calendar_info";
import "../../../Styling/Patient/Calendar.css";

const dotColors = {
  taken: "#39ACE7",
  taken_late: "#FF8A00",
  missed: "#EA4B48",
  upcoming: "#065877",
};
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const dates = [18, 19, 20, 21, 22, 23, 24];


const MedicationCalendar = () => {
  const todayIndex = 3;

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3>Weekly Overview</h3>
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
              {(dose_dict[i] || []).map((type, j) => (
                <span
                  key={j}
                  className="dot"
                  style={{ backgroundColor: dotColors[type] }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <span><span className="dost" style={{ backgroundColor: dose_dict.taken}} /> Taken</span>
        <span><span className="dost" style={{ backgroundColor: dose_dict.taken_late}} /> Taken Late</span>
        <span><span className="dost" style={{ backgroundColor: dose_dict.missed}} /> Missed Dose</span>
        <span><span className="dost" style={{ backgroundColor: dose_dict.upcoming}} /> Upcoming</span>
      </div>
    </div>
  );
};

export default MedicationCalendar;