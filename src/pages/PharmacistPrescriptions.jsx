import { useEffect, useState } from "react";
import "../styles/pharmacistprescription.css";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function PharmacistPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/pharmacist/prescriptions")
      .then(res => {
        console.log("API RESPONSE:", res.data);
        setPrescriptions(res.data);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load prescriptions");
      });
  }, []);

  if (error) {
    return (
      <div className="p-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <>
        <Navbar/>
    <div className="p-container">

      {/* Header */}
      <div className="p-header">
        <h2>Pharmacist Prescriptions</h2>
      </div>

      {/* Empty State */}
      {prescriptions.length === 0 && (
        <div className="empty-state">
          <p>No prescriptions found</p>
        </div>
      )}

      {/* Grid */}
      <div className="p-grid">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.prescriptionId}
            className="p-card"
          >
            <div className="card-header">
              <span className="p-id">
                Id: {prescription.prescriptionId}
              </span>
              <span className="p-status">
                Status: {prescription.status ?? "PENDING"}
              </span>
            </div>

            <div className="cards-content">
              <div className="medicine-name">
                {prescription.name}
              </div>

              <div className="card-row">
                <span className="card-label">Doctor Id:</span>
                <span className="card-value">
                  {prescription.doctorId ?? "N/A"}
                </span>
              </div>

              <div className="card-row">
                <span className="card-label">Patient Id:</span>
                <span className="card-value">
                  {prescription.patientId ?? "N/A"}
                </span>
              </div>

              <div className="card-row">
                <span className="card-label">Dosage:</span>
                <span className="card-value">
                  {prescription.dosages}
                </span>
              </div>

              <div className="card-row">
                <span className="card-label">Duration:</span>
                <span className="card-value">
                  {prescription.duration}
                </span>
              </div>

              {prescription.instruction && (
                <div className="instruction-box">
                  <div className="card-row">
                    <span className="card-label">Instruction:</span>
                    <span className="card-value">
                      {prescription.instruction}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
    </>
  );
}
