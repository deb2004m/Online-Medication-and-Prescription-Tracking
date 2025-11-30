import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/reminders.css";

export default function Reminders() {
  const navigate = useNavigate();

  // Dropdown State
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState("Notification Type");

  const notificationOptions = [
    "Alarm",
    "Vibration",
    "Sound",
    "Silent",
    "Push Notification",
  ];

  const handleSelect = (option) => {
    setSelectedNotif(option);
    setNotifOpen(false);
  };

  return (
    <div className="reminder-page">

      {/* Header */}
      <div className="header">
        <ArrowLeft className="back-icon" size={22} onClick={() => navigate(-1)} />
        <h2 className="header-title">Medication Tracker</h2>
      </div>

      <h3 className="section-heading">Add Medication</h3>

      {/* Input Fields */}
      <input type="text" className="reminder-input" placeholder="Medication Name" />
      <input type="text" className="reminder-input" placeholder="Dosage (e.g., 200mg)" />

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

      {/* Dropdown 3 — INTERACTIVE */}
      <div className="dropdown-container">
        <div 
          className="dropdown"
          onClick={() => setNotifOpen(!notifOpen)}
        >
          <span>{selectedNotif}</span>
          <ChevronDown className="dropdown-icon" />
        </div>

        {notifOpen && (
          <div className="dropdown-menu">
            {notificationOptions.map((opt) => (
              <div 
                key={opt}
                className="dropdown-item"
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button className="save-btn">Save Medication</button>

      <BottomNav />
    </div>
  );
}
