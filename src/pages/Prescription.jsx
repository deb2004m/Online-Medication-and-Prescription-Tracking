import {
  ArrowLeft,
  Pill,
  Download,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import api from "../api/api";
import "../styles/prescriptions.css";

export default function Prescriptions() {
  const navigate = useNavigate();

  const [activeList, setActiveList] = useState([]);
  const [pastList, setPastList] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/api/patient/prescriptions");

      const data = res.data || [];

      // ✅ ACTIVE = ISSUED / ACTIVE
      setActiveList(
        data.filter(
          (p) =>
            p.status &&
            ["ISSUED", "ACTIVE"].includes(p.status.toUpperCase())
        )
      );

      // ✅ PAST = COMPLETED
      setPastList(
        data.filter(
          (p) =>
            p.status &&
            p.status.toUpperCase() === "COMPLETED"
        )
      );
    } catch (err) {
      console.error("Fetch prescriptions error", err);
    }
  };
const markAsCompleted = async (prescription) => {
  const id = prescription.prescriptionId || prescription.id;
  if (!id) return;

  try {
    await api.put(
      `/api/patient/prescriptions/${id}/complete`
    );

    // remove from active
    setActiveList((prev) =>
      prev.filter(
        (p) =>
          (p.prescriptionId || p.id) !== id
      )
    );

    // add to past
    setPastList((prev) => [
      { ...prescription, status: "COMPLETED" },
      ...prev,
    ]);
  } catch (err) {
    console.error("Mark completed failed", err);
  }
};

  const downloadPdf = async (id) => {
    if (!id) return;

    try {
      const res = await api.get(
        `/api/patient/prescriptions/${id}/download/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "prescription.pdf";
      a.click();
    } catch (err) {
      console.error("PDF download failed", err);
    }
  };

  return (
    <div className="prescription-page">
      {/* HEADER */}
      <header className="prescription-header">
        <div className="prescription-header-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </button>
          <h1 className="header-title">Prescriptions</h1>
        </div>
      </header>

      <main className="prescription-main">
        {/* 🔹 ACTIVE PRESCRIPTIONS */}
        <section className="prescription-section">
          <div className="section-header">
            <Clock size={18} />
            <h2 className="section-title">Active Prescriptions</h2>
          </div>

          {activeList.length === 0 ? (
            <div className="empty-state">
              <Pill size={40} />
              <p className="empty-text">No active prescriptions</p>
            </div>
          ) : (
<div className="prescription-cards">
  {activeList.map((p) => (
    <div
      key={p.prescriptionId || p.id}
      className="prescription-card"
    >
      {/* Left green bar */}
      <div className="active-indicator" />

      <div className="card-content">
        {/* Icon */}
        <div className="icon-box">
          <Pill size={22} />
        </div>

        {/* Text */}
        <div className="text-content">
          <h3 className="medicine-name">
            {p.name || p.medicineName}
          </h3>

          <p className="dosage-text">
            {p.dosages || p.dosage}
          </p>

          {p.instruction && (
            <p className="instruction-text">
              {p.instruction}
            </p>
          )}

          <span className="status-badge active">
            <span className="pulse-dot" />
            Active
          </span>
        </div>

        {/* Download */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
  <button
    className="download-button"
    onClick={() =>
      downloadPdf(p.prescriptionId || p.id)
    }
  >
    <Download size={18} />
  </button>

  <button
    className="download-button"
    onClick={() => markAsCompleted(p)}
    title="Mark as completed"
  >
    <CheckCircle2 size={18} />
  </button>
</div>
      </div>
    </div>
  ))}
</div>

          )}
        </section>

        {/* 🔹 PAST PRESCRIPTIONS */}
        <section className="prescription-section">
          <div className="section-header past">
            <CheckCircle2 size={18} />
            <h2 className="section-title past">Past Prescriptions</h2>
          </div>

          {pastList.length === 0 ? (
            <div className="empty-state">
              <Pill size={40} />
              <p className="empty-text">No completed prescriptions</p>
            </div>
          ) : (
            <div className="prescription-cards">
              {pastList.map((p) => (
                <div
                  key={p.prescriptionId || p.id}
                  className="prescription-card past"
                >
                  <div className="card-content">
                    <div className="icon-box past">
                      <Pill size={24} />
                    </div>

                    <div className="text-content">
                      <h3 className="medicine-name">
                        {p.name || p.medicineName}
                      </h3>

                      <p className="dosage-text">
                        {p.dosages || p.dosage}
                      </p>

                      {p.instruction && (
                        <p className="instruction-text">
                          {p.instruction}
                        </p>
                      )}

                      <span className="status-badge completed">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    </div>

                    <button
                      className="download-button"
                      onClick={() =>
                        downloadPdf(p.prescriptionId || p.id)
                      }
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
