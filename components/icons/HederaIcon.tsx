import React from 'react';
import Logo from '../images/logo.png'; // Your logo path

const HederaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={Logo}
    alt="Moroccan Contracts"
    className={`h-12 w-auto sm:h-16 md:h-20 ${className}`} // Bigger and responsive
  />
);

export default HederaIcon;
