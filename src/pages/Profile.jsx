import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../styles/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(storedUser.name || "John Doe");
  const [email, setEmail] = useState(storedUser.email || "john@gmail.com");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="profile-page">

      <div className="profile-wrapper">
        
        {/* Profile Section */}
        <div className="profile-top">
          
          {/* Left big circle */}
          <div className="profile-avatar"></div>

          {/* Right details card */}
          <div className="profile-info">
            <p className="profile-text"><strong>Name -</strong> {name}</p>
            <p className="profile-text"><strong>Email -</strong> {email}</p>
          </div>
        </div>
      </div>
       {/* Logout Button */}
       <div className="lg-btn">
        <button className="logout-btn" onClick={handleLogout}>
          LogOut
        </button>
</div>
      <BottomNav />
    </div>
  );
}
