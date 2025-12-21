import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { User, Mail, Shield, LogOut, Settings, Bell, Lock, ChevronRight } from "lucide-react";
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
    const menuItems = [
    { icon: Settings, label: "Account Settings", badge: null },
    { icon: Bell, label: "Notifications", badge: "3" },
    { icon: Lock, label: "Privacy & Security", badge: null },
    { icon: Shield, label: "Help & Support", badge: null }
  ];

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile</h2>
      </div>

      {/* MAIN WRAPPER */}
      <div className="profile-card-main">

        {/* TOP PROFILE BLOCK */}
        <div className="profile-top">

          {/* Profile Avatar with Initials */}
          <div className="profile-avatar">
            <span className="avatar-text">{initials}</span>
          </div>

          {/* User Details */}
          <div className="profile-info">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-email">
              <Mail size={16} />
              {email}
              </p>
              <div className="status-badge">
                <span className="status-dot"></span>
                Active Account
              </div>
          </div>
        </div>
        </div>

        {/* PROFILE DETAILS CARD */}
        <div className="account-details">
          <h4 className="section-title"><User size={18} /> Account Information</h4>

          <div className="detail-row">
            <div className="detail-icon"><User size={20} /></div>
            <div className="detail-content">
            <p className="detail-label">Full Name </p>
            <p className="detail-value">{name}</p>
          </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon"><Mail size={20} /></div>
            <div className="detail-content">
            <p className="detail-label">Email</p>
            <p className="detail-value">{email}</p>
          </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon"><Shield size={20} /></div>
            <div className="detail-content">
            <p className="detail-label">Account Status </p>
            <p className="detail-value status-active">Active</p>
          </div>
        </div>
      </div>
      {/* Menu Items */}
        <div className="menu-section">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              <div className="menu-icon">
                <item.icon size={20} />
              </div>
              <span className="menu-label">{item.label}</span>
              {item.badge && <span className="menu-badge">{item.badge}</span>}
              <ChevronRight size={20} className="menu-arrow" />
            </div>
          ))}
        </div>

      {/* LOGOUT BUTTON */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
