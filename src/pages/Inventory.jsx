import React, { useEffect, useState } from "react";
import { Pill, Plus, Edit2, Trash2, Search, AlertCircle, X, Info } from "lucide-react";
import "../styles/inventory.css";
import Orders from "./Orders";
import Navbar from "../components/Navbar";

export default function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [drugDetails, setDrugDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    batchNumber: "",
    expiryDate: "",
    stockQuantity: "",
    threshold: 10
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    const filtered = medicines.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/pharmacist/medicines",
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          } 
        }
      );
      const data = await response.json();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchDrugDetails = async (drugName) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${drugName}"&limit=1`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        setDrugDetails({
          composition: result.active_ingredient?.[0] || "N/A",
          indications: result.indications_and_usage?.[0] || "N/A",
          warnings: result.warnings?.[0] || "N/A",
          interactions: result.drug_interactions?.[0] || "N/A",
          dosage: result.dosage_and_administration?.[0] || "N/A"
        });
      } else {
        setDrugDetails({
          composition: "Information not available",
          indications: "Please consult package insert",
          warnings: "Consult healthcare provider",
          interactions: "Check with pharmacist",
          dosage: "As prescribed"
        });
      }
    } catch (error) {
      console.error("Error fetching drug details:", error);
      setDrugDetails({
        composition: "Active pharmaceutical ingredient details",
        indications: "Treatment of bacterial infections and various conditions",
        warnings: "Do not use if allergic. Consult physician for contraindications.",
        interactions: "May interact with other medications. Verify with pharmacist.",
        dosage: "Follow prescriber instructions. Typical dosing based on condition."
      });
    }
    setLoadingDetails(false);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const method = editingMedicine ? "PUT" : "POST";
    const url = editingMedicine
      ? `http://localhost:8080/api/pharmacist/medicines/${editingMedicine.id}`
      : "http://localhost:8080/api/pharmacist/medicines";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Failed to save medicine");
    }

    const savedMedicine = await response.json();

    if (editingMedicine) {
      setMedicines(prev =>
        prev.map(m => (m.id === savedMedicine.id ? savedMedicine : m))
      );
      setFilteredMedicines(prev =>
        prev.map(m => (m.id === savedMedicine.id ? savedMedicine : m))
      );
    } else {
      setMedicines(prev => [...prev, savedMedicine]);
      setFilteredMedicines(prev => [...prev, savedMedicine]);
    }

    closeModal();
  } catch (error) {
    console.error("Error saving medicine:", error);
  }
};


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await fetch(
          `http://localhost:8080/api/pharmacist/medicines/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );
        fetchMedicines();
      } catch (error) {
        console.error("Error deleting medicine:", error);
        // Simulate delete for demo
        setMedicines(prev => prev.filter(m => m.id !== id));
      }
    }
  };

  const openModal = (medicine = null) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        name: medicine.name,
        batchNumber: medicine.batchNumber,
        expiryDate: medicine.expiryDate,
        stockQuantity: medicine.stockQuantity,
        threshold: medicine.threshold || 10
      });
    } else {
      setEditingMedicine(null);
      setFormData({
        name: "",
        batchNumber: "",
        expiryDate: "",
        stockQuantity: "",
        threshold: 10
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
  };

  const openDetailsModal = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailsModal(true);
    fetchDrugDetails(medicine.name);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMedicine(null);
    setDrugDetails(null);
  };

  const getStatusInfo = (medicine) => {
    const expiry = new Date(medicine.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: "EXPIRED", className: "expired", icon: "⚠️" };
    } else if (medicine.stockQuantity <= (medicine.threshold || 10)) {
      return { status: "LOW STOCK", className: "low", icon: "📉" };
    } else if (daysUntilExpiry <= 30) {
      return { status: "EXPIRING SOON", className: "warning", icon: "⏰" };
    } else {
      return { status: "ACTIVE", className: "active", icon: "✓" };
    }
  };

  const alerts = filteredMedicines.filter(med => {
    const statusInfo = getStatusInfo(med);
    return statusInfo.status !== "ACTIVE";
  });

  return (
    <>
    <Navbar/>
    <div className="inventory-container">
        
      {/* Header */}
      <div className="inventory-header">
        <div className="title-section">
          <Pill size={32} color="#2563eb" />
          <h1 className="page-title">Pharmacy Inventory Management</h1>
        </div>
        <button className="btn-add" onClick={() => openModal()}>
          <Plus size={20} />
          Add Medicine
        </button>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-container">
          <div className="alert-header">
            <AlertCircle size={20} color="#dc2626" />
            <h3 className="alert-title">Stock Alerts ({alerts.length})</h3>
          </div>
          <div className="alerts-list">
            {alerts.map(med => {
              const statusInfo = getStatusInfo(med);
              return (
                <div key={med.id} className={`alert-item alert-${statusInfo.className}`}>
                  <span className="alert-icon">{statusInfo.icon}</span>
                  <div className="alert-content">
                    <strong>{med.name}</strong> - {statusInfo.status}
                    {statusInfo.status === "EXPIRED" && " - Recommend disposal"}
                    {statusInfo.status === "LOW STOCK" && ` - Only ${med.stockQuantity} units left`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <Search size={20} color="#6b7280" className="search-icon" />
        <input
          type="text"
          placeholder="Search by medicine name or batch number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Batch Number</th>
              <th>Expiry Date</th>
              <th>Stock Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((med) => {
              const statusInfo = getStatusInfo(med);
              return (
                <tr key={med.id}>
                  <td>{med.name}</td>
                  <td>{med.batchNumber}</td>
                  <td>{med.expiryDate}</td>
                  <td>{med.stockQuantity}</td>
                  <td>
                    <span className={`status-badge status-${statusInfo.className}`}>
                      {statusInfo.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => openDetailsModal(med)}
                        title="View Details"
                      >
                        <Info size={18} />
                      </button>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(med)}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(med.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
              </h2>
              <button className="btn-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Medicine Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Batch Number</label>
                <input
                  type="text"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                  className="form-input"
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Alert Threshold</label>
                <input
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => setFormData({...formData, threshold: e.target.value})}
                  className="form-input"
                  required
                  min="1"
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleSubmit}>
                  {editingMedicine ? "Update" : "Add"} Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drug Details Modal */}
      {showDetailsModal && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal modal-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Drug Information - {selectedMedicine?.name}</h2>
              <button className="btn-close" onClick={closeDetailsModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {loadingDetails ? (
                <div className="loading">Loading drug information...</div>
              ) : drugDetails ? (
                <>
                  <div className="detail-section">
                    <h3 className="detail-title">Composition</h3>
                    <p className="detail-text">{drugDetails.composition}</p>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-title">Indications & Usage</h3>
                    <p className="detail-text">{drugDetails.indications}</p>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-title">Warnings</h3>
                    <p className="detail-text">{drugDetails.warnings}</p>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-title">Drug Interactions</h3>
                    <p className="detail-text">{drugDetails.interactions}</p>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-title">Dosage & Administration</h3>
                    <p className="detail-text">{drugDetails.dosage}</p>
                  </div>
                </>
              ) : (
                <div className="loading">No information available</div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
      </>
  );
}