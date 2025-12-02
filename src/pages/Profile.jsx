import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../styles/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  // Fetch stored user data (from login response)
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  // Extract name & email safely
  const [name, setName] = useState(storedUser.name || "User");
  const [email, setEmail] = useState(storedUser.email || "user@example.com");

  // Generate profile initials (e.g., Debashis Moharana → DM)
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Logout and clear all user data
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="profile-page">

      {/* MAIN WRAPPER */}
      <div className="profile-wrapper">

        {/* TOP PROFILE BLOCK */}
        <div className="profile-top">

          {/* Profile Avatar with Initials */}
          <div className="profile-avatar">
            <span className="avatar-text">{initials}</span>
          </div>

          {/* User Details */}
          <div className="profile-info">
            <p className="profile-label">Name</p>
            <p className="profile-value">{name}</p>

            <p className="profile-label">Email</p>
            <p className="profile-value">{email}</p>
          </div>
        </div>

        {/* PROFILE DETAILS CARD */}
        <div className="profile-card">
          <h4 className="card-title">Account Information</h4>

          <div className="card-row">
            <span className="card-key">Username:</span>
            <span className="card-value">{name}</span>
          </div>

          <div className="card-row">
            <span className="card-key">Registered Email:</span>
            <span className="card-value">{email}</span>
          </div>

          <div className="card-row">
            <span className="card-key">Account Status:</span>
            <span className="card-value status-active">Active</span>
          </div>
        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="lg-btn">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
