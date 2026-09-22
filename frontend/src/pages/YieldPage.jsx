import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { yieldEngine } from '../services/yieldEngine';
import { TrendingUp, Layers, CheckCircle2, Award, Scale, HelpCircle } from 'lucide-react';

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
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Calculating Crop Biomass Integral & Yield Model...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Yield Estimation & Harvest Calculator</h1>
            <span className="badge badge-primary">NDVI Biomass Model</span>
          </div>
          <p style={styles.subtitle}>
            Projects harvest output in Metric Tons & Quintals based on cumulative satellite NDVI integrals.
          </p>
        </div>

        {farms.length > 0 && (
          <select
            value={selectedFarm?.id || ''}
            onChange={(e) => handleFarmSelect(e.target.value)}
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
          <p>Register a farm boundary to calculate harvest yield projections.</p>
        </div>
      ) : (
        <>
          {/* Main Yield Projection KPI Banner */}
          <div style={styles.kpiGrid}>
            <div className="card" style={styles.kpiCard}>
              <TrendingUp size={28} color="var(--color-primary)" />
              <div>
                <span style={styles.kpiLabel}>Projected Yield / Hectare</span>
                <div style={styles.kpiVal}>{yieldData.projectedYieldPerHa} Tons/Ha</div>
                <span style={styles.kpiHelper}>Base Potential: {yieldData.basePotentialPerHa} Tons/Ha</span>
              </div>
            </div>

            <div className="card" style={styles.kpiCard}>
              <Scale size={28} color="var(--color-teal)" />
              <div>
                <span style={styles.kpiLabel}>Total Metric Output</span>
                <div style={styles.kpiVal}>{yieldData.totalYieldTons} Metric Tons</div>
                <span style={styles.kpiHelper}>Equivalent to {yieldData.totalYieldQuintals} Quintals</span>
              </div>
            </div>

            <div className="card" style={styles.kpiCard}>
              <Layers size={28} color="#f59e0b" />
              <div>
                <span style={styles.kpiLabel}>Registered Field Area</span>
                <div style={styles.kpiVal}>{yieldData.farmAreaHectares} Ha</div>
                <span style={styles.kpiHelper}>{selectedFarm.cropType} Crop Field</span>
              </div>
            </div>
          </div>

          {/* Confidence Interval Range Card */}
          <div className="card" style={styles.rangeCard}>
            <div style={styles.cardHeader}>
              <Award size={20} color="var(--color-primary)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Harvest Projection Confidence Range</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: '600' }}>
                  {yieldData.confidenceLevel}
                </span>
              </div>
            </div>

            <div style={styles.rangeGrid}>
              <div style={styles.rangeBox}>
                <span style={styles.rangeTitle}>MINIMUM HARVEST</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#64748b' }}>
                  {yieldData.harvestRange.minTons} Tons
                </span>
                <span style={styles.rangeSub}>Conservative Estimate</span>
              </div>

              <div style={{ ...styles.rangeBox, backgroundColor: 'var(--color-primary-light)', border: '1px solid #bbf7d0' }}>
                <span style={{ ...styles.rangeTitle, color: 'var(--color-primary)' }}>EXPECTED HARVEST</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                  {yieldData.harvestRange.expectedTons} Tons
                </span>
                <span style={{ fontSize: '0.725rem', color: 'var(--color-teal)', fontWeight: '700' }}>
                  {yieldData.totalYieldQuintals} Quintals
                </span>
              </div>

              <div style={styles.rangeBox}>
                <span style={styles.rangeTitle}>MAXIMUM POTENTIAL</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>
                  {yieldData.harvestRange.maxTons} Tons
                </span>
                <span style={styles.rangeSub}>Optimized Conditions</span>
              </div>
            </div>
          </div>

          {/* Biomass Contribution Factor Table */}
          <div className="card" style={styles.factorsCard}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Biomass Integral Contributing Factors</h3>
            <div style={styles.factorsList}>
              {yieldData.yieldFactors.map((f, idx) => (
                <div key={idx} style={styles.factorRow}>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{f.factor}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: '700', color: f.impact === 'Positive' ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                      {f.contribution}
                    </span>
                    <span className={f.impact === 'Positive' ? 'badge badge-primary' : 'badge badge-danger'}>
                      {f.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1.25rem'
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem'
  },
  kpiLabel: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase'
  },
  kpiVal: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1.2'
  },
  kpiHelper: {
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  rangeCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  },
  rangeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  },
  rangeBox: {
    padding: '1.25rem',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#f8fafc',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.25rem'
  },
  rangeTitle: {
    fontSize: '0.675rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    color: '#64748b'
  },
  rangeSub: {
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  factorsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  factorsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem'
  },
  factorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)'
  }
};
