import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

const KineticLoader = ({ size = 'medium', text = 'Flowing workspace streams...', color = 'default' }) => {
  // Button Inline Variant
  if (size === 'small' || size === 'button' || color === 'white') {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: color === 'white' ? '#ffffff' : 'inherit'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Loader2 size={16} />
        </motion.div>
        {text && <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{text}</span>}
      </div>
    );
  }

  // Large Full Page / Section Branded Loader
  const containerDim = size === 'large' ? 84 : 56;
  const logoDim = size === 'large' ? 24 : 18;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: size === 'large' ? '3rem 1.5rem' : '1.5rem'
    }}>
      <div style={{
        position: 'relative',
        width: `${containerDim}px`,
        height: `${containerDim}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Animated outer flow ring */}
        <svg
          viewBox="0 0 100 100"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#kineticFlowGradient)"
            strokeWidth="5"
            strokeDasharray="70 180"
            strokeLinecap="round"
            animate={{ strokeDashoffset: [-250, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          <defs>
            <linearGradient id="kineticFlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Kinetic Zap Logo Node */}
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: size === 'large' ? '42px' : '28px',
            height: size === 'large' ? '42px' : '28px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}
        >
          <Zap size={logoDim} fill="#ffffff" />
        </motion.div>
      </div>

      {text && (
        <div style={{ textAlign: 'center' }}>
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: size === 'large' ? '0.95rem' : '0.84rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              letterSpacing: '-0.01em',
              display: 'block'
            }}
          >
            {text}
          </motion.span>
          {size === 'large' && (
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px', display: 'block' }}>
              TaskFlow Kinetic Workspace
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default KineticLoader;
