import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaShieldAlt } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, shipping, grandTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="mb-4 text-muted">
          <FaShoppingBag size={64} style={{ color: 'var(--sage)' }} />
        </div>
        <h2 className="fw-bold mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-muted mb-4">Discover our pure natural sweeteners and add them to your cart.</p>
        <Link to="/shop" className="btn btn-velvi btn-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold m-0" style={{ color: 'var(--forest)' }}>
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>
        <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="row g-5">
        {/* Cart Items List */}
        <div className="col-lg-8">
          <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead style={{ background: 'var(--cream)' }}>
                  <tr>
                    <th scope="col" className="ps-4 py-3">Product</th>
                    <th scope="col" className="py-3">Price</th>
                    <th scope="col" className="py-3 text-center">Quantity</th>
                    <th scope="col" className="py-3">Total</th>
                    <th scope="col" className="pe-4 py-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const product = item.product;
                    const price =
                      product.discountPrice && product.discountPrice < product.price
                        ? product.discountPrice
                        : product.price;
                    const itemTotal = price * item.quantity;

                    return (
                      <tr key={product._id} className="border-bottom">
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={product.images?.[0] || '/stevia-drop.jpg'}
                              alt={product.name}
                              width="60"
                              height="60"
                              className="rounded-3 border object-fit-contain p-1"
                            />
                            <div>
                              <Link
                                to={`/product/${product.slug || product._id}`}
                                className="fw-bold text-dark text-decoration-none d-block"
                              >
                                {product.name}
                              </Link>
                              <small className="text-muted">{product.packSize || '10 ml'}</small>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 fw-semibold">₹{price}</td>

                        <td className="py-3">
                          <div className="input-group input-group-sm mx-auto" style={{ width: '100px' }}>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(product._id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control text-center bg-white"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => updateQuantity(product._id, item.quantity + 1)}
                              disabled={item.quantity >= product.stock}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 fw-bold text-success">₹{itemTotal}</td>

                        <td className="pe-4 py-3 text-end">
                          <button
                            className="btn btn-link text-danger p-0"
                            onClick={() => removeFromCart(product._id)}
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-light d-flex justify-content-between align-items-center">
              <Link to="/shop" className="btn btn-link text-decoration-none text-muted d-flex align-items-center gap-2">
                <FaArrowLeft size={12} /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white">
            <h5 className="fw-bold mb-4">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-bold">₹{subtotal}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Shipping</span>
              <span className="fw-bold">
                {shipping === 0 ? <span className="text-success">FREE</span> : `₹${shipping}`}
              </span>
            </div>

            {shipping > 0 && (
              <div className="alert alert-warning py-2 small mb-3">
                Add ₹{299 - subtotal} more for <strong>FREE shipping</strong>!
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold">Total Amount</span>
              <span className="fs-5 fw-bold" style={{ color: 'var(--forest)' }}>
                ₹{grandTotal}
              </span>
            </div>

            <button
              className="btn btn-velvi btn-lg w-100 py-3 mb-3"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
              <FaShieldAlt className="text-success" />
              <span>Safe &amp; Secure Payment Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
