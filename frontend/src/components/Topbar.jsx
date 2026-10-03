import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import NotificationCenter from './NotificationCenter';
import { 
  LogOut, 
  UserCheck, 
  Box, 
  RefreshCw, 
  Thermometer, 
  Plane, 
  Radio, 
  Sliders, 
  ChevronDown,
  Sparkles,
  Layers
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
} from 'lucide-react';

export default function Topbar({ pageTitle }) {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState('2m ago');

  const currentUser = authService.getCurrentUser() || {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@agritwin.com',
    role: 'Chief Agronomist'
=======
  const { t } = useLanguage();
  const currentUser = authService.getCurrentUser() || {
    fullName: 'Rajesh Kumar',
    email: 'farmer@agritwin.com'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  };

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/farmer/login');
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTimestamp('Just now');
    }, 1200);
  };

  return (
<<<<<<< HEAD
    <header style={styles.topbar} className="hud-glow">
      {/* Left: Branding & Farm Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
            boxShadow: '0 0 12px rgba(34, 229, 138, 0.25)'
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
                letterSpacing: '-0.02em'
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
                fontWeight: '700'
              }}>
                3D SPATIAL
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.7rem',
              color: 'var(--color-text-secondary)',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Cyber-Agronomic Mission Hub
            </p>
          </div>
        </div>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border-subtle)' }} />

        {/* Farm & Plot Selector Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: 'rgba(23, 34, 29, 0.7)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.35rem 0.75rem',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/farms')}
        title="Switch Farm / Parcel View"
        >
          <Layers size={15} color="var(--color-secondary)" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Green Valley Farm - Plot B
              </span>
              <ChevronDown size={13} color="var(--color-text-secondary)" />
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ color: 'var(--color-secondary)' }}>Sector Gamma</span>
              <span>•</span>
              <span>Soybean Pioneer</span>
              <span>•</span>
              <span>4.85 Ha (25 Cells)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Live Sentinel-2 Sync Telemetry Capsule */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        backgroundColor: 'rgba(6, 16, 12, 0.85)',
        border: '1px solid var(--color-border)',
        borderRadius: '9999px',
        padding: '0.35rem 0.95rem',
        boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.6)'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isSyncing ? '#00d9ff' : 'var(--color-primary)',
          boxShadow: isSyncing ? '0 0 10px #00d9ff' : '0 0 8px #22e58a',
          display: 'inline-block'
        }}></span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'Space Grotesk, sans-serif' }}>
          <strong style={{ color: 'var(--color-primary)' }}>Sentinel-2 MSI</strong>
          <span style={{ color: 'var(--color-text-secondary)' }}>Sync {syncTimestamp}</span>
          <span style={{ color: 'var(--color-border-subtle)' }}>|</span>
          <span style={{ color: 'var(--color-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>42ms Latency</span>
          <span style={{ color: 'var(--color-border-subtle)' }}>|</span>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Level-2A BOA Reflex</span>
        </div>

        <button
          onClick={handleTriggerSync}
          style={{
            background: 'none',
            border: 'none',
            color: isSyncing ? '#00d9ff' : 'var(--color-primary)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Force Telemetry Sync"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Right: Weather Pill, Quick Actions, Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Micro-Climate Capsule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: 'rgba(23, 34, 29, 0.7)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.35rem 0.75rem'
        }}>
          <Thermometer size={16} color="var(--color-secondary)" />
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '600', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
              <span>27.4°C</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>65% RH</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>11 km/h</span>
            </div>
            <div style={{ fontSize: '0.68rem', display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Delta-T:</span>
              <strong style={{ color: 'var(--color-tertiary)' }}>3.8</strong>
              <span style={{ color: 'var(--color-primary)' }}>(Optimal Spray)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (Drone planner, Sensor mesh) */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => navigate('/satellite')}
            className="tab-btn"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center', borderRadius: '10px' }}
            title="Satellite Multispectral Earth Observation"
          >
            <Radio size={16} color="var(--color-secondary)" />
          </button>
          <button
            onClick={() => navigate('/recommendations')}
            className="tab-btn"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center', borderRadius: '10px' }}
            title="AI Agronomic Prescriptions"
          >
            <Sparkles size={16} color="var(--color-primary)" />
          </button>
        </div>

        {/* Notification Center */}
        <NotificationCenter />

        {/* Chief Agronomist Profile Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.3rem 0.65rem',
          backgroundColor: 'rgba(23, 34, 29, 0.7)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(34, 229, 138, 0.15)',
            border: '1px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <UserCheck size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
              {currentUser.fullName}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Chief Agronomist
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
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'Space Grotesk, sans-serif'
          }}
          onClick={handleLogout}
          title="Logout session"
        >
          <LogOut size={14} color="#ffb4ab" />
          <span style={{ color: '#ffb4ab' }}>Exit</span>
        </button>
      </div>
    </header>
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  );
}

const styles = {
<<<<<<< HEAD
  topbar: {
    height: '68px',
    backgroundColor: 'rgba(11, 21, 17, 0.92)',
    backdropFilter: 'blur(20px)',
=======
  header: {
    height: '68px',
    backgroundColor: '#ffffff',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    position: 'sticky',
    top: 0,
<<<<<<< HEAD
    zIndex: 40
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
