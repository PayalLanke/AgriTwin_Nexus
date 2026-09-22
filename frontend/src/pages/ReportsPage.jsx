import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { yieldEngine } from '../services/yieldEngine';
import { generateDigitalTwinReport } from '../utils/reportExporter';
import { FileText, Download, Printer, Sprout, ShieldCheck, Layers, Calendar, CheckCircle2 } from 'lucide-react';

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
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Compiling Agronomic Digital Twin Audit Report...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Digital Twin Audit Reports</h1>
            <span className="badge badge-primary">PDF Export Ready</span>
          </div>
          <p style={styles.subtitle}>
            Generate publication-quality agronomic reports containing boundary maps, indices, risks, and yield forecasts.
          </p>
        </div>

        {farms.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => {
                const f = farms.find((farm) => String(farm.id) === String(e.target.value));
                if (f) compileFarmReport(f);
              }}
              style={styles.selectInput}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmName} ({f.cropType})
                </option>
              ))}
            </select>

            <button type="button" className="btn btn-primary" onClick={handleExportPDF}>
              <Printer size={16} />
              <span>Export PDF Report</span>
            </button>
          </div>
        )}
      </div>

      {!selectedFarm ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Farm Registered</h3>
          <p>Register a farm boundary to generate digital twin reports.</p>
        </div>
      ) : (
        <div style={styles.previewContainer} className="card">
          <div style={styles.docHeader}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                AgriTwin Nexus Platform &bull; Precision Audit
              </span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem' }}>{selectedFarm.farmName}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Field Coordinates: {selectedFarm.latitude.toFixed(5)}° N, {selectedFarm.longitude.toFixed(5)}° E
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-teal">Sentinel-2 10m Certified</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div style={styles.docSection}>
            <h4 style={styles.sectionTitle}>1. Farm & Spatial Specifications</h4>
            <div style={styles.docGrid}>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Crop Type</span>
                <span style={styles.docVal}>{selectedFarm.cropType}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Sowing Date</span>
                <span style={styles.docVal}>{selectedFarm.sowingDate}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Calculated Area</span>
                <span style={styles.docVal}>{selectedFarm.areaHectares} Ha ({selectedFarm.areaAcres} Acres)</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Status</span>
                <span style={styles.docVal}>{selectedFarm.status}</span>
              </div>
            </div>
          </div>

          <div style={styles.docSection}>
            <h4 style={styles.sectionTitle}>2. Multispectral Vegetation Indices</h4>
            <div style={styles.docGrid}>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>NDVI (Canopy Vigor)</span>
                <span style={{ ...styles.docVal, color: 'var(--color-primary)' }}>{reportState?.indices?.current?.NDVI}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>NDRE (Chlorophyll)</span>
                <span style={{ ...styles.docVal, color: 'var(--color-teal)' }}>{reportState?.indices?.current?.NDRE}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>EVI (Enhanced Index)</span>
                <span style={styles.docVal}>{reportState?.indices?.current?.EVI}</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>SAVI (Soil Adjusted)</span>
                <span style={styles.docVal}>{reportState?.indices?.current?.SAVI}</span>
              </div>
            </div>
          </div>

          <div style={styles.docSection}>
            <h4 style={styles.sectionTitle}>3. Harvest Yield Projection & Risk Summary</h4>
            <div style={styles.docGrid}>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Projected Yield / Ha</span>
                <span style={styles.docVal}>{reportState?.yieldData?.projectedYieldPerHa} Metric Tons/Ha</span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Total Expected Harvest</span>
                <span style={{ ...styles.docVal, color: 'var(--color-primary)' }}>
                  {reportState?.yieldData?.totalYieldTons} Tons ({reportState?.yieldData?.totalYieldQuintals} Quintals)
                </span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Pest & Disease Risk</span>
                <span style={{ ...styles.docVal, color: 'var(--color-danger)' }}>
                  {reportState?.risks?.overallRiskScore}% ({reportState?.risks?.overallRiskLevel})
                </span>
              </div>
              <div style={styles.docItem}>
                <span style={styles.docLabel}>Confidence Level</span>
                <span style={styles.docVal}>{reportState?.yieldData?.confidenceLevel}</span>
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
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '2rem'
  },
  docHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '1rem',
    borderBottom: '2px solid var(--color-primary)'
  },
  docSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#f8fafc',
    padding: '1.25rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)'
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--color-teal)',
    margin: 0,
    paddingBottom: '0.375rem',
    borderBottom: '1px solid #e2e8f0'
  },
  docGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  docItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  docLabel: {
    fontSize: '0.725rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '600'
  },
  docVal: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--color-text-main)'
  }
};
