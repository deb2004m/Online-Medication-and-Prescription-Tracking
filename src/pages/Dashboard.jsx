import BottomNav from "../components/BottomNav";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="dash-header">
        <span className="back-arrow">←</span>
        <h2>Analytics</h2>
        <span></span>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        <button className="tab active">Patient</button>
        <button className="tab">Doctor</button>
        <button className="tab">Pharmacy</button>
        <button className="tab">Admin</button>
      </div>

      {/* Adherence Trends */}
      <h3 className="section-title">Adherence Trends</h3>

      <div className="analytics-card">
        <h4>Medication Adherence</h4>
        <p className="percent">85%</p>
        <p className="subtext">Last 30 Days <span className="green">+5%</span></p>

        {/* Line chart placeholder */}
        <div className="chart-placeholder">
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
      <h3 className="section-title">Prescription History</h3>

      <div className="prescription-list">
        <div className="prescription-item">
          <div className="pill-icon">💊</div>
          <div>
            <p className="med-name">Medication A</p>
            <p className="med-date">2025-11-15</p>
          </div>
        </div>

        <div className="prescription-item">
          <div className="pill-icon">💊</div>
          <div>
            <p className="med-name">Medication B</p>
            <p className="med-date">2025-10-20</p>
          </div>
        </div>

        <div className="prescription-item">
          <div className="pill-icon">💊</div>
          <div>
            <p className="med-name">Medication C</p>
            <p className="med-date">2025-10-25</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
