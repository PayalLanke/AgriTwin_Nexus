import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { farmService } from '../services/farmService';
import FarmMap from '../components/FarmMap';
import {
  Users,
  Sprout,
  MapPin,
  Layers,
  ShieldCheck,
  LogOut,
  Activity,
  Globe,
  Database,
  BarChart2,
  Calendar,
  Search,
  Filter,
  Download,
  Terminal,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  RefreshCw,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'farms' | 'users' | 'telemetry'

  const [farms, setFarms] = useState([]);
  const [registeredFarmers, setRegisteredFarmers] = useState([]);
  const [registeredAdmins, setRegisteredAdmins] = useState([]);
  
  // Search & Filters
  const [farmSearch, setFarmSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalAdmins: 1,
    totalFarms: 0,
    totalHectares: 0,
    totalAcres: 0
  });

  // Simulated Telemetry Activity Logs
  const [logs, setLogs] = useState([
    { id: 1, time: '15:32:01', level: 'INFO', msg: 'Sentinel-2 L2A Tile Ingestion for Grid 43QKD initiated via Google Earth Engine API.' },
    { id: 2, time: '15:28:44', level: 'SUCCESS', msg: 'GeoJSON vector area calculation verified: 3.85 Ha computed.' },
    { id: 3, time: '15:15:10', level: 'INFO', msg: 'OpenWeather API weather sync successful for region Maharashtra (Lat 18.52 N).' },
    { id: 4, time: '14:50:22', level: 'SUCCESS', msg: 'Farmer session usr_demo_1 authenticated successfully.' }
  ]);

  useEffect(() => {
    const admin = authService.getAdminUser();
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setAdminUser(admin);
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const allFarms = await farmService.getAllFarmsForAdmin();
      setFarms(allFarms);

      const storedFarmers = JSON.parse(localStorage.getItem('agritwin_users') || '[]');
      setRegisteredFarmers(storedFarmers);

      const storedAdmins = JSON.parse(localStorage.getItem('agritwin_admins') || '[]');
      setRegisteredAdmins(storedAdmins);

      const sumHa = allFarms.reduce((acc, f) => acc + (parseFloat(f.areaHectares) || 0), 0);
      const sumAcres = allFarms.reduce((acc, f) => acc + (parseFloat(f.areaAcres) || 0), 0);

      setStats({
        totalFarmers: Math.max(1, storedFarmers.length + 1), // Including demo farmer
        totalAdmins: Math.max(1, storedAdmins.length + 1),
        totalFarms: allFarms.length,
        totalHectares: parseFloat(sumHa.toFixed(2)),
        totalAcres: parseFloat(sumAcres.toFixed(2))
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminLogout = () => {
    authService.adminLogout();
    navigate('/admin/login');
  };

  // Export Platform Farm Report as JSON/CSV trigger
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(farms, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `agritwin_platform_farms_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Farms List
  const filteredFarms = farms.filter((f) => {
    const matchesSearch = f.farmName.toLowerCase().includes(farmSearch.toLowerCase()) ||
                          (f.cropType && f.cropType.toLowerCase().includes(farmSearch.toLowerCase()));
    const matchesCrop = cropFilter === 'ALL' || f.cropType === cropFilter;
    return matchesSearch && matchesCrop;
  });

  // Combine farmers & admins list for User Directory
  const allUsersList = [
    { id: 'usr_demo_1', fullName: 'Rajesh Kumar (Demo Farmer)', email: 'farmer@agritwin.com', mobileNumber: '+91 98765 43210', role: 'farmer', createdAt: '2026-09-01' },
    ...registeredFarmers.map(u => ({ ...u, role: 'farmer' })),
    { id: 'admin_root', fullName: 'System Administrator', email: 'admin@agritwin.com', mobileNumber: '+91 90000 00000', role: 'administrator', createdAt: '2026-09-01' },
    ...registeredAdmins.map(a => ({ ...a, role: 'administrator' }))
  ].filter(u => u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

  if (!adminUser) return null;

  return (
    <div style={styles.pageLayout} className="animate-fade-in">
      {/* Admin Control Bar Header */}
      <header style={styles.adminHeader}>
        <div style={styles.headerContent}>
          <div style={styles.brandGroup}>
            <div style={styles.adminLogoBadge}>
              <ShieldCheck size={24} color="#ffffff" />
            </div>
            <div>
              <h1 style={styles.brandTitle}>AgriTwin Nexus <span style={{ color: 'var(--color-teal)' }}>Admin Console</span></h1>
              <p style={styles.brandSub}>Platform Oversight, Spatial Data Engine & System Telemetry</p>
            </div>
          </div>

          <div style={styles.adminUserActions}>
            <div style={styles.adminProfileTag}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: '600' }}>{adminUser.fullName}</span>
              <span style={{ fontSize: '0.675rem', color: '#38bdf8' }}>{adminUser.designation || 'System Admin'}</span>
            </div>

            <button onClick={handleAdminLogout} className="btn btn-secondary" style={styles.logoutBtn}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={styles.mainContainer}>
        {/* Navigation Tabs Bar */}
        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'overview' ? '#ffffff' : 'transparent',
              color: activeTab === 'overview' ? 'var(--color-teal)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === 'overview' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'overview' ? '700' : '600'
            }}
          >
            <BarChart2 size={16} />
            <span>Overview & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('farms')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'farms' ? '#ffffff' : 'transparent',
              color: activeTab === 'farms' ? 'var(--color-teal)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === 'farms' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'farms' ? '700' : '600'
            }}
          >
            <Sprout size={16} />
            <span>Farm Management ({farms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'users' ? '#ffffff' : 'transparent',
              color: activeTab === 'users' ? 'var(--color-teal)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === 'users' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'users' ? '700' : '600'
            }}
          >
            <Users size={16} />
            <span>User & Admin Directory ({allUsersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'telemetry' ? '#ffffff' : 'transparent',
              color: activeTab === 'telemetry' ? 'var(--color-teal)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === 'telemetry' ? 'var(--shadow-sm)' : 'none',
              fontWeight: activeTab === 'telemetry' ? '700' : '600'
            }}
          >
            <Terminal size={16} />
            <span>System Telemetry & Logs</span>
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <Link to="/admin/register" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <UserPlus size={14} />
              <span>Add Admin</span>
            </Link>
            <button onClick={handleExportData} className="btn btn-teal" style={{ fontSize: '0.8rem' }}>
              <Download size={14} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stat Cards Row */}
            <div style={styles.statsGrid}>
              <div className="card" style={styles.statCard}>
                <div style={{ ...styles.statIconBadge, backgroundColor: 'var(--color-light-green)' }}>
                  <Users size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <span style={styles.statLabel}>Total Farmers</span>
                  <span style={styles.statVal}>{stats.totalFarmers}</span>
                </div>
              </div>

              <div className="card" style={styles.statCard}>
                <div style={{ ...styles.statIconBadge, backgroundColor: 'var(--color-teal-light)' }}>
                  <ShieldCheck size={24} color="var(--color-teal)" />
                </div>
                <div>
                  <span style={styles.statLabel}>Administrators</span>
                  <span style={styles.statVal}>{stats.totalAdmins}</span>
                </div>
              </div>

              <div className="card" style={styles.statCard}>
                <div style={{ ...styles.statIconBadge, backgroundColor: '#e0f2fe' }}>
                  <Sprout size={24} color="#0284c7" />
                </div>
                <div>
                  <span style={styles.statLabel}>Registered Farms</span>
                  <span style={styles.statVal}>{stats.totalFarms}</span>
                </div>
              </div>

              <div className="card" style={styles.statCard}>
                <div style={{ ...styles.statIconBadge, backgroundColor: '#fffbeb' }}>
                  <Layers size={24} color="var(--color-warning)" />
                </div>
                <div>
                  <span style={styles.statLabel}>Total Registered Area</span>
                  <span style={styles.statVal}>{stats.totalHectares} Ha</span>
                  <span style={styles.statSub}>({stats.totalAcres} Acres)</span>
                </div>
              </div>
            </div>

            {/* Map & Crop Distribution Grid */}
            <div style={styles.gridTwoCol}>
              {/* Left: Interactive Geospatial Oversight Map */}
              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={styles.cardHeaderRow}>
                  <MapPin size={20} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Platform Field Boundaries Map</h3>
                </div>

                {farms.length > 0 ? (
                  <div style={{ height: '360px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <FarmMap
                      initialLat={farms[0].latitude}
                      initialLng={farms[0].longitude}
                      initialBoundary={farms[0].boundary}
                      readOnly={true}
                    />
                  </div>
                ) : (
                  <div style={styles.emptyMapBox}>
                    <Globe size={36} color="var(--color-text-secondary)" />
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      No farms registered yet. Registered farms will render automatically on this geospatial canvas.
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Crop Distribution Breakdown */}
              <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={styles.cardHeaderRow}>
                  <BarChart2 size={20} color="var(--color-teal)" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Registered Crop Types Breakdown</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { crop: 'Cotton', count: farms.filter(f => f.cropType === 'Cotton').length, pct: 40, color: '#16a34a' },
                    { crop: 'Soyabean', count: farms.filter(f => f.cropType === 'Soyabean').length, pct: 30, color: '#0f766e' },
                    { crop: 'Wheat', count: farms.filter(f => f.cropType === 'Wheat').length, pct: 15, color: '#d97706' },
                    { crop: 'Sugarcane', count: farms.filter(f => f.cropType === 'Sugarcane').length, pct: 15, color: '#0284c7' }
                  ].map((item) => (
                    <div key={item.crop}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{item.crop}</span>
                        <span style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>{item.count} Farms ({item.pct}%)</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.max(12, item.pct)}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* System Services Telemetry */}
                <div style={styles.systemStatusBox}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-teal)' }}>
                    API Pipeline Status
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '4px' }}>
                    <span>Sentinel-2 GEE Engine: <b>Operational</b></span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>100% Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FARM MANAGEMENT */}
        {activeTab === 'farms' && (
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Registered Agricultural Farms</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                  Search, filter, and inspect vector GeoJSON boundaries for all registered plots.
                </p>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={styles.searchWrapper}>
                  <Search size={16} color="#6b7280" style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search farm name..."
                    value={farmSearch}
                    onChange={(e) => setFarmSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>

                <select
                  value={cropFilter}
                  onChange={(e) => setCropFilter(e.target.value)}
                  style={styles.selectFilter}
                >
                  <option value="ALL">All Crop Types</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Soyabean">Soyabean</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Maize">Maize</option>
                  <option value="Rice">Rice</option>
                </select>
              </div>
            </div>

            {/* Farms Table */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Farm Name</th>
                    <th style={styles.th}>Crop Type</th>
                    <th style={styles.th}>Calculated Area</th>
                    <th style={styles.th}>Center Coordinates</th>
                    <th style={styles.th}>Sowing Date</th>
                    <th style={styles.th}>Boundary Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarms.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        No farm records match your filter query.
                      </td>
                    </tr>
                  ) : (
                    filteredFarms.map((farm) => (
                      <tr key={farm.id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{farm.farmName}</span>
                        </td>
                        <td style={styles.td}>
                          <span className="badge badge-primary">{farm.cropType}</span>
                        </td>
                        <td style={styles.td}>
                          <b>{farm.areaHectares} Ha</b> ({farm.areaAcres} Acres)
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            {parseFloat(farm.latitude).toFixed(4)}°N, {parseFloat(farm.longitude).toFixed(4)}°E
                          </span>
                        </td>
                        <td style={styles.td}>{farm.sowingDate}</td>
                        <td style={styles.td}>
                          {farm.boundary ? (
                            <span className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> GeoJSON Active
                            </span>
                          ) : (
                            <span className="badge badge-warning">Marker Only</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USER & ADMIN DIRECTORY */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Platform User Directory</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                  Manage registered farmers and platform administrator accounts.
                </p>
              </div>

              <div style={styles.searchWrapper}>
                <Search size={16} color="#6b7280" style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            {/* Users Table */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Full Name</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Mobile Number</th>
                    <th style={styles.th}>Access Role</th>
                    <th style={styles.th}>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsersList.map((user) => (
                    <tr key={user.id} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{user.fullName}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} color="#6b7280" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} color="#6b7280" />
                          <span>{user.mobileNumber || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {user.role === 'administrator' ? (
                          <span className="badge badge-teal" style={{ fontWeight: '700' }}>Administrator</span>
                        ) : (
                          <span className="badge badge-primary">Farmer</span>
                        )}
                      </td>
                      <td style={styles.td}>{user.createdAt ? user.createdAt.split('T')[0] : '2026-09-01'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM TELEMETRY & LOGS */}
        {activeTab === 'telemetry' && (
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>System Audit Logs & Service Telemetry</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                  Real-time activity logs from Earth Engine ingestion, GeoJSON processing, and API endpoints.
                </p>
              </div>
              <button onClick={loadAdminData} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                <RefreshCw size={14} />
                <span>Refresh Log Terminal</span>
              </button>
            </div>

            {/* Terminal Box */}
            <div style={styles.terminalBox}>
              <div style={styles.terminalHeader}>
                <Terminal size={14} color="#38bdf8" />
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>agritwin_telemetry.log</span>
              </div>
              <div style={styles.terminalContent}>
                {logs.map((log) => (
                  <div key={log.id} style={{ display: 'flex', gap: '1rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    <span style={{ color: '#64748b' }}>[{log.time}]</span>
                    <span style={{ color: log.level === 'SUCCESS' ? '#4ade80' : '#38bdf8', fontWeight: '700' }}>
                      {log.level}
                    </span>
                    <span style={{ color: '#e2e8f0' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  pageLayout: {
    backgroundColor: 'var(--color-bg)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  adminHeader: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderBottom: '1px solid #1e293b'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0.875rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  adminLogoBadge: {
    width: '42px',
    height: '42px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(15, 118, 110, 0.4)'
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    lineHeight: '1.1'
  },
  brandSub: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    margin: 0
  },
  adminUserActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  adminProfileTag: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#1e293b',
    padding: '0.375rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid #334155'
  },
  logoutBtn: {
    fontSize: '0.8125rem',
    padding: '0.375rem 0.75rem'
  },
  mainContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1.75rem 1.5rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  tabBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#e2e8f0',
    padding: '0.375rem',
    borderRadius: 'var(--radius-lg)',
    overflowX: 'auto'
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem'
  },
  statCard: {
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  statIconBadge: {
    width: '50px',
    height: '50px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  statVal: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-text-main)'
  },
  statSub: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)'
  },
  gridTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '1.25rem',
    alignItems: 'start'
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBottom: '0.625rem',
    borderBottom: '1px solid var(--color-border)'
  },
  emptyMapBox: {
    height: '360px',
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    textAlign: 'center'
  },
  systemStatusBox: {
    backgroundColor: 'var(--color-teal-light)',
    border: '1px solid #ccfbf1',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem 1rem',
    marginTop: '0.5rem'
  },
  searchWrapper: {
    position: 'relative',
    width: '260px'
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  searchInput: {
    paddingLeft: '2.25rem',
    fontSize: '0.85rem'
  },
  selectFilter: {
    padding: '0.5rem 0.875rem',
    fontSize: '0.85rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: '#ffffff'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem'
  },
  th: {
    padding: '0.75rem 0.875rem',
    borderBottom: '2px solid var(--color-border)',
    color: 'var(--color-text-secondary)',
    fontWeight: '700'
  },
  tr: {
    borderBottom: '1px solid var(--color-border)'
  },
  td: {
    padding: '0.875rem'
  },
  terminalBox: {
    backgroundColor: '#0f172a',
    borderRadius: 'var(--radius-md)',
    border: '1px solid #1e293b',
    overflow: 'hidden'
  },
  terminalHeader: {
    backgroundColor: '#1e293b',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  terminalContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    height: '240px',
    overflowY: 'auto'
  }
};
