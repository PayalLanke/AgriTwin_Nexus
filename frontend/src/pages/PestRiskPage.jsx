import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { ShieldAlert, AlertTriangle, CheckCircle2, Bug, Thermometer, Droplets, ArrowRight } from 'lucide-react';

export default function PestRiskPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0]);
        const indices = getFarmIndicesAnalysis(data[0].cropType, data[0].sowingDate);
        const weather = await weatherService.getFarmWeather(data[0].latitude, data[0].longitude);
        const risks = await riskEngine.evaluateFarmRisks(data[0], indices, weather);
        setRiskData(risks);
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
      const weather = await weatherService.getFarmWeather(f.latitude, f.longitude);
      const risks = await riskEngine.evaluateFarmRisks(f, indices, weather);
      setRiskData(risks);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Running Pest & Disease Risk Engine...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Pest & Disease Risk Analytics</h1>
            <span className="badge badge-amber">Pathogen Prediction Engine</span>
          </div>
          <p style={styles.subtitle}>
            Fuses canopy moisture, leaf wetness, and ambient micro-climate to forecast pest outbreaks.
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
          <p>Register a farm boundary to trigger pest risk predictions.</p>
        </div>
      ) : (
        <>
          {/* Overall Risk Meter Banner */}
          <div className="card" style={styles.riskBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={styles.scoreCircle}>
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff' }}>
                  {riskData.overallRiskScore}%
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Overall Pathogen Risk Score
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.3rem' }}>{riskData.overallRiskLevel}</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Field: <b>{selectedFarm.farmName}</b> ({selectedFarm.cropType})
                </p>
              </div>
            </div>

            <span className={`badge ${riskData.overallBadge}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              {riskData.overallRiskLevel}
            </span>
          </div>

          {/* Individual Pathogen & Insect Risk Cards */}
          <div style={styles.diseaseGrid}>
            {riskData.diseases.map((d, idx) => {
              const isHigh = d.riskLevel === 'High';
              return (
                <div key={idx} className="card" style={styles.diseaseCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{d.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: '600' }}>
                        {d.type}
                      </span>
                    </div>
                    <span className={isHigh ? 'badge badge-danger' : 'badge badge-primary'}>
                      {d.probability}% Risk ({d.riskLevel})
                    </span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.infoBlock}>
                      <span style={styles.infoTitle}>ENVIRONMENTAL TRIGGER</span>
                      <p style={styles.infoText}>{d.triggerReason}</p>
                    </div>

                    <div style={styles.infoBlock}>
                      <span style={styles.infoTitle}>IDENTIFIED SYMPTOMS</span>
                      <p style={styles.infoText}>{d.symptoms}</p>
                    </div>

                    <div style={styles.preventionBox}>
                      <ShieldAlert size={16} color="var(--color-primary)" />
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '0.775rem', color: 'var(--color-primary)' }}>
                          Recommended Treatment Protocol
                        </span>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.775rem', color: '#334155' }}>
                          {d.prevention}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
  riskBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '1.5rem'
  },
  scoreCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)'
  },
  diseaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.25rem'
  },
  diseaseCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  infoTitle: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.05em'
  },
  infoText: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-main)',
    margin: 0
  },
  preventionBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.625rem',
    padding: '0.75rem',
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid #bbf7d0',
    borderRadius: 'var(--radius-md)'
  }
};
