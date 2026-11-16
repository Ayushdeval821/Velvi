import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FaChartPie,
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaEnvelopeOpenText,
  FaArrowLeft,
  FaSignOutAlt,
} from 'react-icons/fa';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="p-4 border-bottom border-secondary d-flex align-items-center gap-2">
          <img src="/logo.svg" alt="Velvi Logo" width="36" height="36" />
          <div>
            <h5 className="m-0 text-white fw-bold">VELVI ADMIN</h5>
            <small className="text-white-50">E-Commerce Management</small>
          </div>
        </div>

        <nav className="mt-3 flex-grow-1">
          <NavLink to="/admin/dashboard" end>
            <FaChartPie /> Dashboard
          </NavLink>
          <NavLink to="/admin/products">
            <FaBoxOpen /> Products
          </NavLink>
          <NavLink to="/admin/orders">
            <FaShoppingBag /> Orders
          </NavLink>
          <NavLink to="/admin/customers">
            <FaUsers /> Customers
          </NavLink>
          <NavLink to="/admin/enquiries">
            <FaEnvelopeOpenText /> Enquiries
          </NavLink>
        </nav>

        <div className="p-3 border-top border-secondary">
          <Link to="/" className="text-white-50 d-flex align-items-center gap-2 mb-2 p-2 rounded hover-bg">
            <FaArrowLeft /> View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-content">
        <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <span className="text-muted small">Logged in as</span>
            <h6 className="m-0 fw-bold">{user?.name} ({user?.email})</h6>
          </div>
          <span className="badge bg-success px-3 py-2">Admin Active</span>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
