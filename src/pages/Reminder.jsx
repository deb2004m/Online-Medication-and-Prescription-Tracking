import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/reminders.css";

export default function Reminders() {
  const navigate = useNavigate();

  // Saved Notifications
  const [savedList, setSavedList] = useState([]);

  // Form Inputs
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // Dropdown State for Notification
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

  // Save Handler
  const handleSave = () => {
    if (!medName || !dosage || !frequency || !time || !date || selectedNotif === "Notification Type") {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      medName,
      dosage,
      frequency,
      time,
      date,
      notif: selectedNotif,
    };

    setSavedList([newItem, ...savedList]);

    // Reset fields
    setMedName("");
    setDosage("");
    setFrequency("");
    setTime("");
    setDate("");
    setSelectedNotif("Notification Type");
  };

  return (
    <div className="reminder-page">

      {/* Header */}
      <div className="header">
        <ArrowLeft className="back-icon" size={22} onClick={() => navigate(-1)} />
        <h2 className="header-title">Medication Tracker</h2>
      </div>

      {/* Saved Notifications Section */}
      {savedList.length > 0 && (
        <div className="saved-section">
          <h3 className="section-heading">Saved Reminders</h3>

          {savedList.map((item, index) => (
            <div key={index} className="saved-item">
              <p><strong>{item.medName}</strong> — {item.dosage}</p>
              <p>Frequency: {item.frequency}</p>
              <p>Time: {item.time}</p>
              <p>Date: {item.date}</p>
              <p>Notification: {item.notif}</p>
            </div>
          ))}
        </div>
      )}

      <h3 className="section-heading">Add Medication</h3>

      {/* Input Fields */}
      <input
        type="text"
        className="reminder-input"
        placeholder="Medication Name"
        value={medName}
        onChange={(e) => setMedName(e.target.value)}
      />

      <input
        type="text"
        className="reminder-input"
        placeholder="Dosage (e.g., 200mg)"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
      />

      {/* Frequency Field */}
      <input
        type="text"
        className="reminder-input"
        placeholder="Frequency (e.g. 2 times/day)"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      />

      {/* Time Field */}
      <input
        type="time"
        className="reminder-input"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* Date Field */}
      <input
        type="date"
        className="reminder-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Dropdown Notification */}
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
      <button className="save-btn" onClick={handleSave}>
        Save Medication
      </button>

      <BottomNav />
    </div>
  );
}
