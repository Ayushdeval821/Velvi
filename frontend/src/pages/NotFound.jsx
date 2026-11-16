import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center my-5">
      <h1 className="display-1 fw-bold text-success">404</h1>
      <h2 className="fw-bold mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-velvi">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
