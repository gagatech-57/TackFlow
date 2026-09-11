import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import KineticLoader from '../components/common/KineticLoader';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Password strength calculation (0 to 100)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 30;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Unable to complete registration.');
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
        {/* Brand Logo */}
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

        {/* Feature List */}
        <div style={{ zIndex: 2, margin: '2rem 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.35rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '1rem',
              letterSpacing: '-0.03em'
            }}>
              Join TaskFlow.<br />
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #2dd4bf 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Engineered for Team Execution.
              </span>
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '420px', lineHeight: 1.6, marginBottom: '2rem' }}>
              Create your account to unlock real-time project pulse metrics, signature interactive timelines, and kinetic workflow streams.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Multi-tenant project security & user isolation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Signature START &rarr; END kinetic timelines</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Live progress calculations & instant state updates</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: '0.8125rem', color: '#64748b', zIndex: 2 }}>
          &copy; {new Date().getFullYear()} TaskFlow Inc. Production-grade kinetic workspace.
        </div>
      </div>

      {/* Right Column — Elevated Kinetic Form Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            maxWidth: '450px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.03)',
            padding: '2.5rem'
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.375rem', letterSpacing: '-0.02em' }}>
              Create an account
            </h2>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
              Start tracking your project momentum in seconds.
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
                marginBottom: '1.25rem'
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name" style={{ fontWeight: 700, color: '#0f172a' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
                  required
                />
                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email" style={{ fontWeight: 700, color: '#0f172a' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
                  required
                />
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password" style={{ fontWeight: 700, color: '#0f172a' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
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
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div style={{ marginTop: '0.375rem' }}>
                  <div style={{ height: '4px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${strength}%`,
                      backgroundColor: strength < 40 ? '#ef4444' : strength < 80 ? '#f59e0b' : '#10b981',
                      transition: 'var(--transition-fast)'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strength < 40 ? '#dc2626' : strength < 80 ? '#d97706' : '#059669', fontWeight: 700 }}>
                    {strength < 40 ? 'Weak password' : strength < 80 ? 'Medium strength' : 'Strong password'}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword" style={{ fontWeight: 700, color: '#0f172a' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
                  required
                />
                <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {submitting ? (
                <KineticLoader color="white" text="Creating account..." />
              ) : (
                <>
                  <span style={{ fontWeight: 700 }}>Create Account</span>
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
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
