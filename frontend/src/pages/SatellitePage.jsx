import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { satelliteService } from '../services/satelliteService';
import FarmMap from '../components/FarmMap';
import { useLanguage } from '../context/LanguageContext';
import {
  Satellite,
  Cloud,
  Layers,
  Calendar,
  RefreshCw,
  Search,
  CheckCircle2,
  MapPin,
  Filter,
  Eye,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export default function SatellitePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [activeLayer, setActiveLayer] = useState('trueColor'); // 'trueColor' | 'falseColor' | 'ndvi' | 'ndre' | 'savi'
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
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

  // Search Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [maxCloud, setMaxCloud] = useState(20);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const farmList = await farmService.getFarms();
      const list = farmList || [];
      setFarms(list);

      if (list.length > 0) {
        const first = list[0];
        setSelectedFarm(first);
        const s = await satelliteService.getSentinelScenes(first.id, { maxCloud });
        setScenes(s || []);
        if (s && s.length > 0) {
          setSelectedScene(s[0]);
        }
      } else {
        setSelectedFarm(null);
      }
    } catch (err) {
      console.error('Error loading satellite data:', err);
      setError('Satellite service is currently unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFarmChange = async (farmId) => {
    const found = farms.find((f) => String(f.id) === String(farmId));
    if (found) {
      setSelectedFarm(found);
      setIsSearching(true);
      try {
        const s = await satelliteService.getSentinelScenes(found.id, { maxCloud });
        setScenes(s || []);
        if (s && s.length > 0) {
          setSelectedScene(s[0]);
        } else {
          setSelectedScene(null);
        }
      } catch (err) {
        console.error('Error searching scenes:', err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedFarm) return;
    setIsSearching(true);
    try {
      const s = await satelliteService.getSentinelScenes(selectedFarm.id, { fromDate, toDate, maxCloud });
      setScenes(s || []);
      if (s && s.length > 0) {
        setSelectedScene(s[0]);
      } else {
        setSelectedScene(null);
      }
    } catch (err) {
      console.error('Error executing satellite search:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = async () => {
    if (!selectedFarm) return;
    setIsSearching(true);
    try {
      const farmList = await farmService.getFarms();
      const list = farmList || [];
      setFarms(list);
      const currentId = selectedFarm.id;
      const updatedFarm = list.find((f) => String(f.id) === String(currentId)) || list[0] || null;
      if (updatedFarm) {
        setSelectedFarm(updatedFarm);
        const s = await satelliteService.getSentinelScenes(updatedFarm.id, { fromDate, toDate, maxCloud });
        setScenes(s || []);
        if (s && s.length > 0) {
          setSelectedScene(s[0]);
        }
      }
    } catch (err) {
      console.error('Error refreshing satellite observations:', err);
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingState}>
        <RefreshCw size={36} color="#00d9ff" className="animate-spin" />
        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.2rem' }}>Searching satellite observations...</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Querying Google Earth Engine Sentinel-2 L2A collection</p>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div style={styles.emptyStateCard}>
        <Satellite size={48} color="#00d9ff" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>Select a farm to view satellite observations.</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '500px', margin: '0 0 1.5rem 0' }}>
          No farms are registered in your profile. Please register a farm boundary to ingest Sentinel-2 satellite observations.
        </p>
        <Link to="/farms/add" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Register Your First Farm
        </Link>
      </div>
    );
  }

  const latestDate = scenes.length > 0 ? scenes[0].date : 'Awaiting Data';
  const latestCloud = scenes.length > 0 ? `${scenes[0].cloudCoverPercent}%` : 'N/A';
  const latestSatellite = scenes.length > 0 ? scenes[0].satellite : 'Sentinel-2';
  const latestStatus = scenes.length > 0 ? 'Ready' : 'No Data';

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 1. Page Title & Header */}
      <div style={styles.headerCard}>
        <div style={styles.headerTitleGroup}>
          <div style={styles.iconCircle}>
            <Satellite size={22} color="#00d9ff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={styles.pageTitle}>{t('sat_title')}</h1>
              <span style={styles.geeSourceTag}>{t('sat_source_tag')}</span>
            </div>
            <p style={styles.pageSub}>{t('sat_subtitle')}</p>
          </div>
        </div>

        {/* 2. Selected Farm Selector & Refresh */}
        <div style={styles.headerControls}>
          <div style={styles.selectorWrapper}>
            <label htmlFor="satFarmSelect" style={styles.selectLabel}>
              {t('selected_farm')}:
            </label>
            <select
              id="satFarmSelect"
              value={selectedFarm?.id || ''}
              onChange={(e) => handleFarmChange(e.target.value)}
              style={styles.farmSelect}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  {f.farmName} ({getCropLabel(f.cropType)})
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleRefresh} disabled={isSearching} className="btn btn-secondary" style={styles.refreshBtn}>
            <RefreshCw size={14} className={isSearching ? 'animate-spin' : ''} />
            <span>{t('refresh_data')}</span>
          </button>
        </div>
      </div>

      {selectedFarm && (
        <>
          {/* 3. Farm Summary Card */}
          <div style={styles.farmSummaryCard}>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t('farms_name')}</span>
                <span style={styles.summaryValue}>{selectedFarm.farmName}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t('common_crop')}</span>
                <span style={styles.summaryValue}>{getCropLabel(selectedFarm.cropType)}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t('common_area')}</span>
                <span style={styles.summaryValue}>
                  {Number(selectedFarm.areaHectares || 0).toFixed(2)} {t('common_hectares')} ({Number(selectedFarm.areaAcres || 0).toFixed(2)} {t('common_acres')})
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t('common_location')}</span>
                <span style={styles.summaryValue}>
                  {selectedFarm.locationAddress || `${Number(selectedFarm.latitude).toFixed(4)}° N, ${Number(selectedFarm.longitude).toFixed(4)}° E`}
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t('common_lat')}</span>
                <span style={styles.summaryValue}>{Number(selectedFarm.latitude).toFixed(6)}° N</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t('common_lng')}</span>
                <span style={styles.summaryValue}>{Number(selectedFarm.longitude).toFixed(6)}° E</span>
              </div>
            </div>
          </div>

          {/* 4. Satellite Overview Cards (4 Cards) */}
          <div style={styles.overviewCardsGrid}>
            <div style={styles.overviewCard}>
              <span style={styles.overviewCardTitle}>{t('sat_card_latest')}</span>
              <span style={styles.overviewCardVal}>{latestDate}</span>
              <span style={styles.overviewCardSub}>5-day revisit interval</span>
            </div>

            <div style={styles.overviewCard}>
              <span style={styles.overviewCardTitle}>{t('sat_card_cloud')}</span>
              <span style={{ ...styles.overviewCardVal, color: '#00d9ff' }}>{latestCloud}</span>
              <span style={styles.overviewCardSub}>Sentinel-2 metadata</span>
            </div>

            <div style={styles.overviewCard}>
              <span style={styles.overviewCardTitle}>{t('sat_card_source')}</span>
              <span style={{ ...styles.overviewCardVal, color: '#22e58a' }}>{latestSatellite}</span>
              <span style={styles.overviewCardSub}>Copernicus Constellation</span>
            </div>

            <div style={styles.overviewCard}>
              <span style={styles.overviewCardTitle}>{t('sat_card_status')}</span>
              <span style={{ ...styles.overviewCardVal, color: '#22e58a' }}>{latestStatus}</span>
              <span style={styles.overviewCardSub}>Level-2A Surface Reflectance</span>
            </div>
          </div>

          {/* 5. Main Farm Satellite Map Section */}
          <div style={styles.sectionCard}>
            <div style={styles.mapHeaderRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#00d9ff" />
                <h2 style={styles.sectionHeading}>{t('sat_map_heading')}</h2>
              </div>

              {/* 6. Layer Switcher Controls */}
              <div style={styles.layerControlsWrapper}>
                <button
                  className={`tab-btn ${activeLayer === 'trueColor' ? 'tab-btn-active' : ''}`}
                  onClick={() => setActiveLayer('trueColor')}
                  style={styles.layerBtn}
                >
                  {t('sat_layer_true')}
                </button>
                <button
                  className={`tab-btn ${activeLayer === 'falseColor' ? 'tab-btn-active' : ''}`}
                  onClick={() => setActiveLayer('falseColor')}
                  style={styles.layerBtn}
                >
                  {t('sat_layer_false')}
                </button>
                <button
                  className={`tab-btn ${activeLayer === 'ndvi' ? 'tab-btn-active' : ''}`}
                  onClick={() => setActiveLayer('ndvi')}
                  style={styles.layerBtn}
                >
                  {t('sat_layer_ndvi')}
                </button>
                <button
                  className={`tab-btn ${activeLayer === 'ndre' ? 'tab-btn-active' : ''}`}
                  onClick={() => setActiveLayer('ndre')}
                  style={styles.layerBtn}
                >
                  {t('sat_layer_ndre')}
                </button>
                <button
                  className={`tab-btn ${activeLayer === 'savi' ? 'tab-btn-active' : ''}`}
                  onClick={() => setActiveLayer('savi')}
                  style={styles.layerBtn}
                >
                  SAVI Layer
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div style={styles.mapContainerWrapper}>
              <FarmMap
                key={selectedFarm.id}
                initialLat={Number(selectedFarm.latitude) || 18.5204}
                initialLng={Number(selectedFarm.longitude) || 73.8567}
                initialBoundary={selectedFarm.boundaryGeoJSON}
                readOnly={true}
              />
              <div style={styles.mapOverlayTag}>
                <span style={styles.pulseDot}></span>
                <span>Farm Boundary Applied • {selectedFarm.farmName}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                <span style={{ color: '#00d9ff' }}>Active Layer: {activeLayer.toUpperCase()}</span>
              </div>
            </div>

            {/* Vegetation Indices Quick Nav Buttons */}
            <div style={styles.indicesNavRow}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Vegetation Analysis:</span>
              <button onClick={() => navigate('/crop-health')} className="btn btn-secondary" style={styles.quickNavBtn}>
                <span>View NDVI Analysis</span>
                <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate('/crop-health')} className="btn btn-secondary" style={styles.quickNavBtn}>
                <span>View NDRE Analysis</span>
                <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate('/crop-health')} className="btn btn-secondary" style={styles.quickNavBtn}>
                <span>View SAVI Analysis</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 16. Search & Filter Observations Bar */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Filter size={18} color="#00d9ff" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Search Historical Observations</h3>
            </div>

            <form onSubmit={handleSearch} style={styles.filterForm}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={styles.filterInput}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={styles.filterInput}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Max Cloud Coverage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={maxCloud}
                  onChange={(e) => setMaxCloud(e.target.value)}
                  style={styles.filterInput}
                />
              </div>

              <button type="submit" disabled={isSearching} className="btn btn-primary" style={styles.searchSubmitBtn}>
                <Search size={15} />
                <span>{isSearching ? 'Searching...' : 'Search Observations'}</span>
              </button>
            </form>
          </div>

          {/* 7. Available Satellite Observations Table/Cards */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="#22e58a" />
                <h2 style={styles.sectionHeading}>Available Satellite Observations</h2>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{scenes.length} Sentinel-2 scenes found</span>
            </div>

            {scenes.length > 0 ? (
              <div style={styles.scenesTableWrapper}>
                <table style={styles.scenesTable}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Acquisition Date</th>
                      <th style={styles.th}>Satellite</th>
                      <th style={styles.th}>Cloud Coverage</th>
                      <th style={styles.th}>Processing Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenes.map((scene) => {
                      const isSelected = selectedScene?.id === scene.id;
                      return (
                        <tr
                          key={scene.id}
                          style={{
                            backgroundColor: isSelected ? 'rgba(0, 217, 255, 0.12)' : 'transparent'
                          }}
                        >
                          <td style={styles.td}>
                            <strong>{scene.date}</strong>
                          </td>
                          <td style={styles.td}>{scene.satellite}</td>
                          <td style={styles.td}>
                            <span style={{ color: scene.cloudCoverPercent < 10 ? '#22e58a' : '#fbbf24', fontWeight: '700' }}>
                              {scene.cloudCoverPercent}% Cloud
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.statusBadge}>{scene.status}</span>
                          </td>
                          <td style={styles.td}>
                            <button
                              onClick={() => setSelectedScene(scene)}
                              className="btn btn-secondary"
                              style={{
                                ...styles.viewSceneBtn,
                                backgroundColor: isSelected ? '#00d9ff' : 'rgba(255, 255, 255, 0.08)',
                                color: isSelected ? '#0f172a' : '#ffffff'
                              }}
                            >
                              <Eye size={13} />
                              <span>{isSelected ? 'Selected' : 'View'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={styles.noDataText}>No Sentinel-2 observations found for this farm and date range.</p>
            )}
          </div>

          {/* 9 & 10. Selected Observation Details & Product Specifications */}
          {selectedScene && (
            <div style={styles.sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h2 style={styles.sectionHeading}>Selected Observation Details</h2>
                <span style={styles.productLevelBadge}>Sentinel-2 Level-2A Surface Reflectance</span>
              </div>

              <div style={styles.selectedSceneGrid}>
                <div style={styles.sceneDetailBox}>
                  <span>Acquisition Date</span>
                  <strong>{selectedScene.date}</strong>
                </div>
                <div style={styles.sceneDetailBox}>
                  <span>Satellite</span>
                  <strong>{selectedScene.satellite}</strong>
                </div>
                <div style={styles.sceneDetailBox}>
                  <span>Product Level</span>
                  <strong>Sentinel-2 Level-2A</strong>
                </div>
                <div style={styles.sceneDetailBox}>
                  <span>Cloud Coverage</span>
                  <strong style={{ color: '#00d9ff' }}>{selectedScene.cloudCoverPercent}%</strong>
                </div>
                <div style={styles.sceneDetailBox}>
                  <span>Processing Status</span>
                  <strong style={{ color: '#22e58a' }}>{selectedScene.status}</strong>
                </div>
                <div style={styles.sceneDetailBox}>
                  <span>Product / Granule ID</span>
                  <strong style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedScene.granuleId}</strong>
                </div>
              </div>
            </div>
          )}

          {/* 11 & 12. Spectral Bands Section */}
          <div style={styles.sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} color="#22e58a" />
                <h2 style={styles.sectionHeading}>Spectral Bands</h2>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                10 m / 20 m spatial resolution depending on spectral band.
              </span>
            </div>

            <div style={styles.bandsGrid}>
              <div style={styles.bandCard}>
                <div style={styles.bandHeader}>
                  <strong style={{ color: '#38bdf8' }}>B2 — Blue</strong>
                  <span style={styles.resBadge}>10 m</span>
                </div>
                <p style={styles.bandPurpose}>Blue reflectance</p>
              </div>

              <div style={styles.bandCard}>
                <div style={styles.bandHeader}>
                  <strong style={{ color: '#f87171' }}>B4 — Red</strong>
                  <span style={styles.resBadge}>10 m</span>
                </div>
                <p style={styles.bandPurpose}>Red reflectance</p>
              </div>

              <div style={styles.bandCard}>
                <div style={styles.bandHeader}>
                  <strong style={{ color: '#fbbf24' }}>B5 — Red Edge</strong>
                  <span style={styles.resBadge}>20 m</span>
                </div>
                <p style={styles.bandPurpose}>Red-edge vegetation information</p>
              </div>

              <div style={styles.bandCard}>
                <div style={styles.bandHeader}>
                  <strong style={{ color: '#22e58a' }}>B8 — NIR</strong>
                  <span style={styles.resBadge}>10 m</span>
                </div>
                <p style={styles.bandPurpose}>Near-infrared vegetation information</p>
              </div>

              <div style={styles.bandCard}>
                <div style={styles.bandHeader}>
                  <strong style={{ color: '#c084fc' }}>B11 — SWIR</strong>
                  <span style={styles.resBadge}>20 m</span>
                </div>
                <p style={styles.bandPurpose}>Short-wave infrared surface information</p>
              </div>
            </div>
          </div>

          {/* 13 & 14. Satellite Processing Pipeline Section */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionHeading}>Satellite Processing Pipeline</h2>
            <div style={styles.pipelineSteps}>
              <div style={styles.pipelineStep}>
                <CheckCircle2 size={18} color="#22e58a" />
                <span>Farm Boundary Loaded</span>
              </div>
              <div style={styles.pipelineStep}>
                <CheckCircle2 size={18} color="#22e58a" />
                <span>Sentinel-2 Collection Queried</span>
              </div>
              <div style={styles.pipelineStep}>
                <CheckCircle2 size={18} color="#22e58a" />
                <span>Date & Cloud Filter Applied</span>
              </div>
              <div style={styles.pipelineStep}>
                <CheckCircle2 size={18} color="#22e58a" />
                <span>Image Clipped to Farm Boundary</span>
              </div>
              <div style={styles.pipelineStep}>
                <CheckCircle2 size={18} color="#22e58a" />
                <span>Surface Reflectance Loaded</span>
              </div>
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
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '380px',
    gap: '1rem'
  },
  emptyStateCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderTop: '4px solid #00d9ff',
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
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
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
  geeSourceTag: {
    backgroundColor: 'rgba(0, 217, 255, 0.12)',
    color: '#00d9ff',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '0.15rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  headerControls: {
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
  selectLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  farmSelect: {
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
  farmSummaryCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    padding: '1.15rem 1.35rem'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem'
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  summaryLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  summaryValue: {
    fontSize: '0.925rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  overviewCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  overviewCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    padding: '1.15rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  overviewCardTitle: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  },
  overviewCardVal: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  overviewCardSub: {
    fontSize: '0.725rem',
    color: '#64748b'
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
  mapHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  layerControlsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.25rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap'
  },
  layerBtn: {
    padding: '0.35rem 0.65rem',
    fontSize: '0.78rem',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  mapContainerWrapper: {
    position: 'relative',
    height: '420px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(34, 229, 138, 0.3)'
  },
  mapOverlayTag: {
    position: 'absolute',
    bottom: '0.85rem',
    left: '0.85rem',
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '0.4rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    fontSize: '0.78rem',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    pointerEvents: 'none'
  },
  pulseDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#00d9ff',
    boxShadow: '0 0 8px #00d9ff'
  },
  indicesNavRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap'
  },
  quickNavBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  filterForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    alignItems: 'end'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  filterLabel: {
    fontSize: '0.78rem',
    color: '#94a3b8'
  },
  filterInput: {
    padding: '0.45rem 0.75rem',
    fontSize: '0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    color: '#ffffff',
    outline: 'none'
  },
  searchSubmitBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem'
  },
  scenesTableWrapper: {
    overflowX: 'auto'
  },
  scenesTable: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.85rem'
  },
  th: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    fontSize: '0.78rem'
  },
  td: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    color: '#ffffff'
  },
  statusBadge: {
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    color: '#22e58a',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.725rem'
  },
  viewSceneBtn: {
    padding: '0.35rem 0.75rem',
    fontSize: '0.78rem',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    cursor: 'pointer',
    fontWeight: '600'
  },
  productLevelBadge: {
    backgroundColor: 'rgba(0, 217, 255, 0.12)',
    color: '#00d9ff',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  selectedSceneGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  sceneDetailBox: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.825rem',
    color: '#94a3b8'
  },
  bandsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  bandCard: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  bandHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.875rem'
  },
  resBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.7rem'
  },
  bandPurpose: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    margin: 0
  },
  pipelineSteps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  pipelineStep: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.85rem',
    color: '#ffffff'
  },
  noDataText: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: 0
  }
};
