// src/pages/LoginPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../components/ProtectedRouter";
import "../styles/Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [license, setLicense] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState(null);

  // ---------------- GOOGLE LOGIN SETUP ----------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id:
          "YOUR CLIENT ID",
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // ---------------- HANDLE GOOGLE LOGIN ----------------
  const handleGoogleResponse = (response) => {
    const userData = decodeJwt(response.credential);

    const user = {
      name: userData.name,
      email: userData.email,
      role: "patient",
    };

    fakeAuth.login(user);
    navigate("/prescriptions");
  };

  function decodeJwt(token) {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  }

  // ---------------- NORMAL LOGIN ----------------
  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter login details");
      return;
    }

    const user = {
      name: email.split("@")[0],
      email,
      role,
      ...(role === "doctor" && { license, specialization })
    };

    fakeAuth.login(user);
    navigate("/prescriptions");
  };

  return (
    <div className="login-container">
      <h1 className="app-title">MedTrack</h1>

      <div className="login-box">
        <div className="input-group">
          <label>Full Name</label>
          <input
            type="name"
            placeholder="Enter your fullname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ROLE DROPDOWN */}
        <div className="input-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
            <option value="pharmacist">Pharmacist</option>
          </select>
        </div>

                  {/* Doctor Extra Fields */}
          {role === "doctor" && (
            <>
            <div className="input-group">
              <input
                placeholder="Medical License Number"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
              />
              </div>
             <div className="input-group">
              <textarea
                className="input-box"
                placeholder="Specialization"
                rows="3"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
              </div>
            </>
          )}

        <button className="login-btn" onClick={handleLogin}>
          Sign Up
        </button>

        <div className="divider">or</div>

        <div id="googleLoginBtn" className="google-btn-container"></div>
      </div>
    </div>
  );
}
