import React, { useState } from 'react';
import { Settings, Key, Globe, Save, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [unitArea, setUnitArea] = useState('hectares');
  const [unitTemp, setUnitTemp] = useState('celsius');
  const [geeKey, setGeeKey] = useState('');
  const [weatherKey, setWeatherKey] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccessMsg(t('save_changes') + ' ✓');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{t('settings_title')}</h1>
          <p style={styles.subtitle}>
            {t('settings_subtitle')}
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
          </div>
        </div>

        {/* API Credentials Card */}
        <div className="card" style={styles.cardSection}>
          <div style={styles.sectionHeader}>
            <Key size={20} color="var(--color-warning)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>API Credentials</h3>
              <span className="badge badge-coming-soon">Soon</span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label>Google Earth Engine Service Account Email</label>
            <input
              type="text"
              value={geeKey}
              onChange={(e) => setGeeKey(e.target.value)}
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
          </div>
        </div>

        <div className="card" style={styles.actionCard}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
            <Save size={18} />
            <span>{t('save_changes')}</span>
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
    fontWeight: '800',
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
    backgroundColor: 'var(--color-light-green)',
    border: '1px solid #bbf7d0',
    color: 'var(--color-primary)',
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-md)',
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
    backgroundColor: '#fafdfa'
  }
};
