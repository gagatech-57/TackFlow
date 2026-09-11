import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, FolderKanban, CheckSquare, LogOut, Zap, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`} style={{
        width: '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        transition: 'transform 0.3s ease'
      }}>
        <div>
          {/* Kinetic Workspace Logo Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0 0.5rem 1.75rem 0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}>
              <Zap size={22} fill="#ffffff" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1
              }}>
                TaskFlow
              </span>
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                Kinetic Workspace
              </span>
            </div>
          </div>

          {/* Navigation Stream Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                            right: '10px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
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

        {/* Styled User Profile Card & Logout */}
        <div style={{
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* User Profile Container */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            padding: '0.75rem 0.875rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}>
                {(user?.name || user?.fullName) ? (user.name || user.fullName).charAt(0).toUpperCase() : <User size={18} />}
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid #ffffff'
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0f172a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.name || user?.fullName || 'Workspace User'}
              </div>
              <div style={{
                fontSize: '0.75rem',
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
            onClick={handleLogout}
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
    </>
  );
};

export default Sidebar;
