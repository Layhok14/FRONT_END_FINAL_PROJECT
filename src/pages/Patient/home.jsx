import Navbar from '../../Components/Patient/Home/Navbar'
import GreetingCard from '../../Components/Patient/Home/GreetingCard'
import TodaysDoses from '../../Components/Patient/Home/Dose'
import MedicationCalendar from '../../Components/Patient/Home/Calendar'
import '../../Styling/Patient/Home.css'

const PatientHome=()=>{
  return (
    <div className="patient-home">
      <Navbar />
      <div className="home-container">
        <div className="main-content">
          <div className="top-section">
            <GreetingCard />
            {/* <CaregiverMessage /> */}
          </div>
          <div className="middle-section">
            <div className="left-column">
              <TodaysDoses />
            </div>
            <div className="right-column">
              <MedicationCalendar />
            </div>
          </div>
          
          <div className="bottom-section">
            {/* footer maybe */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientHome