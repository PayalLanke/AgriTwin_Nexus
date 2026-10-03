import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Sprout, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Cpu, Radio } from 'lucide-react';

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
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Background ambient lighting */}
      <div style={styles.ambientAuraTop}></div>
      <div style={styles.ambientAuraBottom}></div>

      <div style={styles.loginCard} className="animate-fade-in">
        {/* Logo Branding */}
        <div style={styles.brandHeader}>
          <div style={styles.logoBadge} className="hud-glow">
            <Sprout size={32} color="#070e0b" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            <h1 style={styles.appTitle}>AgriTwin <span style={{ color: '#00d9ff' }}>Nexus</span></h1>
            <span style={styles.versionPill}>3D TWIN v2.4</span>
          </div>
          <p style={styles.tagline}>Autonomous Spatial Intelligence & Digital Twin Command</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {/* Demo Hint Helper */}
        <div style={styles.demoHintBox}>
          <ShieldCheck size={16} color="#00d9ff" style={{ flexShrink: 0 }} />
          <span><b>Demo Access</b>: Use <code style={styles.codeSnippet}>farmer@agritwin.com</code> / <code style={styles.codeSnippet}>farmer123</code></span>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">OPERATOR / AGRONOMIST EMAIL</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} color="#64748b" style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="farmer@agritwin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">GATEWAY ACCESS PASSPHRASE</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} color="#64748b" style={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} color="#64748b" /> : <Eye size={16} color="#64748b" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="cyber-gradient-btn"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}
          >
            {isLoading ? (
              <span>Decrypting Session Token...</span>
            ) : (
              <>
                <span>Launch Digital Twin Console</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={styles.footerLinkGroup}>
          <span style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
            New to AgriTwin Platform?
          </span>
          <Link to="/register" style={styles.registerLink}>
            Initialize Farmer Account &rarr;
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
  loginCard: {
    backgroundColor: 'rgba(11, 22, 17, 0.85)',
    backdropFilter: 'blur(28px)',
    borderRadius: '24px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(34, 229, 138, 0.1)',
    width: '100%',
    maxWidth: '440px',
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
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    backgroundColor: '#22e58a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 25px rgba(34, 229, 138, 0.5)',
    marginBottom: '0.25rem'
  },
  appTitle: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif',
    lineHeight: '1.1',
    margin: 0
  },
  versionPill: {
    fontSize: '0.625rem',
    fontWeight: '700',
    padding: '0.15rem 0.45rem',
    borderRadius: '6px',
    background: 'rgba(0, 217, 255, 0.15)',
    color: '#00d9ff',
    fontFamily: 'Space Grotesk, sans-serif',
    border: '1px solid rgba(0, 217, 255, 0.3)'
  },
  tagline: {
    fontSize: '0.775rem',
    color: '#94a3b8',
    maxWidth: '300px',
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
  demoHintBox: {
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
    border: '1px solid rgba(0, 217, 255, 0.25)',
    color: '#94a3b8',
    padding: '0.625rem 0.875rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    lineHeight: '1.4'
  },
  codeSnippet: {
    color: '#00d9ff',
    fontFamily: 'monospace',
    fontWeight: '700'
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
    justifyContent: 'center',
    padding: '4px'
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
  registerLink: {
    fontSize: '0.8125rem',
    fontWeight: '700',
    color: '#22e58a',
    textDecoration: 'none',
    fontFamily: 'Space Grotesk, sans-serif'
  }
};
