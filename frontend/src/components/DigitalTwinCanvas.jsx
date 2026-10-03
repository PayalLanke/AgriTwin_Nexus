import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Activity, 
  Droplets, 
  Zap, 
  Thermometer, 
  Radar, 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  Focus, 
  Send, 
  Compass, 
  AlertTriangle,
  CheckCircle2,
  Crosshair
} from 'lucide-react';
import DigitalTwin3DScene from './DigitalTwin3DScene';

export default function DigitalTwinCanvas({ farm, indices, onTriggerAction }) {
  const [activeLayer, setActiveLayer] = useState('vigor'); // 'vigor', 'moisture', 'npk', 'thermal', 'sar'
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'ortho'
  const [selectedCell, setSelectedCell] = useState({ row: 1, col: 1 }); // Default to Cell B2
  const [autoRotate, setAutoRotate] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  // 5x5 sub-plot spatial micro-grid matrix
  const gridRows = 5;
  const gridCols = 5;

  const getCellData = (r, c) => {
    const isTargetedB2 = (r === 1 && c === 1);
    const isStressedD4 = (r === 3 && c === 3);

    let cellVigor = 0.82;
    if (isTargetedB2) cellVigor = 0.54;
    else if (isStressedD4) cellVigor = 0.42;
    else if (r === 0 || c === 0) cellVigor = 0.76;
    else if (r === 2 && c === 2) cellVigor = 0.85;

    let cellMoisture = 34.2;
    if (isTargetedB2) cellMoisture = 28.1;
    else if (isStressedD4) cellMoisture = 19.4;

    let cellChloro = cellVigor * 52.0;

    return {
      row: r,
      col: c,
      zoneName: `Sub-Plot ${String.fromCharCode(65 + r)}${c + 1}`,
      cellCode: `${String.fromCharCode(65 + r)}${c + 1}`,
      vigor: cellVigor,
      moisture: cellMoisture,
      chlorophyll: Math.round(cellChloro * 10) / 10,
      ph: 6.7,
      nitrogenStatus: isTargetedB2 ? '-14 kg N/ha Deficit' : 'Optimal (+4 kg/ha)',
      isDeficit: isTargetedB2,
      isStressed: isStressedD4,
      elevation: isTargetedB2 ? '+1.2m Ridge' : '+0.6m Flat',
      coords: `45.${3050 + r * 5}°N, 9.${4100 + c * 5}°E`,
      status: isTargetedB2 ? 'Deficit Anomaly' : isStressedD4 ? 'Hydration Stress' : 'Optimal Vigor'
    };
  };

  const currentCellData = getCellData(selectedCell.row, selectedCell.col);

  const handleCellClick = (cell) => {
    setSelectedCell(cell);
    setActionFeedback(null);
  };

  const handleTriggerMicroDose = () => {
    setActionFeedback(`Targeted micro-dose mission dispatched to Sub-Plot ${currentCellData.cellCode} via UAV Alpha-1.`);
    setTimeout(() => setActionFeedback(null), 5000);
    if (onTriggerAction) {
      onTriggerAction({ action: 'micro-dose', cell: currentCellData });
    }
  };

  return (
    <div className="digital-twin-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      background: 'rgba(11, 21, 17, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-glow)'
    }}>
      {/* Top 3D Depth Layer Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        paddingBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(34, 229, 138, 0.15)',
            border: '1px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <Box size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                Spatial Digital Twin Engine
              </h3>
              <span className="badge badge-primary font-mono text-[10px]">
                3D SPATIAL
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              {farm ? `${farm.farmName || farm.name || 'Green Valley Farm'} • ${farm.cropType || farm.crop_type || 'Soybean'}` : 'Green Valley Farm • Plot B (Soybean Pioneer 93Y05)'}
            </p>
          </div>
        </div>

        {/* Depth Layer Segmented Controls */}
        <div className="tabs-container" style={{ flexWrap: 'wrap' }}>
          <button
            className={`tab-btn ${activeLayer === 'vigor' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('vigor')}
            title="Surface NDVI multi-spectral canopy reflectance"
          >
            <Activity size={14} />
            <span>Surface NDVI</span>
          </button>
          <button
            className={`tab-btn ${activeLayer === 'moisture' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('moisture')}
            title="Root zone volumetric water content (VWC%)"
          >
            <Droplets size={14} />
            <span>Root Moisture</span>
          </button>
          <button
            className={`tab-btn ${activeLayer === 'npk' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('npk')}
            title="Soil Nitrogen, Phosphorus & Potassium distribution"
          >
            <Zap size={14} />
            <span>Soil NPK</span>
            <span style={{ fontSize: '9px', background: 'rgba(239, 68, 68, 0.25)', color: '#ffb4ab', padding: '1px 4px', borderRadius: '4px', fontWeight: 'bold' }}>
              Deficit
            </span>
          </button>
          <button
            className={`tab-btn ${activeLayer === 'thermal' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('thermal')}
            title="Infrared Thermal Canopy (FLIR)"
          >
            <Thermometer size={14} />
            <span>Thermal FLIR</span>
          </button>
          <button
            className={`tab-btn ${activeLayer === 'sar' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('sar')}
            title="Copernicus Sentinel-1 Synthetic Aperture Radar Coherence"
          >
            <Radar size={14} />
            <span>SAR Radar</span>
          </button>
        </div>
      </div>

      {/* Main Twin Workspace: 3D Viewport with Floating Overlays */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: '1.25rem',
        minHeight: '520px'
      }}>
        {/* 3D Viewport Canvas Container */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          background: 'radial-gradient(circle at 50% 50%, #0d1e18 0%, #060d0a 100%)',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.7)'
        }}>
          {/* Top Geodetic Coordinates Ribbon */}
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            fontSize: '0.7rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.04em'
          }}>
            <div style={{
              background: 'rgba(7, 14, 11, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block', boxShadow: '0 0 6px #22e58a' }}></span>
              <span>LAT: 45°18'22"N | LON: 9°24'40"E</span>
              <span style={{ color: 'var(--color-border)' }}>|</span>
              <span style={{ color: 'var(--color-secondary)' }}>ELEV: +84.2m MSL</span>
            </div>

            <div style={{
              background: 'rgba(7, 14, 11, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ color: 'var(--color-primary)' }}>UAV ALPHA-1 ACTIVE</span>
              <span style={{ color: 'var(--color-border)' }}>|</span>
              <span>10m MESH GSD</span>
            </div>
          </div>

          {/* Interactive 3D Three.js Scene */}
          <DigitalTwin3DScene
            selectedCell={selectedCell}
            onSelectCell={handleCellClick}
            activeLayer={activeLayer}
            viewMode={viewMode}
            autoRotate={autoRotate}
          />

          {/* Floating Camera Controls (Right-Bottom corner) */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            zIndex: 10,
            background: 'rgba(11, 21, 17, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.35rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="tab-btn"
              style={{
                width: '34px',
                height: '34px',
                padding: 0,
                justifyContent: 'center',
                background: autoRotate ? 'var(--color-primary-light)' : 'transparent',
                color: autoRotate ? 'var(--color-primary)' : 'var(--color-text-main)'
              }}
              title={autoRotate ? 'Pause 360° Orbit' : 'Enable 360° Orbit Auto-Rotation'}
            >
              <Rotate3d size={16} />
            </button>
            <button
              onClick={() => setViewMode(viewMode === '3d' ? 'ortho' : '3d')}
              className="tab-btn"
              style={{
                width: '34px',
                height: '34px',
                padding: 0,
                justifyContent: 'center',
                background: viewMode === 'ortho' ? 'rgba(0, 217, 255, 0.2)' : 'transparent',
                color: viewMode === 'ortho' ? 'var(--color-secondary)' : 'var(--color-text-main)'
              }}
              title="Toggle 3D Perspective / 2D Top-Down Orthographic"
            >
              <Layers size={16} />
            </button>
            <button
              onClick={() => {
                setSelectedCell({ row: 1, col: 1 });
              }}
              className="tab-btn"
              style={{
                width: '34px',
                height: '34px',
                padding: 0,
                justifyContent: 'center',
                color: 'var(--color-text-main)'
              }}
              title="Target Sub-Plot B2 (Focus Beacon)"
            >
              <Focus size={16} />
            </button>
          </div>

          {/* Bottom Interactive Legend */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 10,
            background: 'rgba(7, 14, 11, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.4rem 0.8rem',
            fontSize: '0.75rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Vigor Gradient:</span>
            <div style={{
              width: '80px',
              height: '6px',
              borderRadius: '4px',
              background: 'linear-gradient(to right, #ef4444, #f59e0b, #22e58a)'
            }}></div>
            <span style={{ color: '#22e58a', fontWeight: 'bold' }}>NDVI 0.85</span>
          </div>
        </div>

        {/* Right Floating Sub-Plot Inspector & Telemetry Panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'rgba(15, 28, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-glow)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '0.75rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Crosshair size={16} color="var(--color-secondary)" />
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>
                  Sub-Plot Inspector
                </h4>
                <span className="badge badge-teal font-mono">
                  {currentCellData.cellCode}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                {currentCellData.coords}
              </p>
            </div>

            <span className={`badge ${currentCellData.isDeficit ? 'badge-danger' : 'badge-primary'}`}>
              {currentCellData.status}
            </span>
          </div>

          {/* Profile Specs */}
          <div style={{
            background: 'rgba(23, 34, 29, 0.7)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Cultivar</span>
              <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>Glycine max (Soybean)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Growth Stage</span>
              <span style={{ fontWeight: '600', color: 'var(--color-secondary)' }}>R3 — Beginning Pod</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Topography</span>
              <span style={{ color: 'var(--color-text-main)' }}>{currentCellData.elevation}</span>
            </div>
          </div>

          {/* 4 Telemetry Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.65rem'
          }}>
            <div style={{
              background: 'rgba(34, 44, 40, 0.7)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                <span>Soil Moisture</span>
                <Droplets size={12} color="var(--color-secondary)" />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {currentCellData.moisture}% <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>VWC</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-primary)' }}>Optimal capacity</div>
            </div>

            <div style={{
              background: 'rgba(34, 44, 40, 0.7)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                <span>Soil pH</span>
                <Activity size={12} color="var(--color-tertiary)" />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-tertiary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {currentCellData.ph} <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>pH</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)' }}>Neutral / Balanced</div>
            </div>

            <div style={{
              background: 'rgba(34, 44, 40, 0.7)',
              border: currentCellData.isDeficit ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                <span>Nitrogen (N)</span>
                <AlertTriangle size={12} color={currentCellData.isDeficit ? '#ef4444' : '#22e58a'} />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: currentCellData.isDeficit ? '#ef4444' : '#22e58a', fontFamily: 'Space Grotesk, sans-serif' }}>
                48 <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>mg/kg</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: currentCellData.isDeficit ? '#ef4444' : 'var(--color-primary)' }}>
                {currentCellData.nitrogenStatus}
              </div>
            </div>

            <div style={{
              background: 'rgba(34, 44, 40, 0.7)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                <span>Canopy SPAD</span>
                <Zap size={12} color="var(--color-primary)" />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                {currentCellData.chlorophyll} <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>SPAD</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-secondary)' }}>
                NDVI: {currentCellData.vigor}
              </div>
            </div>
          </div>

          {/* 5x5 Matrix Cell Selector Map */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              <span>Parcel Grid Selector (Click node)</span>
              <span className="font-mono">25 Sub-Plots</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '4px',
              background: 'rgba(7, 14, 11, 0.6)',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)'
            }}>
              {Array.from({ length: gridRows }).map((_, r) =>
                Array.from({ length: gridCols }).map((_, c) => {
                  const isSel = selectedCell.row === r && selectedCell.col === c;
                  const isDef = (r === 1 && c === 1);
                  const isStr = (r === 3 && c === 3);

                  let bg = 'rgba(34, 229, 138, 0.45)';
                  if (isDef) bg = 'rgba(239, 68, 68, 0.8)';
                  else if (isStr) bg = 'rgba(245, 158, 11, 0.8)';
                  else if (r === 2 && c === 2) bg = 'rgba(34, 229, 138, 0.9)';

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick({ row: r, col: c })}
                      style={{
                        height: '18px',
                        borderRadius: '3px',
                        background: bg,
                        border: isSel ? '2px solid #00d9ff' : 'none',
                        boxShadow: isSel ? '0 0 8px #00d9ff' : 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title={`Sub-Plot ${String.fromCharCode(65 + r)}${c + 1}`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Action Feedback Notification */}
          {actionFeedback && (
            <div style={{
              background: 'rgba(34, 229, 138, 0.15)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--color-primary)'
            }}>
              <CheckCircle2 size={16} />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Action Triggers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
            <button
              onClick={handleTriggerMicroDose}
              className="btn cyber-gradient-btn"
              style={{ width: '100%', padding: '0.7rem' }}
            >
              <Send size={15} />
              <span>Trigger Targeted Micro-Dose</span>
            </button>
            <button
              onClick={() => {
                setActionFeedback(`UAV Alpha-1 route mapped to Sub-Plot ${currentCellData.cellCode} coordinates.`);
                setTimeout(() => setActionFeedback(null), 4000);
              }}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.6rem' }}
            >
              <Compass size={15} />
              <span>View UAV Mission Path</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
