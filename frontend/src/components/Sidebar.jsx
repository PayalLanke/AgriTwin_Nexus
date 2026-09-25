import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  Cpu,
  Satellite,
  CloudSun,
  Activity,
  ShieldAlert,
  TrendingUp,
  Sparkles,
  FileBarChart,
  Settings,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useLanguage();

  const farmNavItems = [
    { label: t('nav_dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('nav_my_farms'), path: '/farms', icon: Sprout },
    { label: t('nav_add_farm'), path: '/farms/add', icon: PlusCircle }
  ];

  const digitalFarmNavItems = [
    { label: t('nav_digital_twin'), path: '/digital-twin', icon: Cpu, isFuture: true },
    { label: t('nav_satellite'), path: '/satellite', icon: Satellite, isFuture: true },
    { label: t('nav_weather'), path: '/weather', icon: CloudSun, isFuture: true }
  ];

  const analyticsNavItems = [
    { label: t('health_status') || 'Crop Health', path: '/satellite', icon: Activity, isFuture: true },
    { label: t('nav_pest_risk'), path: '/pest-risk', icon: ShieldAlert, isFuture: true },
    { label: t('nav_yield'), path: '/yield', icon: TrendingUp, isFuture: true },
    { label: t('nav_recommendations'), path: '/recommendations', icon: Sparkles, isFuture: true }
  ];

  const systemNavItems = [
    { label: t('nav_reports'), path: '/reports', icon: FileBarChart, isFuture: true },
    { label: t('nav_settings'), path: '/settings', icon: Settings, isFuture: false }
  ];

  const renderNavGroup = (title, items) => (
    <div style={styles.navGroup}>
      <div style={styles.sectionHeader}>{title}</div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label + item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {})
            })}
          >
            <div style={styles.navLabelWrapper}>
              <Icon size={17} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </div>
            {item.isFuture && (
              <span className="badge badge-coming-soon">Soon</span>
            )}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brandContainer}>
        <div style={styles.logoIconContainer}>
          <Sprout size={20} color="#ffffff" />
        </div>
        <div>
          <h2 style={styles.brandTitle}>
            AgriTwin <span style={{ color: 'var(--color-secondary)' }}>Nexus</span>
          </h2>
          <p style={styles.brandSubtitle}>Spatial Digital Twin Engine</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div style={styles.navScrollArea}>
        {renderNavGroup('FARM MANAGEMENT', farmNavItems)}
        {renderNavGroup('DIGITAL FARM', digitalFarmNavItems)}
        {renderNavGroup('ANALYTICS', analyticsNavItems)}
        {renderNavGroup('SYSTEM', systemNavItems)}
      </div>

      {/* Sidebar Footer */}
      <div style={styles.sidebarFooter}>
        <div style={styles.phaseBadge}>
          <Layers size={14} color="var(--color-primary)" />
          <span>Spatial Twin Foundation Active</span>
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
    height: 'calc(100vh - 68px)',
    position: 'sticky',
    top: '68px',
    zIndex: 20,
    flexShrink: 0
  },
  brandContainer: {
    padding: '1.125rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: '#fafdfa'
  },
  logoIconContainer: {
    width: '34px',
    height: '34px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)'
  },
  brandTitle: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    margin: 0,
    lineHeight: '1.1'
  },
  brandSubtitle: {
    fontSize: '0.675rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
    marginTop: '2px'
  },
  navScrollArea: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '0.5rem 0'
  },
  navGroup: {
    padding: '0.625rem 0.875rem 0.25rem 0.875rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  sectionHeader: {
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '0.06em',
    color: '#94a3b8',
    marginBottom: '0.35rem',
    paddingLeft: '0.5rem'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0.625rem',
    borderRadius: 'var(--radius-md)',
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    fontWeight: '600',
    transition: 'all 0.15s ease'
  },
  navLinkActive: {
    backgroundColor: 'var(--color-light-green)',
    color: 'var(--color-primary)',
    fontWeight: '700'
  },
  navLabelWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem'
  },
  sidebarFooter: {
    marginTop: 'auto',
    padding: '0.875rem 1.25rem',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  phaseBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-primary)'
  }
};
