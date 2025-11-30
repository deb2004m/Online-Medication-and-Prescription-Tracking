// src/pages/ProfilePage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";   // <-- IMPORT EXTERNAL CSS

export default function ProfilePage() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [name, setName] = useState(storedUser.name || "");
  const [email, setEmail] = useState(storedUser.email || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!storedUser) navigate("/");
  }, []);

  const handleUpdate = () => {
    const updatedUser = { name, email };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>

      <div className="profile-card">
        
        <label>Name</label>
        <input
          className="profile-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          className="profile-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {message && <p className="profile-success">{message}</p>}

        <button className="update-btn" onClick={handleUpdate}>
          Update Profile
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
