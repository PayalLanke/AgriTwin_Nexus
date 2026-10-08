import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  AlertTriangle,
  Bug,
  RefreshCw,
  CheckCircle2,
  Sprout,
  Activity,
  Calendar
} from 'lucide-react';

export default function PestRiskPage() {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await farmService.getFarms();
      const list = data || [];
      setFarms(list);

      if (list.length > 0) {
        const first = list[0];
        setSelectedFarm(first);
        await evaluateFarmRisk(first);
      } else {
        setSelectedFarm(null);
      }
    } catch (err) {
      console.error('Error loading pest risk data:', err);
      setError('Unable to load risk analysis model.');
    } finally {
      setIsLoading(false);
    }
  };

  const evaluateFarmRisk = async (farm) => {
    const indices = getFarmIndicesAnalysis(farm.cropType, farm.sowingDate);
    const weather = await weatherService.getFarmWeather(farm.latitude, farm.longitude);
    const risks = await riskEngine.evaluateFarmRisks(farm, indices, weather);
    setRiskData(risks);
  };

  const handleFarmSelect = async (farmId) => {
    const found = farms.find((f) => String(f.id) === String(farmId));
    if (found) {
      setSelectedFarm(found);
      setIsRefreshing(true);
      try {
        await evaluateFarmRisk(found);
      } catch (err) {
        console.error('Error selecting farm for risk analysis:', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleRefresh = async () => {
    if (!selectedFarm) return;
    setIsRefreshing(true);
    try {
      await evaluateFarmRisk(selectedFarm);
    } catch (err) {
      console.error('Error refreshing risk analysis:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingState}>
        <RefreshCw size={36} color="#fbbf24" className="animate-spin" />
        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.2rem' }}>Evaluating pest & disease risks...</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Analyzing micro-climate triggers and crop vulnerability</p>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div style={styles.emptyStateCard}>
        <Bug size={48} color="#fbbf24" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>No farm registered yet.</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '500px', margin: '0 0 1.5rem 0' }}>
          Register a farm boundary to enable automated pest and disease risk calculations based on crop type and micro-climate conditions.
        </p>
        <Link to="/farms/add" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Register Your First Farm
        </Link>
      </div>
    );
  }

  const daysSinceSowing = selectedFarm?.sowingDate
    ? Math.max(0, Math.floor((new Date() - new Date(selectedFarm.sowingDate)) / (1000 * 60 * 60 * 24)))
    : 'N/A';

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 1. Header & Farm Selector */}
      <div style={styles.headerCard}>
        <div style={styles.headerTitleGroup}>
          <div style={styles.iconCircle}>
            <Bug size={24} color="#fbbf24" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={styles.pageTitle}>Pest & Disease Risk Analysis</h1>
              <span style={styles.sourceTag}>AgriTwin Risk Analytics Engine</span>
            </div>
            <p style={styles.pageSub}>
              Crop-specific pest and disease risk assessment based on micro-climate weather and crop growth stage.
            </p>
          </div>
        </div>

        <div style={styles.headerControls}>
          <div style={styles.selectorWrapper}>
            <label htmlFor="riskFarmSelect" style={styles.selectLabel}>
              Selected Farm:
            </label>
            <select
              id="riskFarmSelect"
              value={selectedFarm?.id || ''}
              onChange={(e) => handleFarmSelect(e.target.value)}
              style={styles.farmSelect}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  {f.farmName} ({f.cropType || 'Crop Unspecified'})
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleRefresh} disabled={isRefreshing} className="btn btn-secondary" style={styles.refreshBtn}>
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh Risk Analysis</span>
          </button>
        </div>
      </div>

      {selectedFarm && (
        <>
          {/* 2. Selected Farm Summary Card */}
          <div style={styles.farmSummaryCard}>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Farm Name</span>
                <span style={styles.summaryValue}>{selectedFarm.farmName}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Crop Type</span>
                <span style={styles.summaryValue}>{selectedFarm.cropType || 'Not specified'}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Days Since Sowing</span>
                <span style={styles.summaryValue}>{daysSinceSowing} Days</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Calculated Area</span>
                <span style={styles.summaryValue}>
                  {Number(selectedFarm.areaHectares || 0).toFixed(2)} Ha ({Number(selectedFarm.areaAcres || 0).toFixed(2)} Acres)
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Latitude</span>
                <span style={styles.summaryValue}>{Number(selectedFarm.latitude).toFixed(6)}° N</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Longitude</span>
                <span style={styles.summaryValue}>{Number(selectedFarm.longitude).toFixed(6)}° E</span>
              </div>
            </div>
          </div>

          {/* 3. Overall Risk Meter Banner */}
          {riskData && (
            <div style={{
              ...styles.riskBanner,
              borderColor: riskData.overallRiskScore > 65 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{
                  ...styles.scoreCircle,
                  borderColor: riskData.overallRiskScore > 65 ? '#ef4444' : '#fbbf24'
                }}>
                  <span style={styles.scoreVal}>{riskData.overallRiskScore}%</span>
                  <span style={styles.scoreSub}>RISK</span>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>
                    OVERALL CROP RISK LEVEL
                  </span>
                  <h3 style={styles.riskLevelText}>{riskData.overallRiskLevel}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                    Monitored Farm: <strong style={{ color: '#ffffff' }}>{selectedFarm.farmName}</strong> ({selectedFarm.cropType || 'Crop'})
                  </p>
                </div>
              </div>

              <div style={styles.statusPill}>
                <ShieldAlert size={16} color={riskData.overallRiskScore > 65 ? '#ef4444' : '#fbbf24'} />
                <span>Crop-Specific Microclimate Assessment</span>
              </div>
            </div>
          )}

          {/* 4. Pest & Disease Risk Breakdown Cards */}
          {riskData && riskData.diseases && (
            <div style={styles.sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h2 style={styles.sectionHeading}>Pathogen & Insect Vector Risk Breakdown</h2>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Evaluated for {selectedFarm.cropType || 'Crop'}
                </span>
              </div>

              <div style={styles.diseaseGrid}>
                {riskData.diseases.map((d, idx) => {
                  const isHigh = d.riskLevel === 'High';
                  const isMod = d.riskLevel === 'Moderate';
                  return (
                    <div key={idx} style={styles.diseaseCard}>
                      <div style={styles.cardHeader}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bug size={18} color={isHigh ? '#ef4444' : isMod ? '#fbbf24' : '#22e58a'} />
                            <h3 style={styles.pathogenName}>{d.name}</h3>
                          </div>
                          <span style={styles.pathogenType}>{d.type}</span>
                        </div>

                        <span style={{
                          ...styles.riskBadge,
                          backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.15)' : isMod ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 229, 138, 0.15)',
                          color: isHigh ? '#ef4444' : isMod ? '#fbbf24' : '#22e58a',
                          borderColor: isHigh ? 'rgba(239, 68, 68, 0.35)' : isMod ? 'rgba(245, 158, 11, 0.35)' : 'rgba(34, 229, 138, 0.35)'
                        }}>
                          {d.probability}% Risk ({d.riskLevel})
                        </span>
                      </div>

                      <div style={styles.cardBody}>
                        <div style={styles.infoBlock}>
                          <span style={styles.infoTitle}>ENVIRONMENTAL MICROCLIMATE TRIGGER</span>
                          <p style={styles.infoText}>{d.triggerReason}</p>
                        </div>

                        <div style={styles.infoBlock}>
                          <span style={styles.infoTitle}>OBSERVED / MODELED SYMPTOMS</span>
                          <p style={styles.infoText}>{d.symptoms}</p>
                        </div>

                        <div style={styles.preventionBox}>
                          <div style={styles.shieldIcon}>
                            <CheckCircle2 size={16} color="#22e58a" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={styles.protocolTitle}>Recommended Agronomic Prescription</span>
                            <p style={styles.protocolText}>{d.prevention}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderTop: '4px solid #fbbf24',
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
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
  sourceTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    color: '#fbbf24',
    border: '1px solid rgba(245, 158, 11, 0.3)',
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
  riskBanner: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid',
    padding: '1.35rem 1.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  scoreCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(7, 14, 11, 0.7)',
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  scoreVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1'
  },
  scoreSub: {
    fontSize: '0.55rem',
    fontWeight: '700',
    color: '#94a3b8'
  },
  riskLevelText: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: '2px 0 0 0'
  },
  statusPill: {
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.45rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    fontSize: '0.78rem',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600'
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
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  diseaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  diseaseCard: {
    backgroundColor: 'rgba(7, 14, 11, 0.65)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  pathogenName: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  pathogenType: {
    fontSize: '0.725rem',
    color: '#00d9ff',
    fontWeight: '600',
    marginTop: '2px',
    display: 'block'
  },
  riskBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '0.725rem',
    fontWeight: '700',
    whiteSpace: 'nowrap'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  infoTitle: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: '#94a3b8'
  },
  infoText: {
    fontSize: '0.825rem',
    color: '#e2e8f0',
    margin: 0,
    lineHeight: '1.4'
  },
  preventionBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem 0.85rem',
    backgroundColor: 'rgba(34, 229, 138, 0.06)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '10px',
    marginTop: '0.25rem'
  },
  shieldIcon: {
    width: '26px',
    height: '26px',
    borderRadius: '6px',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  protocolTitle: {
    fontWeight: '700',
    fontSize: '0.75rem',
    color: '#22e58a',
    display: 'block'
  },
  protocolText: {
    margin: '2px 0 0 0',
    fontSize: '0.775rem',
    color: '#94a3b8',
    lineHeight: '1.4'
  }
};
