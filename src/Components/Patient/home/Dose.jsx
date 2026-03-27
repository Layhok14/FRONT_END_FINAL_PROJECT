import "../../../Styling/Patient/Doses.css";
import doses from "../dose_data";

const TodaysDoses = () => {
  const beforeMealDoses = doses.filter(d => d.type === "before");
  const afterMealDoses = doses.filter(d => d.type === "after");

  return (
    <div className="doses-card">
      <h3>Upcoming Medicine</h3>
      <div className="doses-section">
        <div className="dose-time-badge">Today, 11:00 AM (1 hour 2 minutes left)</div>
        
        <div className="dose-category">
          <h4>Before Meal 15 mins</h4>
          {beforeMealDoses.map((dose, i) => (
            <div key={i} className="dose-item">
              <div className="dose-details">
                <span className="dose-amount">Amount: {dose.amount}</span>
                {dose.remark && <span className="dose-remark">Remark: {dose.remark}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="dose-category">
          <h4>After Meal</h4>
          {afterMealDoses.map((dose, i) => (
            <div key={i} className="dose-item">
              <div className="dose-details">
                <span className="dose-amount">Amount: {dose.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysDoses;