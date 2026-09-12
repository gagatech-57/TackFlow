import React from 'react';
import { motion } from 'framer-motion';

const KineticLoader = ({ size = 'medium', text = 'Loading...', color = 'default' }) => {
  const isButton = size === 'small' || size === 'button' || color === 'white';
  const loaderSize = isButton ? 18 : size === 'large' ? 44 : 30;
  const dotSize = isButton ? 3 : size === 'large' ? 5 : 4;
  const dotColor = color === 'white' ? '#ffffff' : '#2563eb';

  // 12 orbiting small dots for smooth continuous ring
  const dotsCount = 12;
  const radius = (loaderSize - dotSize) / 2;

  return (
    <div style={{
      display: isButton ? 'inline-flex' : 'flex',
      flexDirection: isButton ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isButton ? '0.5rem' : '0.75rem',
      color: color === 'white' ? '#ffffff' : 'inherit'
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'relative',
          width: `${loaderSize}px`,
          height: `${loaderSize}px`
        }}
      >
        {Array.from({ length: dotsCount }).map((_, i) => {
          const angle = (i * (360 / dotsCount)) * (Math.PI / 180);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const opacity = 0.2 + (i / dotsCount) * 0.8;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                borderRadius: '50%',
                backgroundColor: dotColor,
                opacity,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                boxShadow: color === 'white' ? '0 0 3px rgba(255, 255, 255, 0.7)' : '0 0 4px rgba(37, 99, 235, 0.5)'
              }}
            />
          );
        })}
      </motion.div>

      {text && (
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isButton ? '0.8125rem' : size === 'large' ? '0.875rem' : '0.8125rem',
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
