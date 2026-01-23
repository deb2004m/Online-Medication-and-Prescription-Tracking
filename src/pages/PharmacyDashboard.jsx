import React, { useState } from "react";
import "../styles/pharmacydashboard.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
  Calendar,
} from "lucide-react";
import Navbar from "../components/Navbar";

const PharmacyDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");

  /* ================= RAW SALES DATA (SOURCE OF TRUTH) ================= */
  const salesRecords = [
    { drug: "Amoxicillin", category: "Antibiotics", units: 50, price: 15, day: "Mon" },
    { drug: "Amoxicillin", category: "Antibiotics", units: 45, price: 15, day: "Tue" },
    { drug: "Metformin", category: "Diabetes", units: 30, price: 12, day: "Wed" },
    { drug: "Atorvastatin", category: "Cardiovascular", units: 20, price: 24, day: "Thu" },
    { drug: "Omeprazole", category: "Pain Relief", units: 25, price: 15, day: "Fri" },
    { drug: "Vitamin D3", category: "Vitamins", units: 40, price: 7, day: "Sat" },
  ];

  /* ================= CALCULATIONS ================= */

  // Total Revenue
  const totalRevenue = salesRecords.reduce(
    (sum, r) => sum + r.units * r.price,
    0
  );

  // Top Selling Drugs
  const topSellingDrugs = Object.values(
    salesRecords.reduce((acc, r) => {
      if (!acc[r.drug]) {
        acc[r.drug] = {
          name: r.drug,
          sales: 0,
          revenue: 0,
          stock: Math.floor(Math.random() * 800) + 400,
        };
      }
      acc[r.drug].sales += r.units;
      acc[r.drug].revenue += r.units * r.price;
      return acc;
    }, {})
  ).sort((a, b) => b.sales - a.sales);

  // Daily Sales Trend
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailySales = days.map((day) => {
    const dayData = salesRecords.filter((r) => r.day === day);
    return {
      day,
      sales: dayData.reduce((s, r) => s + r.units * r.price, 0),
      prescriptions: dayData.length,
    };
  });

  // Category Distribution
  const categoryMap = {};
  salesRecords.forEach((r) => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + r.units;
  });

  const totalUnits = Object.values(categoryMap).reduce((a, b) => a + b, 0);
  const categoryColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  const categoryData = Object.entries(categoryMap).map(([name, units], i) => ({
    name,
    value: Math.round((units / totalUnits) * 100),
    color: categoryColors[i % categoryColors.length],
  }));

  // Monthly Sales vs Stock
  const salesVsStock = [
    { month: "Aug", sales: 12000, stock: 45000 },
    { month: "Sep", sales: 14500, stock: 42000 },
    { month: "Oct", sales: 16000, stock: 39000 },
    { month: "Nov", sales: 17000, stock: 36000 },
    { month: "Dec", sales: totalRevenue, stock: 34000 },
  ];

  // Expiration Data
  const upcomingExpirations = [
    { drug: "Ibuprofen", batch: "IBU-24A", quantity: 150, daysLeft: 15, value: 450 },
    { drug: "Paracetamol", batch: "PAR-24C", quantity: 200, daysLeft: 22, value: 300 },
    { drug: "Ciprofloxacin", batch: "CIP-24B", quantity: 80, daysLeft: 30, value: 960 },
  ];

  const criticalExpirations = upcomingExpirations.filter(
    (i) => i.daysLeft <= 30
  ).length;

  const totalExpiringValue = upcomingExpirations.reduce(
    (s, i) => s + i.value,
    0
  );

  /* ================= UI ================= */

  return (
    <>
    <Navbar/>
    
    <div className="dashboard">
      <h1 className="dashboard-title">Pharmacy Analytics Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <DollarSign />
          <div>
            <p>Total Revenue</p>
            <h3>${totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card success">
          <TrendingUp />
          <div>
            <p>Top Seller</p>
            <h3>{topSellingDrugs[0]?.name}</h3>
          </div>
        </div>

        <div className="stat-card warning">
          <AlertTriangle />
          <div>
            <p>Expiring Soon</p>
            <h3>{criticalExpirations} Items</h3>
            <span>${totalExpiringValue}</span>
          </div>
        </div>

        <div className="stat-card info">
          <Package />
          <div>
            <p>Total Products</p>
            <h3>{topSellingDrugs.length}</h3>
          </div>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="charts-row">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesVsStock}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="sales" stroke="#3b82f6" name="Sales" />
            <Line dataKey="stock" stroke="#10b981" name="Stock" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="charts-row">
        <ResponsiveContainer width="50%" height={300}>
          <BarChart data={topSellingDrugs}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie data={categoryData} dataKey="value" outerRadius={100}>
              {categoryData.map((e, i) => (
                <Cell key={i} fill={e.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= TABLE ================= */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Drug</th>
            <th>Batch</th>
            <th>Qty</th>
            <th>Days Left</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {upcomingExpirations.map((i, idx) => (
            <tr key={idx}>
              <td>{i.drug}</td>
              <td>{i.batch}</td>
              <td>{i.quantity}</td>
              <td>
                <Calendar size={14} /> {i.daysLeft}
              </td>
              <td>${i.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default PharmacyDashboard;
