import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as productService from '../services/productService.js';
import * as enquiryService from '../services/enquiryService.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AlertMessage from '../components/AlertMessage.jsx';
import { FaCheckCircle, FaLeaf, FaTint, FaSuitcase, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [enquiryStatus, setEnquiryStatus] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      setLoading(true);
      const res = await productService.getFeaturedProducts(4);
      setFeaturedProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load featured products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus({ loading: true, success: null, error: null });
    try {
      await enquiryService.sendEnquiry(enquiryForm);
      setEnquiryStatus({
        loading: false,
        success: 'Thank you! Your enquiry has been sent. We will get in touch with you shortly.',
        error: null,
      });
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setEnquiryStatus({ loading: false, success: null, error: err.message });
    }
  };

  return (
    <>
      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <section className="section py-5" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p className="kicker">Stevia Drop &middot; 10 ml</p>
              <h1 className="display-4 fw-bold mb-3" style={{ color: 'var(--forest)' }}>
                Natural Sweetness, <em style={{ fontStyle: 'italic', color: 'var(--leaf)' }}>Every Drop.</em>
              </h1>
              <p className="lead text-muted mb-4">
                Discover VELVI NATURALS Stevia Drop – a convenient liquid sweetener crafted for everyday moments. Add natural plant-based sweetness to tea, coffee, desserts, and foods without the guilt of refined sugar.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/shop" className="btn btn-velvi btn-lg">
                  Shop Now
                </Link>
                <Link to="/about" className="btn btn-velvi-outline btn-lg">
                  Learn More
                </Link>
              </div>
              <div className="d-flex gap-4 pt-3 border-top" style={{ borderColor: 'var(--line)' }}>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">10 ml</h6>
                  <small className="text-muted">Net Volume</small>
                </div>
                <div className="border-start ps-4" style={{ borderColor: 'var(--line)' }}>
                  <h6 className="fw-bold mb-0 text-dark">Dropper Bottle</h6>
                  <small className="text-muted">Easy Portioning</small>
                </div>
                <div className="border-start ps-4" style={{ borderColor: 'var(--line)' }}>
                  <h6 className="fw-bold mb-0 text-dark">Plant Origin</h6>
                  <small className="text-muted">Stevia Extract</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div className="position-relative d-inline-block">
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '380px',
                    height: '380px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(142,175,134,0.3) 0%, rgba(246,241,231,0) 70%)',
                    zIndex: 0,
                  }}
                ></div>
                <img
                  src="/stevia-drop.jpg"
                  alt="VELVI NATURALS Stevia Drop 10 ml bottle and box packaging"
                  className="img-fluid position-relative rounded-4 shadow-lg"
                  style={{ maxHeight: '480px', zIndex: 1, objectFit: 'contain' }}
                />
                <span
                  className="position-absolute bottom-0 start-50 translate-middle-x badge px-3 py-2 rounded-pill shadow"
                  style={{ background: 'var(--forest)', color: 'var(--cream)', fontSize: '0.85rem', zIndex: 2 }}
                >
                  Net Vol. 10 ml
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="section band-white">
        <div className="container">
          <div className="text-center mb-5">
            <p className="kicker">Our Collection</p>
            <h2 className="display-6 fw-bold">Featured Natural Products</h2>
            <p className="text-muted">Pure, lab-tested, and prepared according to highest quality standards.</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading products..." />
          ) : featuredProducts.length > 0 ? (
            <div className="row g-4 justify-content-center">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-lg-3 col-md-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No featured products currently available.</p>
              <Link to="/shop" className="btn btn-velvi">
                Browse Shop
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── PRODUCT BENEFITS ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <p className="kicker">Why It Works</p>
            <h2 className="display-6 fw-bold">Made for Everyday Sweetening</h2>
            <p className="text-muted">Designed for modern lifestyle routines with ease of use in mind.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 p-4 border-0 rounded-4 shadow-sm text-center">
                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: 64, height: 64, background: 'rgba(47, 109, 69, 0.1)', color: 'var(--leaf)' }}>
                  <FaTint size={28} />
                </div>
                <h5 className="fw-bold">Liquid Drop Format</h5>
                <p className="text-muted small">
                  Stevia Drop is a liquid sweetener with a precision dropper, letting you add just the right amount of sweetness drop by drop.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 p-4 border-0 rounded-4 shadow-sm text-center">
                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: 64, height: 64, background: 'rgba(47, 109, 69, 0.1)', color: 'var(--leaf)' }}>
                  <FaLeaf size={28} />
                </div>
                <h5 className="fw-bold">Plant-Based Goodness</h5>
                <p className="text-muted small">
                  Derived from natural Stevia rebaudiana leaf extracts, providing wholesome sweetness without empty refined sugar calories.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 p-4 border-0 rounded-4 shadow-sm text-center">
                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: 64, height: 64, background: 'rgba(47, 109, 69, 0.1)', color: 'var(--leaf)' }}>
                  <FaSuitcase size={28} />
                </div>
                <h5 className="fw-bold">Compact &amp; Portable</h5>
                <p className="text-muted small">
                  The compact 10 ml bottle easily fits in your pocket, purse, travel bag, or desk drawer for sweetness anywhere.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 p-4 border-0 rounded-4 shadow-sm text-center">
                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: 64, height: 64, background: 'rgba(47, 109, 69, 0.1)', color: 'var(--leaf)' }}>
                  <FaShieldAlt size={28} />
                </div>
                <h5 className="fw-bold">Pure Quality Standard</h5>
                <p className="text-muted small">
                  Packaged hygienically under strict quality control, ensuring consistent purity, taste, and safety in every single drop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ───────────────────────────────────────── */}
      <section className="section band-white">
        <div className="container">
          <div className="text-center mb-5">
            <p className="kicker">Simple Usage</p>
            <h2 className="display-6 fw-bold">Three Simple Steps</h2>
            <p className="text-muted">Effortlessly sweeten any hot or cold food or drink.</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4" style={{ background: 'var(--cream)' }}>
                <span className="display-4 fw-bold text-success d-block mb-2">01</span>
                <h5 className="fw-bold">Open the Dropper Bottle</h5>
                <p className="text-muted small m-0">Gently unscrew the child-friendly tamper-evident cap of the Stevia Drop bottle.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4" style={{ background: 'var(--cream)' }}>
                <span className="display-4 fw-bold text-success d-block mb-2">02</span>
                <h5 className="fw-bold">Add Desired Drops</h5>
                <p className="text-muted small m-0">Add 1 to 2 drops into your tea, coffee, lemon water, shake, or dessert dish.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4" style={{ background: 'var(--cream)' }}>
                <span className="display-4 fw-bold text-success d-block mb-2">03</span>
                <h5 className="fw-bold">Mix and Enjoy</h5>
                <p className="text-muted small m-0">Stir gently to dissolve immediately and experience delightful natural sweetness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PURCHASE ENQUIRY / CONTACT SECTION ───────────────── */}
      <section className="section" style={{ background: 'var(--cream-deep)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <p className="kicker">Direct Connect</p>
              <h2 className="display-6 fw-bold mb-3">Talk to VELVI NATURALS</h2>
              <p className="text-muted mb-4">
                Have bulk orders, questions about Stevia Drop, or looking for wholesale partnerships? Reach out to our dedicated support team in Bareilly, Uttar Pradesh.
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <span className="badge rounded-circle p-3 bg-white text-dark shadow-sm">📍</span>
                  <div>
                    <strong>Head Office</strong>
                    <div className="text-muted small">354, Jawahar Nagar, Bareilly, UP 243001</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge rounded-circle p-3 bg-white text-dark shadow-sm">📞</span>
                  <div>
                    <strong>Phone Support</strong>
                    <div className="text-muted small">+91 94511 55771</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="badge rounded-circle p-3 bg-white text-dark shadow-sm">✉️</span>
                  <div>
                    <strong>Email Address</strong>
                    <div className="text-muted small">velvinaturals@gmail.com</div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/919451155771?text=Hello%20VELVI%20NATURALS%2C%20I%20would%20like%20to%20enquire%20about%20Stevia%20Drop."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2"
              >
                <FaWhatsapp size={20} /> Chat on WhatsApp
              </a>
            </div>

            <div className="col-lg-7">
              <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white">
                <h4 className="fw-bold mb-3">Send Us an Enquiry</h4>
                {enquiryStatus.success && <AlertMessage variant="success">{enquiryStatus.success}</AlertMessage>}
                {enquiryStatus.error && <AlertMessage variant="danger">{enquiryStatus.error}</AlertMessage>}

                <form onSubmit={handleEnquirySubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Message *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        required
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        placeholder="I would like to enquire about Stevia Drop (10 ml)..."
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-velvi w-100 py-2"
                        disabled={enquiryStatus.loading}
                      >
                        {enquiryStatus.loading ? 'Sending Enquiry...' : 'Submit Enquiry'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
