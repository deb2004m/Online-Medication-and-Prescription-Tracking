import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Pill,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import BottomNav from "../components/BottomNav";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Patient");
  const [activePrescriptions, setActivePrescriptions] = useState([]);

  const token = localStorage.getItem("token");
  const tabs = ["Patient"]

  /* 🔹 Sample analytics data (later connect backend) */
  const adherenceData = [
    { date: "Week 1", adherence: 85, target: 90 },
    { date: "Week 2", adherence: 80, target: 90 },
    { date: "Week 3", adherence: 88, target: 90 },
    { date: "Week 4", adherence: 92, target: 90 },
  ];

  const currentAdherence =
    adherenceData[adherenceData.length - 1].adherence;

  /* 🔹 Fetch patient prescriptions */
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/patient/prescriptions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const active = res.data.filter((p) => p.status === "ISSUED");
        setActivePrescriptions(active);
      } catch (err) {
        console.error("Error fetching prescriptions", err);
      }
    };

    fetchPrescriptions();
  }, [token]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dash-header">
        <button className="back-button">
          <ArrowLeft size={20} />
        </button>
        <h2>Analytics Dashboard</h2>
        <div />
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <TrendingUp />
          <div>
            <h4>Adherence</h4>
            <p className="stat-value">{currentAdherence}%</p>
            <span className="stat-label">Last 30 days</span>
          </div>
        </div>

        <div className="stat-card success">
          <CheckCircle />
          <div>
            <h4>Active Medicines</h4>
            <p className="stat-value">{activePrescriptions.length}</p>
            <span className="stat-label">Currently prescribed</span>
          </div>
        </div>

        <div className="stat-card warning">
          <Calendar />
          <div>
            <h4>Missed Doses</h4>
            <p className="stat-value">0</p>
            <span className="stat-label">This week</span>
          </div>
        </div>
      </div>

      {/* 🔹 ADHERENCE CHART */}
      <div className="section">
        <div className="section-header">
          <TrendingUp size={20} />
          <h3>Medicine Adherence Trend</h3>
        </div>

        <div className="analytics-card">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={adherenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="adherence"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Your Adherence"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#16a34a"
                strokeDasharray="5 5"
                name="Target (90%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 ACTIVE PRESCRIPTIONS */}
      <div className="section">
        <div className="section-header">
          <Pill size={20} />
          <h3>Active Prescriptions</h3>
        </div>

        <div className="prescription-list">
          {activePrescriptions.length === 0 ? (
            <p className="empty-text">No active medicines found.</p>
          ) : (
            activePrescriptions.map((med) => (
              <div key={med.prescriptionId} className="prescription-item">
                <Pill size={22} />
                <div className="med-info">
                  <p className="med-name">{med.name}</p>
                  <p className="med-date">
                    Dosage: {med.dosages} • {med.duration}
                  </p>
                </div>
                <span className="status-badge active">ACTIVE</span>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
