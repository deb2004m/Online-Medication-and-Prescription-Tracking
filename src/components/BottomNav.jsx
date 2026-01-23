import { NavLink } from "react-router-dom";
import { Home, Pill, Bell, User } from "lucide-react";
import "../styles/bottomnav.css";

export default function BottomNav() {
  return (
    <div className="bottom-nav-container">
      <NavLink to="/dashboard" className="nav-item">
        <Home size={20} className="nav-icon" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/prescriptions" className="nav-item">
        <Pill size={20} className="nav-icon" />
        <span>Prescriptions</span>
      </NavLink>

      <NavLink to="/reminders" className="nav-item">
        <Bell size={20} className="nav-icon" />
        <span>Reminders</span>
      </NavLink>

      <NavLink to="/profile" className="nav-item">
        <User size={20} className="nav-icon" />
        <span>Profile</span>
      </NavLink>
    </div>
  );
}
