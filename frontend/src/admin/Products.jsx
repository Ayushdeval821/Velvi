import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AlertMessage from '../components/AlertMessage.jsx';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBox } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState({ success: null, error: null });

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    packSize: '10 ml',
    SKU: '',
    images: '/stevia-drop.jpg',
    isActive: true,
  });

  useEffect(() => {
    loadProducts();
  }, [search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await adminService.adminGetProducts({ search });
      setProducts(res.data || []);
    } catch (err) {
      setStatus({ success: null, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      stock: 100,
      packSize: '10 ml',
      SKU: '',
      images: '/stevia-drop.jpg',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice || '',
      stock: p.stock,
      packSize: p.packSize || '10 ml',
      SKU: p.SKU || '',
      images: p.images?.[0] || '/stevia-drop.jpg',
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: null, error: null });

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
      images: [form.images],
    };

    try {
      if (editingProduct) {
        await adminService.adminUpdateProduct(editingProduct._id, payload);
        setStatus({ success: 'Product updated successfully', error: null });
      } else {
        await adminService.adminCreateProduct(payload);
        setStatus({ success: 'Product created successfully', error: null });
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      setStatus({ success: null, error: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.adminDeleteProduct(id);
      setStatus({ success: 'Product deleted', error: null });
      loadProducts();
    } catch (err) {
      setStatus({ success: null, error: err.message });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0" style={{ color: 'var(--forest)' }}>
            Product Inventory Management
          </h2>
          <small className="text-muted">Manage products, pricing, stock levels, and SKUs</small>
        </div>
        <button className="btn btn-velvi btn-sm d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {status.success && <AlertMessage variant="success" onClose={() => setStatus({ ...status, success: null })}>{status.success}</AlertMessage>}
      {status.error && <AlertMessage variant="danger" onClose={() => setStatus({ ...status, error: null })}>{status.error}</AlertMessage>}

      {/* Search Filter */}
      <div className="card p-3 border-0 rounded-4 shadow-sm bg-white mb-4">
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-0 bg-light"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner message="Loading products list..." />
      ) : products.length === 0 ? (
        <div className="card p-5 border-0 rounded-4 shadow-sm bg-white text-center">
          <FaBox size={48} className="text-muted mb-2 mx-auto" />
          <h5>No products found</h5>
          <p className="text-muted small">Click "Add New Product" to populate your catalog.</p>
        </div>
      ) : (
        <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Discount Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-bottom">
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={p.images?.[0] || '/stevia-drop.jpg'}
                          alt=""
                          width="48"
                          height="48"
                          className="rounded border object-fit-contain p-1"
                        />
                        <div>
                          <div className="fw-bold">{p.name}</div>
                          <small className="text-muted">{p.packSize || '10 ml'}</small>
                        </div>
                      </div>
                    </td>
                    <td className="font-monospace small">{p.SKU}</td>
                    <td className="fw-semibold">₹{p.price}</td>
                    <td className="text-success fw-bold">
                      {p.discountPrice ? `₹${p.discountPrice}` : '—'}
                    </td>
                    <td>
                      <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'} rounded-pill`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.isActive ? 'bg-success-subtle text-success' : 'bg-secondary'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleOpenEdit(p)}
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(p._id)}
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Pack Size</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 10 ml"
                        value={form.packSize}
                        onChange={(e) => setForm({ ...form, packSize: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Description *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Original Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Discount Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        placeholder="Optional"
                        value={form.discountPrice}
                        onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Stock Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="0"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="/stevia-drop.jpg"
                        value={form.images}
                        onChange={(e) => setForm({ ...form, images: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6 d-flex align-items-center mt-4 pt-2">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isActiveSwitch"
                          checked={form.isActive}
                          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold small" htmlFor="isActiveSwitch">
                          Product is Active &amp; Visible to Customers
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-velvi px-4">
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
