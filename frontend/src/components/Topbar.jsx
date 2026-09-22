import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import NotificationCenter from './NotificationCenter';
import { LogOut, UserCheck, Sprout } from 'lucide-react';

export default function Topbar({ pageTitle = 'Dashboard' }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser() || {
    fullName: 'Farmer User',
    email: 'farmer@agritwin.com'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header style={styles.topbar}>
      <div>
        <h2 style={styles.pageTitle}>{pageTitle}</h2>
        <p style={styles.breadcrumb}>AgriTwin Nexus Platform &bull; Digital Twin Analytics</p>
      </div>

      <div style={styles.rightSection}>
        {/* Working Notification Center Trigger */}
        <NotificationCenter />

        {/* User Profile Badge */}
        <div style={styles.profileBadge}>
          <div style={styles.avatarContainer}>
            <UserCheck size={18} color="var(--color-primary)" />
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{currentUser.fullName}</span>
            <span style={styles.userRole}>Registered Farmer</span>
          </div>
        </div>

        {/* Logout Action */}
        <button style={styles.logoutBtn} onClick={handleLogout} title="Logout session">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    height: '64px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 30
  },
  pageTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0,
    lineHeight: '1.2'
  },
  breadcrumb: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    margin: 0
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.375rem 0.75rem',
    backgroundColor: 'var(--color-primary-light)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid #dcfce7'
  },
  avatarContainer: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: 'var(--color-primary)'
  },
  userRole: {
    fontSize: '0.675rem',
    color: 'var(--color-teal)'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0.875rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: '#4b5563',
    backgroundColor: '#f9fafb',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  }
};
