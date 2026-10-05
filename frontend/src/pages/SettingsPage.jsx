import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUnits } from '../context/UnitContext';
import { authService } from '../services/authService';
import {
  User,
  Globe,
  Ruler,
  Bell,
  Shield,
  Info,
  Save,
  CheckCircle2,
  LogOut,
  Edit2,
  Key,
  X,
  Lock,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { areaUnit, tempUnit, notifications, savePreferences } = useUnits();

  // Profile State
  const currentUser = authService.getCurrentUser() || {
    fullName: 'Lanke Payal',
    email: 'farmer@agritwin.com',
    role: 'Farmer'
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.fullName || 'Lanke Payal');
  const [profileEmail, setProfileEmail] = useState(currentUser.email || 'farmer@agritwin.com');

  // Preferences Form State
  const [localAreaUnit, setLocalAreaUnit] = useState(areaUnit);
  const [localTempUnit, setLocalTempUnit] = useState(tempUnit);
  const [notifState, setNotifState] = useState({ ...notifications });

  // Save State Handling
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: '', msg: '' });

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
  };

  const handleToggleNotif = (key) => {
    setNotifState((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = { ...currentUser, fullName: profileName, email: profileEmail };
    authService.setCurrentUser(updated);
    setIsEditingProfile(false);
    setSuccessMsg(t('settings_saved_success'));
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleSaveAllSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    try {
      // Simulate network save delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      savePreferences({
        areaUnit: localAreaUnit,
        tempUnit: localTempUnit,
        notifications: notifState
      });
      setSuccessMsg(t('settings_saved_success'));
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', msg: '' });
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'All password fields are required.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', msg: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }

    setPasswordStatus({ type: 'success', msg: 'Password updated successfully!' });
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStatus({ type: '', msg: '' });
    }, 1500);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/farmer/login');
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 1. Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{t('settings_title')}</h1>
        <p style={styles.subtitle}>{t('settings_subtitle')}</p>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div style={styles.successBanner} className="animate-fade-in">
          <CheckCircle2 size={20} color="#22e58a" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div style={styles.errorBanner} className="animate-fade-in">
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveAllSettings} style={styles.sectionsWrapper}>
        {/* 2. ACCOUNT / PROFILE SECTION */}
        <div style={styles.cardSection}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircle}>
              <User size={20} color="#22e58a" />
            </div>
            <div>
              <span style={styles.sectionCategory}>{t('settings_sec_account')}</span>
              <h2 style={styles.cardTitle}>{t('settings_profile_info')}</h2>
            </div>
          </div>

          {!isEditingProfile ? (
            <div style={styles.profileDisplayRow}>
              <div style={styles.avatarCircle}>
                <User size={30} color="#22e58a" />
              </div>
              <div style={styles.profileMetaGroup}>
                <div style={styles.infoField}>
                  <span style={styles.infoLabel}>{t('settings_full_name')}:</span>
                  <span style={styles.infoValue}>{profileName}</span>
                </div>
                <div style={styles.infoField}>
                  <span style={styles.infoLabel}>{t('settings_email')}:</span>
                  <span style={styles.infoValue}>{profileEmail}</span>
                </div>
                <div style={styles.infoField}>
                  <span style={styles.infoLabel}>{t('settings_role')}:</span>
                  <span style={styles.rolePill}>{currentUser.role || 'Farmer'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="btn btn-secondary"
                style={styles.editBtn}
              >
                <Edit2 size={14} />
                <span>{t('settings_edit_profile')}</span>
              </button>
            </div>
          ) : (
            <div style={styles.profileEditForm}>
              <div style={styles.formGridTwo}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>{t('settings_full_name')}</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    style={styles.textInput}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>{t('settings_email')}</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    style={styles.textInput}
                    required
                  />
                </div>
              </div>
              <div style={styles.editActionRow}>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  {t('common_save')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {t('common_cancel')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. LANGUAGE & REGION SECTION */}
        <div style={styles.cardSection}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircle}>
              <Globe size={20} color="#22e58a" />
            </div>
            <div>
              <span style={styles.sectionCategory}>{t('settings_sec_lang_region')}</span>
              <h2 style={styles.cardTitle}>{t('settings_app_language')}</h2>
            </div>
          </div>

          <div style={styles.langGrid}>
            {[
              { code: 'en', label: 'English', native: 'English' },
              { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
              { code: 'mr', label: 'Marathi', native: 'मराठी' }
            ].map((item) => {
              const isSelected = language === item.code;
              return (
                <div
                  key={item.code}
                  onClick={() => handleLanguageChange(item.code)}
                  style={{
                    ...styles.langOptionCard,
                    borderColor: isSelected ? '#22e58a' : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: isSelected ? 'rgba(34, 229, 138, 0.08)' : 'rgba(8, 17, 13, 0.5)'
                  }}
                >
                  <div style={styles.radioCircle}>
                    {isSelected && <div style={styles.radioInner} />}
                  </div>
                  <div>
                    <span style={styles.langNative}>{item.native}</span>
                    <span style={styles.langSub}>{item.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={18} color="#22e58a" style={{ marginLeft: 'auto' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. MEASUREMENT UNITS SECTION */}
        <div style={styles.cardSection}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircle}>
              <Ruler size={20} color="#22e58a" />
            </div>
            <div>
              <span style={styles.sectionCategory}>{t('settings_sec_units')}</span>
              <h2 style={styles.cardTitle}>{t('settings_sec_units')}</h2>
            </div>
          </div>

          <div style={styles.formGridTwo}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>{t('settings_farm_area_unit')}</label>
              <div style={styles.unitToggleGroup}>
                <button
                  type="button"
                  onClick={() => setLocalAreaUnit('hectares')}
                  style={{
                    ...styles.unitBtn,
                    backgroundColor: localAreaUnit === 'hectares' ? 'rgba(34, 229, 138, 0.15)' : 'transparent',
                    borderColor: localAreaUnit === 'hectares' ? '#22e58a' : 'rgba(255, 255, 255, 0.1)',
                    color: localAreaUnit === 'hectares' ? '#22e58a' : '#94a3b8'
                  }}
                >
                  {t('settings_unit_ha')}
                </button>
                <button
                  type="button"
                  onClick={() => setLocalAreaUnit('acres')}
                  style={{
                    ...styles.unitBtn,
                    backgroundColor: localAreaUnit === 'acres' ? 'rgba(34, 229, 138, 0.15)' : 'transparent',
                    borderColor: localAreaUnit === 'acres' ? '#22e58a' : 'rgba(255, 255, 255, 0.1)',
                    color: localAreaUnit === 'acres' ? '#22e58a' : '#94a3b8'
                  }}
                >
                  {t('settings_unit_acres')}
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>{t('settings_temp_unit')}</label>
              <div style={styles.unitToggleGroup}>
                <button
                  type="button"
                  onClick={() => setLocalTempUnit('celsius')}
                  style={{
                    ...styles.unitBtn,
                    backgroundColor: localTempUnit === 'celsius' ? 'rgba(34, 229, 138, 0.15)' : 'transparent',
                    borderColor: localTempUnit === 'celsius' ? '#22e58a' : 'rgba(255, 255, 255, 0.1)',
                    color: localTempUnit === 'celsius' ? '#22e58a' : '#94a3b8'
                  }}
                >
                  {t('settings_unit_celsius')}
                </button>
                <button
                  type="button"
                  onClick={() => setLocalTempUnit('fahrenheit')}
                  style={{
                    ...styles.unitBtn,
                    backgroundColor: localTempUnit === 'fahrenheit' ? 'rgba(34, 229, 138, 0.15)' : 'transparent',
                    borderColor: localTempUnit === 'fahrenheit' ? '#22e58a' : 'rgba(255, 255, 255, 0.1)',
                    color: localTempUnit === 'fahrenheit' ? '#22e58a' : '#94a3b8'
                  }}
                >
                  {t('settings_unit_fahrenheit')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. NOTIFICATIONS SECTION */}
        <div style={styles.cardSection}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircle}>
              <Bell size={20} color="#22e58a" />
            </div>
            <div>
              <span style={styles.sectionCategory}>{t('settings_sec_notifications')}</span>
              <h2 style={styles.cardTitle}>{t('settings_sec_notifications')}</h2>
            </div>
          </div>

          <div style={styles.notifList}>
            {[
              { key: 'weatherAlerts', labelKey: 'settings_notif_weather', desc: 'Alerts on heavy rainfall, temperature spikes, or high winds.' },
              { key: 'cropHealthAlerts', labelKey: 'settings_notif_health', desc: 'Notifications on canopy vigor drop and spectral anomaly detection.' },
              { key: 'riskAlerts', labelKey: 'settings_notif_risk', desc: 'Early warning indicators for pest & pathogen bio-vulnerabilities.' },
              { key: 'recommendationUpdates', labelKey: 'settings_notif_rec', desc: 'New fertilizer, irrigation, or crop protection advisories.' },
              { key: 'satelliteDataAvailability', labelKey: 'settings_notif_sat', desc: 'Notifications when new Sentinel-2 satellite passes are processed.' }
            ].map((item) => {
              const isChecked = notifState[item.key];
              return (
                <div key={item.key} style={styles.notifRow} onClick={() => handleToggleNotif(item.key)}>
                  <div>
                    <h4 style={styles.notifTitle}>{t(item.labelKey)}</h4>
                    <p style={styles.notifDesc}>{item.desc}</p>
                  </div>
                  <div
                    style={{
                      ...styles.toggleSwitch,
                      backgroundColor: isChecked ? '#22e58a' : 'rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <div
                      style={{
                        ...styles.toggleThumb,
                        transform: isChecked ? 'translateX(20px)' : 'translateX(2px)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. ACCOUNT & SECURITY SECTION */}
        <div style={styles.cardSection}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircle}>
              <Shield size={20} color="#22e58a" />
            </div>
            <div>
              <span style={styles.sectionCategory}>{t('settings_sec_security')}</span>
              <h2 style={styles.cardTitle}>{t('settings_sec_security')}</h2>
            </div>
          </div>

          <div style={styles.securityActionGrid}>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="btn btn-secondary"
              style={styles.securityBtn}
            >
              <Key size={16} color="#38bdf8" />
              <span>{t('settings_change_pass')}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ ...styles.securityBtn, borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ffb4ab' }}
            >
              <LogOut size={16} color="#ffb4ab" />
              <span>{t('settings_logout')}</span>
            </button>
          </div>
        </div>

        {/* 7. ABOUT AGRITWIN NEXUS */}
        <div style={styles.cardSection}>
          <div style={styles.cardHeader}>
            <div style={styles.iconCircle}>
              <Info size={20} color="#22e58a" />
            </div>
            <div>
              <span style={styles.sectionCategory}>{t('settings_sec_about')}</span>
              <h2 style={styles.cardTitle}>AgriTwin Nexus</h2>
            </div>
          </div>

          <p style={styles.aboutDesc}>{t('settings_about_desc')}</p>

          <div style={styles.aboutMetaRow}>
            <div style={styles.versionBadge}>
              <span>{t('settings_version')}:</span>
              <b>v1.0.0</b>
            </div>

            <div style={styles.techStackWrapper}>
              <span style={styles.techLabel}>{t('settings_tech')}:</span>
              <div style={styles.techPillsGroup}>
                {['React.js', 'FastAPI', 'PostgreSQL', 'Sentinel-2', 'Google Earth Engine', 'Python', 'Scikit-learn', 'Leaflet', 'GeoJSON'].map((tech) => (
                  <span key={tech} style={styles.techPill}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={styles.saveActionCard}>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
            style={styles.mainSaveBtn}
          >
            <Save size={18} />
            <span>{isSaving ? t('common_loading') : t('settings_save_btn')}</span>
          </button>
        </div>
      </form>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsPasswordModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} color="#22e58a" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>{t('settings_change_pass')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#94a3b8" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} style={styles.modalBody}>
              {passwordStatus.msg && (
                <div
                  style={{
                    padding: '0.65rem 0.875rem',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    backgroundColor: passwordStatus.type === 'success' ? 'rgba(34, 229, 138, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: passwordStatus.type === 'success' ? '#22e58a' : '#ef4444',
                    border: passwordStatus.type === 'success' ? '1px solid rgba(34, 229, 138, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {passwordStatus.msg}
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={styles.textInput}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.textInput}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.textInput}
                  required
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '860px',
    margin: '0 auto',
    paddingBottom: '3rem'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    margin: 0
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    padding: '0.875rem 1.25rem',
    borderRadius: '14px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#ef4444',
    padding: '0.875rem 1.25rem',
    borderRadius: '14px',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  sectionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: 'rgba(15, 27, 21, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  iconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(34, 229, 138, 0.1)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  sectionCategory: {
    fontSize: '0.675rem',
    fontWeight: '800',
    color: '#22e58a',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'block'
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  profileDisplayRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    flexWrap: 'wrap'
  },
  avatarCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 229, 138, 0.1)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  profileMetaGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: 1
  },
  infoField: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem'
  },
  infoLabel: {
    color: '#94a3b8',
    minWidth: '90px'
  },
  infoValue: {
    color: '#ffffff',
    fontWeight: '600'
  },
  rolePill: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: '#22e58a',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    padding: '2px 8px',
    borderRadius: '9999px',
    border: '1px solid rgba(34, 229, 138, 0.3)'
  },
  editBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.825rem'
  },
  profileEditForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.25rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  inputLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  textInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(8, 17, 13, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  editActionRow: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end'
  },
  langGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  langOptionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1rem 1.25rem',
    borderRadius: '14px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  radioCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid #22e58a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioInner: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22e58a'
  },
  langNative: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  langSub: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  unitToggleGroup: {
    display: 'flex',
    gap: '0.5rem',
    backgroundColor: 'rgba(8, 17, 13, 0.7)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  unitBtn: {
    flex: 1,
    padding: '0.625rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.825rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  notifList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  notifRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(8, 17, 13, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer'
  },
  notifTitle: {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  notifDesc: {
    margin: '2px 0 0 0',
    fontSize: '0.775rem',
    color: '#94a3b8'
  },
  toggleSwitch: {
    width: '44px',
    height: '24px',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0
  },
  toggleThumb: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'all 0.2s ease'
  },
  securityActionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  securityBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem'
  },
  aboutDesc: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#cbd5e1',
    lineHeight: '1.5'
  },
  aboutMetaRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    paddingTop: '0.5rem'
  },
  versionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#94a3b8'
  },
  techStackWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  techLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  techPillsGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  techPill: {
    fontSize: '0.75rem',
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    padding: '3px 10px',
    borderRadius: '9999px',
    fontWeight: '600'
  },
  saveActionCard: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  mainSaveBtn: {
    padding: '0.875rem 2rem',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 12, 9, 0.8)',
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
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  modalCloseBtn: {
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
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    paddingTop: '0.5rem'
  }
};
