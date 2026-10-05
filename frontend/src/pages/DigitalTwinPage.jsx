import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import FarmMap from '../components/FarmMap';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Cpu,
  Sprout,
  RefreshCw,
  Layers,
  Satellite,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  FileText,
  Compass,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin
} from 'lucide-react';

export default function DigitalTwinPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFarmsAndSelect();
  }, [id]);

  const loadFarmsAndSelect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await farmService.getFarms();
      const list = data || [];
      setFarms(list);

      if (list.length > 0) {
        if (id) {
          const match = list.find((f) => String(f.id) === String(id));
          if (match) {
            setSelectedFarm(match);
          } else {
            setError(`Selected farm (ID: ${id}) could not be found.`);
            setSelectedFarm(null);
          }
        } else {
          setSelectedFarm(list[0]);
        }
      } else {
        setSelectedFarm(null);
      }
    } catch (err) {
      console.error('Error fetching farms for Digital Twin:', err);
      setError('Unable to load farm data. Please try again.');
      setSelectedFarm(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    if (!selectedFarm) return;
    setIsRefreshing(true);
    try {
      const updatedList = await farmService.getFarms();
      setFarms(updatedList || []);
      const updatedFarm = (updatedList || []).find((f) => String(f.id) === String(selectedFarm.id));
      if (updatedFarm) {
        setSelectedFarm(updatedFarm);
      }
    } catch (err) {
      console.error('Error refreshing farm data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectFarmChange = (farmId) => {
    navigate(`/farms/${farmId}/digital-twin`);
  };

  // Calculate Days Since Sowing
  const calculateDaysSinceSowing = (sowingDateStr) => {
    if (!sowingDateStr) return 'N/A';
    const sowingDate = new Date(sowingDateStr);
    if (isNaN(sowingDate.getTime())) return 'N/A';
    const diffTime = new Date() - sowingDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? `${diffDays} days` : 'N/A';
  };

  // Check backend availability for features
  const satelliteInfo = selectedFarm?.satelliteData || null;
  const weatherInfo = selectedFarm?.weatherData || null;
  const cropHealthInfo = selectedFarm?.cropHealthData || selectedFarm?.indices || null;
  const riskInfo = selectedFarm?.riskData || (selectedFarm?.riskScore !== undefined ? selectedFarm?.riskScore : null);
  const yieldInfo = selectedFarm?.yieldData || (selectedFarm?.predictedYield !== undefined ? selectedFarm?.predictedYield : null);
  const recommendationsList = selectedFarm?.recommendations && Array.isArray(selectedFarm.recommendations) ? selectedFarm.recommendations : [];
  const historicalSeries = selectedFarm?.historicalObservations && Array.isArray(selectedFarm.historicalObservations) ? selectedFarm.historicalObservations : [];
  const subPlotsList = selectedFarm?.subPlots && Array.isArray(selectedFarm.subPlots) ? selectedFarm.subPlots : [];

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <RefreshCw size={36} color="#22e58a" className="animate-spin" />
        <h3 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>Loading farm digital twin...</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Fetching geospatial boundaries and satellite observations</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorCard}>
        <AlertTriangle size={40} color="#fbbf24" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ color: '#ffffff', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>{error}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Please select a valid farm from your registered directory.
        </p>
        <Link to="/farms" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          Go to My Farms
        </Link>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div style={styles.emptyStateCard}>
        <Sprout size={48} color="#22e58a" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>No farm registered yet.</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.925rem', maxWidth: '520px', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
          Register your farm location, plot boundary coordinates, and crop details to generate its 3D spatial digital twin.
        </p>
        <Link to="/farms/add" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <PlusCircle size={18} />
          <span>Register Your First Farm</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 3. Farm Information Header */}
      <div style={styles.headerCard}>
        <div style={styles.headerTextGroup}>
          <div style={styles.iconBadge}>
            <Compass size={24} color="#22e58a" />
          </div>
          <div>
            <h1 style={styles.pageTitle}>Farm Digital Twin</h1>
            <p style={styles.pageSub}>
              Virtual representation of your selected farm using geospatial, satellite and weather data.
            </p>
          </div>
        </div>

        <div style={styles.headerControlGroup}>
          {/* Farm Selector Dropdown */}
          <div style={styles.selectorWrapper}>
            <label htmlFor="digitalTwinFarmSelect" style={styles.selectorLabel}>
              Select Farm:
            </label>
            <select
              id="digitalTwinFarmSelect"
              value={selectedFarm?.id || ''}
              onChange={(e) => handleSelectFarmChange(e.target.value)}
              style={styles.farmSelectInput}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  {f.farmName} ({f.cropType || 'Crop Unspecified'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="btn btn-secondary"
            style={styles.refreshBtn}
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {selectedFarm && (
        <>
          {/* Selected Farm Information Overview Card */}
          <div style={styles.farmOverviewCard}>
            <div style={styles.overviewGrid}>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Farm Name</span>
                <span style={styles.overviewValue}>{selectedFarm.farmName}</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Crop</span>
                <span style={styles.overviewValue}>{selectedFarm.cropType || 'Not specified'}</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Calculated Area</span>
                <span style={styles.overviewValue}>
                  {Number(selectedFarm.areaHectares || 0).toFixed(2)} Ha ({Number(selectedFarm.areaAcres || 0).toFixed(2)} Acres)
                </span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Location</span>
                <span style={styles.overviewValue}>
                  {selectedFarm.locationAddress || `${Number(selectedFarm.latitude).toFixed(4)}° N, ${Number(selectedFarm.longitude).toFixed(4)}° E`}
                </span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Sowing Date</span>
                <span style={styles.overviewValue}>{selectedFarm.sowingDate || 'Not specified'}</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Latitude</span>
                <span style={styles.overviewValue}>{Number(selectedFarm.latitude).toFixed(6)}° N</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>Longitude</span>
                <span style={styles.overviewValue}>{Number(selectedFarm.longitude).toFixed(6)}° E</span>
              </div>
            </div>
          </div>

          {/* 4. Main 3D Digital Twin Section */}
          <DigitalTwinCanvas farm={selectedFarm} onRefresh={handleRefreshData} />

          {/* 5. Digital Twin Data Layers Section */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionHeading}>Digital Twin Data Layers</h2>
            <div style={styles.layersGrid}>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>Farm Boundary</span>
                <span style={selectedFarm.boundaryGeoJSON ? styles.badgeAvailable : styles.badgeAwaiting}>
                  {selectedFarm.boundaryGeoJSON ? 'Available' : 'Awaiting Boundary'}
                </span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>Satellite Image</span>
                <span style={satelliteInfo ? styles.badgeAvailable : styles.badgeAwaiting}>
                  {satelliteInfo ? 'Available' : 'Awaiting Data'}
                </span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>NDVI</span>
                <span style={cropHealthInfo?.ndvi !== undefined ? styles.badgeAvailable : styles.badgeAwaiting}>
                  {cropHealthInfo?.ndvi !== undefined ? 'Available' : 'Awaiting Data'}
                </span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>NDRE</span>
                <span style={cropHealthInfo?.ndre !== undefined ? styles.badgeAvailable : styles.badgeAwaiting}>
                  {cropHealthInfo?.ndre !== undefined ? 'Available' : 'Awaiting Data'}
                </span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>SAVI</span>
                <span style={cropHealthInfo?.savi !== undefined ? styles.badgeAvailable : styles.badgeAwaiting}>
                  {cropHealthInfo?.savi !== undefined ? 'Available' : 'Awaiting Data'}
                </span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>Weather</span>
                <span style={weatherInfo ? styles.badgeAvailable : styles.badgeNotConfigured}>
                  {weatherInfo ? 'Connected' : 'Not Configured'}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Farm Boundary Map Section */}
          <div style={styles.sectionCard}>
            <div style={styles.cardHeaderRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#22e58a" />
                <h2 style={styles.sectionHeading}>Farm Boundary Map</h2>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Coordinates: {Number(selectedFarm.latitude).toFixed(4)}° N, {Number(selectedFarm.longitude).toFixed(4)}° E
              </span>
            </div>

            <div style={styles.mapGrid}>
              <div style={styles.mapWrapper}>
                <FarmMap
                  key={selectedFarm.id}
                  initialLat={Number(selectedFarm.latitude) || 18.5204}
                  initialLng={Number(selectedFarm.longitude) || 73.8567}
                  initialBoundary={selectedFarm.boundaryGeoJSON}
                  readOnly={true}
                />
              </div>

              <div style={styles.boundaryDetailsBox}>
                <h4 style={styles.detailsBoxTitle}>Spatial Specifications</h4>
                <div style={styles.detailsList}>
                  <div style={styles.detailRow}>
                    <span>Total Field Area:</span>
                    <strong>{Number(selectedFarm.areaHectares || 0).toFixed(2)} Ha ({Number(selectedFarm.areaAcres || 0).toFixed(2)} Acres)</strong>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Center Latitude:</span>
                    <strong>{Number(selectedFarm.latitude).toFixed(6)}° N</strong>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Center Longitude:</span>
                    <strong>{Number(selectedFarm.longitude).toFixed(6)}° E</strong>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Boundary Geometry:</span>
                    <strong style={{ color: selectedFarm.boundaryGeoJSON ? '#22e58a' : '#fbbf24' }}>
                      {selectedFarm.boundaryGeoJSON ? 'GeoJSON Polygon Defined' : 'Center Marker Only'}
                    </strong>
                  </div>
                </div>

                {!selectedFarm.boundaryGeoJSON && (
                  <div style={styles.geojsonNotice}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#fbbf24' }}>
                      Farm boundary polygon unavailable. Return to farm registration to draw boundary polygon.
                    </p>
                    <Link to={`/farms/edit/${selectedFarm.id}`} className="btn btn-secondary" style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
                      Return to Farm Registration
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 7. Satellite Observation Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Satellite size={20} color="#00d9ff" />
              <h2 style={styles.sectionHeading}>Satellite Observation</h2>
            </div>
            {satelliteInfo ? (
              <div style={styles.satelliteDetailsGrid}>
                <div style={styles.satItem}>
                  <span>Source:</span>
                  <strong>Sentinel-2 L2A (10m Resolution)</strong>
                </div>
                <div style={styles.satItem}>
                  <span>Observation Date:</span>
                  <strong>{satelliteInfo.lastDate || 'Recent Copernicus Pass'}</strong>
                </div>
                <div style={styles.satItem}>
                  <span>Cloud Coverage:</span>
                  <strong>{satelliteInfo.cloudCover !== undefined ? `${satelliteInfo.cloudCover}%` : 'Low'}</strong>
                </div>
                <div style={styles.satItem}>
                  <span>Processing Status:</span>
                  <strong>{satelliteInfo.status || 'Surface Reflectance Processed'}</strong>
                </div>
              </div>
            ) : (
              <p style={styles.noDataText}>Satellite observation not available for this farm yet.</p>
            )}
          </div>

          {/* 8 & 9. Vegetation Indices & NDVI Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Layers size={20} color="#22e58a" />
              <h2 style={styles.sectionHeading}>Vegetation Indices (NDVI / NDRE / SAVI)</h2>
            </div>
            {cropHealthInfo ? (
              <div style={styles.indicesGrid}>
                <div style={styles.indexBox}>
                  <span style={styles.indexName}>NDVI (Vegetation Vigor)</span>
                  <span style={styles.indexVal}>{cropHealthInfo.ndvi !== undefined ? cropHealthInfo.ndvi : 'Awaiting satellite analysis.'}</span>
                </div>
                <div style={styles.indexBox}>
                  <span style={styles.indexName}>NDRE (Canopy Chlorophyll)</span>
                  <span style={styles.indexVal}>{cropHealthInfo.ndre !== undefined ? cropHealthInfo.ndre : 'Awaiting satellite analysis.'}</span>
                </div>
                <div style={styles.indexBox}>
                  <span style={styles.indexName}>SAVI (Soil-Adjusted Index)</span>
                  <span style={styles.indexVal}>{cropHealthInfo.savi !== undefined ? cropHealthInfo.savi : 'Awaiting satellite analysis.'}</span>
                </div>
              </div>
            ) : (
              <p style={styles.noDataText}>Awaiting satellite analysis.</p>
            )}
          </div>

          {/* 10. Weather Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <CloudSun size={20} color="#00d9ff" />
              <h2 style={styles.sectionHeading}>Weather Data</h2>
            </div>
            {weatherInfo ? (
              <div style={styles.weatherGrid}>
                <div style={styles.weatherItem}>
                  <span>Temperature:</span>
                  <strong>{weatherInfo.temperature}°C</strong>
                </div>
                <div style={styles.weatherItem}>
                  <span>Humidity:</span>
                  <strong>{weatherInfo.humidity}%</strong>
                </div>
                <div style={styles.weatherItem}>
                  <span>Rainfall:</span>
                  <strong>{weatherInfo.rainfall} mm</strong>
                </div>
                <div style={styles.weatherItem}>
                  <span>Wind Speed:</span>
                  <strong>{weatherInfo.windSpeed} km/h</strong>
                </div>
              </div>
            ) : (
              <p style={styles.noDataText}>Weather data unavailable.</p>
            )}
          </div>

          {/* 11. Crop Information Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Sprout size={20} color="#22e58a" />
              <h2 style={styles.sectionHeading}>Crop Information</h2>
            </div>
            <div style={styles.cropInfoGrid}>
              <div style={styles.cropInfoItem}>
                <span>Crop Type:</span>
                <strong>{selectedFarm.cropType || 'Not specified'}</strong>
              </div>
              <div style={styles.cropInfoItem}>
                <span>Sowing Date:</span>
                <strong>{selectedFarm.sowingDate || 'Not specified'}</strong>
              </div>
              <div style={styles.cropInfoItem}>
                <span>Days Since Sowing:</span>
                <strong>{calculateDaysSinceSowing(selectedFarm.sowingDate)}</strong>
              </div>
              <div style={styles.cropInfoItem}>
                <span>Crop Growth Stage:</span>
                <strong>{selectedFarm.cropGrowthStage || 'Crop stage: Not available'}</strong>
              </div>
            </div>
          </div>

          {/* 12. Farm Analysis (Analytical Status) */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionHeading}>Farm Analysis</h2>
            <div style={styles.analysisGrid}>
              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <Sprout size={18} color="#22e58a" />
                  <h4 style={styles.analysisTitle}>Crop Health</h4>
                </div>
                <p style={styles.analysisStatusText}>
                  {cropHealthInfo ? 'Calculated from Sentinel-2 pass' : 'Awaiting satellite analysis'}
                </p>
              </div>

              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <ShieldAlert size={18} color="#fbbf24" />
                  <h4 style={styles.analysisTitle}>Risk Analysis</h4>
                </div>
                <p style={styles.analysisStatusText}>
                  {riskInfo !== null ? `Evaluated: ${typeof riskInfo === 'number' ? `${riskInfo}%` : riskInfo}` : 'Model not run'}
                </p>
              </div>

              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <TrendingUp size={18} color="#22e58a" />
                  <h4 style={styles.analysisTitle}>Yield Estimation</h4>
                </div>
                <p style={styles.analysisStatusText}>
                  {yieldInfo !== null ? `Predicted: ${typeof yieldInfo === 'number' ? `${yieldInfo} Tons/Ha` : yieldInfo}` : 'Model not run'}
                </p>
              </div>

              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <FileText size={18} color="#00d9ff" />
                  <h4 style={styles.analysisTitle}>Recommendations</h4>
                </div>
                <p style={styles.analysisStatusText}>
                  {recommendationsList.length > 0 ? `${recommendationsList.length} advisories available` : 'No recommendations generated'}
                </p>
              </div>
            </div>
          </div>

          {/* 13. Historical Vegetation Trend Section */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionHeading}>Historical Vegetation Trend</h2>
            {historicalSeries.length > 0 ? (
              <div style={{ width: '100%', height: 280, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 27, 21, 0.95)',
                        borderRadius: '8px',
                        border: '1px solid rgba(34, 229, 138, 0.3)',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="NDVI" stroke="#22e58a" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="NDRE" stroke="#00d9ff" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="SAVI" stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={styles.noDataText}>
                Historical vegetation data will appear here after satellite observations are available.
              </p>
            )}
          </div>

          {/* 15. Sub-Plot Analysis Section (Future Ready) */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionHeading}>Sub-Plot Inspector</h2>
            {subPlotsList.length > 0 ? (
              <div style={styles.subPlotsGrid}>
                {subPlotsList.map((sp, idx) => (
                  <div key={idx} style={styles.subPlotCard}>
                    <strong>Sub-Plot {sp.name || idx + 1}</strong>
                    <span>NDVI: {sp.ndvi || 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noDataText}>Sub-plot analysis is not available for this farm.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0.5rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '380px',
    gap: '1rem'
  },
  errorCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    padding: '3rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    textAlign: 'center'
  },
  headerCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  headerTextGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconBadge: {
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
  pageTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  pageSub: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: '3px 0 0 0'
  },
  headerControlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  selectorWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem'
  },
  selectorLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff',
    whiteSpace: 'nowrap'
  },
  farmSelectInput: {
    padding: '0.5rem 0.85rem',
    fontSize: '0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    backgroundColor: 'rgba(23, 34, 29, 0.9)',
    color: '#ffffff',
    fontWeight: '600',
    minWidth: '220px',
    cursor: 'pointer'
  },
  refreshBtn: {
    padding: '0.5rem 0.9rem',
    fontSize: '0.825rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  farmOverviewCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    padding: '1.15rem 1.35rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem'
  },
  overviewItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  overviewLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  overviewValue: {
    fontSize: '0.925rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  sectionCard: {
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
  sectionHeading: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  layersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.85rem'
  },
  layerCard: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  layerName: {
    color: '#ffffff',
    fontWeight: '600'
  },
  badgeAvailable: {
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    color: '#22e58a',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  badgeAwaiting: {
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    color: '#00d9ff',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  badgeNotConfigured: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '0.2rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  cardHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  mapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  mapWrapper: {
    height: '350px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(34, 229, 138, 0.3)'
  },
  boundaryDetailsBox: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.15rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem'
  },
  detailsBoxTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    paddingBottom: '0.4rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.55rem',
    fontSize: '0.85rem',
    color: '#94a3b8'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  geojsonNotice: {
    marginTop: 'auto',
    padding: '0.75rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  satelliteDetailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  satItem: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    fontSize: '0.825rem',
    color: '#94a3b8'
  },
  indicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  indexBox: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  indexName: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  },
  indexVal: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#22e58a'
  },
  weatherGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  weatherItem: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    fontSize: '0.825rem',
    color: '#94a3b8'
  },
  cropInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  cropInfoItem: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    fontSize: '0.825rem',
    color: '#94a3b8'
  },
  analysisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem'
  },
  analysisCard: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  analysisCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  analysisTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  analysisStatusText: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    margin: 0
  },
  subPlotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.85rem'
  },
  subPlotCard: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    borderRadius: '8px',
    padding: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    fontSize: '0.8rem',
    color: '#ffffff'
  },
  noDataText: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: 0
  }
};
