import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Bell,
  Download,
  UserCog,
  BarChart3,
  LayoutDashboard,
  Trash2,
  Shield,
  Activity,
} from "lucide-react";
import "../styles/admindashboard.css";

const API = "http://localhost:8080/api/admin";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    patients: 0,
    doctors: 0,
    prescriptions: 0,
    reminders: 0,
    alerts: 0,
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      await Promise.all([
        fetchAnalytics(),
        fetchUsers("patients", setPatients),
        fetchUsers("doctors", setDoctors),
        fetchUsers("pharmacists", setPharmacists),
      ]);
    } catch (err) {
      console.error("Admin dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    const res = await fetch(`${API}/analytics`, { headers });
    const data = await res.json();
    setStats(data);
  };

  const fetchUsers = async (role, setter) => {
    const res = await fetch(`${API}/users/${role}`, { headers });
    const data = await res.json();
    setter(Array.isArray(data) ? data : []);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers,
    });
    loadAll();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-content">
          <Shield size={30} />
          <div>
            <h1>MedTrack Admin</h1>
            <p>System Analytics & Control</p>
          </div>
        </div>
        <button onClick={() => navigate("/profile")}>
          <UserCog size={18} /> Profile
        </button>
      </header>

      {/* NAV */}
      <nav className="admin-nav">
        <Nav tab="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={<LayoutDashboard />} label="Dashboard" />
        <Nav tab="analytics" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BarChart3 />} label="Analytics" />
        <Nav tab="reports" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Download />} label="Reports" />
      </nav>

      {/* DASHBOARD */}
      {activeTab === "dashboard" && (
        <>
          <div className="stats-grid">
            <Stat title="Total Users" value={stats.totalUsers} icon={<Users />} />
            <Stat title="Patients" value={stats.patients} icon={<Users />} />
            <Stat title="Doctors" value={stats.doctors} icon={<Activity />} />
            <Stat title="Prescriptions" value={stats.prescriptions} icon={<FileText />} />
            <Stat title="Reminders" value={stats.reminders} icon={<Bell />} />
            <Stat title="Alerts" value={stats.alerts} icon={<Bell />} />
          </div>

          <UserTable title="Patients" users={patients} onDelete={deleteUser} />
          <UserTable title="Doctors" users={doctors} onDelete={deleteUser} />
          <UserTable title="Pharmacists" users={pharmacists} onDelete={deleteUser} />
        </>
      )}

      {/* ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="analytics-grid">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="analytics-card">
              <h3>{k}</h3>
              <p>{v}</p>
            </div>
          ))}
        </div>
      )}

      {/* REPORTS */}
      {activeTab === "reports" && (
        <div className="reports-grid">
          <Report type="users" />
          <Report type="alerts" />
          <Report type="prescriptions" />
        </div>
      )}
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const Nav = ({ tab, activeTab, setActiveTab, icon, label }) => (
  <button className={tab === activeTab ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab(tab)}>
    {icon} {label}
  </button>
);

const Stat = ({ title, value, icon }) => (
  <div className="stat-card">
    <div>
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
    {icon}
  </div>
);

const UserTable = ({ title, users, onDelete }) => (
  <div className="user-table-card">
    <h3>{title} ({users.length})</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr><td colSpan="3">No users found</td></tr>
        ) : (
          users.map(u => (
            <tr key={u.id}>
              <td>{u.name || "Unknown"}</td>
              <td>{u.email || "-"}</td>
              <td>
                <button onClick={() => onDelete(u.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const Report = ({ type }) => {
  const downloadReport = async () => {
    try {
      const res = await fetch(`${API}/reports/${type}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-report.csv`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Report download error:", err);
      alert("Download failed");
    }
  };

  return (
    <div className="report-card">
      <h3>{type.toUpperCase()} Report</h3>
      <button onClick={downloadReport}>
        <Download size={16} /> Download
      </button>
    </div>
  );
};