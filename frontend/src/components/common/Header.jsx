import React from 'react';
import { Menu, Zap } from 'lucide-react';

const Header = ({ isMobileOpen, setIsMobileOpen }) => {
  return (
    <header style={{
      display: 'none',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1.25rem',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 80
    }} className="mobile-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Zap size={16} fill="#ffffff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 800,
            color: 'var(--text-main)'
          }}>
            TaskFlow
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
