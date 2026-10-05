import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { authService } from '../services/authService';
import FarmMap from '../components/FarmMap';
import {
  Sprout,
  PlusCircle,
  MapPin,
  Satellite,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  BarChart3,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Layers,
  Compass,
  Cpu,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data || []);
      if (data && data.length > 0) {
        setSelectedFarm(data[0]);
      } else {
        setSelectedFarm(null);
      }
    } catch (e) {
      console.error('Error loading farms for dashboard:', e);
      setFarms([]);
      setSelectedFarm(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFarm = (farmId) => {
    const found = farms.find((f) => String(f.id) === String(farmId));
    if (found) {
      setSelectedFarm(found);
    }
  };

  // Real Database Metrics
  const totalFarms = farms.length;
  const totalAreaHectares = farms.reduce((sum, f) => sum + (Number(f.areaHectares) || 0), 0);
  const totalAreaAcres = farms.reduce((sum, f) => sum + (Number(f.areaAcres) || 0), 0);

  // Check real availability for data status cards
  const satelliteInfo = selectedFarm?.satelliteData || null;
  const weatherInfo = selectedFarm?.weatherData || null;
  const cropHealthInfo = selectedFarm?.cropHealthData || selectedFarm?.indices || null;
  const riskInfo = selectedFarm?.riskData || (selectedFarm?.riskScore !== undefined ? selectedFarm?.riskScore : null);
  const yieldInfo = selectedFarm?.yieldData || (selectedFarm?.predictedYield !== undefined ? selectedFarm?.predictedYield : null);
  const recommendationsList = selectedFarm?.recommendations && Array.isArray(selectedFarm.recommendations) ? selectedFarm.recommendations : [];

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <Sprout size={40} color="#22e58a" className="animate-spin" />
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: '500' }}>Loading your farm dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header Section */}
      <div style={styles.headerCard}>
        <div style={styles.headerMainText}>
          <div style={styles.avatarIcon}>
            <Sprout size={24} color="#22e58a" />
          </div>
          <div>
            <h1 style={styles.welcomeTitle}>
              Welcome, {currentUser?.fullName || 'Farmer'}
            </h1>
            <p style={styles.welcomeSub}>
              Monitor your farms, satellite observations and crop analysis from one place.
            </p>
          </div>
        </div>

        <div style={styles.headerBtnGroup}>
          <Link to="/farms/add" className="btn btn-primary" style={styles.greenBtn}>
            <PlusCircle size={16} />
            <span>+ Add Farm</span>
          </Link>
          <Link
            to={selectedFarm ? `/farms/${selectedFarm.id}/digital-twin` : '/digital-twin'}
            className="btn btn-secondary"
            style={styles.secondaryBtn}
          >
            <Compass size={16} />
            <span>View Digital Twin</span>
          </Link>
        </div>
      </div>

      {/* Farm Selector & Overview Section */}
      {totalFarms > 0 ? (
        <div style={styles.selectorBar}>
          <div style={styles.selectorGroup}>
            <label htmlFor="farmSelector" style={styles.selectorLabel}>
              Selected Farm:
            </label>
            <select
              id="farmSelector"
              value={selectedFarm?.id || ''}
              onChange={(e) => handleSelectFarm(e.target.value)}
              style={styles.farmSelectInput}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  {f.farmName} ({f.cropType || 'Crop Unspecified'})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.quickOverviewPills}>
            <div style={styles.pillItem}>
              <span style={styles.pillLabel}>Registered Farms:</span>
              <span style={styles.pillValue}>{totalFarms} Plot(s)</span>
            </div>
            <div style={styles.pillItem}>
              <span style={styles.pillLabel}>Total Farm Area:</span>
              <span style={styles.pillValue}>
                {totalAreaHectares.toFixed(2)} Ha ({totalAreaAcres.toFixed(2)} Acres)
              </span>
            </div>
            <div style={styles.pillItem}>
              <span style={styles.pillLabel}>Selected Crop:</span>
              <span style={styles.pillValue}>{selectedFarm?.cropType || 'Not specified'}</span>
            </div>
            <div style={styles.pillItem}>
              <span style={styles.pillLabel}>Location:</span>
              <span style={styles.pillValue}>
                {selectedFarm
                  ? `${Number(selectedFarm.latitude).toFixed(4)}° N, ${Number(selectedFarm.longitude).toFixed(4)}° E`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Component if 0 farms registered */
        <div style={styles.emptyStateCard}>
          <div style={styles.emptyIconCircle}>
            <Sprout size={44} color="#22e58a" />
          </div>
          <h2 style={styles.emptyTitle}>No farm registered yet.</h2>
          <p style={styles.emptyDesc}>
            Register your farm location, plot boundary coordinates, and crop details to unlock satellite monitoring and digital twin capabilities.
          </p>
          <Link to="/farms/add" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
            <PlusCircle size={18} />
            <span>Register Your First Farm</span>
          </Link>
        </div>
      )}

      {/* Main Digital Twin Interactive Map Section (Primary Visual Element) */}
      {selectedFarm && (
        <div style={styles.mapSectionCard}>
          <div style={styles.mapHeaderRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Compass size={20} color="#22e58a" />
              <h2 style={styles.sectionTitle}>Digital Twin Field Map — {selectedFarm.farmName}</h2>
            </div>
            <Link
              to={`/farms/${selectedFarm.id}/digital-twin`}
              className="btn btn-primary"
              style={styles.openTwinBtn}
            >
              <span>Open Digital Twin</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div style={styles.mapGrid}>
            {/* Interactive Leaflet Boundary Map */}
            <div style={styles.mapWrapper}>
              <FarmMap
                key={selectedFarm.id}
                initialLat={Number(selectedFarm.latitude) || 18.5204}
                initialLng={Number(selectedFarm.longitude) || 73.8567}
                initialBoundary={selectedFarm.boundaryGeoJSON}
                readOnly={true}
              />
            </div>

            {/* Farm Database Fields Detail Sidebar */}
            <div style={styles.mapDetailsSidebar}>
              <h3 style={styles.sidebarHeading}>Plot Specifications</h3>
              <div style={styles.detailsList}>
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Farm Name:</span>
                  <span style={styles.detailVal}>{selectedFarm.farmName}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Calculated Area:</span>
                  <span style={styles.detailVal}>
                    {Number(selectedFarm.areaHectares || 0).toFixed(2)} Ha ({Number(selectedFarm.areaAcres || 0).toFixed(2)} Acres)
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Latitude:</span>
                  <span style={styles.detailVal}>{Number(selectedFarm.latitude || 0).toFixed(6)}° N</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Longitude:</span>
                  <span style={styles.detailVal}>{Number(selectedFarm.longitude || 0).toFixed(6)}° E</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Crop Type:</span>
                  <span style={styles.detailVal}>{selectedFarm.cropType || 'Not specified'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Sowing Date:</span>
                  <span style={styles.detailVal}>{selectedFarm.sowingDate || 'Not specified'}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailKey}>Boundary Data:</span>
                  <span style={{ ...styles.detailVal, color: selectedFarm.boundaryGeoJSON ? '#22e58a' : '#fbbf24' }}>
                    {selectedFarm.boundaryGeoJSON ? 'GeoJSON Defined' : 'Center Marker Only'}
                  </span>
                </div>
              </div>

              <div style={styles.sidebarActionBox}>
                <Link
                  to={`/farms/${selectedFarm.id}/digital-twin`}
                  style={styles.fullTwinLink}
                >
                  <span>Explore Full Spatial Boundary &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Status Section (6 Real Status Cards) */}
      {selectedFarm && (
        <div style={styles.dataStatusSection}>
          <h2 style={styles.sectionTitle}>Analytical Modules Status</h2>

          <div style={styles.statusCardsGrid}>
            {/* 1. Satellite Data Card */}
            <div style={styles.statusCard}>
              <div style={styles.statusCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Satellite size={18} color="#00d9ff" />
                  <h3 style={styles.statusCardTitle}>Satellite Data</h3>
                </div>
                <span style={satelliteInfo ? styles.badgeAvailable : styles.badgeAwaiting}>
                  {satelliteInfo ? 'Available' : 'Awaiting Data'}
                </span>
              </div>
              <div style={styles.statusCardBody}>
                {satelliteInfo ? (
                  <div style={styles.dataList}>
                    <div><strong>Last Observation:</strong> {satelliteInfo.lastDate || 'Recent Pass'}</div>
                    <div><strong>Cloud Cover:</strong> {satelliteInfo.cloudCover !== undefined ? `${satelliteInfo.cloudCover}%` : 'Low'}</div>
                    <div><strong>Bands Available:</strong> Sentinel-2 L2A (10m)</div>
                  </div>
                ) : (
                  <p style={styles.noDataText}>Satellite analysis is not available for this farm yet.</p>
                )}
              </div>
            </div>

            {/* 2. Weather Data Card */}
            <div style={styles.statusCard}>
              <div style={styles.statusCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CloudSun size={18} color="#00d9ff" />
                  <h3 style={styles.statusCardTitle}>Weather Data</h3>
                </div>
                <span style={weatherInfo ? styles.badgeAvailable : styles.badgeNotConfigured}>
                  {weatherInfo ? 'Connected' : 'Unavailable'}
                </span>
              </div>
              <div style={styles.statusCardBody}>
                {weatherInfo ? (
                  <div style={styles.dataList}>
                    <div><strong>Temperature:</strong> {weatherInfo.temperature}°C</div>
                    <div><strong>Humidity:</strong> {weatherInfo.humidity}%</div>
                    <div><strong>Rainfall:</strong> {weatherInfo.rainfall} mm</div>
                    <div><strong>Wind Speed:</strong> {weatherInfo.windSpeed} km/h</div>
                  </div>
                ) : (
                  <p style={styles.noDataText}>Weather data unavailable.</p>
                )}
              </div>
            </div>

            {/* 3. Crop Health Card */}
            <div style={styles.statusCard}>
              <div style={styles.statusCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sprout size={18} color="#22e58a" />
                  <h3 style={styles.statusCardTitle}>Crop Health</h3>
                </div>
                <span style={cropHealthInfo ? styles.badgeAvailable : styles.badgeAwaiting}>
                  {cropHealthInfo ? 'Calculated' : 'Awaiting Data'}
                </span>
              </div>
              <div style={styles.statusCardBody}>
                {cropHealthInfo ? (
                  <div style={styles.dataList}>
                    {cropHealthInfo.ndvi !== undefined && <div><strong>NDVI:</strong> {cropHealthInfo.ndvi}</div>}
                    {cropHealthInfo.ndre !== undefined && <div><strong>NDRE:</strong> {cropHealthInfo.ndre}</div>}
                    {cropHealthInfo.savi !== undefined && <div><strong>SAVI:</strong> {cropHealthInfo.savi}</div>}
                  </div>
                ) : (
                  <p style={styles.noDataText}>Awaiting satellite analysis.</p>
                )}
              </div>
            </div>

            {/* 4. Risk Card */}
            <div style={styles.statusCard}>
              <div style={styles.statusCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={18} color="#fbbf24" />
                  <h3 style={styles.statusCardTitle}>Risk Analysis</h3>
                </div>
                <span style={riskInfo !== null ? styles.badgeAvailable : styles.badgePending}>
                  {riskInfo !== null ? 'Evaluated' : 'Pending Analysis'}
                </span>
              </div>
              <div style={styles.statusCardBody}>
                {riskInfo !== null ? (
                  <div style={styles.dataList}>
                    <div><strong>Overall Risk Score:</strong> {typeof riskInfo === 'number' ? `${riskInfo}%` : riskInfo}</div>
                  </div>
                ) : (
                  <p style={styles.noDataText}>Risk analysis pending.</p>
                )}
              </div>
            </div>

            {/* 5. Yield Card */}
            <div style={styles.statusCard}>
              <div style={styles.statusCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="#22e58a" />
                  <h3 style={styles.statusCardTitle}>Yield Estimation</h3>
                </div>
                <span style={yieldInfo !== null ? styles.badgeAvailable : styles.badgePending}>
                  {yieldInfo !== null ? 'Predicted' : 'Pending Analysis'}
                </span>
              </div>
              <div style={styles.statusCardBody}>
                {yieldInfo !== null ? (
                  <div style={styles.dataList}>
                    <div><strong>Predicted Yield:</strong> {typeof yieldInfo === 'number' ? `${yieldInfo} Tons/Ha` : yieldInfo}</div>
                  </div>
                ) : (
                  <p style={styles.noDataText}>Yield estimation pending.</p>
                )}
              </div>
            </div>

            {/* 6. Recommendations Card */}
            <div style={styles.statusCard}>
              <div style={styles.statusCardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="#00d9ff" />
                  <h3 style={styles.statusCardTitle}>Recommendations</h3>
                </div>
                <span style={recommendationsList.length > 0 ? styles.badgeAvailable : styles.badgeNoAdvisory}>
                  {recommendationsList.length > 0 ? `${recommendationsList.length} Active` : 'No Active Advisory'}
                </span>
              </div>
              <div style={styles.statusCardBody}>
                {recommendationsList.length > 0 ? (
                  <div style={styles.dataList}>
                    {recommendationsList.map((rec, idx) => (
                      <div key={idx}>• {rec.title || rec}</div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.noDataText}>No recommendations generated yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Platform Modules Navigation Grid */}
      <div style={styles.modulesSection}>
        <h2 style={styles.sectionTitle}>Platform Modules Overview</h2>

        <div style={styles.modulesGrid}>
          <Link to="/farms" style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxGreen}>
                <Sprout size={20} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Farm Management</h4>
                <p style={styles.moduleSub}>View, register and manage GeoJSON plot boundaries</p>
              </div>
              <span style={styles.moduleBadgeActive}>{farms.length > 0 ? `${farms.length} Active` : '0 Farms'}</span>
            </div>
          </Link>

          <Link to={selectedFarm ? `/farms/${selectedFarm.id}/digital-twin` : '/digital-twin'} style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxGreen}>
                <Compass size={20} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Digital Twin</h4>
                <p style={styles.moduleSub}>Vector map geometry and spatial field specs</p>
              </div>
              <span style={selectedFarm ? styles.moduleBadgeActive : styles.moduleBadgePending}>
                {selectedFarm ? 'Ready' : 'Awaiting Farm'}
              </span>
            </div>
          </Link>

          <Link to={selectedFarm ? `/farms/${selectedFarm.id}/satellite` : '/satellite'} style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxBlue}>
                <Satellite size={20} color="#00d9ff" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Satellite Data</h4>
                <p style={styles.moduleSub}>Copernicus Sentinel-2 multispectral imagery</p>
              </div>
              <span style={satelliteInfo ? styles.moduleBadgeActive : styles.moduleBadgePending}>
                {satelliteInfo ? 'Available' : 'Awaiting Data'}
              </span>
            </div>
          </Link>

          <Link to={selectedFarm ? `/farms/${selectedFarm.id}/weather` : '/weather'} style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxBlue}>
                <CloudSun size={20} color="#00d9ff" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Weather</h4>
                <p style={styles.moduleSub}>Micro-climate forecasts and telemetry</p>
              </div>
              <span style={weatherInfo ? styles.moduleBadgeActive : styles.moduleBadgePending}>
                {weatherInfo ? 'Connected' : 'Unavailable'}
              </span>
            </div>
          </Link>

          <Link to="/crop-health" style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxGreen}>
                <Layers size={20} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Crop Health</h4>
                <p style={styles.moduleSub}>NDVI / NDRE / SAVI vegetation indices</p>
              </div>
              <span style={cropHealthInfo ? styles.moduleBadgeActive : styles.moduleBadgePending}>
                {cropHealthInfo ? 'Calculated' : 'Pending Analysis'}
              </span>
            </div>
          </Link>

          <Link to={selectedFarm ? `/farms/${selectedFarm.id}/risk` : '/pest-risk'} style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxAmber}>
                <ShieldAlert size={20} color="#fbbf24" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Risk Analysis</h4>
                <p style={styles.moduleSub}>Pest and infection vulnerability model</p>
              </div>
              <span style={riskInfo !== null ? styles.moduleBadgeActive : styles.moduleBadgePending}>
                {riskInfo !== null ? 'Evaluated' : 'Pending Analysis'}
              </span>
            </div>
          </Link>

          <Link to={selectedFarm ? `/farms/${selectedFarm.id}/yield` : '/yield'} style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxGreen}>
                <TrendingUp size={20} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Yield Estimation</h4>
                <p style={styles.moduleSub}>Crop production & yield model</p>
              </div>
              <span style={yieldInfo !== null ? styles.moduleBadgeActive : styles.moduleBadgePending}>
                {yieldInfo !== null ? 'Predicted' : 'Pending Analysis'}
              </span>
            </div>
          </Link>

          <Link to="/recommendations" style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxBlue}>
                <FileText size={20} color="#00d9ff" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Recommendations</h4>
                <p style={styles.moduleSub}>Agronomic advisory rules engine</p>
              </div>
              <span style={recommendationsList.length > 0 ? styles.moduleBadgeActive : styles.moduleBadgePending}>
                {recommendationsList.length > 0 ? `${recommendationsList.length} Active` : 'No Active Advisory'}
              </span>
            </div>
          </Link>

          <Link to="/reports" style={styles.moduleCardLink}>
            <div style={styles.moduleCard}>
              <div style={styles.moduleIconBoxGreen}>
                <BarChart3 size={20} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={styles.moduleTitle}>Reports</h4>
                <p style={styles.moduleSub}>Exportable spatial & crop summary reports</p>
              </div>
              <span style={styles.moduleBadgeActive}>Ready</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0.5rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '350px',
    gap: '1rem'
  },
  headerCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1.5rem 1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  headerMainText: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  avatarIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  welcomeTitle: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    lineHeight: '1.2'
  },
  welcomeSub: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    margin: '3px 0 0 0'
  },
  headerBtnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  greenBtn: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    padding: '0.625rem 1.15rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    textDecoration: 'none'
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.625rem 1.15rem',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    textDecoration: 'none'
  },
  selectorBar: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  selectorGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem'
  },
  selectorLabel: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff',
    whiteSpace: 'nowrap'
  },
  farmSelectInput: {
    padding: '0.55rem 1rem',
    fontSize: '0.875rem',
    borderRadius: '10px',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    backgroundColor: 'rgba(23, 34, 29, 0.9)',
    color: '#ffffff',
    fontWeight: '600',
    minWidth: '240px',
    cursor: 'pointer'
  },
  quickOverviewPills: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    paddingTop: '0.85rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  pillItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.825rem'
  },
  pillLabel: {
    color: '#94a3b8'
  },
  pillValue: {
    fontWeight: '700',
    color: '#ffffff'
  },
  emptyStateCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    borderTop: '4px solid #22e58a',
    padding: '3.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  emptyIconCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 0.5rem 0'
  },
  emptyDesc: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    maxWidth: '560px',
    lineHeight: '1.5',
    margin: '0 0 1.5rem 0'
  },
  mapSectionCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  mapHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  openTwinBtn: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    fontSize: '0.825rem',
    borderRadius: '8px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '600'
  },
  mapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  mapWrapper: {
    height: '380px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(34, 229, 138, 0.3)'
  },
  mapDetailsSidebar: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sidebarHeading: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  detailKey: {
    color: '#94a3b8'
  },
  detailVal: {
    fontWeight: '700',
    color: '#ffffff'
  },
  sidebarActionBox: {
    marginTop: 'auto',
    paddingTop: '0.85rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  fullTwinLink: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#22e58a',
    textDecoration: 'none'
  },
  dataStatusSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  statusCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.25rem'
  },
  statusCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
  },
  statusCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  statusCardTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  statusCardBody: {
    fontSize: '0.85rem',
    color: '#cbd5e1'
  },
  dataList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    lineHeight: '1.4'
  },
  noDataText: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: 0
  },
  badgeAvailable: {
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    color: '#22e58a',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  badgeAwaiting: {
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    color: '#00d9ff',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  badgeNotConfigured: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  badgePending: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    color: '#fbbf24',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  badgeNoAdvisory: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  modulesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  moduleCardLink: {
    textDecoration: 'none'
  },
  moduleCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    padding: '1rem 1.15rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    transition: 'all 0.15s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
  },
  moduleIconBoxGreen: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  moduleIconBoxBlue: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  moduleIconBoxAmber: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  moduleTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  moduleSub: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    margin: '2px 0 0 0'
  },
  moduleBadgeActive: {
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    color: '#22e58a',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    whiteSpace: 'nowrap'
  },
  moduleBadgePending: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    whiteSpace: 'nowrap'
  }
};
