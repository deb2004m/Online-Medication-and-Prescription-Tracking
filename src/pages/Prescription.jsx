import { ArrowLeft, Pill, Plus, CheckCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import "../styles/prescriptions.css";
import axios from "axios";
import api from "../api/api";
import { Download } from "lucide-react";


export default function Prescriptions() {
  const navigate = useNavigate();

  // Active + Past Prescription States
const [activeList, setActiveList] = useState([]);
const [pastList, setPastList] = useState([]);


  // Add Prescription Form State
  const [showForm, setShowForm] = useState(false);
  const [newMed, setNewMed] = useState({ title: "", subtitle: "" });

  useEffect(() => {
  fetchPrescriptions();
}, []);

const fetchPrescriptions = async () => {
  try {
    const res = await api.get("/api/patient/prescriptions");
    // Example: split by status
    setActiveList(res.data.filter(p => p.status === "ACTIVE"));
    setPastList(res.data.filter(p => p.status === "COMPLETED"));

  } catch (err) {
    console.error("Error fetching prescriptions", err);
  }
};

  // Add new prescription to Active List
const addPrescription = async () => {
  if (!newMed.title.trim()) return;

  try {
    const payload = {
      patientId: selectedPatientId, // IMPORTANT
      name: newMed.title,
      dosages: newMed.subtitle,
      duration: "5 days",
      instruction: "After food"
    };

    await api.post("/api/doctor/prescription", payload);

    fetchPrescriptions(); // reload list
    setNewMed({ title: "", subtitle: "" });
    setShowForm(false);
  } catch (err) {
    console.error("Error adding prescription", err);
  }
};


  // Move item from Active → Past
  const markAsCompleted = async (prescriptionId) => {
    try {
      await api.put(
        `/api/patient/prescriptions/${prescriptionId}/complete`
      );
      fetchPrescriptions();
    

    setPastList([...pastList, { ...prescription, status: "COMPLETED"}]);     // Add to past
    setActiveList(activeList.filter(p => p.prescriptionId !== prescriptionId)); // Remove from active
  } catch (err) {
    console.error("Error marking prescription as completed", err);
  }
};

  const deletePastPrescription = async (prescriptionId) => {
    await axios.delete(`http://localhost:8080/prescriptions/${prescriptionId}`);
    setPastList(pastList.filter((p => p.id !== prescriptionId)));
  };

  const downloadPdf = async (id) => {
  const res = await api.get(
    `/api/patient/prescriptions/${id}/download/pdf`,
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = "prescription.pdf";
  a.click();
};

// const downloadTxt = async (id) => {
//   const res = await api.get(
//     `/api/patient/prescriptions/${id}/download/txt`,
//     { responseType: "blob" }
//   );

//   const url = window.URL.createObjectURL(new Blob([res.data]));
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "prescription.txt";
//   a.click();
// };

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
        {activeList.map((item) => (
          <div key={item.prescriptionId} className="prescription-card">
            <div className="icon-box">
              <Pill className="icon-green" size={22} />
            </div>

            <div className="text-box">
              <h4 className="title">{item.name}</h4>
              <p className="subtitle">{item.dosages}</p>
              <p className="subtitle">{item.instruction}</p>
            </div>
            <div className="action-icons">
              {/* DOWNLOAD PDF */}
              <Download
                size={22}
                className="download-icon"
                onClick={() => downloadPdf(item.prescriptionId)}
              />

            {/* ✔ Button */}
            {item.status === "ACTIVE" && (
            <CheckCircle
              className="done-icon"
              size={24}
              onClick={() => markAsCompleted(item.prescriptionId)}
            />
            )}
            {item.status === "COMPLETED" && (
              <span className="completed-text">Completed</span>
            )}

          </div>
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
              <h4 className="title">{item.name}</h4>
              <p className="subtitle">{item.dosages}</p>
            </div>

            <Download
              size={22}
              className="download-icon"
              onClick={() => downloadPdf(item.prescriptionId)}
            />

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
