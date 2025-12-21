import { useState } from "react";
import axios from "axios";
import "../styles/DoctorDashboard.css";
import { Bot } from "lucide-react";
import BottomNav from "../components/BottomNav";

export default function DoctorDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState("issue");
  const [form, setForm] = useState({
    patientId: "",
    name: "",
    dosages: "",
    duration: "",
    instruction: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const issuePrescription = async () => {
    if (!form.patientId || !form.name || !form.dosages || !form.duration) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/doctor/prescription",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Prescription issued successfully");
      setForm({
        patientId: "",
        name: "",
        dosages: "",
        duration: "",
        instruction: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error issuing prescription");
    }
  };
  const fetchPrescriptions = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8080/api/doctor/prescriptions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPrescriptions(res.data);
  } catch (err) {
    console.error("Error fetching prescriptions", err);
  }
};


  return (
    <div className="doc-dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo">DocPanel</div>
        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeTab === "issue" ? "active" : ""}`}
            onClick={() => setActiveTab("issue")}
          >
            Issue Prescription
          </button>
          <button 
            className={`nav-item ${activeTab === "track" ? "active" : ""}`}
            onClick={() =>{
               setActiveTab("track");
                fetchPrescriptions();
              }}
          >
            Track Prescription
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>{activeTab === "issue" ? "New Prescription" : "Prescription History"}</h1>
        </header>

        {activeTab === "issue" ? (
          <div className="doctor-card">
            <div className="doctor-form">
              <div className="input-group">
                <label>Patient ID</label>
                <input
                  name="patientId"
                  placeholder="Enter ID"
                  value={form.patientId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Medicine Name</label>
                  <input
                    name="name"
                    placeholder="Medicine Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Dosage</label>
                  <input
                    name="dosages"
                    placeholder="500mg"
                    value={form.dosages}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Duration</label>
                <input
                  name="duration"
                  placeholder="e.g. 5 days"
                  value={form.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Instructions</label>
                <textarea
                  name="instruction"
                  placeholder="Additional notes..."
                  value={form.instruction}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <button className="issue-btn" onClick={issuePrescription}>
                Issue Prescription
              </button>
            </div>
          </div>
        ) : (
          <div className="doctor-card">
            <table className="track-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#A1A1AA', padding: '2rem' }}>
                    No recent prescriptions found.
                  </td>
                </tr>
                ) : (
                  prescriptions.map((p) => (
                    <tr key={p.prescriptionId}>
                      <td>{p.patientId}</td>
                      <td>{p.name}</td>
                      <td>{p.dosages}</td>
                      <td>{p.duration}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

    </div>
  );
}