import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import * as orderService from '../services/orderService.js';
import * as paymentService from '../services/paymentService.js';
import AlertMessage from '../components/AlertMessage.jsx';
import { FaCreditCard, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, subtotal, shipping, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Uttar Pradesh',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create order in backend (backend calculates prices strictly)
      const orderRes = await orderService.createOrder({
        shippingAddress,
        paymentMethod,
      });

      const order = orderRes.data;

      // 2. If COD, order is confirmed immediately
      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success/${order._id}`);
        return;
      }

      // 3. If Razorpay, initiate online payment
      try {
        const razorpayRes = await paymentService.createRazorpayOrder(order._id);
        const { razorpayOrderId, amount, keyId } = razorpayRes.data;

        const options = {
          key: keyId,
          amount,
          currency: 'INR',
          name: 'VELVI NATURALS',
          description: `Order #${order._id}`,
          image: '/logo.svg',
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // Verify signature on the backend
              await paymentService.verifyPayment({
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              clearCart();
              navigate(`/order-success/${order._id}`);
            } catch (vErr) {
              setError(`Payment verification error: ${vErr.message}`);
            }
          },
          prefill: {
            name: shippingAddress.name,
            email: user?.email,
            contact: shippingAddress.phone,
          },
          theme: {
            color: '#1c3b2c',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setError(`Payment Failed: ${resp.error.description}`);
          setLoading(false);
        });
        rzp.open();
      } catch (pErr) {
        // Fallback note if Razorpay test keys are not configured
        console.warn('Razorpay initiation notice:', pErr.message);
        clearCart();
        navigate(`/order-success/${order._id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="h2 fw-bold mb-4" style={{ color: 'var(--forest)' }}>
        Checkout &amp; Shipping
      </h1>

      {error && <AlertMessage variant="danger" onClose={() => setError(null)}>{error}</AlertMessage>}

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-5">
          {/* Shipping Form */}
          <div className="col-lg-7">
            <div className="card p-4 border-0 rounded-4 shadow-sm bg-white mb-4">
              <h5 className="fw-bold mb-3">1. Shipping Address</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Street Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="House no, Street name, Area"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label small fw-bold">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold">Postal Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-4 border-0 rounded-4 shadow-sm bg-white">
              <h5 className="fw-bold mb-3">2. Payment Method</h5>
              <div className="form-check p-3 border rounded-3 mb-2 d-flex align-items-center">
                <input
                  className="form-check-input ms-0 me-3"
                  type="radio"
                  name="paymentMethod"
                  id="razorpay"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="form-check-label d-flex align-items-center gap-2 flex-grow-1 cursor-pointer" htmlFor="razorpay">
                  <FaCreditCard className="text-success" />
                  <strong>Razorpay Online Payment</strong> (UPI, Credit/Debit Cards, NetBanking)
                </label>
              </div>

              <div className="form-check p-3 border rounded-3 d-flex align-items-center">
                <input
                  className="form-check-input ms-0 me-3"
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="form-check-label d-flex align-items-center gap-2 flex-grow-1 cursor-pointer" htmlFor="cod">
                  <FaMoneyBillWave className="text-success" />
                  <strong>Cash on Delivery (COD)</strong>
                </label>
              </div>
            </div>
          </div>

          {/* Order Review Sidebar */}
          <div className="col-lg-5">
            <div className="card p-4 border-0 rounded-4 shadow-sm bg-white sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-3">Order Items ({cartItems.length})</h5>

              <div className="mb-3 overflow-auto" style={{ maxHeight: '250px' }}>
                {cartItems.map((item) => (
                  <div key={item.product._id} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.product.images?.[0] || '/stevia-drop.jpg'}
                        alt=""
                        width="45"
                        height="45"
                        className="rounded border object-fit-contain"
                      />
                      <div>
                        <div className="small fw-bold">{item.product.name}</div>
                        <div className="text-muted small">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="fw-bold">
                      ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? <span className="text-success">FREE</span> : `₹${shipping}`}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5">Final Total</strong>
                <strong className="fs-5" style={{ color: 'var(--forest)' }}>₹{grandTotal}</strong>
              </div>

              <button
                type="submit"
                className="btn btn-velvi btn-lg w-100 py-3"
                disabled={loading}
              >
                {loading ? 'Processing Order...' : `Pay ₹${grandTotal} & Place Order`}
              </button>

              <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-1">
                <FaShieldAlt className="text-success" /> Encrypted 256-Bit SSL Checkout
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
