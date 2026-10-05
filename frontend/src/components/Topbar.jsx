import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import NotificationCenter from './NotificationCenter';
import { 
  LogOut, 
  UserCheck, 
  Box, 
  Thermometer, 
  User, 
  X
} from 'lucide-react';

export default function Topbar({ pageTitle }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentUser = authService.getCurrentUser() || {
    fullName: 'Rajesh Kumar',
    email: 'farmer@agritwin.com',
    role: 'Farmer'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/farmer/login');
  };

  return (
    <>
      <header style={styles.topbar} className="hud-glow">
        {/* Left: Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'rgba(34, 229, 138, 0.15)',
            border: '1px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            boxShadow: '0 0 12px rgba(34, 229, 138, 0.25)',
            flexShrink: 0
          }}>
            <Box size={20} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 8px #22e58a'
            }}></span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap'
              }}>
                AgriTwin <span style={{ color: 'var(--color-primary)' }}>Nexus</span>
              </span>
              <span style={{
                fontSize: '9px',
                fontFamily: 'JetBrains Mono, monospace',
                backgroundColor: 'rgba(34, 229, 138, 0.12)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(34, 229, 138, 0.3)',
                padding: '2px 6px',
                borderRadius: '9999px',
                fontWeight: '700',
                whiteSpace: 'nowrap'
              }}>
                3D SPATIAL
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.7rem',
              color: 'var(--color-text-secondary)',
              fontFamily: 'Space Grotesk, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              {t('topbar_tagline')}
            </p>
          </div>
        </div>

        {/* Right: Language Selector, Notification Center, Profile Badge & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* Notification Center */}
          <NotificationCenter />

          {/* Perfectly Aligned Profile Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: 'rgba(23, 34, 29, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(34, 229, 138, 0.3)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
            onClick={() => setIsProfileOpen(true)}
            title={t('topbar_view_profile')}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 229, 138, 0.15)',
              border: '1px solid var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              flexShrink: 0
            }}>
              <UserCheck size={15} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1.2' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>
                {currentUser.fullName}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap' }}>
                {t('farmer_portal')}
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'Space Grotesk, sans-serif',
              whiteSpace: 'nowrap'
            }}
            onClick={handleLogout}
            title="Logout session"
          >
            <LogOut size={14} color="#ffb4ab" />
            <span style={{ color: '#ffb4ab' }}>{t('logout')}</span>
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsProfileOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <User size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{t('profile_info')}</h3>
              </div>
              <button style={styles.closeBtn} onClick={() => setIsProfileOpen(false)}>
                <X size={18} color="#94a3b8" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.profileMetaBox}>
                <div style={styles.largeAvatar}>
                  <User size={32} color="#22e58a" />
                </div>
                <h3 style={{ margin: '0.5rem 0 0.2rem 0', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>{currentUser.fullName}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{currentUser.role?.toUpperCase() || 'FARMER'}</span>
              </div>

              <div style={styles.profileDetailsList}>
                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>{t('full_name')}:</span>
                  <span style={styles.profileVal}>{currentUser.fullName}</span>
                </div>
                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>{t('email_address')}:</span>
                  <span style={styles.profileVal}>{currentUser.email}</span>
                </div>
                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>{t('language')}:</span>
                  <span style={styles.profileVal}>{t('preferred_language')}</span>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button className="cyber-gradient-btn" onClick={() => setIsProfileOpen(false)} style={{ padding: '0.5rem 1rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  topbar: {
    minHeight: '68px',
    backgroundColor: 'rgba(11, 21, 17, 0.92)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 12, 9, 0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  },
  modalContent: {
    backgroundColor: 'rgba(15, 27, 21, 0.95)',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  modalBody: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  modalFooter: {
    padding: '0.875rem 1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem'
  },
  profileMetaBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0.5rem 0'
  },
  largeAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 229, 138, 0.1)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileDetailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    backgroundColor: 'rgba(8, 17, 13, 0.6)',
    padding: '0.875rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  profileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8125rem'
  },
  profileLabel: {
    color: '#94a3b8'
  },
  profileVal: {
    fontWeight: '600',
    color: '#f8fafc'
  }
};
