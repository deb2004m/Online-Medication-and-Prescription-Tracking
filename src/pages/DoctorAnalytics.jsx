import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


export default function DoctorAnalytics() {
  /* ===== Mock Data (replace with API later) ===== */
  const adherenceTrend = [
    { week: "W1", adherence: 82 },
    { week: "W2", adherence: 85 },
    { week: "W3", adherence: 88 },
    { week: "W4", adherence: 92 },
  ];

  const adherenceDistribution = [
    { name: "Excellent", value: 45, color: "#22c55e" },
    { name: "Good", value: 32, color: "#3b82f6" },
    { name: "Moderate", value: 15, color: "#f59e0b" },
    { name: "Poor", value: 8, color: "#ef4444" },
  ];

  return (
    <div className="doctor-analytics">

      {/* ===== SUMMARY CARDS ===== */}
      <div className="analytics-stats">
        <div className="analytics-card">
          <h4>Avg Adherence</h4>
          <p className="stat-value">87.5%</p>
          <span>Last 30 days</span>
        </div>

        <div className="analytics-card success">
          <h4>Excellent Patients</h4>
          <p className="stat-value">45</p>
          <span>&gt; 90% adherence</span>
        </div>

        <div className="analytics-card warning">
          <h4>Needs Attention</h4>
          <p className="stat-value">8</p>
          <span>&lt; 70% adherence</span>
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="analytics-charts">

        {/* Adherence Trend */}
        <div className="chart-box">
          <h3>Patient Adherence Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={adherenceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="adherence"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Adherence Distribution */}
        <div className="chart-box">
          <h3>Adherence Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={adherenceDistribution}
                dataKey="value"
                outerRadius={90}
                label
              >
                {adherenceDistribution.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
