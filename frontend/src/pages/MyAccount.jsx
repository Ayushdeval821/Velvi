import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AlertMessage from '../components/AlertMessage.jsx';

const MyAccount = () => {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white">
            <h2 className="fw-bold mb-4" style={{ color: 'var(--forest)' }}>
              My Profile Settings
            </h2>

            {success && <AlertMessage variant="success" onClose={() => setSuccess(null)}>{success}</AlertMessage>}
            {error && <AlertMessage variant="danger" onClose={() => setError(null)}>{error}</AlertMessage>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="col-12 mt-4 pt-3 border-top">
                  <h5 className="fw-bold mb-3">Change Password (optional)</h5>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>

                <div className="col-12 mt-4">
                  <button type="submit" className="btn btn-velvi px-4 py-2" disabled={loading}>
                    {loading ? 'Saving Changes...' : 'Save Profile Changes'}
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

export default MyAccount;
