import React, { useState } from 'react';
<<<<<<< HEAD
import {
  Settings,
  ShieldCheck,
  Key,
  Globe,
  Database,
  Save,
  CheckCircle2,
  Cpu,
  Radio,
  Sliders,
  Terminal
} from 'lucide-react';
=======
import { Settings, Key, Globe, Save, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4

export default function SettingsPage() {
  const { t } = useLanguage();
  const [unitArea, setUnitArea] = useState('hectares');
  const [unitTemp, setUnitTemp] = useState('celsius');
<<<<<<< HEAD
  const [geeKey, setGeeKey] = useState('agritwin-gee-service-acc-2026@agritwin.iam.gserviceaccount.com');
  const [weatherKey, setWeatherKey] = useState('agritwin_owm_live_key_9942');
  const [meshFrequency, setMeshFrequency] = useState('868');
=======
  const [geeKey, setGeeKey] = useState('');
  const [weatherKey, setWeatherKey] = useState('');
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setSuccessMsg('Spatial telemetry settings and API credentials synchronized successfully!');
    setTimeout(() => setSuccessMsg(''), 3500);
=======
    setSuccessMsg(t('save_changes') + ' ✓');
    setTimeout(() => setSuccessMsg(''), 3000);
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
<<<<<<< HEAD
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1 style={styles.title}>System Configuration & Telemetry Gateways</h1>
          <span style={styles.configBadge}>
            <Terminal size={12} color="#00d9ff" />
            NODE V1.2 CALIBRATION
          </span>
=======
        <div>
          <h1 style={styles.title}>{t('settings_title')}</h1>
          <p style={styles.subtitle}>
            {t('settings_subtitle')}
          </p>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
        </div>
        <p style={styles.subtitle}>
          Configure metric coordinate projections, Google Earth Engine service account authentication, and LoRaWAN gateway frequency.
        </p>
      </div>

      {successMsg && (
        <div style={styles.successAlert}>
          <CheckCircle2 size={18} color="#22e58a" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={styles.formLayout}>
<<<<<<< HEAD
        {/* Unit Preferences Card */}
        <div style={styles.cardSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.iconCircle}>
              <Globe size={18} color="#22e58a" />
            </div>
            <div>
              <h3 style={styles.sectionHeading}>Spatial GIS & Measurement Scale</h3>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Coordinate and biometric telemetry units</span>
            </div>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>PRIMARY SURFACE AREA UNIT</label>
              <select
                value={unitArea}
                onChange={(e) => setUnitArea(e.target.value)}
                style={styles.select}
              >
                <option value="hectares" style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  Hectares (Ha) &bull; SI Metric Standard
                </option>
                <option value="acres" style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  Acres &bull; Imperial Survey Standard
                </option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>ATMOSPHERIC TEMPERATURE SCALE</label>
              <select
                value={unitTemp}
                onChange={(e) => setUnitTemp(e.target.value)}
                style={styles.select}
              >
                <option value="celsius" style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  Celsius (°C) &bull; Standard Agro-met
                </option>
                <option value="fahrenheit" style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  Fahrenheit (°F)
                </option>
              </select>
            </div>
=======
        {/* Language Selection Card */}
        <div className="card" style={styles.cardSection}>
          <div style={styles.sectionHeader}>
            <Globe size={20} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('preferred_language')}</h3>
          </div>

          <div style={styles.formGroup}>
            <label style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              {t('preferred_language')}
            </label>
            <LanguageSelector variant="buttons" />
          </div>
        </div>

        {/* Unit Preferences Card */}
        <div className="card" style={styles.cardSection}>
          <div style={styles.sectionHeader}>
            <Settings size={20} color="var(--color-teal)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Display & Measurement Units</h3>
          </div>

          <div style={styles.formGroup}>
            <label>{t('field_area')}</label>
            <select value={unitArea} onChange={(e) => setUnitArea(e.target.value)}>
              <option value="hectares">{t('hectares')} (Ha)</option>
              <option value="acres">{t('acres')}</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>{t('temperature')}</label>
            <select value={unitTemp} onChange={(e) => setUnitTemp(e.target.value)}>
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>
        </div>

        {/* API Credentials Card */}
        <div style={styles.cardSection}>
          <div style={styles.sectionHeader}>
<<<<<<< HEAD
            <div style={{ ...styles.iconCircle, background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.25)' }}>
              <Key size={18} color="#00d9ff" />
            </div>
            <div>
              <h3 style={styles.sectionHeading}>Cloud APIs & Orbital Ingestion Gateways</h3>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>GEE OAuth2 service tokens & weather streams</span>
=======
            <Key size={20} color="var(--color-warning)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>API Credentials</h3>
              <span className="badge badge-coming-soon">Soon</span>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
            </div>
          </div>

          <div style={styles.formGroup}>
<<<<<<< HEAD
            <label style={styles.label}>GOOGLE EARTH ENGINE (GEE) SERVICE ACCOUNT IAM</label>
=======
            <label>Google Earth Engine Service Account Email</label>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
            <input
              type="text"
              value={geeKey}
              onChange={(e) => setGeeKey(e.target.value)}
<<<<<<< HEAD
              style={styles.input}
              placeholder="service-account@project.iam.gserviceaccount.com"
            />
          </div>

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>WEATHER RADAR TELEMETRY API KEY</label>
              <input
                type="password"
                value={weatherKey}
                onChange={(e) => setWeatherKey(e.target.value)}
                style={styles.input}
                placeholder="••••••••••••••••"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>LORAWAN MESH CARRIER FREQUENCY</label>
              <select
                value={meshFrequency}
                onChange={(e) => setMeshFrequency(e.target.value)}
                style={styles.select}
              >
                <option value="868" style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  EU868 / IN865 MHz (Sub-GHz Long Range)
                </option>
                <option value="915" style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  US915 MHz Standard
                </option>
              </select>
            </div>
=======
              placeholder="e.g. service-account@agritwin.iam.gserviceaccount.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Weather API Key</label>
            <input
              type="password"
              value={weatherKey}
              onChange={(e) => setWeatherKey(e.target.value)}
              placeholder="Enter OpenWeatherMap or Weather API key"
            />
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>
        </div>

        <div style={styles.actionCard}>
          <button
            type="submit"
            className="cyber-gradient-btn"
            style={{ width: '100%', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}
          >
            <Save size={18} />
<<<<<<< HEAD
            <span>Commit Platform Configurations</span>
=======
            <span>{t('save_changes')}</span>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '840px'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  title: {
<<<<<<< HEAD
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
=======
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    margin: 0
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  subtitle: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    margin: '4px 0 0 0'
  },
  configBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.35)',
    color: '#00d9ff',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
<<<<<<< HEAD
    gap: '0.625rem',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    padding: '0.875rem 1.25rem',
    borderRadius: '14px',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'Space Grotesk, sans-serif'
=======
    gap: '0.5rem',
    backgroundColor: 'var(--color-light-green)',
    border: '1px solid #bbf7d0',
    color: 'var(--color-primary)',
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    fontWeight: '600'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.75rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  iconCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    background: 'rgba(34, 229, 138, 0.1)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeading: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem'
  },
  label: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(8, 17, 13, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(8, 17, 13, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  actionCard: {
<<<<<<< HEAD
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.25rem'
=======
    backgroundColor: '#fafdfa'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
