// import "../../../Styling/Patient/GreetingCard.css";

const GreetingCard = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  
  return (
    <div className="greeting-card">
      <div className="greeting-text">
        <h1>{greeting}, Tong!</h1>
        <p>You have 3 doses scheduled for today.</p>
      </div>
      <div className="greeting-stats">
        <div className="stat-box">
          <span className="stat-label">NEXT DOSE</span>
          <span className="stat-value">
            <span className="stat-time">11:00 AM</span>
            <span className="stat-unit">(1 hour 2 mins left)</span>
          </span>
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