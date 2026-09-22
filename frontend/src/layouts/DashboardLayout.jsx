import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  const location = useLocation();

  // Derive dynamic page title from path
  const getPageTitle = (path) => {
    if (path.startsWith('/farms/add')) return 'Register New Farm';
    if (path.startsWith('/farms/edit')) return 'Edit Farm Boundary';
    if (path.startsWith('/farms/view')) return 'Farm Digital Twin Details';
    if (path.startsWith('/farms')) return 'My Registered Farms';
    return 'Dashboard Overview';
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainWrapper}>
        <Topbar pageTitle={getPageTitle(location.pathname)} />
        <main style={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg)'
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  contentArea: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto'
  }
};
