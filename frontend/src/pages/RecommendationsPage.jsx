import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { recommendationEngine } from '../services/recommendationEngine';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Droplets,
  Zap,
  ShieldCheck,
  ArrowRight,
  Radio,
  Send,
  Sliders,
  Cpu
} from 'lucide-react';

export default function RecommendationsPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdvisories();
  }, []);

  const loadAdvisories = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0]);
        const indices = getFarmIndicesAnalysis(data[0].cropType, data[0].sowingDate);
        const weather = await weatherService.getFarmWeather(data[0].latitude, data[0].longitude);
        const risks = await riskEngine.evaluateFarmRisks(data[0], indices, weather);
        const advs = await recommendationEngine.getAdvisories(data[0], indices, weather, risks);
        setAdvisories(advs);
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
      const advs = await recommendationEngine.getAdvisories(f, indices, weather, risks);
      setAdvisories(advs);
      setIsLoading(false);
    }
  };

  const toggleAdvisoryStatus = (id) => {
    setAdvisories(
      advisories.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'Completed' ? 'Pending Action' : 'Completed' }
          : a
      )
    );
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          SYNTHESIZING EXPERT AGRONOMIC DECISION TREES...
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
            <h1 style={styles.title}>Autonomous Agronomic Action Protocols</h1>
            <span style={styles.rulesBadge}>
              <Cpu size={12} color="#22e58a" />
              DIGITAL TWIN EXPERT SYSTEM ACTIVE
            </span>
          </div>
          <p style={styles.subtitle}>
            Machine-generated precision interventions balancing canopy transpiration, soil VWC depletion, and fungal pressure.
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
          <Sparkles size={48} color="#22e58a" />
          <h3 style={{ color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>No Farm Registered</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>Register a farm boundary to receive precision agronomic advisories.</p>
        </div>
      ) : (
        <div style={styles.advisoriesList}>
          {advisories.map((adv) => {
            const isCompleted = adv.status === 'Completed';
            const isHigh = adv.priority === 'High';
            return (
              <div
                key={adv.id}
                style={{
                  ...styles.advCard,
                  borderColor: isCompleted
                    ? 'rgba(255, 255, 255, 0.08)'
                    : isHigh
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(34, 229, 138, 0.25)',
                  opacity: isCompleted ? 0.6 : 1
                }}
              >
                <div style={styles.advHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      ...styles.advIconCircle,
                      background: isCompleted ? 'rgba(255, 255, 255, 0.05)' : isHigh ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 229, 138, 0.15)',
                      borderColor: isCompleted ? 'rgba(255, 255, 255, 0.1)' : isHigh ? 'rgba(245, 158, 11, 0.35)' : 'rgba(34, 229, 138, 0.35)'
                    }}>
                      <Sparkles size={18} color={isCompleted ? '#64748b' : isHigh ? '#fbbf24' : '#22e58a'} />
                    </div>
                    <div>
                      <span style={styles.advCategory}>
                        {adv.category} PROTOCOL
                      </span>
                      <h3 style={styles.advTitle}>{adv.title}</h3>
                    </div>
                  </div>

                  <span style={{
                    ...styles.priorityBadge,
                    background: isCompleted ? 'rgba(255, 255, 255, 0.05)' : isHigh ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 229, 138, 0.12)',
                    color: isCompleted ? '#94a3b8' : isHigh ? '#fbbf24' : '#22e58a',
                    border: `1px solid ${isCompleted ? 'rgba(255, 255, 255, 0.15)' : isHigh ? 'rgba(245, 158, 11, 0.35)' : 'rgba(34, 229, 138, 0.35)'}`
                  }}>
                    {isCompleted ? 'ACTION DISPATCHED' : `${adv.priority.toUpperCase()} PRIORITY`}
                  </span>
                </div>

                <p style={styles.advDesc}>{adv.description}</p>

                <div style={styles.advFooter}>
                  <div style={styles.impactBadge}>
                    <ShieldCheck size={16} color="#22e58a" />
                    <span>Expected Agronomic ROI: <b style={{ color: '#22e58a' }}>{adv.impact}</b></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAdvisoryStatus(adv.id)}
                    style={{
                      ...styles.actionBtn,
                      background: isCompleted ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, #22e58a 0%, #00d9ff 100%)',
                      color: isCompleted ? '#94a3b8' : '#070e0b',
                      border: isCompleted ? '1px solid rgba(255, 255, 255, 0.15)' : 'none'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{isCompleted ? 'Re-open Prescription' : 'Execute & Dispatch UAV'}</span>
                  </button>
                </div>
              </div>
            );
          })}
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
  rulesBadge: {
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
  advisoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  advCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.2s ease'
  },
  advHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  advIconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid'
  },
  advCategory: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#00d9ff',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif',
    display: 'block'
  },
  advTitle: {
    margin: '2px 0 0 0',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  priorityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.65rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  advDesc: {
    fontSize: '0.875rem',
    color: '#cbd5e1',
    margin: 0,
    lineHeight: '1.55'
  },
  advFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingTop: '0.5rem'
  },
  impactBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.825rem',
    color: '#94a3b8',
    backgroundColor: 'rgba(34, 229, 138, 0.06)',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    padding: '0.4rem 0.85rem',
    borderRadius: '10px'
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    borderRadius: '12px',
    fontSize: '0.825rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};
