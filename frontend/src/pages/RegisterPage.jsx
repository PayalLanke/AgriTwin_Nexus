import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Sprout, User, Mail, Phone, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ fullName, email, mobileNumber, password });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/farmer/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.ambientAuraTop}></div>
      <div style={styles.ambientAuraBottom}></div>

      <div style={styles.card} className="animate-fade-in">
        {/* Branding Header */}
        <div style={styles.brandHeader}>
          <div style={styles.logoBadge} className="hud-glow">
            <Sprout size={30} color="#070e0b" />
          </div>
          <h1 style={styles.appTitle}>Farmer Registration</h1>
          <p style={styles.tagline}>Create your digital farm operator profile</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successAlert}>
            <CheckCircle2 size={18} color="#22e58a" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="fullName">FULL NAME</label>
            <div style={styles.inputWrapper}>
              <User size={16} color="#64748b" style={styles.inputIcon} />
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">EMAIL ADDRESS</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} color="#64748b" style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="mobileNumber">MOBILE NUMBER</label>
            <div style={styles.inputWrapper}>
              <Phone size={16} color="#64748b" style={styles.inputIcon} />
              <input
                id="mobileNumber"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="password">PASSWORD</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="confirmPassword">CONFIRM PASSWORD</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="cyber-gradient-btn"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}
          >
            {isLoading ? (
              <span>Registering Account...</span>
            ) : (
              <>
                <span>Register & Access Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={styles.footerLinkGroup}>
          <span style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
            Already registered?
          </span>
          <Link to="/farmer/login" style={styles.loginLink}>
            Back to Farmer Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070e0b',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'radial-gradient(rgba(34, 229, 138, 0.08) 1px, transparent 1px)',
    backgroundSize: '28px 28px'
  },
  ambientAuraTop: {
    position: 'absolute',
    top: '-15%',
    right: '20%',
    width: '450px',
    height: '450px',
    background: 'radial-gradient(circle, rgba(34, 229, 138, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none'
  },
  ambientAuraBottom: {
    position: 'absolute',
    bottom: '-20%',
    left: '15%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(0, 217, 255, 0.12) 0%, transparent 70%)',
    pointerEvents: 'none'
  },
  card: {
    backgroundColor: 'rgba(11, 22, 17, 0.85)',
    backdropFilter: 'blur(28px)',
    borderRadius: '24px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(34, 229, 138, 0.1)',
    width: '100%',
    maxWidth: '480px',
    padding: '2.5rem 2.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    zIndex: 10
  },
  brandHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem'
  },
  logoBadge: {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    backgroundColor: '#22e58a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 25px rgba(34, 229, 138, 0.5)',
    marginBottom: '0.25rem'
  },
  appTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif',
    lineHeight: '1.1',
    margin: 0
  },
  tagline: {
    fontSize: '0.775rem',
    color: '#94a3b8',
    maxWidth: '320px',
    lineHeight: '1.4',
    margin: '2px 0 0 0'
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#fca5a5',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    textAlign: 'center',
    fontWeight: '500'
  },
  successAlert: {
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    fontSize: '0.825rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem'
  },
  label: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.4rem',
    background: 'rgba(8, 17, 13, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  footerLinkGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.25rem',
    paddingTop: '1.125rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  loginLink: {
    fontSize: '0.8125rem',
    fontWeight: '700',
    color: '#22e58a',
    textDecoration: 'none',
    fontFamily: 'Space Grotesk, sans-serif'
  }
};
