import React, { useState } from 'react';
import {
  Box,
  Rotate3d,
  Layers,
  Droplets,
  Sprout,
  Thermometer,
  Radio,
  Zap,
  Eye,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Send,
  Navigation
} from 'lucide-react';
import DigitalTwin3DScene from './DigitalTwin3DScene';
import { useLanguage } from '../context/LanguageContext';

export default function DigitalTwinCanvas({ farm, onRefresh }) {
  const { t } = useLanguage();
  const [activeLayer, setActiveLayer] = useState('ndvi'); // 'ndvi' | 'moisture' | 'npk' | 'thermal' | 'sar'
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'ortho'
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedSubPlotIndex, setSelectedSubPlotIndex] = useState(7); // Default tile (row 1, col 2) matching screenshot
  const [actionNotice, setActionNotice] = useState(null);

  const getCropLabel = (crop) => {
    if (!crop) return 'Glycine max (Soybean)';
    const normalized = crop.toLowerCase();
    if (normalized.includes('wheat')) return 'Triticum aestivum (Wheat)';
    if (normalized.includes('papaya')) return 'Carica papaya (Papaya)';
    if (normalized.includes('maize')) return 'Zea mays (Maize)';
    if (normalized.includes('cotton')) return 'Gossypium hirsutum (Cotton)';
    if (normalized.includes('sugarcane')) return 'Saccharum officinarum (Sugarcane)';
    if (normalized.includes('soybean')) return 'Glycine max (Soybean)';
    return crop;
  };

  const lat = Number(farm?.latitude) || 19.9231;
  const lng = Number(farm?.longitude) || 74.5464;
  const farmName = farm?.farmName || 'Khemnar Farm';
  const cropType = getCropLabel(farm?.cropType);
  const growthStage = farm?.cropGrowthStage || 'R3 — Beginning Pod';

  // Generate 25 sub-plot grid nodes (5x5 matrix)
  const subPlots = Array.from({ length: 25 }, (_, idx) => {
    const row = Math.floor(idx / 5);
    const col = idx % 5;
    let status = 'healthy'; // default
    let ndvi = (0.72 + (idx % 4) * 0.05).toFixed(2);
    let soilMoisture = (26.5 + (idx % 5) * 0.8).toFixed(1);
    let nLevel = 54 - (idx % 3) * 4;

    if (idx === 7) {
      // Node 7 (Row 1, Col 2 - Red Deficit Anomaly matching screenshot)
      status = 'deficit';
      ndvi = '0.54';
      soilMoisture = '21.4';
      nLevel = 48;
    } else if (idx === 4) {
      status = 'moderate';
      ndvi = '0.62';
    } else if (idx === 20) {
      status = 'wet';
      soilMoisture = '34.2';
    }

    return {
      id: idx,
      row,
      col,
      name: `Sub-Plot ${String.fromCharCode(65 + row)}${col + 1}`,
      status,
      ndvi,
      soilMoisture,
      nLevel,
      ph: (6.6 + (idx % 3) * 0.1).toFixed(1),
      spad: (27.5 + (idx % 4) * 0.4).toFixed(1)
    };
  });

  const activeSubPlot = subPlots[selectedSubPlotIndex] || subPlots[7];

  const handleTriggerMicroDose = () => {
    setActionNotice(`Targeted NPK Fertigation Micro-Dose queued for ${activeSubPlot.name} via UAV ALPHA-1`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div style={styles.container}>
      {/* 1. Header Bar with Layer Filter Selectors */}
      <div style={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={styles.iconBox}>
            <Box size={22} color="#22e58a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={styles.title}>Spatial Digital Twin Engine</h3>
              <span style={styles.badgeLive}>3D SPATIAL</span>
            </div>
            <p style={styles.subtitle}>
              {farmName} — {cropType.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Multi-Layer Selector Buttons */}
        <div style={styles.layerSelectorGroup}>
          <button
            onClick={() => setActiveLayer('ndvi')}
            style={{
              ...styles.layerBtn,
              backgroundColor: activeLayer === 'ndvi' ? 'rgba(34, 229, 138, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: activeLayer === 'ndvi' ? '#22e58a' : 'rgba(255, 255, 255, 0.1)',
              color: activeLayer === 'ndvi' ? '#22e58a' : '#cbd5e1'
            }}
          >
            <Zap size={14} />
            <span>Surface NDVI</span>
          </button>

          <button
            onClick={() => setActiveLayer('moisture')}
            style={{
              ...styles.layerBtn,
              backgroundColor: activeLayer === 'moisture' ? 'rgba(0, 217, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: activeLayer === 'moisture' ? '#00d9ff' : 'rgba(255, 255, 255, 0.1)',
              color: activeLayer === 'moisture' ? '#00d9ff' : '#cbd5e1'
            }}
          >
            <Droplets size={14} />
            <span>Root Moisture</span>
          </button>

          <button
            onClick={() => setActiveLayer('npk')}
            style={{
              ...styles.layerBtn,
              backgroundColor: activeLayer === 'npk' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: activeLayer === 'npk' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
              color: activeLayer === 'npk' ? '#ef4444' : '#cbd5e1'
            }}
          >
            <Sprout size={14} />
            <span>Soil NPK <span style={styles.badgeDeficitText}>Deficit</span></span>
          </button>

          <button
            onClick={() => setActiveLayer('thermal')}
            style={{
              ...styles.layerBtn,
              backgroundColor: activeLayer === 'thermal' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: activeLayer === 'thermal' ? '#f97316' : 'rgba(255, 255, 255, 0.1)',
              color: activeLayer === 'thermal' ? '#f97316' : '#cbd5e1'
            }}
          >
            <Thermometer size={14} />
            <span>Thermal FLIR</span>
          </button>

          <button
            onClick={() => setActiveLayer('sar')}
            style={{
              ...styles.layerBtn,
              backgroundColor: activeLayer === 'sar' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: activeLayer === 'sar' ? '#a855f7' : 'rgba(255, 255, 255, 0.1)',
              color: activeLayer === 'sar' ? '#a855f7' : '#cbd5e1'
            }}
          >
            <Radio size={14} />
            <span>SAR Radar</span>
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div style={styles.toastNotice}>
          <CheckCircle2 size={16} color="#22e58a" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 2. Main Workspace Grid: 3D Viewport (Left) + Sub-Plot Inspector (Right) */}
      <div style={styles.workspaceGrid}>
        {/* Left Column: 3D Viewport with HUD Overlays */}
        <div style={styles.sceneWrapper}>
          <DigitalTwin3DScene
            boundaryGeoJSON={farm?.boundaryGeoJSON}
            centerLat={lat}
            centerLng={lng}
            cropType={farm?.cropType}
            activeLayer={activeLayer}
            viewMode={viewMode}
            autoRotate={autoRotate}
          />

          {/* Top Left HUD */}
          <div style={styles.topLeftHud}>
            <div style={styles.hudPill}>
              <span style={styles.greenDot}></span>
              <span>LAT: {lat.toFixed(4)}°N | LON: {lng.toFixed(4)}°E | ELEV: +84.2m MSL</span>
            </div>
          </div>

          {/* Top Right HUD */}
          <div style={styles.topRightHud}>
            <div style={styles.hudPillCyan}>
              <Navigation size={12} color="#00d9ff" />
              <span>UAV ALPHA-1 ACTIVE | 10m MESH GSD</span>
            </div>
          </div>

          {/* Bottom Left Vigor Gradient Legend */}
          <div style={styles.bottomLeftHud}>
            <div style={styles.gradientLegendBox}>
              <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Vigor Gradient:</span>
              <div style={styles.gradientBar}></div>
              <span style={{ fontSize: '0.725rem', color: '#22e58a', fontWeight: '700' }}>NDVI {activeSubPlot.ndvi}</span>
            </div>
          </div>

          {/* Bottom Right Orbit Control Buttons */}
          <div style={styles.bottomRightHud}>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              style={{
                ...styles.hudIconButton,
                backgroundColor: autoRotate ? 'rgba(34, 229, 138, 0.2)' : 'rgba(7, 14, 11, 0.85)',
                color: autoRotate ? '#22e58a' : '#ffffff'
              }}
              title="Toggle Auto-Orbit"
            >
              <Rotate3d size={16} />
            </button>
            <button
              onClick={() => setViewMode(viewMode === '3d' ? 'ortho' : '3d')}
              style={styles.hudIconButton}
              title="Toggle Perspective / Ortho View"
            >
              <Layers size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Sub-Plot Inspector Panel (Matching Screenshot) */}
        <div style={styles.inspectorPanel}>
          {/* Panel Header */}
          <div style={styles.inspectorHeader}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={18} color="#00d9ff" />
                <h4 style={styles.inspectorTitle}>Sub-Plot Inspector</h4>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span style={styles.badgeB2}>B2</span>
              {activeSubPlot.status === 'deficit' && (
                <span style={styles.badgeDeficit}>Deficit Anomaly</span>
              )}
            </div>
          </div>

          {/* Cultivar & Growth Info */}
          <div style={styles.cultivarBox}>
            <div style={styles.cultivarRow}>
              <span style={styles.labelMuted}>Cultivar</span>
              <strong style={{ color: '#22e58a' }}>{cropType}</strong>
            </div>
            <div style={styles.cultivarRow}>
              <span style={styles.labelMuted}>Growth Stage</span>
              <strong style={{ color: '#00d9ff' }}>{growthStage}</strong>
            </div>
            <div style={styles.cultivarRow}>
              <span style={styles.labelMuted}>Topography</span>
              <strong style={{ color: '#ffffff' }}>+1.2m Ridge</strong>
            </div>
          </div>

          {/* 2x2 Telemetry Cards Grid */}
          <div style={styles.telemetry2x2Grid}>
            <div style={{ ...styles.telCard, borderColor: 'rgba(0, 217, 255, 0.3)' }}>
              <span style={styles.telLabel}>Soil Moisture</span>
              <span style={{ ...styles.telVal, color: '#00d9ff' }}>{activeSubPlot.soilMoisture}% VWC</span>
              <span style={styles.telSub}>Optimal capacity</span>
            </div>

            <div style={{ ...styles.telCard, borderColor: 'rgba(34, 229, 138, 0.3)' }}>
              <span style={styles.telLabel}>Soil pH</span>
              <span style={{ ...styles.telVal, color: '#22e58a' }}>{activeSubPlot.ph} pH</span>
              <span style={styles.telSub}>Neutral / Balanced</span>
            </div>

            <div style={{ ...styles.telCard, borderColor: 'rgba(239, 68, 68, 0.35)' }}>
              <span style={styles.telLabel}>Nitrogen (N)</span>
              <span style={{ ...styles.telVal, color: '#ef4444' }}>{activeSubPlot.nLevel} mg/kg</span>
              <span style={{ ...styles.telSub, color: '#ef4444' }}>-14 kg N/ha Deficit</span>
            </div>

            <div style={{ ...styles.telCard, borderColor: 'rgba(34, 229, 138, 0.3)' }}>
              <span style={styles.telLabel}>Canopy SPAD</span>
              <span style={{ ...styles.telVal, color: '#22e58a' }}>{activeSubPlot.spad} SPAD</span>
              <span style={styles.telSub}>NDVI: {activeSubPlot.ndvi}</span>
            </div>
          </div>

          {/* Interactive Parcel Grid Selector (5x5 Matrix) */}
          <div style={styles.gridMatrixBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff' }}>
                Parcel Grid Selector (Click node)
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>25 Sub-Plots</span>
            </div>

            <div style={styles.grid5x5}>
              {subPlots.map((sp) => {
                const isSelected = sp.id === selectedSubPlotIndex;
                let bgColor = '#15803d'; // Green
                if (sp.status === 'deficit') bgColor = '#ef4444'; // Red deficit
                if (sp.status === 'moderate') bgColor = '#eab308'; // Yellow
                if (sp.status === 'wet') bgColor = '#0284c7'; // Blue

                return (
                  <button
                    key={sp.id}
                    onClick={() => setSelectedSubPlotIndex(sp.id)}
                    style={{
                      ...styles.gridNode,
                      backgroundColor: bgColor,
                      boxShadow: isSelected ? '0 0 0 2px #ffffff, 0 0 10px #22e58a' : 'none'
                    }}
                    title={`${sp.name} - NDVI ${sp.ndvi}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons (Matching Screenshot) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleTriggerMicroDose}
              style={styles.btnPrimaryAction}
            >
              <Zap size={16} />
              <span>Trigger Targeted Micro-Dose</span>
            </button>

            <button
              onClick={() => alert(`UAV ALPHA-1 Mission Path initialized for 25 Sub-Plot scan at ${lat.toFixed(4)}°N`)}
              style={styles.btnSecondaryAction}
            >
              <Eye size={15} />
              <span>View UAV Mission Path</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'rgba(10, 20, 16, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
    paddingBottom: '0.65rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  iconBox: {
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
  title: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  subtitle: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    margin: '2px 0 0 0'
  },
  badgeLive: {
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    color: '#22e58a',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.65rem',
    fontWeight: '700'
  },
  layerSelectorGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap'
  },
  layerBtn: {
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'all 0.2s ease'
  },
  badgeDeficitText: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    padding: '0.05rem 0.3rem',
    borderRadius: '4px',
    fontSize: '0.65rem',
    marginLeft: '0.2rem'
  },
  toastNotice: {
    padding: '0.55rem 0.85rem',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.4)',
    borderRadius: '8px',
    color: '#22e58a',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  workspaceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '1rem',
    alignItems: 'stretch'
  },
  sceneWrapper: {
    position: 'relative',
    height: '490px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    backgroundColor: '#060d0a'
  },
  topLeftHud: {
    position: 'absolute',
    top: '0.75rem',
    left: '0.75rem',
    zIndex: 10
  },
  topRightHud: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    zIndex: 10
  },
  hudPill: {
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    fontSize: '0.725rem',
    color: '#cbd5e1',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  hudPillCyan: {
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    fontSize: '0.725rem',
    color: '#00d9ff',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  greenDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#22e58a'
  },
  bottomLeftHud: {
    position: 'absolute',
    bottom: '0.75rem',
    left: '0.75rem',
    zIndex: 10
  },
  gradientLegendBox: {
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    backdropFilter: 'blur(10px)',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
  },
  gradientBar: {
    width: '90px',
    height: '8px',
    borderRadius: '4px',
    background: 'linear-gradient(to right, #ef4444, #eab308, #22e58a)'
  },
  bottomRightHud: {
    position: 'absolute',
    bottom: '0.75rem',
    right: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    zIndex: 10
  },
  hudIconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: 'rgba(7, 14, 11, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  inspectorPanel: {
    backgroundColor: 'rgba(7, 14, 11, 0.9)',
    borderRadius: '12px',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  inspectorHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  inspectorTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  badgeB2: {
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    color: '#00d9ff',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.68rem',
    fontWeight: '700'
  },
  badgeDeficit: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.68rem',
    fontWeight: '700'
  },
  cultivarBox: {
    backgroundColor: 'rgba(15, 27, 21, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.55rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  cultivarRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.78rem'
  },
  labelMuted: {
    color: '#94a3b8'
  },
  telemetry2x2Grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem'
  },
  telCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.8)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0.55rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem'
  },
  telLabel: {
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  telVal: {
    fontSize: '0.95rem',
    fontWeight: '800'
  },
  telSub: {
    fontSize: '0.68rem',
    color: '#94a3b8'
  },
  gridMatrixBox: {
    backgroundColor: 'rgba(15, 27, 21, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.6rem'
  },
  grid5x5: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '0.3rem'
  },
  gridNode: {
    height: '24px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.15s ease'
  },
  btnPrimaryAction: {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '8px',
    backgroundColor: '#22e58a',
    color: '#060d0a',
    fontWeight: '800',
    fontSize: '0.825rem',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(34, 229, 138, 0.3)'
  },
  btnSecondaryAction: {
    width: '100%',
    padding: '0.55rem',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.78rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  }
};
