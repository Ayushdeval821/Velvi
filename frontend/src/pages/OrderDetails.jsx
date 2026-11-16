import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as orderService from '../services/orderService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FaArrowLeft, FaCheckCircle, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading order details..." />;
  if (!order) return <div className="container py-5 text-center">Order not found.</div>;

  return (
    <div className="container py-5">
      <Link to="/my-orders" className="btn btn-link text-muted p-0 mb-4 d-inline-flex align-items-center gap-1 text-decoration-none">
        <FaArrowLeft size={12} /> Back to My Orders
      </Link>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <span className="text-muted small">Order ID</span>
          <h2 className="h4 fw-bold m-0">#{order._id}</h2>
          <small className="text-muted">Placed on {new Date(order.createdAt).toLocaleString()}</small>
        </div>
        <div className="d-flex gap-2 mt-2 mt-md-0">
          <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 fs-6`}>
            {order.isPaid ? 'Payment: Paid' : 'Payment: Pending'}
          </span>
          <span className="badge bg-secondary px-3 py-2 fs-6">
            Status: {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Ordered items */}
        <div className="col-lg-8">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white mb-4">
            <h5 className="fw-bold mb-3">Items in this Order</h5>
            {order.orderItems.map((item) => (
              <div key={item._id} className="d-flex align-items-center justify-content-between py-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.image || '/stevia-drop.jpg'}
                    alt={item.name}
                    width="60"
                    height="60"
                    className="rounded border object-fit-contain p-1"
                  />
                  <div>
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <small className="text-muted">Qty: {item.quantity} &times; ₹{item.price}</small>
                  </div>
                </div>
                <span className="fw-bold fs-6">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Courier & Tracking if shipped */}
          {order.trackingNumber && (
            <div className="card p-4 border-0 rounded-4 shadow-sm bg-white mb-4">
              <h5 className="fw-bold mb-2 d-flex align-items-center gap-2">
                <FaTruck className="text-success" /> Shipment Tracking
              </h5>
              <p className="text-muted small mb-2">
                Courier Partner: <strong>{order.courierName || 'Standard Delivery'}</strong>
              </p>
              <p className="text-muted small m-0">
                Tracking Number: <strong>{order.trackingNumber}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Shipping address & summary */}
        <div className="col-lg-4">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaMapMarkerAlt className="text-success" /> Shipping Details
            </h5>
            <p className="fw-bold mb-1">{order.shippingAddress.name}</p>
            <p className="text-muted small mb-1">{order.shippingAddress.phone}</p>
            <p className="text-muted small mb-0">
              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
          </div>

          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white">
            <h5 className="fw-bold mb-3">Payment Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-5 fw-bold">
              <span>Total</span>
              <span style={{ color: 'var(--forest)' }}>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
