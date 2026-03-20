import React from "react";
import Navbar from "../../Components/Patient/home/Navbar";
import GreetingCard from "../../Components/Patient/home/GreetingCard";
import MedicationCalendar from "../../Components/Patient/home/Calendar";
import QuickHealthNote from "../../Components/Patient/home/Note";
import TodaysDoses from "../../Components/Patient/home/Dose";
import CaregiverMessage from "../../Components/Patient/home/CaregiverMessage";
import "../../Styling/Patient/Home/Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main className="home-main">
        <GreetingCard />
        <QuickHealthNote />
        <MedicationCalendar />
        <TodaysDoses />
        <CaregiverMessage />
      </main>
      <footer className="home-footer">
        <span>© 2025 Thnam. All rights reserved.</span>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Accessibility</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;