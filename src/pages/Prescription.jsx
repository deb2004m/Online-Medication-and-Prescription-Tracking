import { ArrowLeft, Pill, Plus, CheckCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/prescriptions.css";

export default function Prescriptions() {
  const navigate = useNavigate();

  // Active + Past Prescription States
  const [activeList, setActiveList] = useState([
    { title: "Antibiotic", subtitle: "Amoxicillin 500mg" },
    { title: "Pain Relief", subtitle: "Ibuprofen 200mg" },
    { title: "Blood Pressure", subtitle: "Lisinopril 10mg" },
  ]);

  const [pastList, setPastList] = useState([
    { title: "Diabetes", subtitle: "Metformin 500mg" },
    { title: "Cholesterol", subtitle: "Atorvastatin 20mg" },
  ]);

  // Add Prescription Form State
  const [showForm, setShowForm] = useState(false);
  const [newMed, setNewMed] = useState({ title: "", subtitle: "" });

  // Add new prescription to Active List
  const addPrescription = () => {
    if (!newMed.title.trim()) return;

    setActiveList([...activeList, newMed]);
    setNewMed({ title: "", subtitle: "" });
    setShowForm(false);
  };

  // Move item from Active → Past
  const markAsCompleted = (index) => {
    const item = activeList[index];

    setPastList([...pastList, item]);     // Add to past
    setActiveList(activeList.filter((_, i) => i !== index)); // Remove from active
  };

  const deletePastPrescription = (index) => {
    setPastList(pastList.filter((_, i) => i !== index));
  };

  return (
    <div className="prescription-page">
      {/* Header */}
      <div className="header">
        <ArrowLeft className="back-icon" size={22} onClick={() => navigate(-1)} />
        <h2 className="header-title">Prescriptions</h2>
      </div>

      {/* ACTIVE PRESCRIPTIONS */}
      <h3 className="section-title">Active Prescriptions</h3>

      <div className="card-list">
        {activeList.map((item, idx) => (
          <div key={idx} className="prescription-card">
            <div className="icon-box">
              <Pill className="icon-green" size={22} />
            </div>

            <div className="text-box">
              <h4 className="title">{item.title}</h4>
              <p className="subtitle">{item.subtitle}</p>
            </div>

            {/* ✔ Button */}
            <CheckCircle
              className="done-icon"
              size={24}
              onClick={() => markAsCompleted(idx)}
            />
          </div>
        ))}
      </div>

      {/* PAST PRESCRIPTIONS */}
      <h3 className="section-title">Past Prescriptions</h3>

      <div className="card-list">
        {pastList.map((item, idx) => (
          <div key={idx} className="prescription-card past-card">
            <div className="icon-box">
              <Pill className="icon-green" size={22} />
            </div>

            <div className="text-box">
              <h4 className="title">{item.title}</h4>
              <p className="subtitle">{item.subtitle}</p>
            </div>
                        {/* 🗑 Delete icon */}
            <Trash2
              className="delete-icon"
              size={22}
              onClick={() => deletePastPrescription(idx)}
            />
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button className="add-btn" onClick={() => setShowForm(true)}>
        <Plus size={26} />
      </button>

      {/* Add Prescription Popup */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 className="popup-title">Add New Prescription</h3>

            <input
              className="popup-input"
              placeholder="Medicine Name"
              value={newMed.title}
              onChange={(e) =>
                setNewMed({ ...newMed, title: e.target.value })
              }
            />

            <input
              className="popup-input"
              placeholder="Dosage (e.g., 200mg)"
              value={newMed.subtitle}
              onChange={(e) =>
                setNewMed({ ...newMed, subtitle: e.target.value })
              }
            />

            <button className="popup-btn" onClick={addPrescription}>
              Add Prescription
            </button>

            <button className="popup-cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
