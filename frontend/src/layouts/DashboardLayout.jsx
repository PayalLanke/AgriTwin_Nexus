import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = (path) => {
<<<<<<< HEAD
    if (path.startsWith('/farms/add')) return 'Register Farm Boundary';
    if (path.startsWith('/farms/edit')) return 'Edit Boundary ROI';
    if (path.startsWith('/farms/view')) return 'Farm Spatial Specifications';
    if (path.startsWith('/farms')) return 'Registered Agricultural Plots';
    if (path.startsWith('/digital-twin')) return '3D Spatial Twin Studio';
    if (path.startsWith('/satellite')) return 'Sentinel-2 Multispectral Hub';
    if (path.startsWith('/weather')) return 'Micro-Climate Telemetry Station';
    if (path.startsWith('/pest-risk')) return 'Pathogen Risk Radar';
    if (path.startsWith('/yield')) return 'Yield Projection Engine';
    if (path.startsWith('/recommendations')) return 'Autonomous Action Protocols';
    if (path.startsWith('/reports')) return 'Digital Twin Audit Dossiers';
    if (path.startsWith('/settings')) return 'System Telemetry Configurations';
    return 'Digital Twin Command HUD';
=======
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
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
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
    backgroundColor: '#070e0b',
    color: '#f8fafc'
  },
  bodyLayout: {
    display: 'flex',
<<<<<<< HEAD
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden'
  },
  contentArea: {
    flex: 1,
    padding: '1.75rem 2rem 3rem 2rem',
    overflowY: 'auto'
=======
    flex: 1,
    minHeight: 'calc(100vh - 68px)'
  },
  contentArea: {
    flex: 1,
    padding: '1.75rem 2rem',
    overflowY: 'auto',
    minWidth: 0
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
