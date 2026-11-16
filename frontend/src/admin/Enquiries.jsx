import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AlertMessage from '../components/AlertMessage.jsx';
import { FaEnvelopeOpenText, FaReply, FaCheck } from 'react-icons/fa';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await adminService.adminGetEnquiries();
      setEnquiries(res.data || []);
    } catch (err) {
      console.error('Failed to load enquiries:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReply = (enq) => {
    setSelectedEnquiry(enq);
    setReplyText(enq.adminReply || '');
  };

  const handleSaveReply = async (status = 'Replied') => {
    try {
      await adminService.adminUpdateEnquiry(selectedEnquiry._id, {
        adminReply: replyText,
        status,
      });
      setStatusMessage('Enquiry updated successfully');
      setSelectedEnquiry(null);
      loadEnquiries();
    } catch (err) {
      console.error('Failed to update enquiry:', err.message);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold m-0" style={{ color: 'var(--forest)' }}>
          Customer Purchase Enquiries
        </h2>
        <small className="text-muted">Messages sent via contact forms or WhatsApp purchase requests</small>
      </div>

      {statusMessage && (
        <AlertMessage variant="success" onClose={() => setStatusMessage(null)}>
          {statusMessage}
        </AlertMessage>
      )}

      {loading ? (
        <LoadingSpinner message="Loading customer messages..." />
      ) : enquiries.length === 0 ? (
        <div className="card p-5 border-0 rounded-4 shadow-sm bg-white text-center">
          <FaEnvelopeOpenText size={48} className="text-muted mb-2 mx-auto" />
          <h5>No customer enquiries yet</h5>
        </div>
      ) : (
        <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Sender</th>
                  <th>Subject</th>
                  <th>Message Preview</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="border-bottom">
                    <td className="ps-4">
                      <div className="fw-bold">{enq.name}</div>
                      <small className="text-muted d-block">{enq.email}</small>
                      <small className="text-muted">{enq.phone}</small>
                    </td>
                    <td className="small fw-semibold">{enq.subject || 'General Enquiry'}</td>
                    <td className="small text-muted" style={{ maxWidth: '300px' }}>
                      <div className="text-truncate">{enq.message}</div>
                    </td>
                    <td className="text-muted small">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          enq.status === 'Resolved'
                            ? 'bg-success'
                            : enq.status === 'Replied'
                            ? 'bg-info'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-outline-success btn-sm rounded-pill px-3"
                        onClick={() => handleOpenReply(enq)}
                      >
                        <FaReply className="me-1" /> View / Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedEnquiry && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Enquiry from {selectedEnquiry.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedEnquiry(null)}></button>
              </div>

              <div className="modal-body">
                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="small text-muted mb-1">
                    <strong>Email:</strong> {selectedEnquiry.email} &middot;{' '}
                    <strong>Phone:</strong> {selectedEnquiry.phone || 'N/A'}
                  </div>
                  <div className="fw-bold small mb-2">{selectedEnquiry.subject}</div>
                  <p className="small m-0 text-dark">{selectedEnquiry.message}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Admin Response / Internal Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter reply notes, call outcome, or resolved status..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer border-0 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleSaveReply('Resolved')}
                >
                  <FaCheck className="me-1" /> Mark Resolved
                </button>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setSelectedEnquiry(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-velvi btn-sm" onClick={() => handleSaveReply('Replied')}>
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
