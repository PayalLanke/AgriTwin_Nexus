import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { yieldEngine } from '../services/yieldEngine';
import {
  TrendingUp,
  Layers,
  Award,
  Scale,
  Sparkles,
  BarChart3
} from 'lucide-react';

export default function YieldPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadYieldData();
  }, []);

  const loadYieldData = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0]);
        const indices = getFarmIndicesAnalysis(data[0].cropType, data[0].sowingDate);
        const y = await yieldEngine.estimateYield(data[0], indices);
        setYieldData(y);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFarmSelect = async (farmId) => {
    const f = farms.find((farm) => String(farm.id) === String(farmId));
    if (f) {
      setSelectedFarm(f);
      setIsLoading(true);
      const indices = getFarmIndicesAnalysis(f.cropType, f.sowingDate);
      const y = await yieldEngine.estimateYield(f, indices);
      setYieldData(y);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          INTEGRATING CANOPY BIOMASS TIME-SERIES & HARVEST MODEL...
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
            <h1 style={styles.title}>Predictive Yield Engine & Biomass Integral</h1>
            <span style={styles.modelBadge}>
              <Sparkles size={12} color="#22e58a" />
              INTEGRAL NDVI CROP ACCUMULATION MODEL
            </span>
          </div>
          <p style={styles.subtitle}>
            Simulates photosynthetic photosynthetically active radiation (fAPAR) over 120-day growth cycles to forecast harvest output.
          </p>
        </div>

        {farms.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk, sans-serif' }}>TARGET PLOT:</span>
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => handleFarmSelect(e.target.value)}
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
          <TrendingUp size={48} color="#22e58a" />
          <h3 style={{ color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>No Farm Registered</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>Register a farm boundary to calculate harvest yield projections.</p>
        </div>
      ) : yieldData && (
        <>
          {/* Main Yield Projection KPI Banner */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={{ ...styles.iconCircle, background: 'rgba(34, 229, 138, 0.1)', borderColor: 'rgba(34, 229, 138, 0.3)' }}>
                <TrendingUp size={24} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>PROJECTED YIELD / HECTARE</span>
                <div style={{ ...styles.kpiVal, color: '#22e58a' }}>
                  {yieldData.projectedYieldPerHa} <span style={{ fontSize: '0.9rem' }}>Tons/Ha</span>
                </div>
                <span style={styles.kpiHelper}>Benchmark Potential: {yieldData.basePotentialPerHa} Tons/Ha</span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.iconCircle, background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                <Scale size={24} color="#00d9ff" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>TOTAL METRIC HARVEST MASS</span>
                <div style={{ ...styles.kpiVal, color: '#00d9ff' }}>
                  {yieldData.totalYieldTons} <span style={{ fontSize: '0.9rem' }}>Metric Tons</span>
                </div>
                <span style={styles.kpiHelper}>Equivalent to {yieldData.totalYieldQuintals} Quintals</span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.iconCircle, background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                <Layers size={24} color="#fbbf24" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>REGISTERED SURFACE AREA</span>
                <div style={{ ...styles.kpiVal, color: '#fbbf24' }}>
                  {yieldData.farmAreaHectares} <span style={{ fontSize: '0.9rem' }}>Ha</span>
                </div>
                <span style={styles.kpiHelper}>{selectedFarm.cropType} Standard Plot</span>
              </div>
            </div>
          </div>

          {/* Confidence Interval Range Card */}
          {yieldData.harvestRange && (
            <div style={styles.rangeCard}>
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ ...styles.iconCircle, width: '36px', height: '36px', background: 'rgba(34, 229, 138, 0.1)', borderColor: 'rgba(34, 229, 138, 0.25)' }}>
                    <Award size={18} color="#22e58a" />
                  </div>
                  <div>
                    <h3 style={styles.sectionHeading}>Monte Carlo Harvest Confidence Bounds</h3>
                    <span style={{ fontSize: '0.725rem', color: '#00d9ff', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif' }}>
                      CONFIDENCE INTERVAL: {yieldData.confidenceLevel?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.rangeGrid}>
                <div style={styles.rangeBox}>
                  <span style={styles.rangeTitle}>CONSERVATIVE BOUND (-1σ)</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#94a3b8', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {yieldData.harvestRange.minTons} Tons
                  </span>
                  <span style={styles.rangeSub}>Water deficit & thermal stress penalty</span>
                </div>

                <div style={{ ...styles.rangeBox, background: 'linear-gradient(135deg, rgba(34, 229, 138, 0.15) 0%, rgba(15, 27, 21, 0.9) 100%)', borderColor: 'rgba(34, 229, 138, 0.45)', boxShadow: '0 0 25px rgba(34, 229, 138, 0.15)' }}>
                  <span style={{ ...styles.rangeTitle, color: '#22e58a' }}>EXPECTED DIGITAL TWIN HARVEST</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {yieldData.harvestRange.expectedTons} Tons
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#00d9ff', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {yieldData.totalYieldQuintals} Quintals Market Projection
                  </span>
                </div>

                <div style={styles.rangeBox}>
                  <span style={{ ...styles.rangeTitle, color: '#38bdf8' }}>OPTIMIZED MAXIMUM (+1σ)</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {yieldData.harvestRange.maxTons} Tons
                  </span>
                  <span style={styles.rangeSub}>Full fertigation & zero pathogen damage</span>
                </div>
              </div>
            </div>
          )}

          {/* Biomass Contribution Factor Table */}
          {yieldData.yieldFactors && (
            <div style={styles.factorsCard}>
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ ...styles.iconCircle, width: '36px', height: '36px', background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.25)' }}>
                    <BarChart3 size={18} color="#00d9ff" />
                  </div>
                  <div>
                    <h3 style={styles.sectionHeading}>Physiological Biomass Weighting Matrix</h3>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Relative factor sensitivities on cumulative yield</span>
                  </div>
                </div>
              </div>

              <div style={styles.factorsList}>
                {yieldData.yieldFactors.map((f, idx) => {
                  const isPos = f.impact === 'Positive';
                  return (
                    <div key={idx} style={styles.factorRow}>
                      <span style={{ fontWeight: '600', fontSize: '0.875rem', color: '#f8fafc' }}>{f.factor}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                          fontWeight: '800',
                          fontSize: '0.9rem',
                          fontFamily: 'Space Grotesk, sans-serif',
                          color: isPos ? '#22e58a' : '#f87171'
                        }}>
                          {f.contribution}
                        </span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          fontFamily: 'Space Grotesk, sans-serif',
                          background: isPos ? 'rgba(34, 229, 138, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: isPos ? '#22e58a' : '#f87171',
                          border: `1px solid ${isPos ? 'rgba(34, 229, 138, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                        }}>
                          {f.impact.toUpperCase()}
                        </span>
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
  modelBadge: {
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
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem'
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.125rem',
    padding: '1.25rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  iconCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid'
  },
  kpiLabel: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  kpiVal: {
    fontSize: '1.5rem',
    fontWeight: '800',
    fontFamily: 'Space Grotesk, sans-serif',
    lineHeight: '1.2',
    margin: '2px 0'
  },
  kpiHelper: {
    fontSize: '0.725rem',
    color: '#64748b'
  },
  rangeCard: {
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
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  sectionHeading: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  rangeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem'
  },
  rangeBox: {
    padding: '1.25rem',
    borderRadius: '14px',
    backgroundColor: 'rgba(8, 17, 13, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.35rem'
  },
  rangeTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#64748b',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  rangeSub: {
    fontSize: '0.725rem',
    color: '#94a3b8'
  },
  factorsCard: {
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
  factorsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  factorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1.25rem',
    backgroundColor: 'rgba(8, 17, 13, 0.75)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  }
};
