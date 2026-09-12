import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import KineticLoader from '../components/common/KineticLoader';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to authentication service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--bg-app)'
    }}>
      {/* Left Column — Immersive Kinetic Product Branding */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '3.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }} className="auth-brand-col">
        {/* Ambient Animated Nodes Background */}
        <svg style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          pointerEvents: 'none'
        }}>
          <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#2563eb" strokeWidth="2" strokeDasharray="8 8" className="animate-flow-dash" />
          <line x1="20%" y1="70%" x2="80%" y2="30%" stroke="#0d9488" strokeWidth="2" strokeDasharray="8 8" className="animate-flow-dash" />
        </svg>

        {/* Logo Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 2 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}>
            <Zap size={22} fill="#ffffff" />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
              TaskFlow
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Kinetic Workspace
            </span>
          </div>
        </div>

        {/* Animated Workflow Preview Widget */}
        <div style={{ zIndex: 2, margin: '2rem 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '1rem',
              letterSpacing: '-0.03em'
            }}>
              Work in Motion.<br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Accelerate Momentum.
              </span>
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '440px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              A high-precision task and project management ecosystem engineered for focused execution and visual workflow tracking.
            </p>
          </motion.div>

          {/* Kinetic Flow Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              maxWidth: '420px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#60a5fa' }}>ACTIVE WORKFLOW STREAM</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>
                ● 85% Completed
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>Deploy TaskFlow v2.0 Architecture</span>
            </div>

            <div style={{
              height: '6px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '85%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #2563eb, #10b981)'
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '0.8125rem', color: '#64748b', zIndex: 2 }}>
          &copy; {new Date().getFullYear()} TaskFlow Inc. Production-grade kinetic workspace.
        </div>
      </div>

      {/* Right Column — Elevated Kinetic Form Card */}
      <div className="w-full flex-1 flex items-center justify-center p-4 sm:p-10 bg-slate-50 min-h-screen lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-none sm:max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-10"
        >
          {/* Mobile Branding Header */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <Zap size={20} fill="#ffffff" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                TaskFlow
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                Kinetic Workspace
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
              Sign in to access your project pulse and active tasks.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: '#b91c1c',
                fontSize: '0.84rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                wordBreak: 'break-word'
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="form-group w-full">
              <label className="form-label" htmlFor="email" style={{ fontWeight: 700, color: '#0f172a' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }} className="w-full">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input w-full"
                  style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group w-full">
              <label className="form-label" htmlFor="password" style={{ fontWeight: 700, color: '#0f172a' }}>
                Password
              </label>
              <div style={{ position: 'relative' }} className="w-full">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input w-full"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', fontWeight: 600 }}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full"
              style={{
                padding: '0.8rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '0.75rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {submitting ? (
                <KineticLoader color="white" text="Signing in..." />
              ) : (
                <>
                  <span style={{ fontWeight: 700 }}>Sign in to TaskFlow</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#475569'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
