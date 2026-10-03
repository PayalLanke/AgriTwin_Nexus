import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { satelliteService } from '../services/satelliteService';
import {
  Satellite,
  Cloud,
  Layers,
  Calendar,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Radio,
  Eye,
  Sun,
  Maximize2,
  Cpu
} from 'lucide-react';

export default function SatellitePage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0]);
        const s = await satelliteService.getSentinelScenes(data[0].id);
        setScenes(s);
        setSelectedScene(s[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFarmChange = async (farmId) => {
    const f = farms.find((farm) => String(farm.id) === String(farmId));
    if (f) {
      setSelectedFarm(f);
      setIsLoading(true);
      const s = await satelliteService.getSentinelScenes(f.id);
      setScenes(s);
      setSelectedScene(s[0]);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#00d9ff', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          INGESTING SENTINEL-2 L2A MULTISPECTRAL TILES...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={styles.title}>Sentinel-2 Orbital Acquisition Hub</h1>
            <span style={styles.geeBadge}>
              <Radio size={12} color="#22e58a" />
              GEE COPERNICUS L2A STREAM
            </span>
          </div>
          <p style={styles.subtitle}>
            10-metre multispectral surface reflectance clipped to farm ROI (B2 Blue, B4 Red, B5 RedEdge, B8 NIR, B11 SWIR).
          </p>
        </div>

        {farms.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk, sans-serif' }}>TARGET ROI:</span>
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => handleFarmChange(e.target.value)}
              style={styles.selectInput}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  {f.farmName} &bull; {f.cropType}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!selectedFarm ? (
        <div style={styles.noFarmCard}>
          <Satellite size={48} color="#00d9ff" />
          <h3 style={{ color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>No ROI Registered</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>Register a farm boundary to trigger GEE Sentinel-2 satellite data ingestion pipeline.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {/* Left Column: Scene Selector & Spectral Band Specs */}
          <div style={styles.leftCol}>
            <div style={styles.cardSection}>
              <div style={styles.cardSectionHeader}>
                <div style={styles.iconCircle}>
                  <Calendar size={18} color="#00d9ff" />
                </div>
                <div>
                  <h3 style={styles.sectionHeading}>Sentinel-2 Overpass Granules</h3>
                  <span style={{ fontSize: '0.725rem', color: '#64748b' }}>5-day orbital revisit cycle</span>
                </div>
              </div>

              <div style={styles.sceneList}>
                {scenes.map((scene) => {
                  const isSelected = selectedScene?.id === scene.id;
                  return (
                    <div
                      key={scene.id}
                      style={{
                        ...styles.sceneItem,
                        backgroundColor: isSelected ? 'rgba(0, 217, 255, 0.12)' : 'rgba(8, 17, 13, 0.6)',
                        borderColor: isSelected ? '#00d9ff' : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: isSelected ? '0 0 20px rgba(0, 217, 255, 0.2)' : 'none'
                      }}
                      onClick={() => setSelectedScene(scene)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                          {scene.date}
                        </span>
                        <span style={{
                          ...styles.cloudBadge,
                          background: scene.cloudCoverPercent < 15 ? 'rgba(34, 229, 138, 0.12)' : 'rgba(251, 191, 36, 0.12)',
                          color: scene.cloudCoverPercent < 15 ? '#22e58a' : '#fbbf24',
                          border: `1px solid ${scene.cloudCoverPercent < 15 ? 'rgba(34, 229, 138, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                        }}>
                          <Cloud size={11} />
                          {scene.cloudCoverPercent}% Cloud
                        </span>
                      </div>
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.725rem', color: '#94a3b8' }}>
                        Platform: <span style={{ color: '#00d9ff' }}>{scene.satellite}</span> &bull; {scene.status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spectral Bands Specification Card */}
            <div style={styles.cardSection}>
              <div style={styles.cardSectionHeader}>
                <div style={{ ...styles.iconCircle, background: 'rgba(34, 229, 138, 0.1)', borderColor: 'rgba(34, 229, 138, 0.25)' }}>
                  <Layers size={18} color="#22e58a" />
                </div>
                <div>
                  <h3 style={styles.sectionHeading}>Multispectral Sensor Bands</h3>
                  <span style={{ fontSize: '0.725rem', color: '#64748b' }}>MSI (MultiSpectral Instrument)</span>
                </div>
              </div>

              <div style={styles.bandGrid}>
                <div style={styles.bandTile}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.bandName}>B2 &bull; Blue</span>
                    <span style={{ ...styles.bandPill, color: '#38bdf8' }}>490 nm</span>
                  </div>
                  <span style={styles.bandWave}>10m spatial resolution</span>
                </div>
                <div style={styles.bandTile}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.bandName}>B4 &bull; Red</span>
                    <span style={{ ...styles.bandPill, color: '#f87171' }}>665 nm</span>
                  </div>
                  <span style={styles.bandWave}>10m spatial resolution</span>
                </div>
                <div style={styles.bandTile}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.bandName}>B5 &bull; RedEdge</span>
                    <span style={{ ...styles.bandPill, color: '#fbbf24' }}>705 nm</span>
                  </div>
                  <span style={styles.bandWave}>20m spatial resolution</span>
                </div>
                <div style={styles.bandTile}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.bandName}>B8 &bull; NIR</span>
                    <span style={{ ...styles.bandPill, color: '#22e58a' }}>842 nm</span>
                  </div>
                  <span style={styles.bandWave}>10m spatial resolution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scene Preview & Satellite Telemetry */}
          <div style={styles.rightCol}>
            {selectedScene && (
              <div style={styles.previewCard}>
                <div style={styles.previewHeader}>
                  <div>
                    <h3 style={styles.previewTitle}>Scene Granule: {selectedScene.date}</h3>
                    <span style={{ fontSize: '0.725rem', color: '#94a3b8', fontFamily: 'Space Grotesk, sans-serif' }}>
                      GRANULE ID: {selectedScene.id}
                    </span>
                  </div>
                  <span style={styles.cloudMaskBadge}>
                    <CheckCircle2 size={12} color="#22e58a" />
                    QA60 CLOUD MASK APPLIED
                  </span>
                </div>

                <div style={styles.imageContainer}>
                  <img
                    src={selectedScene.previewUrl}
                    alt="Sentinel-2 Satellite View"
                    style={styles.sceneImg}
                  />
                  <div style={styles.imgOverlayTag}>
                    <Satellite size={16} color="#00d9ff" />
                    <span>Clipped to Farm Boundary ({selectedFarm.farmName})</span>
                  </div>
                  <div style={styles.cornerHUD}>
                    <span>10m / PX &bull; EPSG:4326</span>
                  </div>
                </div>

                <div style={styles.telemetryRow}>
                  <div style={styles.telemetryBox}>
                    <span style={styles.telLabel}>ATMOSPHERIC CORRECTION</span>
                    <span style={styles.telVal}>Sen2Cor L2A BOA Surface Reflectance</span>
                  </div>
                  <div style={styles.telemetryBox}>
                    <span style={styles.telLabel}>GROUND SAMPLING DISTANCE</span>
                    <span style={{ ...styles.telVal, color: '#22e58a' }}>10 Metres / Pixel</span>
                  </div>
                  <div style={styles.telemetryBox}>
                    <span style={styles.telLabel}>SOLAR ZENITH / ELEVATION</span>
                    <span style={{ ...styles.telVal, color: '#fbbf24' }}>{selectedScene.sunElevation}° Elevation</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  loadingContainer: {
    padding: '6rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(0, 217, 255, 0.15)',
    borderTop: '3px solid #00d9ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  subtitle: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    margin: '4px 0 0 0'
  },
  geeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  selectInput: {
    padding: '0.55rem 1rem',
    borderRadius: '12px',
    fontWeight: '600',
    background: 'rgba(9, 18, 14, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    color: '#f8fafc',
    fontSize: '0.825rem',
    outline: 'none',
    cursor: 'pointer'
  },
  noFarmCard: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(15, 27, 21, 0.72)',
    borderRadius: '18px',
    border: '1px solid rgba(34, 229, 138, 0.18)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap: '1.5rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  cardSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid rgba(0, 217, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeading: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  sceneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  sceneItem: {
    padding: '1rem',
    borderRadius: '14px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  cloudBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.2rem 0.55rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  bandGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem'
  },
  bandTile: {
    padding: '0.75rem 0.875rem',
    backgroundColor: 'rgba(8, 17, 13, 0.7)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  bandName: {
    fontSize: '0.825rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  bandPill: {
    fontSize: '0.675rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  bandWave: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  previewCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  previewTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  cloudMaskBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  imageContainer: {
    position: 'relative',
    borderRadius: '14px',
    overflow: 'hidden',
    height: '340px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
  },
  sceneImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imgOverlayTag: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    color: '#ffffff',
    padding: '0.4rem 0.85rem',
    borderRadius: '10px',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(0, 217, 255, 0.3)'
  },
  cornerHUD: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    color: '#22e58a',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif',
    border: '1px solid rgba(34, 229, 138, 0.3)'
  },
  telemetryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
  },
  telemetryBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  telLabel: {
    fontSize: '0.675rem',
    color: '#64748b',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif',
    letterSpacing: '0.04em'
  },
  telVal: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#f8fafc'
  }
};
