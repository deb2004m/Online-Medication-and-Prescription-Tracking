import { ArrowLeft, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { Calendar, Pill } from "lucide-react";
import BottomNav from "../components/BottomNav";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Patient');
  const tabs = ['Patient', 'Doctor', 'Pharmacy', 'Admin'];
  const prescriptions = [
    { name: 'Medication A', date: '2025-11-15', id: 1 },
    { name: 'Medication B', date: '2025-10-20', id: 2 },
    { name: 'Medication C', date: '2025-10-25', id: 3 }
  ];
  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="dash-header">
        <button className="back-button"><ArrowLeft size={20} /></button>
        <h2>Analytics</h2>
        <div className="header-spacer"></div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

      {/* Adherence Trends */}
      <div className="section">
          <div className="section-header">
            <TrendingUp size={20} />
            <h3 className="section-title">Adherence Trends</h3>
      </div>

          <div className="analytics-card">
            <div className="card-top">
              <div className="adherence-info">
                <h4 className="card-subtitle">Medication Adherence</h4>
                <p className="percent">85%</p>
              </div>
              <div className="badge-success">
                <span>+5%</span>
              </div>
            </div>
            <p className="subtext">Last 30 Days</p>
        {/* Line chart placeholder */}
        <div className="chart-container">
          <div className="chart-line"></div>
        </div>

        {/* Weeks label */}
        <div className="weeks">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>

      {/* Prescription History */}
      <div className="section">
          <div className="section-header">
            <Calendar size={20} />
            <h3 className="section-title">Prescription History</h3>
          </div>

          <div className="prescription-list">
            {prescriptions.map(med => (
              <div key={med.id} className="prescription-item">
                <div className="pill-icon">
                  <Pill size={24} />
                </div>
                <div className="med-info">
                  <p className="med-name">{med.name}</p>
                  <p className="med-date">{med.date}</p>
                </div>
                <div className="arrow-icon">›</div>
              </div>
            ))}
          </div>
        </div>
        </div>

      <BottomNav />
    </div>
  );
}
