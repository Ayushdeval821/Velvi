import React from 'react';

const ShippingReturn = () => {
  return (
    <div className="container py-5 my-md-3">
      <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white mx-auto" style={{ maxWidth: '850px' }}>
        <p className="kicker">Policy</p>
        <h1 className="h2 fw-bold mb-4" style={{ color: 'var(--forest)' }}>
          Shipping &amp; Return Policy
        </h1>

        <h5 className="fw-bold mt-3 mb-2">1. Shipping Coverage &amp; Delivery Timelines</h5>
        <p className="text-muted">
          We ship across all pin codes in India through trusted courier partners. Standard shipping takes 3-7 business days depending on delivery location. Free shipping is provided for all orders with a subtotal value of ₹299 or higher; a nominal shipping fee of ₹49 applies otherwise.
        </p>

        <h5 className="fw-bold mt-4 mb-2">2. Order Tracking</h5>
        <p className="text-muted">
          Once your order has been dispatched, you will receive tracking details via SMS/email and can monitor progress in your "My Orders" account dashboard.
        </p>

        <h5 className="fw-bold mt-4 mb-2">3. Returns &amp; Replacements</h5>
        <p className="text-muted">
          Due to the hygienic nature of food and consumable products like Stevia Drop, opened or used bottles cannot be returned. If you receive a damaged, leaked, or incorrect product, please notify us within 48 hours of delivery at <a href="mailto:velvinaturals@gmail.com">velvinaturals@gmail.com</a> with photographs of the packaging. We will promptly arrange a replacement or refund.
        </p>
      </div>
    </div>
  );
};

export default ShippingReturn;
