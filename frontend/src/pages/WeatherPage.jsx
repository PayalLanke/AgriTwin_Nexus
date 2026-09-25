import React from 'react';
import { CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';

export default function WeatherPage() {
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Weather Insights</h1>
            <span className="badge badge-coming-soon">Coming Soon</span>
          </div>
          <p style={styles.subtitle}>
            Agronomic micro-climate parameters, soil moisture, and spraying suitability forecasts.
          </p>
        </div>
      </div>

      {/* Main Status & Info Card */}
      <div className="card" style={styles.mainCard}>
        <div style={styles.iconContainer}>
          <CloudSun size={40} color="var(--color-warning)" />
        </div>
        <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
          Weather Service Integration Under Development
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: '520px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
          Weather information will appear after weather service integration. This module will stream hyper-local ambient temperature, volumetric soil moisture, relative humidity, and 7-day spraying suitability indices for registered farm locations.
        </p>

        <div style={styles.specsGrid}>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={16} color="var(--color-warning)" />
              <span style={styles.specTitle}>Air & Canopy Temp</span>
            </div>
            <span style={styles.specDetail}>Thermal telemetry for heat stress & frost warning</span>
          </div>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={16} color="var(--color-teal)" />
              <span style={styles.specTitle}>Soil Moisture</span>
            </div>
            <span style={styles.specDetail}>Volumetric soil water content at 0-10cm root zone</span>
          </div>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind size={16} color="var(--color-primary)" />
              <span style={styles.specTitle}>Spray Suitability</span>
            </div>
            <span style={styles.specDetail}>Wind speed & dew point thresholds for pesticide drift</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    margin: '2px 0 0 0'
  },
  mainCard: {
    padding: '3.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  iconContainer: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#fffbeb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem'
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    width: '100%',
    maxWidth: '750px',
    marginTop: '1.5rem'
  },
  specBox: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  specTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    textTransform: 'uppercase'
  },
  specDetail: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)'
  }
};
