import React from 'react';
import { Satellite, Clock, Layers, Filter } from 'lucide-react';

export default function SatellitePage() {
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Satellite Data Acquisition</h1>
            <span className="badge badge-coming-soon">Coming Soon</span>
          </div>
          <p style={styles.subtitle}>
            Sentinel-2 multispectral satellite imagery ingestion pipeline & Google Earth Engine integration.
          </p>
        </div>
      </div>

      {/* Main Status & Info Card */}
      <div className="card" style={styles.mainCard}>
        <div style={styles.iconContainer}>
          <Satellite size={40} color="var(--color-primary)" />
        </div>
        <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
          Sentinel-2 Integration Pipeline Under Development
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: '520px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
          Satellite analysis will appear after satellite data integration. This module will fetch 10-meter resolution multispectral tiles from Copernicus Sentinel-2 and clip them directly to your registered GeoJSON farm boundaries.
        </p>

        <div style={styles.specsGrid}>
          <div style={styles.specBox}>
            <span style={styles.specTitle}>Multispectral Bands</span>
            <span style={styles.specDetail}>B2 (Blue), B4 (Red), B5 (Red Edge), B8 (NIR), B11 (SWIR)</span>
          </div>
          <div style={styles.specBox}>
            <span style={styles.specTitle}>Atmospheric Correction</span>
            <span style={styles.specDetail}>Sen2Cor L2A Bottom-Of-Atmosphere (BOA) Reflectance</span>
          </div>
          <div style={styles.specBox}>
            <span style={styles.specTitle}>Revisit Cadence</span>
            <span style={styles.specDetail}>5-Day Global Recurrent Tile Acquisition Cycle</span>
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
    backgroundColor: 'var(--color-light-green)',
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
    gap: '0.25rem'
  },
  specTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    textTransform: 'uppercase'
  },
  specDetail: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-main)',
    fontWeight: '500'
  }
};
