import React from 'react';

const Logo = ({ size = 32, className = "", style = {} }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="50%" stopColor="#8AEBFF" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="premiumGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Precision Circular Aperture */}
      <circle 
        cx="50" cy="50" r="46" 
        stroke="url(#premiumGrad)" 
        strokeWidth="0.5" 
        opacity="0.3" 
      />
      <circle 
        cx="50" cy="50" r="42" 
        stroke="url(#premiumGrad)" 
        strokeWidth="2" 
        strokeDasharray="1 10"
        opacity="0.5"
      />

      {/* The "Eco-S" Core Prism */}
      <g filter="url(#premiumGlow)">
        {/* Top Segment */}
        <path 
          d="M50 20 L75 40 L50 60 L25 40 Z" 
          fill="url(#premiumGrad)" 
          opacity="0.9"
        />
        {/* Bottom Segment (Mirror) */}
        <path 
          d="M50 80 L75 60 L50 40 L25 60 Z" 
          fill="url(#premiumGrad)" 
          opacity="0.75"
        />
        {/* Central Core Sphere */}
        <circle cx="50" cy="50" r="6" fill="#fff" />
      </g>
      
      {/* Satellite "Guardians" */}
      <circle cx="50" cy="15" r="2.5" fill="#fff">
        <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="85" r="2.5" fill="#10B981" />
    </svg>
  );
};

export default Logo;
