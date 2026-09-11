import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const KineticLoader = ({ size = 'medium', text = 'Flowing...', color = 'default' }) => {
  if (size === 'button' || color === 'white') {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: '#ffffff'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Loader2 size={18} />
        </motion.div>
        {text && <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{text}</span>}
      </div>
    );
  }

  const containerSize = size === 'small' ? '32px' : size === 'large' ? '72px' : '52px';
  const nodeSize = size === 'small' ? 5 : size === 'large' ? 10 : 7;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      padding: size === 'large' ? '2rem' : '0.5rem'
    }}>
      <div style={{
        position: 'relative',
        width: containerSize,
        height: containerSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Kinetic SVG Flow Circle */}
        <svg
          viewBox="0 0 100 100"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#kineticGradientLoader)"
            strokeWidth="4.5"
            strokeDasharray="60 180"
            animate={{ strokeDashoffset: [-240, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />

          <defs>
            <linearGradient id="kineticGradientLoader" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Node */}
        <motion.div
          animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size === 'small' ? '12px' : size === 'large' ? '24px' : '18px',
            height: size === 'small' ? '12px' : size === 'large' ? '24px' : '18px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            width: `${nodeSize / 2}px`,
            height: `${nodeSize / 2}px`,
            borderRadius: '50%',
            backgroundColor: '#ffffff'
          }} />
        </motion.div>
      </div>

      {text && (
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            letterSpacing: '0.02em'
          }}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
};

export default KineticLoader;
