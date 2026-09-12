import React from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';

const Header = ({ isMobileOpen, setIsMobileOpen }) => {
  return (
    <header style={{
      display: 'none',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1rem',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      width: '100%',
      zIndex: 80
    }} className="mobile-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.625rem',
            minWidth: '44px',
            minHeight: '44px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <Logo size="sm" />
      </div>
    </header>
  );
};

export default Header;
