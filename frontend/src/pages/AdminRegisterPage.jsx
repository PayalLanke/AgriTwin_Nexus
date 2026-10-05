import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ShieldAlert, User, Mail, Phone, Lock, CheckCircle2, ArrowRight, ArrowLeft, Briefcase } from 'lucide-react';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [designation, setDesignation] = useState('Agronomic Data Officer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your official full name (minimum 2 characters).');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid official email address.');
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
      await authService.adminRegister({ fullName, email, mobileNumber, designation, password });
      setSuccess('Administrator account registered successfully! Redirecting to admin login...');
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Administrator registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card} className="animate-fade-in">
        <Link to="/admin/login" style={styles.backHomeBtn}>
          <ArrowLeft size={16} />
          <span>Back to Admin Login</span>
        </Link>

        {/* Branding Header */}
        <div style={styles.brandHeader}>
          <div style={styles.logoBadge}>
            <ShieldAlert size={30} color="#ffffff" />
          </div>
          <h1 style={styles.appTitle}>Administrator Registration</h1>
          <p style={styles.tagline}>Create an official admin account for platform management</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successAlert}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleAdminRegister} style={styles.form}>
          <div>
            <label htmlFor="fullName">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="fullName"
                type="text"
                placeholder="Enter official full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email">Official Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="Enter official email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <div style={styles.inputWrapper}>
              <Phone size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="mobileNumber"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="designation">Role / Designation</label>
            <div style={styles.inputWrapper}>
              <Briefcase size={18} color="#9ca3af" style={styles.inputIcon} />
              <select
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                style={{ ...styles.inputWithIcon, backgroundColor: '#ffffff' }}
              >
                <option value="Agronomic Data Officer">Agronomic Data Officer</option>
                <option value="Geospatial System Administrator">Geospatial System Administrator</option>
                <option value="Regional Research Coordinator">Regional Research Coordinator</option>
                <option value="Lead Platform Engineer">Lead Platform Engineer</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="password">Admin Security Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Registering Admin Account...' : (
              <>
                <span>Complete Administrator Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={styles.footerLinkGroup}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Already have an Admin account?
          </span>
          <Link to="/admin/login" style={styles.loginLink}>
            Login to Admin Portal
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
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
    backgroundSize: '24px 24px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '480px',
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
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
    width: '52px',
    height: '52px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--color-teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(15, 118, 110, 0.3)'
  },
  appTitle: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: 'var(--color-text-main)'
  },
  tagline: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)'
  },
  errorAlert: {
    backgroundColor: 'var(--color-error-light)',
    border: '1px solid #fecaca',
    color: 'var(--color-error)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.825rem',
    textAlign: 'center'
  },
  successAlert: {
    backgroundColor: 'var(--color-teal-light)',
    border: '1px solid #ccfbf1',
    color: 'var(--color-teal)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.825rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-border)'
  },
  loginLink: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: 'var(--color-teal)',
    textDecoration: 'none'
  }
};
