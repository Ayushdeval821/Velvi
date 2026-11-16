import React from 'react';

const AlertMessage = ({ variant = 'info', children, onClose }) => {
  return (
    <div className={`alert alert-${variant} alert-dismissible fade show rounded-3 shadow-sm`} role="alert">
      {children}
      {onClose && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      )}
    </div>
  );
};

export default AlertMessage;
