import "../../../Styling/Patient/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-icon">logo</span>
        <span className="logo-text">Thnam</span>
      </div>
      <ul className="navbar-links">
        <li className="active"><a href="#">Home</a></li>
        <li><a href="#">Medications</a></li>
        <li><a href="#">History</a></li>
        <li><a href="#">Caregivers</a></li>
      </ul>
      <div className="navbar-actions">
        <div className="search-bar">
          <span className="search-icon">search</span>
          <input type="text" placeholder="Search records..." />
        </div>
        <button className="icon-btn">bell</button>
        <button className="icon-btn">setting</button>
        <button className="icon-btn">profile</button>
      </div>
    </nav>
  );
};

export default Navbar;