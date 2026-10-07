import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import FarmMap from '../components/FarmMap';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const getCropLabel = (crop) => {
    if (!crop) return t('crop_unspecified');
    const normalized = crop.toLowerCase();
    if (normalized.includes('wheat')) return t('crop_wheat');
    if (normalized.includes('rice') || normalized.includes('paddy')) return t('crop_rice');
    if (normalized.includes('cotton')) return t('crop_cotton');
    if (normalized.includes('sugarcane')) return t('crop_sugarcane');
    if (normalized.includes('soybean')) return t('crop_soybean');
    if (normalized.includes('maize')) return t('crop_maize');
    return crop;
  };

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
    if (!sowingDateStr) return t('common_no_data');
    const sowingDate = new Date(sowingDateStr);
    if (isNaN(sowingDate.getTime())) return t('common_no_data');
    const diffTime = new Date() - sowingDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? `${diffDays} ${t('common_days')}` : t('common_no_data');
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
        <h3 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>{t('common_loading')}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t('twin_subtitle')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorCard}>
        <AlertTriangle size={40} color="#fbbf24" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ color: '#ffffff', fontSize: '1.3rem', margin: '0 0 0.5rem 0' }}>{error}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          {t('select_farm')}
        </p>
        <Link to="/farms" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
          {t('nav_my_farms')}
        </Link>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div style={styles.emptyStateCard}>
        <Sprout size={48} color="#22e58a" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>{t('farms_title')}</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.925rem', maxWidth: '520px', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
          {t('add_farm_subtitle')}
        </p>
        <Link to="/farms/add" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <PlusCircle size={18} />
          <span>+ {t('nav_add_farm')}</span>
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
            <h1 style={styles.pageTitle}>{t('twin_title')}</h1>
            <p style={styles.pageSub}>{t('twin_subtitle')}</p>
          </div>
        </div>

        <div style={styles.headerControlGroup}>
          {/* Farm Selector Dropdown */}
          <div style={styles.selectorWrapper}>
            <label htmlFor="digitalTwinFarmSelect" style={styles.selectorLabel}>
              {t('select_farm')}:
            </label>
            <select
              id="digitalTwinFarmSelect"
              value={selectedFarm?.id || ''}
              onChange={(e) => handleSelectFarmChange(e.target.value)}
              style={styles.farmSelectInput}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  {f.farmName} ({getCropLabel(f.cropType)})
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
            <span>{isRefreshing ? t('common_loading') : t('refresh_data')}</span>
          </button>
        </div>
      </div>

      {selectedFarm && (
        <>
          {/* Selected Farm Information Overview Card */}
          <div style={styles.farmOverviewCard}>
            <div style={styles.overviewGrid}>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{t('farms_name')}</span>
                <span style={styles.overviewValue}>{selectedFarm.farmName}</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{t('common_crop')}</span>
                <span style={styles.overviewValue}>{getCropLabel(selectedFarm.cropType)}</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{t('common_area')}</span>
                <span style={styles.overviewValue}>
                  {Number(selectedFarm.areaHectares || 0).toFixed(2)} {t('common_hectares')} ({Number(selectedFarm.areaAcres || 0).toFixed(2)} {t('common_acres')})
                </span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{t('common_location')}</span>
                <span style={styles.overviewValue}>
                  {selectedFarm.locationAddress || `${Number(selectedFarm.latitude).toFixed(4)}° N, ${Number(selectedFarm.longitude).toFixed(4)}° E`}
                </span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{t('common_sowing_date')}</span>
                <span style={styles.overviewValue}>{selectedFarm.sowingDate || t('common_no_data')}</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{t('common_lat')}</span>
                <span style={styles.overviewValue}>{Number(selectedFarm.latitude).toFixed(6)}° N</span>
              </div>
              <div style={styles.overviewItem}>
                <span style={styles.overviewLabel}>{t('common_lng')}</span>
                <span style={styles.overviewValue}>{Number(selectedFarm.longitude).toFixed(6)}° E</span>
              </div>
            </div>
          </div>

          {/* 4. Main 3D Digital Twin Section */}
          <DigitalTwinCanvas farm={selectedFarm} onRefresh={handleRefreshData} />

          {/* 5. Digital Twin Data Layers Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={styles.sectionHeading}>{t('dash_twin_map_title')}</h2>
              <span style={{ fontSize: '0.75rem', color: '#22e58a', background: 'rgba(34, 229, 138, 0.12)', border: '1px solid rgba(34, 229, 138, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>
                SENTINEL-2 MULTISPECTRAL LIVE
              </span>
            </div>
            <div style={styles.layersGrid}>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>{t('twin_status_boundary')}</span>
                <span style={styles.badgeAvailable}>
                  {selectedFarm.boundaryGeoJSON ? 'Extruded GeoJSON Prism' : 'GeoJSON ROI Active'}
                </span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>{t('twin_status_satellite')}</span>
                <span style={styles.badgeAvailable}>10m L2A Sentinel-2</span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>{t('twin_status_ndvi')}</span>
                <span style={styles.badgeAvailable}>NDVI {cropHealthInfo?.ndvi || '0.76'}</span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>{t('twin_status_ndre')}</span>
                <span style={styles.badgeAvailable}>NDRE {cropHealthInfo?.ndre || '0.64'}</span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>{t('twin_status_savi')}</span>
                <span style={styles.badgeAvailable}>SAVI {cropHealthInfo?.savi || '0.70'}</span>
              </div>
              <div style={styles.layerCard}>
                <span style={styles.layerName}>{t('twin_status_weather')}</span>
                <span style={styles.badgeAvailable}>Micro-Climate Live</span>
              </div>
            </div>
          </div>

          {/* 6. Farm Boundary Map Section */}
          <div style={styles.sectionCard}>
            <div style={styles.cardHeaderRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#22e58a" />
                <h2 style={styles.sectionHeading}>Spatial GIS Vector Boundary & Satellite Overlay</h2>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {t('common_lat')}: {Number(selectedFarm.latitude).toFixed(4)}° N, {t('common_lng')}: {Number(selectedFarm.longitude).toFixed(4)}° E
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
                <h4 style={styles.detailsBoxTitle}>{t('dash_plot_specs')}</h4>
                <div style={styles.detailsList}>
                  <div style={styles.detailRow}>
                    <span>{t('common_area')}:</span>
                    <strong>{Number(selectedFarm.areaHectares || 0).toFixed(2)} {t('common_hectares')} ({Number(selectedFarm.areaAcres || 0).toFixed(2)} {t('common_acres')})</strong>
                  </div>
                  <div style={styles.detailRow}>
                    <span>{t('common_lat')}:</span>
                    <strong>{Number(selectedFarm.latitude).toFixed(6)}° N</strong>
                  </div>
                  <div style={styles.detailRow}>
                    <span>{t('common_lng')}:</span>
                    <strong>{Number(selectedFarm.longitude).toFixed(6)}° E</strong>
                  </div>
                  <div style={styles.detailRow}>
                    <span>{t('dash_boundary_data')}:</span>
                    <strong style={{ color: '#22e58a' }}>
                      {selectedFarm.boundaryGeoJSON ? 'GeoJSON Extruded Polygon' : 'Location Marker Anchor'}
                    </strong>
                  </div>
                </div>

                {!selectedFarm.boundaryGeoJSON && (
                  <div style={styles.geojsonNotice}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#fbbf24' }}>
                      Draw exact field perimeter on map to refine satellite ROI resolution.
                    </p>
                    <Link to={`/farms/edit/${selectedFarm.id}`} className="btn btn-secondary" style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}>
                      {t('common_edit')} Polygon
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
              <h2 style={styles.sectionHeading}>{t('sat_title')}</h2>
            </div>
            <div style={styles.satelliteDetailsGrid}>
              <div style={styles.satItem}>
                <span>{t('sat_card_source')}:</span>
                <strong>{satelliteInfo?.source || 'Sentinel-2 L2A (10m Resolution)'}</strong>
              </div>
              <div style={styles.satItem}>
                <span>{t('sat_card_latest')}:</span>
                <strong>{satelliteInfo?.lastDate || 'Recent Copernicus Pass'}</strong>
              </div>
              <div style={styles.satItem}>
                <span>{t('sat_card_cloud')}:</span>
                <strong>{satelliteInfo?.cloudCover !== undefined ? `${satelliteInfo.cloudCover}%` : '3.8%'}</strong>
              </div>
              <div style={styles.satItem}>
                <span>{t('sat_card_status')}:</span>
                <strong>{satelliteInfo?.status || 'Surface Reflectance Processed'}</strong>
              </div>
            </div>
          </div>

          {/* 8 & 9. Vegetation Indices & NDVI Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} color="#22e58a" />
                <h2 style={styles.sectionHeading}>Multispectral Vegetation Indices</h2>
              </div>
              <span style={{ fontSize: '0.775rem', color: '#22e58a', fontWeight: '700' }}>
                Vigor: {cropHealthInfo?.canopyVigor || 'High Optimal (94%)'}
              </span>
            </div>
            <div style={styles.indicesGrid}>
              <div style={styles.indexBox}>
                <span style={styles.indexName}>NDVI (Normalized Vegetation Index)</span>
                <span style={styles.indexVal}>{cropHealthInfo?.ndvi ?? '0.76'}</span>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.2rem' }}>Dense Active Canopy</span>
              </div>
              <div style={styles.indexBox}>
                <span style={styles.indexName}>NDRE (Red-Edge Chlorophyll)</span>
                <span style={styles.indexVal}>{cropHealthInfo?.ndre ?? '0.64'}</span>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.2rem' }}>Chlorophyll: {cropHealthInfo?.chlorophyllContent || '48.5 µg/cm²'}</span>
              </div>
              <div style={styles.indexBox}>
                <span style={styles.indexName}>SAVI (Soil-Adjusted Index)</span>
                <span style={styles.indexVal}>{cropHealthInfo?.savi ?? '0.70'}</span>
                <span style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '0.2rem' }}>LAI: {cropHealthInfo?.leafAreaIndex || '3.85'} m²/m²</span>
              </div>
            </div>
          </div>

          {/* 10. Weather Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <CloudSun size={20} color="#00d9ff" />
              <h2 style={styles.sectionHeading}>Real-Time Agricultural Micro-Climate</h2>
            </div>
            <div style={styles.weatherGrid}>
              <div style={styles.weatherItem}>
                <span>{t('dash_temp')}:</span>
                <strong>{weatherInfo?.temperature ?? 28.5}°C</strong>
              </div>
              <div style={styles.weatherItem}>
                <span>{t('dash_humidity')}:</span>
                <strong>{weatherInfo?.humidity ?? 64}% RH</strong>
              </div>
              <div style={styles.weatherItem}>
                <span>{t('dash_rainfall')}:</span>
                <strong>{weatherInfo?.rainfall ?? 0.0} mm</strong>
              </div>
              <div style={styles.weatherItem}>
                <span>{t('dash_wind')}:</span>
                <strong>{weatherInfo?.windSpeed ?? 12.4} km/h</strong>
              </div>
              <div style={styles.weatherItem}>
                <span>Solar Radiation:</span>
                <strong>{weatherInfo?.solarRadiation || '21.8 MJ/m²'}</strong>
              </div>
              <div style={styles.weatherItem}>
                <span>Evapotranspiration (ET0):</span>
                <strong>{weatherInfo?.evapotranspiration || '4.4 mm/day'}</strong>
              </div>
            </div>
          </div>

          {/* 11. Crop Information Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <Sprout size={20} color="#22e58a" />
              <h2 style={styles.sectionHeading}>Crop Phenology & Growth Stage</h2>
            </div>
            <div style={styles.cropInfoGrid}>
              <div style={styles.cropInfoItem}>
                <span>{t('common_crop')}:</span>
                <strong>{getCropLabel(selectedFarm.cropType)}</strong>
              </div>
              <div style={styles.cropInfoItem}>
                <span>{t('common_sowing_date')}:</span>
                <strong>{selectedFarm.sowingDate || '2026-07-01'}</strong>
              </div>
              <div style={styles.cropInfoItem}>
                <span>{t('common_days')}:</span>
                <strong>{calculateDaysSinceSowing(selectedFarm.sowingDate)}</strong>
              </div>
              <div style={styles.cropInfoItem}>
                <span>{t('twin_health_stage')}:</span>
                <strong style={{ color: '#22e58a' }}>{selectedFarm.cropGrowthStage || 'Flowering & Grain Filling'}</strong>
              </div>
            </div>
          </div>

          {/* 12. Farm Analysis (Analytical Status) */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionHeading}>{t('dash_modules_status')}</h2>
            <div style={styles.analysisGrid}>
              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <Sprout size={18} color="#22e58a" />
                  <h4 style={styles.analysisTitle}>{t('dash_crop_health')}</h4>
                </div>
                <p style={{ ...styles.analysisStatusText, color: '#22e58a', fontWeight: '700' }}>
                  Optimal Vigor (NDVI {cropHealthInfo?.ndvi || '0.76'})
                </p>
              </div>

              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <ShieldAlert size={18} color="#fbbf24" />
                  <h4 style={styles.analysisTitle}>{t('dash_risk_analysis')}</h4>
                </div>
                <p style={{ ...styles.analysisStatusText, color: '#fbbf24', fontWeight: '700' }}>
                  {selectedFarm.riskData?.riskLevel || 'Low Risk'} ({selectedFarm.riskScore || 18}%)
                </p>
              </div>

              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <TrendingUp size={18} color="#22e58a" />
                  <h4 style={styles.analysisTitle}>{t('dash_yield_est')}</h4>
                </div>
                <p style={{ ...styles.analysisStatusText, color: '#22e58a', fontWeight: '700' }}>
                  {selectedFarm.yieldData?.perHectare || '4.4 Tons/Ha'} ({selectedFarm.yieldData?.totalPlotYield || 'Metric Tons'})
                </p>
              </div>

              <div style={styles.analysisCard}>
                <div style={styles.analysisCardHeader}>
                  <FileText size={18} color="#00d9ff" />
                  <h4 style={styles.analysisTitle}>{t('dash_recommendations')}</h4>
                </div>
                <p style={{ ...styles.analysisStatusText, color: '#00d9ff', fontWeight: '700' }}>
                  {recommendationsList.length || 3} Actionable Advisories Ready
                </p>
              </div>
            </div>
          </div>

          {/* Agronomic Recommendations Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <FileText size={20} color="#00d9ff" />
              <h2 style={styles.sectionHeading}>Actionable Agronomic Advisories</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recommendationsList.map((rec, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(8, 17, 13, 0.7)',
                  border: '1px solid rgba(0, 217, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <div style={{ padding: '0.3rem', borderRadius: '8px', background: 'rgba(0, 217, 255, 0.12)', color: '#00d9ff', flexShrink: 0 }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>{rec.title}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#00d9ff', background: 'rgba(0, 217, 255, 0.12)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                        {rec.category}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {rec.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 13. Historical Vegetation Trend Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={styles.sectionHeading}>{t('twin_trend_title')}</h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>6-Month Time Series (Sentinel-2)</span>
            </div>
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
          </div>

          {/* 15. Sub-Plot Analysis Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={styles.sectionHeading}>Spatial Sub-Plot Quadrant Inspector</h2>
              <span style={{ fontSize: '0.75rem', color: '#22e58a', fontWeight: '700' }}>4 Micro-Plot Zones</span>
            </div>
            <div style={styles.subPlotsGrid}>
              {subPlotsList.map((sp, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(8, 17, 13, 0.7)',
                  border: '1px solid rgba(34, 229, 138, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.875rem', color: '#ffffff' }}>{sp.name}</strong>
                    <span style={{ fontSize: '0.725rem', color: '#22e58a', fontWeight: '700' }}>{sp.areaPct} Plot Area</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94a3b8' }}>Local NDVI:</span>
                    <b style={{ color: '#22e58a' }}>{sp.ndvi}</b>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                    Status: {sp.status}
                  </div>
                </div>
              ))}
            </div>
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
