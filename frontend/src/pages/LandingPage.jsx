import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  UserPlus
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

      {/* Main Single-Page Hero Section */}
      <main style={styles.mainHero}>
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

          {/* Role Action Gateway Cards */}
          <div style={styles.heroCtaGrid}>
            {/* Farmer Gateway */}
            <div style={styles.ctaBox}>
              <div style={styles.ctaHeader}>
                <Sprout size={22} color="var(--color-primary)" />
                <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#ffffff' }}>Farmer Gateway</span>
              </div>
              <p style={styles.ctaSub}>Register field boundary & monitor digital twin plot</p>
              <div style={styles.btnRow}>
                <Link to="/farmer/login" className="btn btn-primary" style={styles.actionBtn}>
                  <span>Farmer Login</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/farmer/register" className="btn btn-secondary" style={styles.actionBtnSecondary}>
                  <span>Register Farm</span>
                </Link>
              </div>
            </div>

            {/* Admin Gateway */}
            <div style={styles.ctaBoxTeal}>
              <div style={styles.ctaHeader}>
                <ShieldAlert size={22} color="var(--color-teal)" />
                <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#ffffff' }}>Admin Console</span>
              </div>
              <p style={styles.ctaSub}>Platform operations & farm monitoring oversight</p>
              <div style={styles.btnRow}>
                <Link to="/admin/login" className="btn btn-teal" style={styles.actionBtn}>
                  <span>Admin Login</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/admin/register" className="btn btn-secondary" style={styles.actionBtnSecondary}>
                  <UserPlus size={15} />
                  <span>Register Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
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
    padding: '1rem 1.5rem',
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
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(22, 163, 74, 0.5)',
    flexShrink: 0
  },
  brandTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#ffffff',
    display: 'block',
    lineHeight: '1.1'
  },
  brandSub: {
    fontSize: '0.725rem',
    color: '#94a3b8',
    display: 'block'
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  navBtn: {
    padding: '0.55rem 1.1rem',
    fontSize: '0.85rem'
  },
  mainHero: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1.5rem 5rem 1.5rem',
    background: 'radial-gradient(circle at 50% 30%, #064e3b 0%, #0f172a 75%)'
  },
  heroContainer: {
    maxWidth: '860px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.75rem'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.3)',
    padding: '0.4rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#4ade80'
  },
  heroTitle: {
    fontSize: '2.85rem',
    fontWeight: '800',
    lineHeight: '1.2',
    color: '#ffffff',
    margin: 0,
    maxWidth: '820px'
  },
  highlightText: {
    background: 'linear-gradient(135deg, #4ade80 0%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroDesc: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '740px'
  },
  heroCtaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginTop: '0.5rem',
    width: '100%',
    maxWidth: '780px'
  },
  ctaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left'
  },
  ctaBoxTeal: {
    backgroundColor: 'rgba(15, 118, 110, 0.15)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left'
  },
  ctaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  ctaSub: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    margin: '2px 0 8px 0',
    lineHeight: '1.4'
  },
  btnRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  actionBtn: {
    flex: 1,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1rem'
  },
  actionBtnSecondary: {
    flex: 1,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1rem'
  },
  footer: {
    backgroundColor: '#090d16',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.5rem'
  },
  footerContent: {
    maxWidth: '1240px',
    margin: '0 auto',
    textAlign: 'center',
    fontSize: '0.825rem',
    color: '#64748b'
  }
};
