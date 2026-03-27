import { Link, Routes, Route } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>This is the admin area.</p>
    </div>
  );
}

export default function AdminHome() {
  return (
    <div>
      <h1>Admin Section</h1>
      <nav>
        <Link to="/admin">Dashboard</Link>
        {/* add other admin links here */}
      </nav>

      <Routes>
        <Route path="" element={<AdminDashboard />} />
        {/* nested admin routes go here */}
      </Routes>
    </div>
  );
}
