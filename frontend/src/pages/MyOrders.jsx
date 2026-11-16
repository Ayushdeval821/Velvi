import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as orderService from '../services/orderService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FaBoxOpen, FaEye } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your order history..." />;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="h2 fw-bold" style={{ color: 'var(--forest)' }}>
          My Order History
        </h1>
        <p className="text-muted">Review tracking, payment status, and order details</p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-5 border-0 rounded-4 shadow-sm bg-white text-center">
          <FaBoxOpen size={56} className="text-muted mb-3 mx-auto" />
          <h4 className="fw-bold mb-2">You haven't placed any orders yet</h4>
          <p className="text-muted mb-4">Discover our pure Stevia Drop and start your wellness journey.</p>
          <div>
            <Link to="/shop" className="btn btn-velvi">
              Explore Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead style={{ background: 'var(--cream)' }}>
                <tr>
                  <th scope="col" className="ps-4 py-3">Order ID</th>
                  <th scope="col" className="py-3">Date</th>
                  <th scope="col" className="py-3">Items</th>
                  <th scope="col" className="py-3">Total Amount</th>
                  <th scope="col" className="py-3">Payment</th>
                  <th scope="col" className="py-3">Delivery Status</th>
                  <th scope="col" className="pe-4 py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-bottom">
                    <td className="ps-4 py-3 font-monospace small">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 text-muted small">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 small">
                      {order.orderItems.map((item) => (
                        <div key={item._id}>
                          {item.name} &times; {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 fw-bold">₹{order.totalPrice}</td>
                    <td className="py-3">
                      <span
                        className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning text-dark'} px-2 py-1`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-secondary px-2 py-1">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <Link
                        to={`/order/${order._id}`}
                        className="btn btn-outline-dark btn-sm rounded-pill px-3"
                      >
                        <FaEye className="me-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
