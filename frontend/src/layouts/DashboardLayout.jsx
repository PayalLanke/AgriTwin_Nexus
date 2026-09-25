import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.startsWith('/farms/add')) return 'Register New Farm';
    if (path.startsWith('/farms/edit')) return 'Edit Farm Boundary';
    if (path.startsWith('/farms/view')) return 'Farm Details';
    if (path.startsWith('/farms')) return 'My Farms';
    if (path.startsWith('/digital-twin')) return 'Digital Twin';
    if (path.startsWith('/satellite')) return 'Satellite Data';
    if (path.startsWith('/weather')) return 'Weather';
    if (path.startsWith('/pest-risk')) return 'Risk Analysis';
    if (path.startsWith('/yield')) return 'Yield Estimation';
    if (path.startsWith('/recommendations')) return 'Recommendations';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div style={styles.appContainer}>
      <Topbar pageTitle={getPageTitle(location.pathname)} />
      <div style={styles.bodyLayout}>
        <Sidebar />
        <main style={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg)'
  },
  bodyLayout: {
    display: 'flex',
    flex: 1,
    minHeight: 'calc(100vh - 68px)'
  },
  contentArea: {
    flex: 1,
    padding: '1.75rem 2rem',
    overflowY: 'auto',
    minWidth: 0
  }
};
