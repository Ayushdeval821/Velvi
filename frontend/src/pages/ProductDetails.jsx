import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as productService from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AlertMessage from '../components/AlertMessage.jsx';
import { FaShoppingCart, FaHeart, FaRegHeart, FaArrowLeft, FaCheck, FaTruck, FaShieldAlt } from 'react-icons/fa';

const ProductDetails = () => {
  const { idOrSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [addedMessage, setAddedMessage] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
  }, [idOrSlug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await productService.getProductByIdOrSlug(idOrSlug);
      setProduct(res.data);
      if (res.data?.images?.length > 0) {
        setSelectedImage(res.data.images[0]);
      }
    } catch (err) {
      console.error('Failed to load product:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  if (loading) return <LoadingSpinner message="Loading product details..." />;
  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-velvi mt-3">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const displayPrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="container py-5">
      <Link to="/shop" className="btn btn-link text-decoration-none text-muted mb-4 d-inline-flex align-items-center gap-1 p-0">
        <FaArrowLeft size={12} /> Back to Products
      </Link>

      {addedMessage && (
        <AlertMessage variant="success" onClose={() => setAddedMessage(false)}>
          Added {quantity} x {product.name} to your cart!
        </AlertMessage>
      )}

      <div className="row g-5">
        {/* Product Images */}
        <div className="col-lg-6">
          <div className="card p-3 border-0 rounded-4 shadow-sm bg-white text-center">
            <img
              src={selectedImage || product.images?.[0] || '/stevia-drop.jpg'}
              alt={product.name}
              className="img-fluid rounded-3 mx-auto"
              style={{ maxHeight: '420px', objectFit: 'contain' }}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 mt-3 overflow-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`btn p-1 border rounded-3 ${selectedImage === img ? 'border-success border-2' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt="" width="60" height="60" style={{ objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="col-lg-6">
          <span className="badge px-3 py-2 rounded-pill text-uppercase mb-2" style={{ background: 'var(--cream-deep)', color: 'var(--forest)' }}>
            {product.categoryName || 'Natural Sweetener'} &middot; {product.packSize || '10 ml'}
          </span>

          <h1 className="h2 fw-bold mb-2" style={{ color: 'var(--forest)' }}>
            {product.name}
          </h1>

          <div className="d-flex align-items-baseline gap-2 mb-3">
            <span className="fs-2 fw-bold text-dark">₹{displayPrice}</span>
            {hasDiscount && (
              <>
                <span className="fs-5 text-muted text-decoration-line-through">₹{product.price}</span>
                <span className="badge bg-success ms-2">Save ₹{product.price - product.discountPrice}</span>
              </>
            )}
          </div>

          <p className="text-muted mb-4">{product.description}</p>

          {/* Stock status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill">
                <FaCheck className="me-1" /> In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger px-3 py-2 rounded-pill">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="input-group" style={{ width: '130px' }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>

              <button className="btn btn-velvi btn-lg flex-grow-1" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>

              <button
                className="btn btn-outline-danger btn-lg p-3 rounded-circle d-flex align-items-center justify-content-center"
                onClick={() => toggleWishlist(product)}
                title="Wishlist"
              >
                {isFavorited ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="row g-3 py-3 border-top border-bottom" style={{ borderColor: 'var(--line)' }}>
            <div className="col-6 d-flex align-items-center gap-2 text-muted small">
              <FaTruck size={18} className="text-success" />
              <span>Free Delivery above ₹299</span>
            </div>
            <div className="col-6 d-flex align-items-center gap-2 text-muted small">
              <FaShieldAlt size={18} className="text-success" />
              <span>100% Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-5 pt-4">
        <ul className="nav nav-tabs justify-content-center border-bottom mb-4">
          <li className="nav-item">
            <button
              className={`nav-link border-0 fw-bold pb-3 ${activeTab === 'description' ? 'active text-success border-bottom border-success border-3' : 'text-muted'}`}
              onClick={() => setActiveTab('description')}
            >
              Description &amp; Highlights
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link border-0 fw-bold pb-3 ${activeTab === 'ingredients' ? 'active text-success border-bottom border-success border-3' : 'text-muted'}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients &amp; Info
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link border-0 fw-bold pb-3 ${activeTab === 'howToUse' ? 'active text-success border-bottom border-success border-3' : 'text-muted'}`}
              onClick={() => setActiveTab('howToUse')}
            >
              How to Use
            </button>
          </li>
        </ul>

        <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white">
          {activeTab === 'description' && (
            <div>
              <h5 className="fw-bold mb-3">About {product.name}</h5>
              <p className="text-muted">{product.description}</p>
              {product.benefits && product.benefits.length > 0 && (
                <div className="mt-4">
                  <h6 className="fw-bold mb-2">Key Highlights:</h6>
                  <ul className="text-muted">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="mb-1">{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h5 className="fw-bold mb-3">Ingredients Specification</h5>
              <p className="text-muted">{product.ingredients || 'Stevia extract and purified water.'}</p>
              <div className="p-3 rounded-3 mt-3" style={{ background: 'var(--cream)' }}>
                <strong className="text-dark">Packaging Notice:</strong>
                <p className="text-muted small m-0 mt-1">
                  Packed in 10 ml hygienic dropper bottle. Store in a cool, dry place away from direct sunlight. Follow instructions on the label.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div>
              <h5 className="fw-bold mb-3">Usage Directions</h5>
              <p className="text-muted">{product.howToUse || 'Add 1-2 drops to beverage and mix thoroughly.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
