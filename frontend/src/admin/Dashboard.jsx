import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../services/adminService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  FaRupeeSign,
  FaShoppingBag,
  FaUsers,
  FaBoxOpen,
  FaExclamationTriangle,
  FaEye,
} from 'react-icons/fa';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating dashboard analytics from database..." />;
  if (!data) return <div className="text-danger">Failed to load statistics.</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ color: 'var(--forest)' }}>
            Admin Dashboard Overview
          </h2>
          <small className="text-muted">Live data directly from MongoDB</small>
        </div>
        <Link to="/admin/products" className="btn btn-velvi btn-sm">
          Manage Inventory
        </Link>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small fw-bold">TOTAL REVENUE</span>
              <span className="badge rounded-circle p-2 bg-success text-white">
                <FaRupeeSign size={14} />
              </span>
            </div>
            <div className="stat-value text-success">₹{data.totalRevenue}</div>
            <small className="text-muted">From confirmed paid orders</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small fw-bold">TOTAL ORDERS</span>
              <span className="badge rounded-circle p-2 bg-primary text-white">
                <FaShoppingBag size={14} />
              </span>
            </div>
            <div className="stat-value">{data.totalOrders}</div>
            <small className="text-muted">{data.pendingOrders} pending fulfillment</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small fw-bold">CUSTOMERS</span>
              <span className="badge rounded-circle p-2 bg-info text-white">
                <FaUsers size={14} />
              </span>
            </div>
            <div className="stat-value">{data.totalCustomers}</div>
            <small className="text-muted">Registered accounts</small>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small fw-bold">TOTAL PRODUCTS</span>
              <span className="badge rounded-circle p-2 bg-warning text-dark">
                <FaBoxOpen size={14} />
              </span>
            </div>
            <div className="stat-value">{data.totalProducts}</div>
            <small className="text-muted">Catalog items</small>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white h-100">
            <h5 className="fw-bold mb-3">Order Status Pipeline</h5>
            <div className="row g-3 text-center">
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <div className="fs-3 fw-bold text-warning">{data.pendingOrders}</div>
                  <small className="text-muted">Pending</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <div className="fs-3 fw-bold text-primary">{data.confirmedOrders}</div>
                  <small className="text-muted">Confirmed</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <div className="fs-3 fw-bold text-info">{data.shippedOrders}</div>
                  <small className="text-muted">Shipped</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-light rounded-3">
                  <div className="fs-3 fw-bold text-success">{data.deliveredOrders}</div>
                  <small className="text-muted">Delivered</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="col-lg-4">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white h-100">
            <h5 className="fw-bold mb-3 text-danger d-flex align-items-center gap-2">
              <FaExclamationTriangle /> Low Stock Alerts
            </h5>
            {data.lowStockProducts.length === 0 ? (
              <p className="text-muted small">All active products have healthy inventory levels.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {data.lowStockProducts.map((p) => (
                  <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <div>
                      <div className="small fw-bold">{p.name}</div>
                      <small className="text-muted">SKU: {p.SKU}</small>
                    </div>
                    <span className="badge bg-danger rounded-pill">{p.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="fw-bold m-0">Recent Customer Orders</h5>
          <Link to="/admin/orders" className="btn btn-outline-dark btn-sm rounded-pill px-3">
            View All Orders
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="p-4 text-center text-muted">No orders placed yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="pe-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((ord) => (
                  <tr key={ord._id} className="border-bottom">
                    <td className="ps-4 font-monospace small">#{ord._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div className="small fw-bold">{ord.user?.name || ord.shippingAddress?.name}</div>
                      <small className="text-muted">{ord.user?.email}</small>
                    </td>
                    <td className="small">{ord.orderItems.length} items</td>
                    <td className="fw-bold">₹{ord.totalPrice}</td>
                    <td>
                      <span className="badge bg-secondary">{ord.orderStatus}</span>
                    </td>
                    <td>
                      <span className={`badge ${ord.isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {ord.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <Link to={`/admin/orders`} className="btn btn-sm btn-link text-decoration-none">
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
