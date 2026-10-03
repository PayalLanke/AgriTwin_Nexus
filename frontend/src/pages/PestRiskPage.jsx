<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Thermometer,
  Droplets,
  ArrowRight,
  Radio,
  Flame,
  Activity,
  Crosshair
} from 'lucide-react';

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
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#fbbf24', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          RUNNING BACTERIAL & SPORE DISPERSION RISK SIMULATION...
        </p>
      </div>
    );
  }

=======
import React from 'react';
import { ShieldAlert, Bug, Flame, Zap } from 'lucide-react';

export default function PestRiskPage() {
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
<<<<<<< HEAD
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={styles.title}>Pathogen & Pest Bio-Vulnerability Radar</h1>
            <span style={styles.radarBadge}>
              <Radio size={12} color="#f59e0b" />
              SPORE SPREAD VECTOR MODEL ACTIVE
            </span>
          </div>
          <p style={styles.subtitle}>
            Fuses canopy transpiration deficit, leaf wetness hours, and microclimate isotherms to project fungal & insect outbreaks.
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
          <Bug size={48} color="#f59e0b" />
          <h3 style={{ color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>No Farm Registered</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>Register a farm boundary to trigger pest risk predictions.</p>
        </div>
      ) : (
        <>
          {/* Overall Risk Meter Banner */}
          <div style={styles.riskBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={styles.scoreCircle}>
                <div style={styles.scoreInnerRing}>
                  <span style={styles.scoreVal}>{riskData.overallRiskScore}%</span>
                  <span style={styles.scoreSub}>RISK</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={styles.bannerKicker}>CUMULATIVE CANOPY EPIDEMIOLOGY INDEX</span>
                </div>
                <h3 style={styles.riskLevelText}>{riskData.overallRiskLevel} Threat Level</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.825rem', color: '#94a3b8' }}>
                  Monitored Sector: <b style={{ color: '#ffffff' }}>{selectedFarm.farmName}</b> ({selectedFarm.cropType} Crop)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={styles.warningPill}>
                <AlertTriangle size={14} color="#f87171" />
                <span>ACTIVE BIO-DEFENSE PROTOCOL</span>
              </div>
            </div>
          </div>

          {/* Individual Pathogen & Insect Risk Cards */}
          <div style={styles.diseaseGrid}>
            {riskData.diseases.map((d, idx) => {
              const isHigh = d.riskLevel === 'High';
              return (
                <div key={idx} style={styles.diseaseCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bug size={16} color={isHigh ? '#f87171' : '#fbbf24'} />
                        <h3 style={styles.pathogenName}>{d.name}</h3>
                      </div>
                      <span style={styles.pathogenType}>
                        {d.type.toUpperCase()} VECTOR
                      </span>
                    </div>

                    <span style={{
                      ...styles.riskBadge,
                      background: isHigh ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: isHigh ? '#f87171' : '#fbbf24',
                      border: `1px solid ${isHigh ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
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
                      <span style={styles.infoTitle}>CANOPY SYMPTOMS DETECTED / MODELED</span>
                      <p style={styles.infoText}>{d.symptoms}</p>
                    </div>

                    <div style={styles.preventionBox}>
                      <div style={styles.shieldIcon}>
                        <ShieldAlert size={16} color="#22e58a" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={styles.protocolTitle}>
                          Recommended Agronomic Prescription
                        </span>
                        <p style={styles.protocolText}>
                          {d.prevention}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
=======
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Risk Analysis</h1>
            <span className="badge badge-coming-soon">Coming Soon</span>
          </div>
          <p style={styles.subtitle}>
            Predictive pest outbreak, fungal pathogen, and thermal stress risk models.
          </p>
        </div>
      </div>

      {/* Main Status & Info Card */}
      <div className="card" style={styles.mainCard}>
        <div style={styles.iconContainer}>
          <ShieldAlert size={40} color="var(--color-error)" />
        </div>
        <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
          Risk Evaluation Model Under Development
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: '520px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
          Risk analysis will appear after the risk model is integrated. This module will correlate canopy humidity, temperature degree-days, and vegetation index anomalies to calculate disease risk scores.
        </p>

        <div style={styles.specsGrid}>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bug size={16} color="var(--color-error)" />
              <span style={styles.specTitle}>Pathogen Risk Model</span>
            </div>
            <span style={styles.specDetail}>Rust, Blight, and Mildew spore germination algorithms</span>
          </div>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={16} color="var(--color-warning)" />
              <span style={styles.specTitle}>Thermal Stress</span>
            </div>
            <span style={styles.specDetail}>Canopy temperature differential tracking heat load</span>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="var(--color-primary)" />
              <span style={styles.specTitle}>Action Thresholds</span>
            </div>
            <span style={styles.specDetail}>Early warning notifications before economic injury levels</span>
          </div>
        </div>
      </div>
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
    border: '3px solid rgba(245, 158, 11, 0.15)',
    borderTop: '3px solid #fbbf24',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
<<<<<<< HEAD
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
  radarBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
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
  riskBanner: {
=======
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0'
  },
  mainCard: {
    padding: '3.5rem 2rem',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
<<<<<<< HEAD
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1.5rem',
    padding: '1.75rem',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 27, 21, 0.85) 100%)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  scoreCircle: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.05) 70%)',
    border: '2px solid #ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
  },
  scoreInnerRing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif',
    lineHeight: '1.1'
  },
  scoreSub: {
    fontSize: '0.6rem',
    fontWeight: '700',
    color: '#fca5a5',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  bannerKicker: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: '#fca5a5',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  riskLevelText: {
    margin: '3px 0 0 0',
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  warningPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#f87171',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
=======
    gap: '1rem'
  },
  iconContainer: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-error-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  specsGrid: {
    display: 'grid',
<<<<<<< HEAD
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.25rem'
=======
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    width: '100%',
    maxWidth: '750px',
    marginTop: '1.5rem'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  specBox: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
<<<<<<< HEAD
    gap: '1.125rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  pathogenName: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  pathogenType: {
    fontSize: '0.7rem',
    color: '#00d9ff',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif',
    marginTop: '2px',
    display: 'block'
  },
  riskBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.65rem',
    borderRadius: '9999px',
    fontSize: '0.725rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  infoTitle: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  infoText: {
    fontSize: '0.825rem',
    color: '#e2e8f0',
    margin: 0,
    lineHeight: '1.45'
  },
  preventionBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(34, 229, 138, 0.06)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    marginTop: '0.25rem'
  },
  shieldIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(34, 229, 138, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  protocolTitle: {
    fontWeight: '700',
    fontSize: '0.775rem',
    color: '#22e58a',
    fontFamily: 'Space Grotesk, sans-serif',
    display: 'block'
  },
  protocolText: {
    margin: '3px 0 0 0',
    fontSize: '0.775rem',
    color: '#94a3b8',
    lineHeight: '1.4'
=======
    gap: '0.5rem'
  },
  specTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    textTransform: 'uppercase'
  },
  specDetail: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
