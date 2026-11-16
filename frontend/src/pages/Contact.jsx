import React, { useState } from 'react';
import * as enquiryService from '../services/enquiryService.js';
import AlertMessage from '../components/AlertMessage.jsx';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: null, error: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, error: null });

    try {
      await enquiryService.sendEnquiry(form);
      setStatus({
        success: 'Thank you! Your message has been sent successfully. We will get back to you shortly.',
        error: null,
      });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ success: null, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <p className="kicker">Reach Out</p>
        <h1 className="display-5 fw-bold" style={{ color: 'var(--forest)' }}>
          Contact VELVI NATURALS
        </h1>
        <p className="text-muted">
          We are here to answer your questions regarding Stevia Drop, bulk ordering, or distribution.
        </p>
      </div>

      <div className="row g-5">
        {/* Contact info cards */}
        <div className="col-lg-5">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white mb-4">
            <h5 className="fw-bold mb-4">Get In Touch</h5>

            <div className="d-flex align-items-start gap-3 mb-3">
              <FaMapMarkerAlt className="text-success mt-1 fs-5 flex-shrink-0" />
              <div>
                <strong>Office Address</strong>
                <p className="text-muted small m-0">
                  354, Jawahar Nagar, Bareilly, Uttar Pradesh, India - 243001
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-3">
              <FaPhoneAlt className="text-success mt-1 fs-5 flex-shrink-0" />
              <div>
                <strong>Phone Support</strong>
                <p className="m-0">
                  <a href="tel:+919451155771" className="text-decoration-none text-dark fw-bold">
                    +91 94511 55771
                  </a>
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <FaEnvelope className="text-success mt-1 fs-5 flex-shrink-0" />
              <div>
                <strong>Email Address</strong>
                <p className="m-0">
                  <a href="mailto:velvinaturals@gmail.com" className="text-decoration-none text-dark">
                    velvinaturals@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/919451155771?text=Hello%20VELVI%20NATURALS%2C%20I%20would%20like%20to%20enquire%20about%20Stevia%20Drop."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success d-flex align-items-center justify-content-center gap-2 rounded-pill py-2"
            >
              <FaWhatsapp size={20} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-7">
          <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white">
            <h4 className="fw-bold mb-3">Send a Message</h4>

            {status.success && <AlertMessage variant="success">{status.success}</AlertMessage>}
            {status.error && <AlertMessage variant="danger">{status.error}</AlertMessage>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Bulk Order / General Question"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Your Message *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    required
                    placeholder="Type your message here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </div>
                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-velvi px-5 py-2" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
