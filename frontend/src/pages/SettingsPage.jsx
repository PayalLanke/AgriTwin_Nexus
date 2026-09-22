import React, { useState } from 'react';
import { Settings, ShieldCheck, Key, Globe, Database, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [unitArea, setUnitArea] = useState('hectares');
  const [unitTemp, setUnitTemp] = useState('celsius');
  const [geeKey, setGeeKey] = useState('agritwin-gee-service-acc-2026@agritwin.iam.gserviceaccount.com');
  const [weatherKey, setWeatherKey] = useState('agritwin_owm_live_key_9942');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccessMsg('Settings and API credentials updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Platform Settings & Configurations</h1>
          <p style={styles.subtitle}>
            Configure unit measurement preferences, Google Earth Engine service keys, and weather API endpoints.
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={styles.successAlert}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={styles.formLayout}>
        {/* Unit Preferences Card */}
        <div className="card" style={styles.cardSection}>
          <div style={styles.sectionHeader}>
            <Globe size={20} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Display & Measurement Units</h3>
          </div>

          <div style={styles.formGroup}>
            <label>Primary Land Area Unit</label>
            <select value={unitArea} onChange={(e) => setUnitArea(e.target.value)}>
              <option value="hectares">Hectares (Ha) — Metric Standard</option>
              <option value="acres">Acres — Imperial Standard</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Temperature Scale</label>
            <select value={unitTemp} onChange={(e) => setUnitTemp(e.target.value)}>
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>

        {/* API Credentials Card */}
        <div className="card" style={styles.cardSection}>
          <div style={styles.sectionHeader}>
            <Key size={20} color="var(--color-teal)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>API Integrations & Service Credentials</h3>
          </div>

          <div style={styles.formGroup}>
            <label>Google Earth Engine (GEE) Service Account</label>
            <input
              type="text"
              value={geeKey}
              onChange={(e) => setGeeKey(e.target.value)}
              placeholder="service-account@project.iam.gserviceaccount.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label>Weather API Live Key</label>
            <input
              type="password"
              value={weatherKey}
              onChange={(e) => setWeatherKey(e.target.value)}
              placeholder="••••••••••••••••"
            />
          </div>
        </div>

        <div className="card" style={styles.actionCard}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
            <Save size={18} />
            <span>Save Platform Configurations</span>
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
    maxWidth: '780px'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: 0
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid #bbf7d0',
    color: 'var(--color-primary)',
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-lg)',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  formLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  actionCard: {
    backgroundColor: '#f8fafc'
  }
};
