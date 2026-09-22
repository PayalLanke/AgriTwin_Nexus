import React, { useState } from 'react';
import { Cpu, Activity, Droplets, Thermometer, Zap, Layers, AlertCircle } from 'lucide-react';

export default function DigitalTwinCanvas({ farm, indices }) {
  const [activeLayer, setActiveLayer] = useState('vigor'); // 'vigor', 'moisture', 'chlorophyll', 'stress'
  const [selectedCell, setSelectedCell] = useState({ row: 2, col: 3 });

  // Generate 5x5 sub-plot spatial micro-grid matrix representing the field
  const gridRows = 5;
  const gridCols = 5;

  const getCellData = (r, c) => {
    // Spatial variance math simulation
    const distFromCenter = Math.sqrt((r - 2) ** 2 + (c - 2) ** 2);
    const isStressZone = (r === 1 && c === 4) || (r === 4 && c === 1);
    
    let cellVigor = 0.88 - distFromCenter * 0.06;
    if (isStressZone) cellVigor = 0.38;
    cellVigor = Math.max(0.2, Math.min(0.95, cellVigor));

    let cellMoisture = 34.5 - distFromCenter * 2.1;
    if (isStressZone) cellMoisture = 18.2;

    let cellChloro = cellVigor * 48.0;

    return {
      row: r,
      col: c,
      zoneName: `Sub-Plot ${String.fromCharCode(65 + r)}${c + 1}`,
      vigor: Math.round(cellVigor * 100) / 100,
      moisture: Math.round(cellMoisture * 10) / 10,
      chlorophyll: Math.round(cellChloro * 10) / 10,
      temp: Math.round((27.5 + distFromCenter * 0.4) * 10) / 10,
      nitrogenStatus: isStressZone ? 'Deficient' : 'Optimal',
      status: isStressZone ? 'Stress Warning' : cellVigor > 0.75 ? 'Healthy Vigor' : 'Moderate'
    };
  };

  const currentCellData = getCellData(selectedCell.row, selectedCell.col);

  const getCellColor = (r, c) => {
    const data = getCellData(r, c);
    if (activeLayer === 'vigor') {
      if (data.vigor < 0.45) return '#ef4444'; // Red
      if (data.vigor < 0.7) return '#f59e0b'; // Amber
      return '#22c55e'; // Leaf Green
    }
    if (activeLayer === 'moisture') {
      if (data.moisture < 22) return '#f97316';
      return '#0284c7';
    }
    if (activeLayer === 'chlorophyll') {
      if (data.chlorophyll < 25) return '#f43f5e';
      return '#10b981';
    }
    // Water stress
    return data.vigor < 0.5 ? '#dc2626' : '#0f766e';
  };

  return (
    <div style={styles.container}>
      {/* Layer Mode Switcher Header */}
      <div style={styles.controlHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={20} color="var(--color-primary)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Spatial Digital Twin Matrix</h3>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-btn ${activeLayer === 'vigor' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('vigor')}
          >
            <Activity size={14} />
            <span>Canopy Vigor</span>
          </button>
          <button
            className={`tab-btn ${activeLayer === 'moisture' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('moisture')}
          >
            <Droplets size={14} />
            <span>Soil Moisture</span>
          </button>
          <button
            className={`tab-btn ${activeLayer === 'chlorophyll' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveLayer('chlorophyll')}
          >
            <Zap size={14} />
            <span>Chlorophyll</span>
          </button>
        </div>
      </div>

      <div style={styles.canvasGridWrapper}>
        {/* Left: 5x5 Micro-Zone Spatial Grid */}
        <div style={styles.gridCanvas}>
          {Array.from({ length: gridRows }).map((_, r) => (
            <div key={r} style={styles.gridRow}>
              {Array.from({ length: gridCols }).map((_, c) => {
                const isSelected = selectedCell.row === r && selectedCell.col === c;
                const color = getCellColor(r, c);

                return (
                  <div
                    key={c}
                    style={{
                      ...styles.gridCell,
                      backgroundColor: color,
                      outline: isSelected ? '3px solid #000' : '1px solid rgba(255,255,255,0.4)',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onClick={() => setSelectedCell({ row: r, col: c })}
                    title={`Sub-Plot ${String.fromCharCode(65 + r)}${c + 1} (Click to inspect micro-telemetry)`}
                  >
                    <span style={styles.cellLabel}>
                      {String.fromCharCode(65 + r)}{c + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          <div style={styles.gridLegend}>
            <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: '600' }}>Spatial Legend:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.725rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#22c55e', borderRadius: '2px' }} /> Optimal
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#f59e0b', borderRadius: '2px' }} /> Moderate
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '2px' }} /> Stress Alert
              </span>
            </div>
          </div>
        </div>

        {/* Right: Selected Sub-Plot Real-Time Telemetry Inspector */}
        <div style={styles.telemetryPanel} className="card">
          <div style={styles.telemetryHeader}>
            <div>
              <span style={styles.subTitleLabel}>MICRO-ZONE TELEMETRY</span>
              <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                {currentCellData.zoneName}
              </h4>
            </div>
            <span
              className={`badge ${
                currentCellData.status === 'Healthy Vigor' ? 'badge-primary' : 'badge-danger'
              }`}
            >
              {currentCellData.status}
            </span>
          </div>

          <div style={styles.metricsList}>
            <div style={styles.metricRow}>
              <div style={styles.metricLabelGroup}>
                <Activity size={16} color="var(--color-primary)" />
                <span>NDVI Vigor Score</span>
              </div>
              <span style={styles.metricValue}><b>{currentCellData.vigor}</b> / 1.0</span>
            </div>

            <div style={styles.metricRow}>
              <div style={styles.metricLabelGroup}>
                <Droplets size={16} color="#0284c7" />
                <span>Volumetric Soil Moisture</span>
              </div>
              <span style={styles.metricValue}><b>{currentCellData.moisture}%</b> VWC</span>
            </div>

            <div style={styles.metricRow}>
              <div style={styles.metricLabelGroup}>
                <Zap size={16} color="#10b981" />
                <span>Est. Chlorophyll Density</span>
              </div>
              <span style={styles.metricValue}><b>{currentCellData.chlorophyll}</b> µg/cm²</span>
            </div>

            <div style={styles.metricRow}>
              <div style={styles.metricLabelGroup}>
                <Thermometer size={16} color="#f59e0b" />
                <span>Canopy Temperature</span>
              </div>
              <span style={styles.metricValue}><b>{currentCellData.temp}°C</b></span>
            </div>

            <div style={styles.metricRow}>
              <div style={styles.metricLabelGroup}>
                <Layers size={16} color="var(--color-purple)" />
                <span>Nitrogen Level</span>
              </div>
              <span style={{ fontWeight: '700', color: currentCellData.nitrogenStatus === 'Deficient' ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                {currentCellData.nitrogenStatus}
              </span>
            </div>
          </div>

          {currentCellData.status === 'Stress Warning' && (
            <div style={styles.stressAlertBox}>
              <AlertCircle size={16} color="var(--color-danger)" />
              <span><b>Zone Advisory</b>: Localized canopy stress detected in {currentCellData.zoneName}. Variable-rate nitrogen and micro-irrigation recommended.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    width: '100%'
  },
  controlHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  canvasGridWrapper: {
    display: 'grid',
    gridTemplateColumns: '1.3fr 1fr',
    gap: '1.5rem',
    alignItems: 'start'
  },
  gridCanvas: {
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    boxShadow: 'var(--shadow-md)'
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '0.625rem'
  },
  gridCell: {
    aspectRatio: '1/1',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  cellLabel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
  },
  gridLegend: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #1e293b'
  },
  telemetryPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  telemetryHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  },
  subTitleLabel: {
    fontSize: '0.675rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: 'var(--color-text-secondary)'
  },
  metricsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f1f5f9'
  },
  metricLabelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#475569',
    fontWeight: '500'
  },
  metricValue: {
    color: 'var(--color-text-main)'
  },
  stressAlertBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.625rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: '#b91c1c',
    fontSize: '0.775rem',
    lineHeight: '1.4'
  }
};
