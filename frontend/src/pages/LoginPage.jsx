import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Sprout, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard} className="animate-fade-in">
        {/* Logo Branding */}
        <div style={styles.brandHeader}>
          <div style={styles.logoBadge}>
            <Sprout size={32} color="#ffffff" />
          </div>
          <h1 style={styles.appTitle}>AgriTwin <span style={{ color: 'var(--color-secondary)' }}>Nexus</span></h1>
          <p style={styles.tagline}>Intelligent Digital Twin Platform for Precision Farming</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {/* Demo Hint Helper */}
        <div style={styles.demoHintBox}>
          <ShieldCheck size={16} color="var(--color-teal)" />
          <span><b>Demo Access</b>: Use <code>farmer@agritwin.com</code> / <code>farmer123</code> or create your account below.</span>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label htmlFor="email">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="farmer@agritwin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.inputWithIcon, paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {isLoading ? 'Authenticating Session...' : (
              <>
                <span>Login to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={styles.footerLinkGroup}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            New to AgriTwin Nexus?
          </span>
          <Link to="/register" style={styles.registerLink}>
            Create Farmer Account
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
    backgroundColor: 'var(--color-bg)',
    padding: '1.5rem',
    backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
    backgroundSize: '24px 24px'
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-lg)',
    width: '100%',
    maxWidth: '440px',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  brandHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logoBadge: {
    width: '56px',
    height: '56px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(22, 101, 52, 0.3)',
    marginBottom: '0.25rem'
  },
  appTitle: {
    fontSize: '1.65rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    lineHeight: '1.1'
  },
  tagline: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    maxWidth: '280px',
    lineHeight: '1.4'
  },
  errorAlert: {
    backgroundColor: 'var(--color-danger-light)',
    border: '1px solid #fecaca',
    color: 'var(--color-danger)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.825rem',
    textAlign: 'center',
    fontWeight: '500'
  },
  demoHintBox: {
    backgroundColor: 'var(--color-teal-light)',
    border: '1px solid #ccfbf1',
    color: 'var(--color-teal)',
    padding: '0.625rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.775rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem'
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
  inputWithIcon: {
    paddingLeft: '2.5rem'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerLinkGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-border)'
  },
  registerLink: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--color-primary)',
    textDecoration: 'none'
  }
};
