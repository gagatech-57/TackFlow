import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, FolderKanban, CheckSquare, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Logo from './Logo';

import Modal from './Modal';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen, setIsMobileOpen]);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    if (setIsMobileOpen) setIsMobileOpen(false);
    logout();
    showToast('Logged out of TaskFlow', 'info');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid, accent: '#2563eb' },
    { label: 'Projects', path: '/projects', icon: FolderKanban, accent: '#0d9488' },
    { label: 'Task Stream', path: '/tasks', icon: CheckSquare, accent: '#10b981' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90]"
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`} style={{
        width: '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem 1rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        maxHeight: '100vh',
        zIndex: 100,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden'
      }}>
        {/* Top Header & Scrollable Nav Container */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Kinetic Workspace Logo Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0.25rem 1.25rem 0.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1rem',
            flexShrink: 0
          }}>
            <Logo size="sm" />

            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation Stream Links — Scrollable Container */}
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.25rem'
          }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                  style={({ isActive }) => ({
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? item.accent : 'var(--text-secondary)',
                    backgroundColor: isActive ? `${item.accent}12` : 'transparent',
                    border: isActive ? `1px solid ${item.accent}30` : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)'
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        backgroundColor: isActive ? `${item.accent}20` : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? item.accent : 'var(--text-muted)',
                        transition: 'var(--transition-fast)'
                      }}>
                        <Icon size={17} />
                      </div>

                      <span>{item.label}</span>

                      {isActive && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          style={{
                            position: 'absolute',
                            right: '8px',
                            width: '3.5px',
                            height: '20px',
                            borderRadius: '4px',
                            backgroundColor: item.accent
                          }}
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Styled User Profile Card & Logout Footer — Fixed & Always Reachable */}
        <div style={{
          paddingTop: '1rem',
          marginTop: '0.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          {/* User Profile Container */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 0.75rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}>
                {(user?.name || user?.fullName) ? (user.name || user.fullName).charAt(0).toUpperCase() : <User size={16} />}
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid #ffffff'
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#0f172a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.name || user?.fullName || 'Workspace User'}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: '#64748b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500
              }}>
                {user?.email || 'user@taskflow.dev'}
              </div>
            </div>
          </div>

          {/* Styled Sign Out Button */}
          <motion.button
            whileHover={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogoutModal(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              color: '#e11d48',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out of TaskFlow?"
        maxWidth="400px"
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 500 }}>
          Are you sure you want to sign out of your kinetic workspace session?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => setShowLogoutModal(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={confirmLogout}
            className="btn btn-danger"
            style={{ fontWeight: 700 }}
          >
            Sure, Sign Out
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
