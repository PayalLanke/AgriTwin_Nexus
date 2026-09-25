import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import {
  Sprout,
  LayoutDashboard,
  PlusCircle,
  Info,
  User,
  LogOut,
  Cpu,
  X
} from 'lucide-react';

export default function Topbar({ pageTitle }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentUser = authService.getCurrentUser() || {
    fullName: 'Rajesh Kumar',
    email: 'farmer@agritwin.com'
  };

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/farmer/login');
  };

  return (
    <>
      <header style={styles.header}>
        {/* Left Branding Group */}
        <div style={styles.brandGroup}>
          <div style={styles.logoBadge}>
            <Sprout size={22} color="#ffffff" />
          </div>
          <div>
            <div style={styles.brandTitleRow}>
              <h1 style={styles.brandTitle}>{t('app_title')}</h1>
            </div>
            <p style={styles.brandSubtitle}>{t('platform_subtitle')}</p>
          </div>
        </div>

        {/* Center Main Navigation */}
        <nav style={styles.topNav}>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            <LayoutDashboard size={16} />
            <span>{t('nav_dashboard')}</span>
          </NavLink>

          <NavLink
            to="/farms"
            end
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            <Sprout size={16} />
            <span>{t('nav_my_farms')}</span>
          </NavLink>

          <NavLink
            to="/farms/add"
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            <PlusCircle size={16} />
            <span>{t('nav_add_farm')}</span>
          </NavLink>

          <button
            type="button"
            style={styles.navBtn}
            onClick={() => setIsAboutOpen(true)}
            title="About AgriTwin Nexus"
          >
            <Info size={16} />
            <span>About</span>
          </button>
        </nav>

        {/* Right Group: Language Selector, Farmer Profile & Logout */}
        <div style={styles.rightGroup}>
          {/* Language Selection Selector Dropdown */}
          <LanguageSelector />

          <div
            style={styles.farmerPill}
            onClick={() => setIsProfileOpen(true)}
            title="View profile details"
          >
            <div style={styles.avatar}>
              <User size={15} color="var(--color-primary)" />
            </div>
            <div style={styles.farmerMeta}>
              <span style={styles.farmerName}>{currentUser.fullName}</span>
              <span style={styles.farmerRole}>{t('farmer_portal')}</span>
            </div>
          </div>

          <button style={styles.logoutBtn} onClick={handleLogout} title="Sign out session">
            <LogOut size={16} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </header>

      {/* About Platform Modal */}
      {isAboutOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsAboutOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={styles.logoBadgeSmall}>
                  <Sprout size={18} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{t('app_title')}</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    {t('platform_subtitle')}
                  </p>
                </div>
              </div>
              <button style={styles.closeBtn} onClick={() => setIsAboutOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.6' }}>
                AgriTwin Nexus is a software-based Digital Twin platform designed to combine farm geographical information, field boundary delineation, Sentinel-2 satellite imagery, Google Earth Engine, agronomic weather data, vegetation indices (NDVI/NDRE/SAVI), historical agricultural datasets, machine learning, and rule-based recommendations.
              </p>
            </div>

            <div style={styles.modalFooter}>
              <button className="btn btn-primary" onClick={() => setIsAboutOpen(false)}>
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsProfileOpen(false)}>
          <div style={{ ...styles.modalContent, maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <User size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{t('profile_info')}</h3>
              </div>
              <button style={styles.closeBtn} onClick={() => setIsProfileOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.profileMetaBox}>
                <div style={styles.largeAvatar}>
                  <User size={32} color="var(--color-primary)" />
                </div>
                <h3 style={{ margin: '0.5rem 0 2px 0', fontSize: '1.2rem' }}>{currentUser.fullName}</h3>
                <span className="badge badge-primary">{t('farmer_portal')}</span>
              </div>

              <div style={styles.profileDetailsList}>
                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>{t('email_address')}:</span>
                  <span style={styles.profileVal}>{currentUser.email}</span>
                </div>
                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>{t('mobile_number')}:</span>
                  <span style={styles.profileVal}>{currentUser.mobileNumber || '+91 98765 43210'}</span>
                </div>
                <div style={styles.profileRow}>
                  <span style={styles.profileLabel}>{t('language')}:</span>
                  <span style={styles.profileVal}>{t('preferred_language')}</span>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setIsProfileOpen(false)}>
                Close
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  header: {
    height: '68px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    boxShadow: 'var(--shadow-sm)'
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoBadge: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoBadgeSmall: {
    width: '30px',
    height: '30px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  brandTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    lineHeight: '1.1',
    margin: 0
  },
  brandSubtitle: {
    fontSize: '0.7rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
    margin: 0
  },
  topNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: '#4b5563',
    textDecoration: 'none',
    transition: 'all 0.15s ease'
  },
  navItemActive: {
    backgroundColor: 'var(--color-light-green)',
    color: 'var(--color-primary)',
    fontWeight: '700'
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: '#4b5563',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem'
  },
  farmerPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.3rem 0.625rem',
    backgroundColor: 'var(--color-light-green)',
    borderRadius: '9999px',
    border: '1px solid #bbf7d0',
    cursor: 'pointer'
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  farmerMeta: {
    display: 'flex',
    flexDirection: 'column'
  },
  farmerName: {
    fontSize: '0.775rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    lineHeight: '1.1'
  },
  farmerRole: {
    fontSize: '0.65rem',
    color: 'var(--color-teal)'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.45rem 0.75rem',
    fontSize: '0.775rem',
    fontWeight: '600',
    color: '#4b5563',
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--color-border)',
    width: '100%',
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--color-border)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
    borderRadius: 'var(--radius-sm)'
  },
  modalBody: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '75vh',
    overflowY: 'auto'
  },
  modalFooter: {
    padding: '0.875rem 1.25rem',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    backgroundColor: '#f9fafb'
  },
  profileMetaBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '1rem 0'
  },
  largeAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-light-green)',
    border: '1px solid #bbf7d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileDetailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    backgroundColor: '#f9fafb',
    padding: '0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)'
  },
  profileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8125rem'
  },
  profileLabel: {
    color: 'var(--color-text-secondary)'
  },
  profileVal: {
    fontWeight: '600',
    color: 'var(--color-text-main)'
  }
};
