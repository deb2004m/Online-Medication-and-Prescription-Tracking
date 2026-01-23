import React, { useEffect, useState } from "react";
import { Package, Search, Eye, Truck, CheckCircle, XCircle, Clock, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import "../styles/orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.medicines.some((med) =>
            med.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, filterStatus, orders]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/pharmacist/orders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Demo data for testing
      const demoOrders = [
        {
          id: 1,
          orderId: "ORD-2024-001",
          customerName: "John Smith",
          customerEmail: "john.smith@email.com",
          customerPhone: "+1-555-0123",
          medicines: [
            { name: "Amoxicillin 500mg", quantity: 30, price: 15.99 },
            { name: "Ibuprofen 200mg", quantity: 60, price: 8.99 },
          ],
          totalAmount: 24.98,
          orderDate: "2024-12-28",
          deliveryDate: "2025-01-02",
          status: "PENDING",
          shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
          trackingNumber: null,
          paymentMethod: "Credit Card",
          notes: "Please deliver between 2-5 PM",
        },
        {
          id: 2,
          orderId: "ORD-2024-002",
          customerName: "Sarah Johnson",
          customerEmail: "sarah.j@email.com",
          customerPhone: "+1-555-0124",
          medicines: [
            { name: "Lisinopril 10mg", quantity: 90, price: 12.50 },
          ],
          totalAmount: 12.50,
          orderDate: "2024-12-27",
          deliveryDate: "2024-12-31",
          status: "IN_TRANSIT",
          shippingAddress: "456 Oak Avenue, Los Angeles, CA 90001",
          trackingNumber: "TRK123456789",
          paymentMethod: "Insurance",
          notes: "Refrigeration required",
        },
        {
          id: 3,
          orderId: "ORD-2024-003",
          customerName: "Michael Brown",
          customerEmail: "m.brown@email.com",
          customerPhone: "+1-555-0125",
          medicines: [
            { name: "Metformin 500mg", quantity: 180, price: 18.75 },
            { name: "Atorvastatin 20mg", quantity: 90, price: 22.30 },
          ],
          totalAmount: 41.05,
          orderDate: "2024-12-26",
          deliveryDate: "2024-12-30",
          status: "DELIVERED",
          shippingAddress: "789 Elm Street, Chicago, IL 60601",
          trackingNumber: "TRK987654321",
          paymentMethod: "Debit Card",
          notes: null,
        },
        {
          id: 4,
          orderId: "ORD-2024-004",
          customerName: "Emily Davis",
          customerEmail: "emily.d@email.com",
          customerPhone: "+1-555-0126",
          medicines: [
            { name: "Levothyroxine 50mcg", quantity: 30, price: 9.99 },
          ],
          totalAmount: 9.99,
          orderDate: "2024-12-29",
          deliveryDate: "2025-01-03",
          status: "PROCESSING",
          shippingAddress: "321 Pine Road, Houston, TX 77001",
          trackingNumber: null,
          paymentMethod: "Cash on Delivery",
          notes: "Call before delivery",
        },
        {
          id: 5,
          orderId: "ORD-2024-005",
          customerName: "David Wilson",
          customerEmail: "d.wilson@email.com",
          customerPhone: "+1-555-0127",
          medicines: [
            { name: "Omeprazole 20mg", quantity: 60, price: 14.50 },
          ],
          totalAmount: 14.50,
          orderDate: "2024-12-25",
          deliveryDate: "2024-12-29",
          status: "CANCELLED",
          shippingAddress: "654 Maple Drive, Phoenix, AZ 85001",
          trackingNumber: null,
          paymentMethod: "Credit Card",
          notes: "Customer requested cancellation",
        },
      ];
      setOrders(demoOrders);
      setFilteredOrders(demoOrders);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(
        `http://localhost:8080/api/pharmacist/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      // Simulate update for demo
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={18} />;
      case "PROCESSING":
        return <Package size={18} />;
      case "IN_TRANSIT":
        return <Truck size={18} />;
      case "DELIVERED":
        return <CheckCircle size={18} />;
      case "CANCELLED":
        return <XCircle size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "PROCESSING":
        return "status-processing";
      case "IN_TRANSIT":
        return "status-transit";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusOptions = [
    "ALL",
    "PENDING",
    "PROCESSING",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <>
        <Navbar />
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <div className="title-section">
          <Package size={32} className="header-icon" />
          <h1 className="page-title">Orders Management</h1>
        </div>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-value">
              {orders.filter((o) => o.status === "PENDING").length}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {orders.filter((o) => o.status === "IN_TRANSIT").length}
            </div>
            <div className="stat-label">In Transit</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {orders.filter((o) => o.status === "DELIVERED").length}
            </div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="status-filter">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`filter-btn ${
                filterStatus === status ? "filter-btn-active" : ""
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Medicines</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">{order.orderId}</span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{order.customerName}</div>
                      <div className="customer-email">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div className="medicines-list">
                      {order.medicines.slice(0, 2).map((med, idx) => (
                        <div key={idx} className="medicine-item">
                          {med.name} (x{med.quantity})
                        </div>
                      ))}
                      {order.medicines.length > 2 && (
                        <div className="medicine-more">
                          +{order.medicines.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{formatDate(order.deliveryDate)}</td>
                  <td>
                    <span className="amount">${order.totalAmount.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.replace("_", " ")}</span>
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => openDetailsModal(order)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {order.status === "PENDING" && (
                        <button
                          className="btn-action"
                          onClick={() => updateOrderStatus(order.id, "PROCESSING")}
                          title="Mark as Processing"
                        >
                          Process
                        </button>
                      )}
                      {order.status === "PROCESSING" && (
                        <button
                          className="btn-action"
                          onClick={() => updateOrderStatus(order.id, "IN_TRANSIT")}
                          title="Mark as In Transit"
                        >
                          Ship
                        </button>
                      )}
                      {order.status === "IN_TRANSIT" && (
                        <button
                          className="btn-action btn-success"
                          onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                          title="Mark as Delivered"
                        >
                          Deliver
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order Details</h2>
              <button className="btn-close" onClick={closeDetailsModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Order Info */}
              <div className="info-section">
                <h3 className="sectiontitle">Order Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value">{selectedOrder.orderId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">
                      {formatDate(selectedOrder.orderDate)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Delivery Date:</span>
                    <span className="info-value">
                      {formatDate(selectedOrder.deliveryDate)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span
                      className={`status-badge ${getStatusClass(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span>{selectedOrder.status.replace("_", " ")}</span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Payment Method:</span>
                    <span className="info-value">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="info-item">
                      <span className="info-label">Tracking Number:</span>
                      <span className="info-value tracking-number">
                        {selectedOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="info-section">
                <h3 className="section-title">Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{selectedOrder.customerName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">
                      <MapPin size={16} /> Shipping Address:
                    </span>
                    <span className="info-value">
                      {selectedOrder.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medicines */}
              <div className="info-section">
                <h3 className="section-title">Ordered Medicines</h3>
                <table className="medicines-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td>{med.name}</td>
                        <td>{med.quantity}</td>
                        <td>${med.price.toFixed(2)}</td>
                        <td>${(med.quantity * med.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">
                        Total Amount:
                      </td>
                      <td className="total-amount">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="info-section">
                  <h3 className="section-title">Notes</h3>
                  <p className="notes-text">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Update Buttons */}
              <div className="modal-actions">
                {selectedOrder.status === "PENDING" && (
                  <button
                    className="btn-status-update"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "PROCESSING");
                      closeDetailsModal();
                    }}
                  >
                    Mark as Processing
                  </button>
                )}
                {selectedOrder.status === "PROCESSING" && (
                  <button
                    className="btn-status-update"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "IN_TRANSIT");
                      closeDetailsModal();
                    }}
                  >
                    Mark as In Transit
                  </button>
                )}
                {selectedOrder.status === "IN_TRANSIT" && (
                  <button
                    className="btn-status-update btn-status-success"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "DELIVERED");
                      closeDetailsModal();
                    }}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}