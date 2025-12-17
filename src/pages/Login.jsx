// src/pages/LoginPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../api/AuthContext";
import "../styles/Login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  //commonfields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  //doctor fields
  const [license, setLicense] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState(null);
  //Auth Mode
  const [isSignup, setIsSignup] = useState(false);

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
          "YOUR CLIENT ID.apps.googleusercontent.com",
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

    login(response.credential);
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


  // ---------------- NORMAL LOGIN (REAL BACKEND) ----------------
const handleAuth = async () => {
  if (!email || !password) {
    alert("Please enter login details");
    return;
  }

  try {
    if (isSignup) {
      //Registration
      await axios.post("http://localhost:8080/api/auth/register", {
        username: name,
        email,
        password,
        role,
        ...(role === "doctor" && { license, specialization }),
      });
      alert("Registration successful! Please log in.");
      setIsSignup(false);
      return;
    }
    //Login
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      email,
      password,
    });
    const { token, role: userRole, email: userEmail, username } = res.data;

    login(token);

    // localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ email: userEmail, role: userRole, username }));
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else if (userRole === "doctor") {
      navigate("/doctor/appointments");
    } else {
      navigate("/prescriptions");
    }

  } catch (error) {
    console.error("Axios error:", error);
    console.error("Response data:", error.response);
    alert(error.response?.data || error.message);
  }
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
      {isSignup && (
        <div className="input-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
            <option value="pharmacist">Pharmacist</option>
          </select>
        </div>
      )}

   {/* Doctor Extra Fields */}
          {isSignup && role === "doctor" && (
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

        <button className="login-btn" onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Log In"}
        </button>

        <div className="divider">or</div>

        <div id="googleLoginBtn" className="google-btn-container"></div>
                {/* Toggle */}
        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "New user?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
