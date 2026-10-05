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
  ShieldAlert,
  TrendingUp,
  Sparkles,
  FileBarChart,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Box
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();

  const farmNavItems = [
    { label: t('nav_dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('nav_digital_twin'), path: '/digital-twin', icon: Cpu, badge: '3D' },
    { label: t('nav_my_farms'), path: '/farms', icon: Sprout },
    { label: t('nav_add_farm'), path: '/farms/add', icon: PlusCircle },
  ];

  const analyticsNavItems = [
    { label: t('nav_satellite'), path: '/satellite', icon: Satellite, badge: 'GEE' },
    { label: t('nav_weather'), path: '/weather', icon: CloudSun },
    { label: t('nav_pest_risk'), path: '/pest-risk', icon: ShieldAlert },
    { label: t('nav_yield'), path: '/yield', icon: TrendingUp },
    { label: t('nav_recommendations'), path: '/recommendations', icon: Sparkles },
    { label: t('nav_reports'), path: '/reports', icon: FileBarChart },
    { label: t('nav_settings'), path: '/settings', icon: Settings },
  ];

  return (
    <aside style={{
      ...styles.sidebar,
      width: collapsed ? '72px' : '250px'
    }}>


      {/* Navigation Groups */}
      <div style={styles.navScrollArea}>
        <div style={styles.navGroup}>
          {!collapsed && <div style={styles.sectionHeader}>{t('nav_group_farm')}</div>}
          {farmNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
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
          {!collapsed && <div style={styles.sectionHeader}>{t('nav_group_analytics')}</div>}
          {analyticsNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
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
          title={collapsed ? t('nav_collapse_dock') : t('nav_collapse_dock')}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>{t('nav_collapse_dock')}</span>}
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
            <span>{t('nav_twin_live')}</span>
          </div>
        )}
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
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  brandSubtitle: {
    fontSize: '0.68rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  navScrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem 0.65rem'
  },
  navGroup: {
    marginBottom: '1.25rem'
  },
  sectionHeader: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.06em',
    padding: '0.35rem 0.65rem',
    marginBottom: '0.3rem',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--color-text-secondary)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    marginBottom: '0.2rem',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  navLinkActive: {
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    color: 'var(--color-primary)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    boxShadow: '0 0 16px rgba(34, 229, 138, 0.15)'
  },
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
  }
};
