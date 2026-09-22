import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { satelliteService } from '../services/satelliteService';
import { Satellite, Cloud, Layers, Calendar, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';

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
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Fetching Sentinel-2 Multispectral Data...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Sentinel-2 Satellite Acquisition</h1>
            <span className="badge badge-teal">Google Earth Engine Connected</span>
          </div>
          <p style={styles.subtitle}>
            Multispectral satellite tiles clipped to farm GeoJSON ROI (B2 Blue, B4 Red, B5 RedEdge, B8 NIR, B11 SWIR).
          </p>
        </div>

        {farms.length > 0 && (
          <select
            value={selectedFarm?.id || ''}
            onChange={(e) => handleFarmChange(e.target.value)}
            style={styles.selectInput}
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.farmName} ({f.cropType})
              </option>
            ))}
          </select>
        )}
      </div>

      {!selectedFarm ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Farm Registered</h3>
          <p>Register a farm boundary to trigger GEE satellite data pipeline.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {/* Left Column: Scene Selector & Spectral Band Specs */}
          <div style={styles.leftCol}>
            <div className="card" style={styles.cardSection}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Available Sentinel-2 Scenes</h3>

              <div style={styles.sceneList}>
                {scenes.map((scene) => {
                  const isSelected = selectedScene?.id === scene.id;
                  return (
                    <div
                      key={scene.id}
                      style={{
                        ...styles.sceneItem,
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : '#ffffff',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)'
                      }}
                      onClick={() => setSelectedScene(scene)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>{scene.date}</span>
                        <span className="badge badge-primary">{scene.cloudCoverPercent}% Cloud</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.725rem', color: 'var(--color-text-secondary)' }}>
                        {scene.satellite} &bull; {scene.status}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spectral Bands Specification Card */}
            <div className="card" style={styles.cardSection}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Multispectral Band Channels</h3>
              <div style={styles.bandGrid}>
                <div style={styles.bandTile}>
                  <span style={styles.bandName}>B2 — Blue</span>
                  <span style={styles.bandWave}>490 nm &bull; 10m</span>
                </div>
                <div style={styles.bandTile}>
                  <span style={styles.bandName}>B4 — Red</span>
                  <span style={styles.bandWave}>665 nm &bull; 10m</span>
                </div>
                <div style={styles.bandTile}>
                  <span style={styles.bandName}>B5 — RedEdge</span>
                  <span style={styles.bandWave}>705 nm &bull; 20m</span>
                </div>
                <div style={styles.bandTile}>
                  <span style={styles.bandName}>B8 — NIR</span>
                  <span style={styles.bandWave}>842 nm &bull; 10m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scene Preview & Satellite Telemetry */}
          <div style={styles.rightCol}>
            {selectedScene && (
              <div className="card" style={styles.previewCard}>
                <div style={styles.previewHeader}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Scene Preview: {selectedScene.date}</h3>
                    <span style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                      Granule ID: {selectedScene.id}
                    </span>
                  </div>
                  <span className="badge badge-teal">Cloud Mask Applied</span>
                </div>

                <div style={styles.imageContainer}>
                  <img
                    src={selectedScene.previewUrl}
                    alt="Sentinel-2 Satellite View"
                    style={styles.sceneImg}
                  />
                  <div style={styles.imgOverlayTag}>
                    <Satellite size={16} color="#ffffff" />
                    <span>Clipped to Farm Boundary ({selectedFarm.farmName})</span>
                  </div>
                </div>

                <div style={styles.telemetryRow}>
                  <div>
                    <span style={styles.telLabel}>Atmospheric Processing</span>
                    <span style={styles.telVal}>Sen2Cor L2A Surface Reflectance</span>
                  </div>
                  <div>
                    <span style={styles.telLabel}>Spatial Resolution</span>
                    <span style={styles.telVal}>10 Metres / Pixel</span>
                  </div>
                  <div>
                    <span style={styles.telLabel}>Sun Elevation</span>
                    <span style={styles.telVal}>{selectedScene.sunElevation}°</span>
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: 0
  },
  selectInput: {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    width: 'auto'
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
    gap: '1rem'
  },
  sceneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem'
  },
  sceneItem: {
    padding: '0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  bandGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.625rem'
  },
  bandTile: {
    padding: '0.625rem 0.875rem',
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column'
  },
  bandName: {
    fontSize: '0.8125rem',
    fontWeight: '700',
    color: 'var(--color-primary)'
  },
  bandWave: {
    fontSize: '0.7rem',
    color: 'var(--color-text-secondary)'
  },
  previewCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    height: '320px',
    border: '1px solid var(--color-border)'
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    color: '#ffffff',
    padding: '0.375rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backdropFilter: 'blur(4px)'
  },
  telemetryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '0.875rem',
    borderTop: '1px solid var(--color-border)',
    fontSize: '0.8125rem'
  },
  telLabel: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '600'
  },
  telVal: {
    fontWeight: '700',
    color: 'var(--color-text-main)'
  }
};
