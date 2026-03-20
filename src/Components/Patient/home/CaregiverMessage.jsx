import React from "react";
import "../../../Styling/Patient/Home/CaregiverMessage.css";

const CaregiverMessage = () => {
  return (
    <div className="caregiver-card">
      <div className="caregiver-avatar">
        <img src="https://i.pravatar.cc/48?img=47" alt="Lin" />
      </div>
      <div className="caregiver-info">
        <span className="caregiver-role">DAUGHTER</span>
        <span className="caregiver-name">Lin</span>
        <span className="caregiver-msg">I changed the diabetes medicines</span>
      </div>
    </div>
  );
};

export default CaregiverMessage;