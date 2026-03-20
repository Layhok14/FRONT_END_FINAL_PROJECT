import React from "react";
import "../../../Styling/Patient/Home/GreetingCard.css";

const GreetingCard = () => {
  return (
    <div className="greeting-card">
      <div className="greeting-text">
        <h1>Good Morning, Eleanor</h1>
        <p>You have 3 doses scheduled for today.</p>
      </div>
      <div className="greeting-stats">
        <div className="stat-box">
          <span className="stat-label">NEXT DOSE</span>
          <span className="stat-value">45 <span className="stat-unit">mins away</span></span>
        </div>
        <div className="stat-divider" />
        <div className="stat-box">
          <span className="stat-label">DAILY ADHERENCE</span>
          <span className="stat-value">
            92% <span className="stat-unit">Target: 90%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GreetingCard;