import React from 'react';

const Terms = () => {
  return (
    <div className="container py-5 my-md-3">
      <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white mx-auto" style={{ maxWidth: '850px' }}>
        <p className="kicker">Agreement</p>
        <h1 className="h2 fw-bold mb-4" style={{ color: 'var(--forest)' }}>
          Terms and Conditions
        </h1>
        <p className="text-muted small">Effective date: 14 November 2026</p>

        <p className="text-muted">
          These Terms and Conditions govern your use of the VELVI NATURALS website and the purchase of products provided by VELVI NATURALS PRIVATE LIMITED.
        </p>

        <h5 className="fw-bold mt-4 mb-2">1. Product Information &amp; Disclaimer</h5>
        <p className="text-muted">
          VELVI NATURALS offers Stevia Drop, a 10 ml liquid sweetener. Products must be used strictly in accordance with directions printed on the label. Content on this website is for informational and purchasing purposes only and is not medical advice.
        </p>

        <h5 className="fw-bold mt-4 mb-2">2. Pricing and Payment</h5>
        <p className="text-muted">
          All product prices are quoted in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to modify prices or correct pricing discrepancies prior to order confirmation.
        </p>

        <h5 className="fw-bold mt-4 mb-2">3. Intellectual Property</h5>
        <p className="text-muted">
          All trademarks, logos, brand names, visual designs, and copy are the proprietary property of VELVI NATURALS PRIVATE LIMITED.
        </p>

        <h5 className="fw-bold mt-4 mb-2">4. Governing Law</h5>
        <p className="text-muted">
          These terms are governed by and construed under the laws of India. Any legal proceedings will be subject to the jurisdiction of the competent courts in Bareilly, Uttar Pradesh.
        </p>
      </div>
    </div>
  );
};

export default Terms;
