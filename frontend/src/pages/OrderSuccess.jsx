import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as orderService from '../services/orderService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner message="Confirming your order..." />;

  return (
    <div className="container py-5 text-center my-4">
      <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white mx-auto" style={{ maxWidth: '650px' }}>
        <div className="text-success mb-3">
          <FaCheckCircle size={64} />
        </div>
        <h1 className="h2 fw-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted mb-4">
          Thank you for choosing VELVI NATURALS. Your order has been placed and is being prepared with care.
        </p>

        {order && (
          <div className="p-3 rounded-3 mb-4 text-start" style={{ background: 'var(--cream)' }}>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Order Reference:</span>
              <span className="fw-bold small">{order._id}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Payment Method:</span>
              <span className="fw-bold small">{order.paymentMethod}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Payment Status:</span>
              <span className={`fw-bold small ${order.isPaid ? 'text-success' : 'text-warning'}`}>
                {order.isPaid ? 'Paid' : 'Pending / Cash on Delivery'}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted small">Total Amount:</span>
              <span className="fw-bold fs-6 text-dark">₹{order.totalPrice}</span>
            </div>
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/my-orders" className="btn btn-velvi">
            View My Orders <FaArrowRight size={12} className="ms-1" />
          </Link>
          <Link to="/shop" className="btn btn-velvi-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
