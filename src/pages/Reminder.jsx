import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/reminders.css";

export default function Reminders() {
  const navigate = useNavigate();

  const patientId = localStorage.getItem("userId");
  // Form Inputs
  const [medName, setMedName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [medSearch, setMedSearch] = useState("");
  // Dropdown State for Notification
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState("Notification Type");
  const [showDropdown, setShowDropdown] = useState(false);
  const notificationOptions = [
    "Alarm",
    "Push Notification",
  ];
    /* ------------------ STORAGE HELPERS ------------------ */
    const STORAGE_KEY = patientId ? `reminders_${patientId}`: null;
   
    const loadReminders = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };
    
  const MEDICINES = [
  "Paracetamol",
  "Crocin",
  "Azithromycin",
  "Amoxicillin",
  "Cetirizine",
  "Dolo 650",
  "Metformin",
  "Aspirin",
];


  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleSelect = (option) => {
    setSelectedNotif(option);
    setNotifOpen(false);
  };
  // Saved Reminders List
  const [savedList, setSavedList] = useState(loadReminders());

  const saveReminder = async () => {
  const res = await fetch("http://localhost:8080/api/patient/reminders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      patientId: patientId,
      medicineName: selectedMedicine.name,
      reminderDate: reminderDate,
      reminderTime: reminderTime
    })
  });
      if (!res.ok) {
      alert("Failed to save reminder");
      return;
    }

    alert("Reminder saved successfully");

    setMedName("");
    setFrequency("");
    setDate("");
    setTime("");
    setSelectedNotif("Notification Type");
};




useEffect(() => {
    if (!patientId) {
    console.warn("Patient ID not found in localStorage");
    return;
  }
  if (!("Notification" in window)) return;

  const interval = setInterval(async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/patient/alerts/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) return;

      const message = await res.text();
      if (!message) return;

      const registration = await navigator.serviceWorker.ready;

      registration.showNotification("Medication Reminder 💊", {
        body: message,
        icon: "/pill.png",
        vibrate: [200, 100, 200],
      });

    } catch (err) {
      console.error("Alert check failed", err);
    }
  }, 30000); // every 30 sec (better than 60)

  return () => clearInterval(interval);
}, [patientId]);


  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
};

    
  // Save Handler
  const handleSave = () => {
    if (!medName || !frequency || !time || !date || selectedNotif === "Notification Type") {
      alert("Please fill all fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      patientId,
      medName,
      frequency,
      time,
      date,
      notif: selectedNotif,
      days: [],
      enabled: true,
    };

    const updated = [newItem, ...savedList];
    setSavedList(updated);
    saveReminders(updated);


    // Reset fields
    setMedName("");
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
<h3 className="section-heading">Saved Reminders</h3>

<div className="saved-section">
  {savedList.map((item, index) => (
    <div key={index} className="reminder-card">

      {/* TOP */}
      <div className="reminder-top">
        <h4 className="med-title">Medicine: {item.medName}</h4>
        <label className="switch">
          <input
            type="checkbox"
            checked={item.enabled}
            onChange={() => {
              const updated = [...savedList];
              updated[index].enabled = !updated[index].enabled;

              setSavedList(updated);
              saveReminders(updated);
            }}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* MIDDLE */}
      <p className="reminder-info">
        Time:
        {formatTime(item.time)} 
      </p>

      <div className="pill-row">
        <span className="pill">Frequency taken:{item.frequency}</span>
        <span className={`status ${item.enabled ? "on" : "off"}`}>
          {item.enabled ? "ON" : "OFF"}
        </span>
      </div>
            {item.days?.length > 0 && (
      <p className="days-text">
        <strong>Days:</strong> {item.days.join(", ")}
      </p>
    )}

      {/* ACTIONS */}
      <div className="action-row">
        <button className="edit-btn" 
          onClick={() => {
            setEditIndex(index);
            setEditData({ ...item });
          }}
        >Edit</button>
        <button
          className="delete-btn"
          onClick={() =>{
            const updated = savedList.filter((_, i) => i !== index);
            setSavedList(updated);
            saveReminders(updated);
          }}
        >
          Delete
        </button>
      </div>

    </div>
  ))}
</div>



      <h3 className="section-heading">Add Medication</h3>

      {/* Input Fields */}
<div className="medicine-autocomplete">
  <input
    type="text"
    className="reminder-input"
    placeholder="Enter medicine name"
    value={medName}
    onChange={(e) => {
      setMedName(e.target.value);
      setShowDropdown(true);
    }}
    onFocus={() => setShowDropdown(true)}
    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
  />

  {showDropdown && (
    <div className="dropdown-list">
      {MEDICINES.filter(med =>
        med.toLowerCase().includes(medName.toLowerCase())
      ).map((med) => (
        <div
          key={med}
          className="dropdown-item"
          onClick={() => {
            setMedName(med);
            setShowDropdown(false);
          }}
        >
          {med}
        </div>
      ))}

      {/* When no match */}
      {MEDICINES.filter(med =>
        med.toLowerCase().includes(medName.toLowerCase())
      ).length === 0 && (
        <div className="dropdown-item no-match">
          No suggestions — you can add manually
        </div>
      )}
    </div>
  )}
</div>



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
      {editData && (
  <div className="popup-overlay">
    <div className="popup-box">

      <h3>Edit Reminder</h3>

      <input
        value={editData.medName}
        onChange={(e) =>
          setEditData({ ...editData, medName: e.target.value })
        }
        placeholder="Medication Name"
      />

      <input
        value={editData.dosage}
        onChange={(e) =>
          setEditData({ ...editData, dosage: e.target.value })
        }
        placeholder="Dosage"
      />

      <input
        type="time"
        value={editData.time}
        onChange={(e) =>
          setEditData({ ...editData, time: e.target.value })
        }
      />

      {/* DAYS SELECTOR */}
      <div className="day-selector">
        {DAYS.map((day) => (
          <button
            key={day}
            className={
              editData.days.includes(day)
                ? "day-btn active"
                : "day-btn"
            }
            onClick={() => {
              const days = editData.days.includes(day)
                ? editData.days.filter((d) => d !== day)
                : [...editData.days, day];

              setEditData({ ...editData, days });
            }}
          >
            {day}
          </button>
        ))}
      </div>

      <button
        className="popup-btn"
        onClick={() => {
          const updated = [...savedList];
          updated[editIndex] = editData;
          setSavedList(updated);
          setEditData(null);
        }}
      >
        Save Changes
      </button>

      <button
        className="popup-cancel"
        onClick={() => setEditData(null)}
      >
        Cancel
      </button>

    </div>
  </div>
)}

    </div>
  );
}
