import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Satellite,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  Check,
  UserPlus,
  Compass,
  Globe,
  CloudSun,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={styles.pageContainer}>
      {/* Top Glassmorphic Navigation Header */}
      <header style={styles.navHeader}>
        <div style={styles.navContent}>
          <div style={styles.brand}>
            <div style={styles.logoIconBox}>
              <Sprout size={24} color="#ffffff" />
            </div>
            <div>
              <span style={styles.brandTitle}>
                AgriTwin <span style={{ color: '#4ade80' }}>Nexus</span>
              </span>
              <span style={styles.brandSub}>Intelligent Precision Farming Platform</span>
            </div>
          </div>

          <div style={styles.navActions}>
            <Link to="/farmer/login" className="btn btn-primary" style={styles.navBtn}>
              <span>Farmer Portal</span>
            </Link>
            <Link to="/admin/login" className="btn btn-teal" style={styles.navBtn}>
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroBadge}>
            <Sparkles size={16} color="#4ade80" />
            <span>Next-Gen Earth Observation & Precision Farming Software</span>
          </div>

          <h1 style={styles.heroTitle}>
            Intelligent Digital Twin Platform for <span style={styles.highlightText}>Precision Farming</span>
          </h1>

          <p style={styles.heroDesc}>
            AgriTwin Nexus combines farm boundary mapping, Copernicus Sentinel-2 satellite imagery, weather telemetry, and machine learning models into a digital field replica to empower data-driven agronomic decisions.
          </p>

          {/* Role Action CTAs */}
          <div style={styles.heroCtaGrid}>
            <div style={styles.ctaBox}>
              <div style={styles.ctaHeader}>
                <Sprout size={20} color="var(--color-primary)" />
                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#ffffff' }}>Farmer Gateway</span>
              </div>
              <p style={styles.ctaSub}>Register field boundary & monitor digital twin</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <Link to="/farmer/login" className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem' }}>
                  <span>Farmer Login</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/farmer/register" className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>
                  <span>Register Farm</span>
                </Link>
              </div>
            </div>

            <div style={styles.ctaBoxTeal}>
              <div style={styles.ctaHeader}>
                <ShieldAlert size={20} color="var(--color-teal)" />
                <span style={{ fontWeight: '700', fontSize: '1rem', color: '#ffffff' }}>Admin Gateway</span>
              </div>
              <p style={styles.ctaSub}>Platform operations & farm monitoring oversight</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <Link to="/admin/login" className="btn btn-teal" style={{ flex: 1, fontSize: '0.85rem' }}>
                  <span>Admin Login</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/admin/register" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                  <UserPlus size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics / Capabilities */}
          <div style={styles.quickMetricsRow}>
            <div style={styles.quickMetricItem}>
              <MapPin size={16} color="#4ade80" />
              <span>GeoJSON Boundary Mapping</span>
            </div>
            <div style={styles.quickMetricItem}>
              <Satellite size={16} color="#38bdf8" />
              <span>10m Sentinel-2 Satellite Bands</span>
            </div>
            <div style={styles.quickMetricItem}>
              <Layers size={16} color="#facc15" />
              <span>NDVI / NDRE / SAVI Indices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Portal Selection Section */}
      <section style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <span className="badge badge-teal">Access Gateways</span>
          <h2 style={styles.sectionTitle}>Select Platform Portal</h2>
          <p style={styles.sectionSub}>Tailored operational control for both individual farmers and system administrators.</p>
        </div>

        <div style={styles.portalsGrid}>
          {/* Farmer Portal Card */}
          <div className="card" style={styles.portalCard}>
            <div style={styles.portalBadgeRow}>
              <div style={styles.portalIconBoxGreen}>
                <Sprout size={28} color="var(--color-primary)" />
              </div>
              <span className="badge badge-primary">Farmer Portal</span>
            </div>
            <h3 style={styles.portalTitle}>Farmer Interface</h3>
            <p style={styles.portalDesc}>
              Register your farm location, delineate plot boundaries on interactive satellite maps, calculate field area in Hectares and Acres, and track digital twin health.
            </p>
            <div style={styles.portalFeaturesList}>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-primary)" /> Interactive GeoJSON polygon drawing</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-primary)" /> Automated geodesic area math (Ha & Acres)</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-primary)" /> Sentinel-2 satellite canopy monitoring</div>
            </div>
            <div style={styles.portalActionGroup}>
              <Link to="/farmer/login" className="btn btn-primary" style={{ flex: 1 }}>
                <span>Farmer Login</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/farmer/register" className="btn btn-secondary" style={{ flex: 1 }}>
                <span>Register Farm</span>
              </Link>
            </div>
          </div>

          {/* Administrator Portal Card */}
          <div className="card" style={styles.portalCardTeal}>
            <div style={styles.portalBadgeRow}>
              <div style={styles.portalIconBoxTeal}>
                <ShieldAlert size={28} color="var(--color-teal)" />
              </div>
              <span className="badge badge-teal">Admin Control</span>
            </div>
            <h3 style={styles.portalTitle}>Administrator Console</h3>
            <p style={styles.portalDesc}>
              Monitor registered farms across regions, track satellite ingestion status, review crop distribution statistics, and manage platform user directories.
            </p>
            <div style={styles.portalFeaturesList}>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-teal)" /> Geospatial platform farm map oversight</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-teal)" /> Regional crop density & land coverage stats</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-teal)" /> Sentinel-2 API pipeline telemetry logs</div>
            </div>
            <div style={styles.portalActionGroup}>
              <Link to="/admin/login" className="btn btn-teal" style={{ flex: 1 }}>
                <span>Admin Login</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/admin/register" className="btn btn-secondary" style={{ flex: 1 }}>
                <UserPlus size={16} />
                <span>Register Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Overview Section */}
      <section style={{ ...styles.sectionContainer, backgroundColor: 'rgba(15, 23, 42, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={styles.sectionHeader}>
          <span className="badge badge-primary">Platform Capabilities</span>
          <h2 style={styles.sectionTitle}>Precision Farming Modules</h2>
          <p style={styles.sectionSub}>Comprehensive tools bridging satellite observation and agricultural AI analytics.</p>
        </div>

        <div style={styles.techGrid}>
          <div className="card" style={styles.techCard}>
            <Satellite size={32} color="var(--color-primary)" />
            <h4 style={styles.techCardTitle}>Sentinel-2 Multispectral Remote Sensing</h4>
            <p style={styles.techCardDesc}>
              10m optical band imagery (B4 Red, B8 NIR, B5 Vegetation Red Edge) for tracking canopy density and photosynthesis strength.
            </p>
          </div>

          <div className="card" style={styles.techCard}>
            <MapPin size={32} color="var(--color-teal)" />
            <h4 style={styles.techCardTitle}>Leaflet GeoJSON Vector Engine</h4>
            <p style={styles.techCardDesc}>
              Real-time geodesic area computation in Hectares and Acres calculated from interactive map polygon boundary coordinates.
            </p>
          </div>

          <div className="card" style={styles.techCard}>
            <Globe size={32} color="#facc15" />
            <h4 style={styles.techCardTitle}>Google Earth Engine Integration</h4>
            <p style={styles.techCardDesc}>
              Automated spatial cloud pipeline for retrieving historical multispectral data and temporal growth curves.
            </p>
          </div>

          <div className="card" style={styles.techCard}>
            <ShieldAlert size={32} color="#fbbf24" />
            <h4 style={styles.techCardTitle}>Agronomic Risk & Advisory Engine</h4>
            <p style={styles.techCardDesc}>
              Supervised rules and Machine Learning models diagnosing crop stress, pest infection risks, and yield estimations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <div style={styles.brand}>
              <Sprout size={24} color="#ffffff" />
              <span style={{ ...styles.brandTitle, color: '#ffffff' }}>AgriTwin Nexus</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '340px' }}>
              Intelligent Digital Twin Platform for Precision Farming
            </p>
          </div>

          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>Access Gateways</h4>
            <Link to="/farmer/login" style={styles.footerLink}>Farmer Portal Login</Link>
            <Link to="/farmer/register" style={styles.footerLink}>Register New Farm</Link>
            <Link to="/admin/login" style={styles.footerLink}>Administrator Portal Login</Link>
            <Link to="/admin/register" style={styles.footerLink}>Register Administrator</Link>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span>© 2026 AgriTwin Nexus Platform. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#090d16',
    color: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  navHeader: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContent: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '0.875rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoIconBox: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(22, 163, 74, 0.5)',
    flexShrink: 0
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    display: 'block',
    lineHeight: '1.1'
  },
  brandSub: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    display: 'block'
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  navBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.825rem'
  },
  heroSection: {
    padding: '4rem 1.5rem 4.5rem 1.5rem',
    background: 'radial-gradient(circle at 50% 20%, #064e3b 0%, #0f172a 75%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  heroContainer: {
    maxWidth: '960px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.5rem'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.3)',
    padding: '0.375rem 0.875rem',
    borderRadius: '9999px',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: '#4ade80'
  },
  heroTitle: {
    fontSize: '2.75rem',
    fontWeight: '800',
    lineHeight: '1.2',
    color: '#ffffff',
    margin: 0,
    maxWidth: '850px'
  },
  highlightText: {
    background: 'linear-gradient(135deg, #4ade80 0%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroDesc: {
    fontSize: '1.05rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '780px'
  },
  heroCtaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem',
    marginTop: '0.75rem',
    width: '100%',
    maxWidth: '780px'
  },
  ctaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    textAlign: 'left'
  },
  ctaBoxTeal: {
    backgroundColor: 'rgba(15, 118, 110, 0.15)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    textAlign: 'left'
  },
  ctaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  ctaSub: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    margin: '2px 0 6px 0'
  },
  quickMetricsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.75rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap'
  },
  quickMetricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.825rem',
    fontWeight: '600',
    color: '#cbd5e1'
  },
  sectionContainer: {
    padding: '4.5rem 1.5rem',
    maxWidth: '1240px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '2.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  sectionTitle: {
    fontSize: '2.1rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  sectionSub: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    margin: 0,
    maxWidth: '650px'
  },
  portalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2rem'
  },
  portalCard: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  portalCardTeal: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    padding: '2.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  portalBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  portalIconBoxGreen: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  portalIconBoxTeal: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    border: '1px solid var(--color-teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  portalTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  portalDesc: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: 0
  },
  portalFeaturesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
    margin: '0.5rem 0'
  },
  portalCheckItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.85rem',
    color: '#e2e8f0'
  },
  portalActionGroup: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: 'auto'
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem'
  },
  techCard: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  techCardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  techCardDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: '1.5',
    margin: 0
  },
  footer: {
    backgroundColor: '#090d16',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '3rem 1.5rem 1.5rem 1.5rem'
  },
  footerContent: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  footerColTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.5rem 0'
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem'
  },
  footerBottom: {
    maxWidth: '1240px',
    margin: '2rem auto 0 auto',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#64748b'
  }
};
