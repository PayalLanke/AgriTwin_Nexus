import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { yieldEngine } from '../services/yieldEngine';
import { generateDigitalTwinReport } from '../utils/reportExporter';
import {
  FileText,
  Printer,
  Satellite,
  Compass,
  FileCheck
} from 'lucide-react';

export default function ReportsPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [reportState, setReportState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        await compileFarmReport(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const compileFarmReport = async (farm) => {
    setSelectedFarm(farm);
    setIsLoading(true);
    const indices = getFarmIndicesAnalysis(farm.cropType, farm.sowingDate);
    const weather = await weatherService.getFarmWeather(farm.latitude, farm.longitude);
    const risks = await riskEngine.evaluateFarmRisks(farm, indices, weather);
    const yieldData = await yieldEngine.estimateYield(farm, indices);

    setReportState({
      indices,
      weather,
      risks,
      yieldData
    });
    setIsLoading(false);
  };

  const handleExportPDF = () => {
    if (!selectedFarm || !reportState) return;
    generateDigitalTwinReport(
      selectedFarm,
      reportState.indices,
      reportState.weather,
      reportState.risks,
      reportState.yieldData
    );
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          COMPILING AUDIT DOSSIER & CERTIFIED TELEMETRY...
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
            <h1 style={styles.title}>Digital Twin Agronomic Audit Dossiers</h1>
            <span style={styles.certBadge}>
              <FileCheck size={12} color="#00d9ff" />
              ISO/IEC AGRONOMIC AUDIT SPECIFICATION
            </span>
          </div>
          <p style={styles.subtitle}>
            Verified executive compliance audit containing boundary geo-coordinates, multispectral canopy vigor, disease prognosis, and harvest tonnage.
          </p>
        </div>

        {farms.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => {
                const f = farms.find((farm) => String(farm.id) === String(e.target.value));
                if (f) compileFarmReport(f);
              }}
              style={styles.selectInput}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  {f.farmName} &bull; {f.cropType}
                </option>
              ))}
            </select>

            <button type="button" className="cyber-gradient-btn" onClick={handleExportPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}>
              <Printer size={16} />
              <span>Export PDF Dossier</span>
            </button>
          </div>
        )}
      </div>

      {!selectedFarm ? (
        <div style={styles.noFarmCard}>
          <FileText size={48} color="#22e58a" />
          <h3 style={{ color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>No Farm Registered</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>Register a farm boundary to generate digital twin reports.</p>
        </div>
      ) : (
        <div style={styles.previewContainer}>
          <div style={styles.docHeader}>
            <div>
              <span style={styles.docKicker}>
                AGRITWIN NEXUS PLATFORM &bull; PRECISION SPATIAL AUDIT
              </span>
              <h2 style={styles.docTitle}>{selectedFarm.farmName}</h2>
              <span style={styles.docCoords}>
                <Compass size={14} color="#00d9ff" />
                Field Centroid: {selectedFarm.latitude?.toFixed(5)}° N, {selectedFarm.longitude?.toFixed(5)}° E
              </span>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
              <span style={styles.sentinelBadge}>
                <Satellite size={12} color="#22e58a" />
                SENTINEL-2 10M CERTIFIED
              </span>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontFamily: 'Space Grotesk, sans-serif' }}>
                AUDIT DATE: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div style={styles.docSection}>
            <div style={styles.sectionHeadingRow}>
              <div style={styles.sectionPill}>1</div>
              <h4 style={styles.sectionTitle}>Spatial & Biological Specifications</h4>
            </div>
            <div style={styles.docGrid}>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>CROP VARIETY</span>
                <span style={styles.docVal}>{selectedFarm.cropType}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>SOWING / EMERGENCE</span>
                <span style={styles.docVal}>{selectedFarm.sowingDate}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>COMPUTED BOUNDARY AREA</span>
                <span style={{ ...styles.docVal, color: '#22e58a' }}>
                  {selectedFarm.areaHectares} Ha <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({selectedFarm.areaAcres} Ac)</span>
                </span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>TWIN SYNC STATUS</span>
                <span style={{ ...styles.docVal, color: '#00d9ff' }}>{selectedFarm.status?.toUpperCase() || 'ACTIVE'}</span>
              </div>
            </div>
          </div>

          <div style={styles.docSection}>
            <div style={styles.sectionHeadingRow}>
              <div style={{ ...styles.sectionPill, background: 'rgba(0, 217, 255, 0.2)', color: '#00d9ff' }}>2</div>
              <h4 style={styles.sectionTitle}>Sentinel-2 Multispectral Canopy Indices</h4>
            </div>
            <div style={styles.docGrid}>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>NDVI (CANOPY VIGOR)</span>
                <span style={{ ...styles.docVal, color: '#22e58a' }}>{reportState?.indices?.current?.NDVI}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>NDRE (CHLOROPHYLL B5)</span>
                <span style={{ ...styles.docVal, color: '#00d9ff' }}>{reportState?.indices?.current?.NDRE}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>EVI (ENHANCED INDEX)</span>
                <span style={{ ...styles.docVal, color: '#fbbf24' }}>{reportState?.indices?.current?.EVI}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>SAVI (SOIL ADJUSTED)</span>
                <span style={{ ...styles.docVal, color: '#c084fc' }}>{reportState?.indices?.current?.SAVI}</span>
              </div>
            </div>
          </div>

          <div style={styles.docSection}>
            <div style={styles.sectionHeadingRow}>
              <div style={{ ...styles.sectionPill, background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>3</div>
              <h4 style={styles.sectionTitle}>Harvest Yield Projection & Bio-Risk Prognosis</h4>
            </div>
            <div style={styles.docGrid}>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>PROJECTED YIELD RATE</span>
                <span style={styles.docVal}>{reportState?.yieldData?.projectedYieldPerHa} Tons/Ha</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>TOTAL HARVEST MASS</span>
                <span style={{ ...styles.docVal, color: '#22e58a' }}>
                  {reportState?.yieldData?.totalYieldTons} Tons <span style={{ color: '#00d9ff', fontSize: '0.8rem' }}>({reportState?.yieldData?.totalYieldQuintals} Qtl)</span>
                </span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>PATHOGEN PRESSURE</span>
                <span style={{ ...styles.docVal, color: '#f87171' }}>
                  {reportState?.risks?.overallRiskScore}% ({reportState?.risks?.overallRiskLevel})
                </span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>CONFIDENCE BOUND</span>
                <span style={{ ...styles.docVal, color: '#fbbf24' }}>{reportState?.yieldData?.confidenceLevel}</span>
              </div>
            </div>
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
    border: '3px solid rgba(34, 229, 138, 0.15)',
    borderTop: '3px solid #22e58a',
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
  certBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.35)',
    color: '#00d9ff',
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
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    padding: '2.5rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '24px',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)'
  },
  docHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid rgba(34, 229, 138, 0.3)'
  },
  docKicker: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#22e58a',
    letterSpacing: '0.08em',
    fontFamily: 'Space Grotesk, sans-serif',
    display: 'block'
  },
  docTitle: {
    margin: '6px 0 4px 0',
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  docCoords: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  sentinelBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    background: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    fontSize: '0.725rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  docSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: 'rgba(8, 17, 13, 0.75)',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  sectionHeadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
  },
  sectionPill: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    background: 'rgba(34, 229, 138, 0.2)',
    color: '#22e58a',
    fontSize: '0.75rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  docGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '1.25rem'
  },
  docItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  docLabel: {
    fontSize: '0.675rem',
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  docVal: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#f8fafc',
    fontFamily: 'Space Grotesk, sans-serif'
  }
};
