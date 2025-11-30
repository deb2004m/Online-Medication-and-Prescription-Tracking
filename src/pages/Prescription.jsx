import { ArrowLeft, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "../styles/prescriptions.css";

export default function Prescriptions() {
  const navigate = useNavigate();

  const activePrescriptions = [
    { title: "Antibiotic", subtitle: "Amoxicillin 500mg" },
    { title: "Pain Relief", subtitle: "Ibuprofen 200mg" },
    { title: "Blood Pressure", subtitle: "Lisinopril 10mg" },
  ];

  const pastPrescriptions = [
    { title: "Diabetes", subtitle: "Metformin 500mg" },
    { title: "Cholesterol", subtitle: "Atorvastatin 20mg" },
  ];

  const[showForm, setShowForm] = useState(false);
  const[newMed, setNewMed] = useState({
    tittle: "",
    dosage: ""});

    const addPrescription = () => {
        if(!newMed.tittle.trim()) return;
        setActiveList([...activeList, newMed]);
        setNewMed({ tittle: "", dosage: "" });
        setShowForm (false);
    };

  return (
    <div className="prescription-page">
      {/* Header */}
      <div className="header">
        <ArrowLeft className="back-icon" size={22} onClick={() => navigate(-1)} />
        <h2 className="header-title">Prescriptions</h2>
      </div>

      {/* Active Prescriptions */}
      <h3 className="section-title">Active Prescriptions</h3>

      <div className="card-list">
        {activePrescriptions.map((item, idx) => (
          <div key={idx} className="prescription-card">
            <div className="icon-box">
              <Pill className="icon-green" size={22} />
            </div>

            <div className="text-box">
              <h4 className="title">{item.title}</h4>
              <p className="subtitle">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Past Prescriptions */}
      <h3 className="section-title">Past Prescriptions</h3>

      <div className="card-list">
        {pastPrescriptions.map((item, idx) => (
          <div key={idx} className="prescription-card">
            <div className="icon-box">
              <Pill className="icon-green" size={22} />
            </div>

            <div className="text-box">
              <h4 className="title">{item.title}</h4>
              <p className="subtitle">{item.subtitle}</p>
            </div>
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
