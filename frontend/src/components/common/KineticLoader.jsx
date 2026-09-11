import React from 'react';
import { motion } from 'framer-motion';

const KineticLoader = ({ size = 'medium', text = 'Loading...', color = 'default' }) => {
  const isButton = size === 'small' || size === 'button' || color === 'white';
  const loaderSize = isButton ? 20 : size === 'large' ? 54 : 36;
  const dotSize = isButton ? 4 : size === 'large' ? 9 : 6;
  const dotColor = color === 'white' ? '#ffffff' : '#2563eb';

  // 6 orbiting dots positioned on a circle
  const dotsCount = 6;
  const radius = (loaderSize - dotSize) / 2;

  return (
    <div style={{
      display: isButton ? 'inline-flex' : 'flex',
      flexDirection: isButton ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isButton ? '0.5rem' : '0.875rem',
      color: color === 'white' ? '#ffffff' : 'inherit'
    }}>
      {/* Windows 11 Style Dotted Ring Loader */}
      <div
        className="win-dotted-loader"
        style={{
          width: `${loaderSize}px`,
          height: `${loaderSize}px`
        }}
      >
        {Array.from({ length: dotsCount }).map((_, i) => {
          const angle = (i * (360 / dotsCount)) * (Math.PI / 180);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const delay = (i * 0.18).toFixed(2);

          return (
            <div
              key={i}
              className="win-dot"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                backgroundColor: dotColor,
                boxShadow: color === 'white' ? '0 0 4px rgba(255, 255, 255, 0.6)' : '0 0 6px rgba(37, 99, 235, 0.4)',
                transform: `translate(${x}px, ${y}px)`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      {text && (
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isButton ? '0.875rem' : size === 'large' ? '0.95rem' : '0.84rem',
          fontWeight: 600,
          color: color === 'white' ? '#ffffff' : 'var(--text-secondary)',
          whiteSpace: 'nowrap'
        }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default KineticLoader;
