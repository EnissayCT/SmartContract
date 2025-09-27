
import React from 'react';

const HederaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <path d="M128 20.33a107.67 107.67 0 1 1-107.67 107.67A107.67 107.67 0 0 1 128 20.33M128 0a128 128 0 1 0 128 128A128 128 0 0 0 128 0Z" fill="currentColor"/>
    <path d="M128 54.4a15.36 15.36 0 0 0-15.36 15.36v116.48a15.36 15.36 0 0 0 30.72 0V69.76A15.36 15.36 0 0 0 128 54.4Z" fill="currentColor"/>
    <path d="M128 92.16a15.36 15.36 0 0 0-15.36 15.36v30.72a15.36 15.36 0 0 0 30.72 0v-30.72A15.36 15.36 0 0 0 128 92.16Z" fill="currentColor"/>
  </svg>
);

export default HederaIcon;
