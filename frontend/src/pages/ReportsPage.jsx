import React from 'react';
import { FileBarChart, Download, FileText, Share2 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Reports & Exports</h1>
            <span className="badge badge-coming-soon">Coming Soon</span>
          </div>
          <p style={styles.subtitle}>
            Comprehensive PDF agronomic reports, spatial GeoJSON data exports, and seasonal yield summaries.
          </p>
        </div>
      </div>

      {/* Main Status & Info Card */}
      <div className="card" style={styles.mainCard}>
        <div style={styles.iconContainer}>
          <FileBarChart size={40} color="var(--color-primary)" />
        </div>
        <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
          Reporting Generator Under Development
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: '520px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
          Report generation will appear after processing engines are active. This module will allow exporting structured PDF field summaries, shapefiles, and GeoJSON boundary datasets.
        </p>

        <div style={styles.specsGrid}>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="var(--color-primary)" />
              <span style={styles.specTitle}>Agronomic PDF Dossier</span>
            </div>
            <span style={styles.specDetail}>Detailed field health summary formatted for farm advisors</span>
          </div>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={16} color="var(--color-teal)" />
              <span style={styles.specTitle}>Spatial GeoJSON / SHP</span>
            </div>
            <span style={styles.specDetail}>Export boundary coordinates for GIS applications</span>
          </div>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={16} color="var(--color-warning)" />
              <span style={styles.specTitle}>Auditing Logs</span>
            </div>
            <span style={styles.specDetail}>Traceability log of sowing dates and field modifications</span>
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
