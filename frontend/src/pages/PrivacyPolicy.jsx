import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container py-5 my-md-3">
      <div className="card p-4 p-md-5 border-0 rounded-4 shadow-sm bg-white mx-auto" style={{ maxWidth: '850px' }}>
        <p className="kicker">Legal</p>
        <h1 className="h2 fw-bold mb-4" style={{ color: 'var(--forest)' }}>
          Privacy Policy
        </h1>
        <p className="text-muted small">Effective date: 14 November 2026</p>

        <p className="text-muted">
          VELVI NATURALS PRIVATE LIMITED ("we", "us", or "our") operates this website. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website, purchase products, or contact our team.
        </p>

        <h5 className="fw-bold mt-4 mb-2">1. Information We Collect</h5>
        <p className="text-muted">
          We collect personal information that you provide when registering, placing an order, or sending an enquiry, including your name, email address, phone number, shipping address, and order transaction records. We do not store sensitive credit/debit card numbers on our servers; payments are processed securely through RBI-compliant payment gateways such as Razorpay.
        </p>

        <h5 className="fw-bold mt-4 mb-2">2. How We Use Your Information</h5>
        <p className="text-muted">
          We use your information to fulfill and deliver orders, provide tracking updates, respond to customer service enquiries, and enhance website security.
        </p>

        <h5 className="fw-bold mt-4 mb-2">3. Data Security</h5>
        <p className="text-muted">
          We implement standard SSL encryption, password hashing, and secure server architecture to safeguard your personal information against unauthorized access.
        </p>

        <h5 className="fw-bold mt-4 mb-2">4. Contact Information</h5>
        <p className="text-muted">
          If you have questions about this policy, please reach out to us at:<br />
          <strong>VELVI NATURALS PRIVATE LIMITED</strong><br />
          354, Jawahar Nagar, Bareilly, Uttar Pradesh, 243001, India<br />
          Email: <a href="mailto:velvinaturals@gmail.com">velvinaturals@gmail.com</a><br />
          Phone: +91 94511 55771
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
