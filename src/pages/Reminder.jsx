import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../styles/reminders.css";

export default function Reminders() {
  const navigate = useNavigate();

  return (
    <div className="reminder-page">
      {/* Header */}
      <div className="header">
        <ArrowLeft className="back-icon" size={22} onClick={() => navigate(-1)} />
        <h2 className="header-title">Medication Tracker</h2>
      </div>

      <h3 className="section-heading">Add Medication</h3>

      {/* Input Fields */}
      <input
        type="text"
        className="reminder-input"
        placeholder="Medication Name"
      />

      <input
        type="text"
        className="reminder-input"
        placeholder="Dosage (e.g., 200mg)"
      />

      {/* Dropdown 1 */}
      <div className="dropdown">
        <span>Frequency</span>
        <ChevronDown className="dropdown-icon" />
      </div>

      {/* Dropdown 2 */}
      <div className="dropdown">
        <span>Time of Day</span>
        <ChevronDown className="dropdown-icon" />
      </div>

      {/* Dropdown 3 */}
      <div className="dropdown">
        <span>Notification Type</span>
        <ChevronDown className="dropdown-icon" />
      </div>

      {/* Save Button */}
      <button className="save-btn">Save Medication</button>

      <BottomNav />
    </div>
  );
}
