export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">GymFlow CRM</h2>

      <div className="nav-links">
        <a href="#">Dashboard</a>
        <a href="#">Members</a>
        <a href="#">Payments</a>
        <a href="#">Attendance</a>
      </div>
    </nav>
  );
}