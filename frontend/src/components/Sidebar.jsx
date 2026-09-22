import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  Satellite,
  CloudSun,
  Cpu,
  ShieldAlert,
  TrendingUp,
  Sparkles,
  FileBarChart,
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const farmNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Farms', path: '/farms', icon: Sprout },
    { label: 'Add Farm', path: '/farms/add', icon: PlusCircle },
  ];

  const analyticsNavItems = [
    { label: 'Digital Twin Canvas', path: '/digital-twin', icon: Cpu, badge: 'Live Grid' },
    { label: 'Satellite Data (S2)', path: '/satellite', icon: Satellite, badge: 'GEE' },
    { label: 'Weather & Climate', path: '/weather', icon: CloudSun },
    { label: 'Pest & Disease Risk', path: '/pest-risk', icon: ShieldAlert, badge: 'Risk Model' },
    { label: 'Yield Estimator', path: '/yield', icon: TrendingUp },
    { label: 'AI Advisories', path: '/recommendations', icon: Sparkles },
    { label: 'Audit Reports', path: '/reports', icon: FileBarChart, badge: 'PDF' },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandContainer}>
        <div style={styles.logoIconContainer}>
          <Sprout size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={styles.brandTitle}>AgriTwin <span style={{ color: 'var(--color-secondary)' }}>Nexus</span></h1>
          <p style={styles.brandSubtitle}>Precision Farming SaaS</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div style={styles.navScrollArea}>
        <div style={styles.navGroup}>
          <div style={styles.sectionHeader}>FARM MANAGEMENT</div>
          {farmNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {})
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div style={styles.navGroup}>
          <div style={styles.sectionHeader}>ANALYTICS & DIGITAL TWIN</div>
          {analyticsNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {})
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span style={styles.activeNavBadge}>{item.badge}</span>}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Badge */}
      <div style={styles.sidebarFooter}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: '700' }}>
          <ShieldCheck size={16} />
          <span>Modules 1–10+ Certified</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 20
  },
  brandContainer: {
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    borderBottom: '1px solid var(--color-border)'
  },
  logoIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(22, 101, 52, 0.3)'
  },
  brandTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    margin: 0,
    lineHeight: '1.1'
  },
  brandSubtitle: {
    fontSize: '0.725rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    marginTop: '2px'
  },
  navScrollArea: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingBottom: '1rem'
  },
  navGroup: {
    padding: '1rem 0.875rem 0.25rem 0.875rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  sectionHeader: {
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '0.06em',
    color: '#94a3b8',
    marginBottom: '0.375rem',
    paddingLeft: '0.5rem'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.55rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    color: '#475569',
    textDecoration: 'none',
    fontSize: '0.825rem',
    fontWeight: '600',
    transition: 'all 0.15s ease'
  },
  navLinkActive: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    fontWeight: '700'
  },
  activeNavBadge: {
    fontSize: '0.625rem',
    fontWeight: '800',
    padding: '0.125rem 0.375rem',
    borderRadius: '4px',
    backgroundColor: 'var(--color-teal-light)',
    color: 'var(--color-teal)',
    border: '1px solid #ccfbf1'
  },
  sidebarFooter: {
    marginTop: 'auto',
    padding: '0.875rem 1.25rem',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: '#f8fafc'
  }
};
