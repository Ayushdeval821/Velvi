import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { FaHeart } from 'react-icons/fa';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <p className="kicker">Saved For Later</p>
        <h1 className="display-6 fw-bold" style={{ color: 'var(--forest)' }}>
          My Wishlist
        </h1>
        <p className="text-muted">Your favorite natural products saved in one place</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="card p-5 border-0 rounded-4 shadow-sm bg-white text-center my-4">
          <FaHeart size={56} className="text-muted mb-3 mx-auto" />
          <h4 className="fw-bold mb-2">Your wishlist is empty</h4>
          <p className="text-muted mb-4">Click the heart icon on any product to save it here.</p>
          <div>
            <Link to="/shop" className="btn btn-velvi">
              Explore Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {wishlist.map((product) => (
            <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
