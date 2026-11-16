import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand info */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="d-flex align-items-center mb-3">
              <img src="/logo.svg" alt="VELVI NATURALS" width="44" height="44" />
              <div className="brand-text ms-2">
                <span className="brand-name text-white">VELVI</span>
                <span className="brand-sub" style={{ color: 'var(--sage)' }}>NATURALS</span>
              </div>
            </Link>
            <p style={{ color: 'rgba(246, 241, 231, 0.8)', fontSize: '0.95rem' }}>
              VELVI NATURALS PRIVATE LIMITED presents Stevia Drop, a 10 ml liquid sweetener in a convenient dropper bottle for everyday drinks and foods. Natural plant sweetness for everyday wellness.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a
                href="https://www.instagram.com/velvinaturals/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white fs-5"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/919451155771?text=Hello%20VELVI%20NATURALS%2C%20I%20would%20like%20to%20enquire%20about%20Stevia%20Drop."
                target="_blank"
                rel="noopener noreferrer"
                className="text-white fs-5"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a href="mailto:velvinaturals@gmail.com" className="text-white fs-5" aria-label="Email">
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-6">
            <h5 className="footer-title">Explore</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop Now</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/my-orders">Track Orders</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="col-lg-3 col-6">
            <h5 className="footer-title">Customer Care</h5>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/shipping-returns">Shipping & Returns</Link></li>
              <li><Link to="/contact">Wholesale Enquiry</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Registered Office</h5>
            <ul className="footer-links" style={{ color: 'rgba(246, 241, 231, 0.85)', fontSize: '0.9rem' }}>
              <li className="d-flex gap-2 align-items-start mb-2">
                <FaMapMarkerAlt className="mt-1 text-warning flex-shrink-0" />
                <span>354, Jawahar Nagar, Bareilly, Uttar Pradesh, India - 243001</span>
              </li>
              <li className="d-flex gap-2 align-items-center mb-2">
                <FaPhoneAlt className="text-warning flex-shrink-0" />
                <a href="tel:+919451155771">+91 94511 55771</a>
              </li>
              <li className="d-flex gap-2 align-items-center">
                <FaEnvelope className="text-warning flex-shrink-0" />
                <a href="mailto:velvinaturals@gmail.com">velvinaturals@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-base">
          <span>&copy; {new Date().getFullYear()} VELVI NATURALS PRIVATE LIMITED. All rights reserved.</span>
          <span>Stevia Drop &middot; 10 ml</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
