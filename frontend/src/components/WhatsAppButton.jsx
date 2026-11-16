import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919451155771?text=Hello%20VELVI%20NATURALS%2C%20I%20would%20like%20to%20know%20more%20about%20Stevia%20Drop%20(10%20ml)."
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with VELVI NATURALS on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
