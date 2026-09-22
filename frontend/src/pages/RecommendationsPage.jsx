import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { recommendationEngine } from '../services/recommendationEngine';
import { Sparkles, CheckCircle2, Clock, Droplets, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

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
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Generating Agronomic Advisory Recommendations...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Rule-Based Agronomic Advisories</h1>
            <span className="badge badge-teal">AI Digital Twin Rules Active</span>
          </div>
          <p style={styles.subtitle}>
            Actionable precision recommendations generated from satellite vegetation vigor and micro-climate.
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
          <p>Register a farm boundary to receive precision agronomic advisories.</p>
        </div>
      ) : (
        <div style={styles.advisoriesList}>
          {advisories.map((adv) => {
            const isCompleted = adv.status === 'Completed';
            return (
              <div
                key={adv.id}
                className="card"
                style={{
                  ...styles.advCard,
                  backgroundColor: isCompleted ? '#f8fafc' : '#ffffff',
                  opacity: isCompleted ? 0.75 : 1
                }}
              >
                <div style={styles.advHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <Sparkles size={20} color="var(--color-primary)" />
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-teal)', textTransform: 'uppercase' }}>
                        {adv.category}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{adv.title}</h3>
                    </div>
                  </div>
                  <span className={`badge ${adv.badgeClass}`}>{adv.priority} Priority</span>
                </div>

                <p style={styles.advDesc}>{adv.description}</p>

                <div style={styles.advFooter}>
                  <div style={styles.impactBadge}>
                    <ShieldCheck size={16} color="var(--color-primary)" />
                    <span>Projected Impact: <b>{adv.impact}</b></span>
                  </div>

                  <button
                    type="button"
                    className={isCompleted ? 'btn btn-secondary' : 'btn btn-primary'}
                    onClick={() => toggleAdvisoryStatus(adv.id)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{isCompleted ? 'Mark Pending' : 'Mark Completed'}</span>
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
  advisoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  advCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'all 0.2s ease'
  },
  advHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  },
  advDesc: {
    fontSize: '0.875rem',
    color: '#334155',
    margin: 0,
    lineHeight: '1.5'
  },
  advFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '0.5rem'
  },
  impactBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8125rem',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-primary-light)',
    padding: '0.375rem 0.75rem',
    borderRadius: 'var(--radius-md)'
  }
};
