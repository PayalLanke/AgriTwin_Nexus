import React, { useState } from 'react';
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
<<<<<<< HEAD
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Radio,
  Boxes
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const farmNavItems = [
    { label: '3D Command', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Spatial Twin', path: '/digital-twin', icon: Cpu, badge: '3D' },
    { label: 'Farm Parcels', path: '/farms', icon: Sprout },
    { label: 'Register Parcel', path: '/farms/add', icon: PlusCircle },
  ];

  const analyticsNavItems = [
    { label: 'Satellite (S2)', path: '/satellite', icon: Satellite, badge: 'GEE' },
    { label: 'Weather & Spray ΔT', path: '/weather', icon: CloudSun },
    { label: 'Pest & Pathogen', path: '/pest-risk', icon: ShieldAlert, badge: 'Low 18%' },
    { label: 'Yield Integrator', path: '/yield', icon: TrendingUp },
    { label: 'AI Prescriptions', path: '/recommendations', icon: Sparkles },
    { label: 'Mission Reports', path: '/reports', icon: FileBarChart, badge: 'PDF' },
    { label: 'Platform Config', path: '/settings', icon: Settings },
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
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
    <aside style={{
      ...styles.sidebar,
      width: collapsed ? '72px' : '250px'
    }}>
      {/* Brand Header */}
      <div style={styles.brandContainer}>
        <div style={styles.logoIconContainer}>
<<<<<<< HEAD
          <Boxes size={22} color="var(--color-primary)" />
=======
          <Sprout size={20} color="#ffffff" />
        </div>
        <div>
          <h2 style={styles.brandTitle}>
            AgriTwin <span style={{ color: 'var(--color-secondary)' }}>Nexus</span>
          </h2>
          <p style={styles.brandSubtitle}>Spatial Digital Twin Engine</p>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
        </div>
        {!collapsed && (
          <div>
            <h1 style={styles.brandTitle}>
              AgriTwin <span style={{ color: 'var(--color-primary)' }}>3D</span>
            </h1>
            <p style={styles.brandSubtitle}>Spatial Digital Twin</p>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <div style={styles.navScrollArea}>
<<<<<<< HEAD
        <div style={styles.navGroup}>
          {!collapsed && <div style={styles.sectionHeader}>COMMAND & TWIN</div>}
          {farmNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                  justifyContent: collapsed ? 'center' : 'flex-start'
                })}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span style={styles.activeNavBadge}>{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div style={styles.navGroup}>
          {!collapsed && <div style={styles.sectionHeader}>TELEMETRY & AI</div>}
          {analyticsNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                  justifyContent: collapsed ? 'center' : 'space-between'
                })}
                title={collapsed ? item.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <span style={styles.activeNavBadge}>{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Collapse Toggle & Footer */}
      <div style={styles.sidebarFooter}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={styles.collapseBtn}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar for Full 3D View'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse Dock</span>}
        </button>

        {!collapsed && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-primary)',
            fontSize: '0.72rem',
            fontWeight: '700',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            <ShieldCheck size={16} />
            <span>Digital Twin v4.2 Live</span>
          </div>
        )}
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    backgroundColor: 'rgba(11, 21, 17, 0.95)',
    backdropFilter: 'blur(24px)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
<<<<<<< HEAD
    transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 50,
    flexShrink: 0
  },
  brandContainer: {
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 1.25rem',
    borderBottom: '1px solid var(--color-border-subtle)'
  },
  logoIconContainer: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(34, 229, 138, 0.2)'
  },
  brandTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  brandSubtitle: {
<<<<<<< HEAD
    fontSize: '0.68rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
=======
    fontSize: '0.675rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '500',
    marginTop: '2px'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  navScrollArea: {
    flex: 1,
    overflowY: 'auto',
<<<<<<< HEAD
    padding: '1rem 0.65rem'
  },
  navGroup: {
    marginBottom: '1.25rem'
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  sectionHeader: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.06em',
<<<<<<< HEAD
    padding: '0.35rem 0.65rem',
    marginBottom: '0.3rem',
    fontFamily: 'Space Grotesk, sans-serif'
=======
    color: '#94a3b8',
    marginBottom: '0.35rem',
    paddingLeft: '0.5rem'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
<<<<<<< HEAD
    gap: '0.65rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.82rem',
=======
    justifyContent: 'space-between',
    padding: '0.5rem 0.625rem',
    borderRadius: 'var(--radius-md)',
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '0.8125rem',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    marginBottom: '0.2rem',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  navLinkActive: {
<<<<<<< HEAD
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
=======
    backgroundColor: 'var(--color-light-green)',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    color: 'var(--color-primary)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    boxShadow: '0 0 16px rgba(34, 229, 138, 0.15)'
  },
<<<<<<< HEAD
  activeNavBadge: {
    fontSize: '0.65rem',
    fontWeight: '700',
    backgroundColor: 'rgba(0, 217, 255, 0.14)',
    color: 'var(--color-secondary)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '1px 6px',
    borderRadius: '9999px',
    fontFamily: 'JetBrains Mono, monospace'
  },
  sidebarFooter: {
    padding: '1rem',
    borderTop: '1px solid var(--color-border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  collapseBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.45rem',
    background: 'rgba(23, 34, 29, 0.6)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-secondary)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'Space Grotesk, sans-serif'
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
