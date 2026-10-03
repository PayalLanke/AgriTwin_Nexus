import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ShieldAlert, Lock, User, ArrowRight, ArrowLeft, UserPlus } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usernameOrEmail.trim()) {
      setError('Please enter your administrator username or email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.adminLogin({ usernameOrEmail, password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Admin authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard} className="animate-fade-in">
        <Link to="/" style={styles.backHomeBtn}>
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </Link>

        {/* Admin Header */}
        <div style={styles.brandHeader}>
          <div style={styles.logoBadge}>
            <ShieldAlert size={32} color="#ffffff" />
          </div>
          <h1 style={styles.appTitle}>Administrator Portal</h1>
          <p style={styles.tagline}>System Administration & Platform Operations Control</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label htmlFor="username">Username or Admin Email</label>
            <div style={styles.inputWrapper}>
              <User size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="username"
                type="text"
                placeholder="admin@agritwin.com"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password">Administrator Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-teal"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {isLoading ? 'Authenticating Admin Session...' : (
              <>
                <span>Login to Admin Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Admin Registration & Farmer Portal Link */}
        <div style={styles.footerLinkGroup}>
          <Link to="/admin/register" style={styles.registerAdminLink}>
            <UserPlus size={16} />
            <span>Register New Administrator Account</span>
          </Link>
          <div style={styles.divider} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Farmer Access?
            </span>
            <Link to="/farmer/login" style={styles.farmerLink}>
              Farmer Portal
            </Link>
          </div>
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
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
    backgroundSize: '24px 24px'
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '440px',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    position: 'relative'
  },
  backHomeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    fontSize: '0.8rem',
    fontWeight: '600'
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
    backgroundColor: 'var(--color-teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(15, 118, 110, 0.3)'
  },
  appTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1.1'
  },
  tagline: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    lineHeight: '1.4'
  },
  errorAlert: {
    backgroundColor: 'var(--color-error-light)',
    border: '1px solid #fecaca',
    color: 'var(--color-error)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.825rem',
    textAlign: 'center',
    fontWeight: '500'
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
  footerLinkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-border)',
    textAlign: 'center'
  },
  registerAdminLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: 'var(--color-teal)',
    textDecoration: 'none',
    backgroundColor: '#f0fdfa',
    padding: '0.625rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid #ccfbf1'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '0.25rem 0'
  },
  farmerLink: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--color-primary)',
    textDecoration: 'none'
  }
};
