import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div style={{ background: 'var(--forest-deep)', color: 'var(--cream)', fontSize: '0.8rem', padding: '0.4rem 0', textAlign: 'center', letterSpacing: '0.05em' }}>
        <span>🌿 Pure Plant Sweetness | Free Shipping on Orders Above ₹299!</span>
      </div>

      <nav className="navbar navbar-expand-lg velvi-nav">
        <div className="container">
          {/* Brand Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/logo.svg" alt="VELVI NATURALS" width="42" height="42" />
            <div className="brand-text">
              <span className="brand-name">VELVI</span>
              <span className="brand-sub">NATURALS</span>
            </div>
          </Link>

          {/* Mobile Cart & Hamburger */}
          <div className="d-flex align-items-center gap-3 d-lg-none">
            <Link to="/cart" className="position-relative text-dark fs-5">
              <FaShoppingCart style={{ color: 'var(--forest)' }} />
              {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
            </Link>
            <button
              className="btn p-1 text-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarMain">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/shop" onClick={() => setMobileMenuOpen(false)}>
                  Shop
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link text-warning fw-bold d-flex align-items-center gap-1"
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaShieldAlt /> Admin Panel
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Desktop Actions */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <Link to="/wishlist" className="position-relative p-2 text-dark" title="Wishlist">
                <FaHeart style={{ color: 'var(--forest)', fontSize: '1.2rem' }} />
                {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
              </Link>

              <Link to="/cart" className="position-relative p-2 text-dark d-none d-lg-inline-block" title="Cart">
                <FaShoppingCart style={{ color: 'var(--forest)', fontSize: '1.2rem' }} />
                {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
              </Link>

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-dark btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUser size={13} /> {user.name.split(' ')[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                    <li>
                      <Link className="dropdown-item" to="/my-account">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-orders">
                        My Orders
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link className="dropdown-item text-success fw-bold" to="/admin/dashboard">
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-velvi-outline btn-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-velvi btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
