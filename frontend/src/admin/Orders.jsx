import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AlertMessage from '../components/AlertMessage.jsx';
import { FaEdit, FaTruck, FaShoppingBag } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [statusMessage, setStatusMessage] = useState({ success: null, error: null });

  // Order update modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    orderStatus: 'Pending',
    trackingNumber: '',
    courierName: '',
  });

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.adminGetOrders({ status: statusFilter });
      setOrders(res.data || []);
    } catch (err) {
      setStatusMessage({ success: null, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdate = (order) => {
    setSelectedOrder(order);
    setUpdateForm({
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber || '',
      courierName: order.courierName || '',
    });
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminService.adminUpdateOrder(selectedOrder._id, updateForm);
      setStatusMessage({ success: 'Order status updated successfully', error: null });
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      setStatusMessage({ success: null, error: err.message });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ color: 'var(--forest)' }}>
            Customer Orders Management
          </h2>
          <small className="text-muted">Fulfill orders, assign couriers, and update delivery status</small>
        </div>

        <div>
          <select
            className="form-select form-select-sm rounded-pill px-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {statusMessage.success && (
        <AlertMessage variant="success" onClose={() => setStatusMessage({ ...statusMessage, success: null })}>
          {statusMessage.success}
        </AlertMessage>
      )}
      {statusMessage.error && (
        <AlertMessage variant="danger" onClose={() => setStatusMessage({ ...statusMessage, error: null })}>
          {statusMessage.error}
        </AlertMessage>
      )}

      {loading ? (
        <LoadingSpinner message="Fetching customer orders..." />
      ) : orders.length === 0 ? (
        <div className="card p-5 border-0 rounded-4 shadow-sm bg-white text-center">
          <FaShoppingBag size={48} className="text-muted mb-2 mx-auto" />
          <h5>No orders found</h5>
          <p className="text-muted small">Orders placed on the storefront will appear here automatically.</p>
        </div>
      ) : (
        <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Order ID</th>
                  <th>Customer &amp; Shipping</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Tracking</th>
                  <th className="pe-4 text-end">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-bottom">
                    <td className="ps-4 font-monospace small">#{o._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div className="fw-bold small">{o.shippingAddress?.name || o.user?.name}</div>
                      <small className="text-muted d-block">{o.shippingAddress?.phone}</small>
                      <small className="text-muted">{o.shippingAddress?.city}, {o.shippingAddress?.state}</small>
                    </td>
                    <td className="small">
                      {o.orderItems.map((item, i) => (
                        <div key={i}>
                          {item.name} &times; {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="fw-bold">₹{o.totalPrice}</td>
                    <td>
                      <span className={`badge ${o.isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {o.isPaid ? 'Paid' : 'Pending / COD'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-success'
                            : o.orderStatus === 'Shipped'
                            ? 'bg-info'
                            : o.orderStatus === 'Confirmed'
                            ? 'bg-primary'
                            : 'bg-secondary'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="small">
                      {o.trackingNumber ? (
                        <div>
                          <strong>{o.courierName || 'Courier'}:</strong>
                          <div>{o.trackingNumber}</div>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-outline-success btn-sm rounded-pill px-3"
                        onClick={() => handleOpenUpdate(o)}
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Update Order #{selectedOrder._id.slice(-8)}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>

              <form onSubmit={handleSaveUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Order Status</label>
                    <select
                      className="form-select"
                      value={updateForm.orderStatus}
                      onChange={(e) => setUpdateForm({ ...updateForm, orderStatus: e.target.value })}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Courier Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Delhivery / BlueDart / India Post"
                      value={updateForm.courierName}
                      onChange={(e) => setUpdateForm({ ...updateForm, courierName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Tracking Number / AWB</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. DEL123456789IN"
                      value={updateForm.trackingNumber}
                      onChange={(e) => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setSelectedOrder(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-velvi px-4">
                    Save Updates
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
