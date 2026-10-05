import React, { useState } from 'react';
import { Box, Rotate3d, Compass, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import DigitalTwin3DScene from './DigitalTwin3DScene';

export default function DigitalTwinCanvas({ farm, onRefresh }) {
  const [autoRotate, setAutoRotate] = useState(false);

  const hasGeoJSON = farm && farm.boundaryGeoJSON;
  const lat = Number(farm?.latitude) || 18.5204;
  const lng = Number(farm?.longitude) || 73.8567;

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <div style={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={styles.iconBox}>
            <Box size={20} color="#22e58a" />
          </div>
          <div>
            <h3 style={styles.title}>3D Farm Digital Twin</h3>
            <p style={styles.subtitle}>Interactive spatial representation of the selected farm boundary.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="btn btn-secondary"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              borderRadius: '8px',
              backgroundColor: autoRotate ? 'rgba(34, 229, 138, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              color: autoRotate ? '#22e58a' : '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Rotate3d size={15} />
            <span>{autoRotate ? 'Pause 360° Orbit' : 'Auto 360° Orbit'}</span>
          </button>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div style={styles.sceneWrapper}>
        <DigitalTwin3DScene
          boundaryGeoJSON={farm?.boundaryGeoJSON}
          centerLat={lat}
          centerLng={lng}
          autoRotate={autoRotate}
        />

        {/* Floating Overlay Badge */}
        <div style={styles.overlayBadge}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22e58a', display: 'inline-block' }}></span>
          <span>{farm?.farmName || 'Selected Farm'}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span>{Number(farm?.areaHectares || 0).toFixed(2)} Ha</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span>{hasGeoJSON ? 'GeoJSON Polygon Active' : 'Center Coordinates Only'}</span>
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
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    margin: '2px 0 0 0'
  },
  sceneWrapper: {
    position: 'relative',
    height: '420px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    backgroundColor: '#070e0b'
  },
  overlayBadge: {
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
  }
};
