import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product._id);
  const displayPrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const imageSrc = product.images?.[0] || '/stevia-drop.jpg';

  return (
    <div className="product-card">
      {hasDiscount && (
        <span className="badge-discount">
          Save ₹{product.price - product.discountPrice}
        </span>
      )}

      <button
        className="wishlist-btn"
        onClick={handleToggleWishlist}
        title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        aria-label="Wishlist"
      >
        {isFavorited ? <FaHeart color="#e74c3c" /> : <FaRegHeart color="var(--forest)" />}
      </button>

      <Link to={`/product/${product.slug || product._id}`} className="text-decoration-none">
        <div className="product-img-wrap">
          <img src={imageSrc} alt={product.name} loading="lazy" />
        </div>
      </Link>

      <div className="product-card-body">
        <span className="text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          {product.categoryName || 'Liquid Sweetener'} &middot; {product.packSize || '10 ml'}
        </span>

        <h4 className="mb-1" style={{ fontSize: '1.1rem' }}>
          <Link to={`/product/${product.slug || product._id}`} className="text-dark text-decoration-none">
            {product.name}
          </Link>
        </h4>

        <div className="d-flex align-items-baseline mb-3">
          <span className="price-current">₹{displayPrice}</span>
          {hasDiscount && <span className="price-original">₹{product.price}</span>}
        </div>

        <div className="mt-auto d-grid">
          {product.stock > 0 ? (
            <button className="btn btn-velvi btn-sm py-2" onClick={handleAddToCart}>
              <FaShoppingCart size={14} /> Add to Cart
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm py-2" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
