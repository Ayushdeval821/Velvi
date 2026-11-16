import React, { useEffect, useState } from 'react';
import * as productService from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [sort]);

  const fetchProducts = async (searchQuery = search) => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        search: searchQuery,
        sort,
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <p className="kicker">Velvi Natural Store</p>
        <h1 className="display-5 fw-bold" style={{ color: 'var(--forest)' }}>
          All Natural Products
        </h1>
        <p className="text-muted">
          Browse our organic sweeteners and wellness drops designed for healthy everyday living.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-3 p-md-4 border-0 rounded-4 shadow-sm mb-5 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-7">
            <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Search products (e.g. Stevia Drop)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-velvi btn-sm px-4">
                Search
              </button>
            </form>
          </div>

          <div className="col-md-5 d-flex align-items-center justify-content-md-end gap-2">
            <span className="text-muted small d-flex align-items-center gap-1">
              <FaFilter /> Sort:
            </span>
            <select
              className="form-select form-select-sm w-auto border-0 bg-light rounded-pill px-3"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <LoadingSpinner message="Fetching products..." />
      ) : products.length > 0 ? (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="fs-5 text-muted">No products found matching your search.</p>
          <button
            className="btn btn-velvi mt-2"
            onClick={() => {
              setSearch('');
              fetchProducts('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
