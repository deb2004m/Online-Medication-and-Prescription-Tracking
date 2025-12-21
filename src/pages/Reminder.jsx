import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/reminders.css";

export default function Reminders() {
  const navigate = useNavigate();

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
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleSelect = (option) => {
    setSelectedNotif(option);
    setNotifOpen(false);
  };
  // Saved Reminders List
  const [savedList, setSavedList] = useState(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const stored = localStorage.setItem("reminders", JSON.stringify(savedList));
    if(stored) {
      const reminders = JSON.parse(stored);
      setSavedList(reminders);
      reminders.forEach(item => {
        if(item.enabled) {
          // Schedule notification
          scheduleNotification(item);
        }
      });
    }
    if("Notification" in window) {
      Notification.requestPermission();
    }
        
  }, []);
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
    if (!medName || !dosage || !frequency || !time || !date || selectedNotif === "Notification Type") {
      alert("Please fill all fields");
      return;
    }
    const scheduleNotification = (item) => {
      if (Notification.permission !== "granted") return;

      const reminderTime = new Date(`${item.date}T${item.time}`).getTime();
      const delay = reminderTime - Date.now();

      if (delay <= 0) return;

  setTimeout(async () => {
    const registration = await navigator.serviceWorker.ready;

    registration.showNotification("Time to take your medication!", {
      body: `${item.medName} - Take ${item.dosage}`,
      icon: "/pill.png",
      badge: "/pill.png",
      vibrate: [200, 100, 200],
      actions: [
        { action: "snooze", title: "Snooze" },
        { action: "take", title: "Take Now" }
      ],
      data: item
    });
  }, delay);
};


    const newItem = {
      medName,
      dosage,
      frequency,
      time,
      date,
      notif: selectedNotif,
      days: [],
      enabled: true,
    };

    setSavedList(prev => {
      const updated = [newItem, ...prev];
      saveToLocalStorage(updated);
      scheduleNotification(newItem);
      return updated;
    });
      

    // Reset fields
    setMedName("");
    setDosage("");
    setFrequency("");
    setTime("");
    setDate("");
    setSelectedNotif("Notification Type");
  };
  const saveToLocalStorage = (list) => {
    localStorage.setItem("reminders", JSON.stringify(list));
  }

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
        <h4 className="med-title">{item.medName}</h4>
        <label className="switch">
          <input
            type="checkbox"
            checked={item.enabled}
            onChange={() => {
              const updated = [...savedList];
              updated[index].enabled = !updated[index].enabled;

              setSavedList(updated);
              saveToLocalStorage(updated);
            }}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* MIDDLE */}
      <p className="reminder-info">
        {formatTime(item.time)} – Take {item.dosage}
      </p>

      <div className="pill-row">
        <span className="pill">{item.frequency}</span>
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
            saveToLocalStorage(updated);
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
