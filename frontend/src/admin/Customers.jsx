import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FaUsers, FaSearch, FaEnvelope, FaPhone } from 'react-icons/fa';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.adminGetCustomers({ search });
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold m-0" style={{ color: 'var(--forest)' }}>
          Customer Accounts
        </h2>
        <small className="text-muted">Registered customers and contact details</small>
      </div>

      <div className="card p-3 border-0 rounded-4 shadow-sm bg-white mb-4">
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-0 bg-light"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading customer directory..." />
      ) : customers.length === 0 ? (
        <div className="card p-5 border-0 rounded-4 shadow-sm bg-white text-center">
          <FaUsers size={48} className="text-muted mb-2 mx-auto" />
          <h5>No customers registered yet</h5>
        </div>
      ) : (
        <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined Date</th>
                  <th className="pe-4 text-end">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-bottom">
                    <td className="ps-4 fw-bold">{c.name}</td>
                    <td>
                      <span className="d-flex align-items-center gap-1 text-muted small">
                        <FaEnvelope size={12} /> {c.email}
                      </span>
                    </td>
                    <td>
                      {c.phone ? (
                        <span className="d-flex align-items-center gap-1 text-muted small">
                          <FaPhone size={12} /> {c.phone}
                        </span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="pe-4 text-end">
                      <span className="badge bg-success-subtle text-success">Active</span>
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

export default Customers;
