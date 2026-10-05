import React, { useState } from 'react';
import { Box, Rotate3d, Layers, Compass, Sprout, Activity, Eye, Maximize2 } from 'lucide-react';
import DigitalTwin3DScene from './DigitalTwin3DScene';

export default function DigitalTwinCanvas({ farm, onRefresh }) {
  const [activeLayer, setActiveLayer] = useState('canopy'); // 'canopy' | 'terrain' | 'grid' | 'contour'
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'ortho'
  const [autoRotate, setAutoRotate] = useState(false);

  const hasGeoJSON = Boolean(farm && farm.boundaryGeoJSON);
  const lat = Number(farm?.latitude) || 18.5204;
  const lng = Number(farm?.longitude) || 73.8567;
  const farmName = farm?.farmName || 'Selected Farm';
  const cropType = farm?.cropType || 'Crop';
  const areaHectares = Number(farm?.areaHectares || 0).toFixed(2);

  return (
    <div style={styles.container}>
      {/* Top Header & Layer Selector Tabs */}
      <div style={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={styles.iconBox}>
            <Box size={22} color="#22e58a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={styles.title}>3D Farm Digital Twin Engine</h3>
              <span style={styles.badgeLive}>3D SPATIAL MODEL</span>
            </div>
            <p style={styles.subtitle}>
              Interactive spatial representation of {farmName} boundary ({cropType} • {areaHectares} Ha)
            </p>
          </div>
        </div>

        {/* View Controls & Auto-Rotate */}
        <div style={styles.controlGroup}>
          <div style={styles.tabsWrapper}>
            <button
              className={`tab-btn ${viewMode === '3d' ? 'tab-btn-active' : ''}`}
              onClick={() => setViewMode('3d')}
              style={styles.tabBtn}
              title="3D Spatial Isometric Perspective"
            >
              <Eye size={14} />
              <span>3D Perspective</span>
            </button>
            <button
              className={`tab-btn ${viewMode === 'ortho' ? 'tab-btn-active' : ''}`}
              onClick={() => setViewMode('ortho')}
              style={styles.tabBtn}
              title="2D Top-Down Orthographic View"
            >
              <Layers size={14} />
              <span>2D Ortho View</span>
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="btn btn-secondary"
            style={{
              ...styles.orbitBtn,
              backgroundColor: autoRotate ? 'rgba(34, 229, 138, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: autoRotate ? '#22e58a' : '#ffffff'
            }}
          >
            <Rotate3d size={15} />
            <span>{autoRotate ? 'Pause Orbit' : '360° Orbit'}</span>
          </button>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div style={styles.sceneWrapper}>
        <DigitalTwin3DScene
          boundaryGeoJSON={farm?.boundaryGeoJSON}
          centerLat={lat}
          centerLng={lng}
          cropType={cropType}
          activeLayer={activeLayer}
          viewMode={viewMode}
          autoRotate={autoRotate}
        />

        {/* Top Floating Coordinates HUD Ribbon */}
        <div style={styles.hudRibbon}>
          <div style={styles.hudBadge}>
            <span style={styles.livePulseDot}></span>
            <span>LAT: {lat.toFixed(6)}° N | LON: {lng.toFixed(6)}° E</span>
          </div>
          <div style={styles.hudBadge}>
            <span>PARCEL AREA: {areaHectares} HA</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <span style={{ color: hasGeoJSON ? '#22e58a' : '#fbbf24' }}>
              {hasGeoJSON ? 'GEOJSON BOUNDARY ACTIVE' : 'CENTER MARKER'}
            </span>
          </div>
        </div>

        {/* Bottom Floating Legend Badge */}
        <div style={styles.bottomLegend}>
          <Sprout size={15} color="#22e58a" />
          <span>{farmName}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ color: '#00d9ff' }}>{cropType}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Drag to Orbit • Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    margin: '2px 0 0 0'
  },
  badgeLive: {
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    color: '#22e58a',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.68rem',
    fontWeight: '700',
    letterSpacing: '0.04em'
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  tabsWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.25rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  tabBtn: {
    padding: '0.35rem 0.65rem',
    fontSize: '0.78rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  orbitBtn: {
    padding: '0.45rem 0.85rem',
    fontSize: '0.8rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  sceneWrapper: {
    position: 'relative',
    height: '450px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    backgroundColor: '#060d0a'
  },
  hudRibbon: {
    position: 'absolute',
    top: '0.75rem',
    left: '0.75rem',
    right: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
    fontSize: '0.725rem',
    color: '#94a3b8'
  },
  hudBadge: {
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600'
  },
  livePulseDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#22e58a',
    boxShadow: '0 0 8px #22e58a'
  },
  bottomLegend: {
    position: 'absolute',
    bottom: '0.85rem',
    left: '0.85rem',
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '0.4rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    fontSize: '0.78rem',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    pointerEvents: 'none'
  }
};
