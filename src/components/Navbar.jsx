import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Pill } from "lucide-react";
import "../styles/navbar.css";

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", {replace: true});
  };

  return (
    <nav className="navbar">
      {/* Left Logo */}
      <div className="navbar-left">
        <Pill size={22} />
        <span className="navbar-logo">MedTrack</span>
      </div>

      {/* Center Links */}
      <div className="navbar-center">
        <Link to="/pharmacist/inventory" className="nav-link">Home</Link>
        <Link to="/pharmacist/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/orders" className="nav-link">Orders</Link>
        <Link to="/pharmacist/prescriptions" className="nav-link">Prescriptions</Link>
      </div>

      {/* Right Profile */}
      <div className="navbar-right">
        <div
          className="profile-icon"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <User size={22} />
        </div>

        {showProfileMenu && (
          <div className="profile-dropdown">
            <button onClick={() => navigate("/profile")}>
              <User size={16} /> Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
