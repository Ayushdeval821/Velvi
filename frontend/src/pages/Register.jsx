import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AlertMessage from '../components/AlertMessage.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      navigate('/');
    } catch (err) {
      // handled in context
    }
  };

  return (
    <div className="container py-5 my-md-4">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white">
            <div className="text-center mb-4">
              <img src="/logo.svg" alt="VELVI NATURALS" width="56" height="56" className="mb-2" />
              <h2 className="fw-bold" style={{ color: 'var(--forest)' }}>Create an Account</h2>
              <p className="text-muted small">Join VELVI NATURALS for a healthier, natural lifestyle</p>
            </div>

            {(error || localError) && (
              <AlertMessage variant="danger">{localError || error}</AlertMessage>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="row g-2 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Confirm Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-velvi w-100 py-2 mb-3"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register Now'}
              </button>
            </form>

            <div className="text-center pt-3 border-top">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="fw-bold text-success text-decoration-none small">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
