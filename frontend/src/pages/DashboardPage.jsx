import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { yieldEngine } from '../services/yieldEngine';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import {
  Sprout,
  PlusCircle,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  Cpu,
  Satellite,
  CloudSun,
  ShieldAlert,
  TrendingUp,
  Sparkles,
  Play,
  Pause,
  FastForward,
  TrendingDown,
  Bug,
  Radar,
  ArrowRight,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [activeFarm, setActiveFarm] = useState(null);
  const [indices, setIndices] = useState(null);
  const [weather, setWeather] = useState(null);
  const [risks, setRisks] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4D Bio-Dynamic Simulation Timeline state
  const [isPlayingSim, setIsPlayingSim] = useState(false);
  const [simSpeed, setSimSpeed] = useState('4x');
  const [simStep, setSimStep] = useState('today'); // 'd28', 'd21', 'd14', 'd07', 'today', 'p3d', 'p7d'
  const [droneFeedback, setDroneFeedback] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        const farm = data[0];
        setActiveFarm(farm);
        const idx = getFarmIndicesAnalysis(farm.cropType, farm.sowingDate);
        setIndices(idx);
        const w = await weatherService.getFarmWeather(farm.latitude, farm.longitude);
        setWeather(w);
        const r = await riskEngine.evaluateFarmRisks(farm, idx, w);
        setRisks(r);
        const y = await yieldEngine.estimateYield(farm, idx);
        setYieldData(y);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const totalFarms = farms.length;
  const totalAreaHectares = farms.reduce((acc, f) => acc + (f.areaHectares || 0), 0);

  const handleSelectFarm = (farm) => {
    setActiveFarm(farm);
    const idx = getFarmIndicesAnalysis(farm.cropType, farm.sowingDate);
    setIndices(idx);
  };

  const handleTimelineStep = (step) => {
    setSimStep(step);
  };

  const handleExecuteDronePlan = () => {
    setDroneFeedback('Autonomous UAV Alpha-1 dispatched to Sub-Plot B2. Spray trajectory armed for 48h window.');
    setTimeout(() => setDroneFeedback(null), 6000);
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 3D Mission Control Welcome & Farm Switcher Ribbon */}
      <div style={styles.topRibbon} className="hud-glow">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={styles.ribbonTitle}>
                Spatial 3D Digital Twin Command
              </h1>
              <span className="badge badge-teal font-mono">
                ENGINE ACTIVE
              </span>
            </div>
            <p style={styles.ribbonSubtitle}>
              Multi-spectral Sentinel-2 Earth observation, 3D sub-plot terrain elevation, and autonomous drone fleet telemetry.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {farms.length > 1 && (
            <select
              value={activeFarm?.id || ''}
              onChange={(e) => {
                const f = farms.find(farm => farm.id === e.target.value);
                if (f) handleSelectFarm(f);
              }}
              style={styles.farmSelect}
            >
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.crop_type || 'Crop'})</option>
              ))}
            </select>
          )}

          <Link to="/farms/add" className="btn btn-primary cyber-gradient-btn" style={styles.actionBtn}>
            <PlusCircle size={16} />
            <span>Add Field Parcel</span>
          </Link>
        </div>
      </div>

      {/* KPI Telemetry Cards Row */}
      <div style={styles.statsGrid}>
        {/* Metric 1: Registered Fields */}
        <div className="card" style={styles.statCard}>
          <div style={styles.statIconBadge}>
            <Sprout size={20} color="var(--color-primary)" />
          </div>
          <div>
            <span style={styles.statLabel}>Active Field Parcels</span>
            <div style={styles.statValue}>{isLoading ? '...' : totalFarms}</div>
            <span style={styles.statHelper}>
              {totalAreaHectares > 0 ? `${totalAreaHectares.toFixed(2)} Ha under twin monitoring` : '25 sub-plots active'}
            </span>
          </div>
        </div>

        {/* Metric 2: Canopy NDVI Vigor */}
        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.statIconBadge, backgroundColor: 'rgba(0, 217, 255, 0.15)', borderColor: 'var(--color-secondary)' }}>
            <Cpu size={20} color="var(--color-secondary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={styles.statLabel}>Canopy Health (NDVI)</span>
            <div style={{ ...styles.statValue, color: 'var(--color-primary)' }}>
              {isLoading ? '...' : (indices?.current?.NDVI || 0.74)}
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginLeft: '0.4rem', fontWeight: 'normal' }}>
                Peak 0.85
              </span>
            </div>
            <span style={{ ...styles.statHelper, color: 'var(--color-secondary)' }}>
              {activeFarm ? `${activeFarm.name} • ${indices?.current?.healthStatus || 'Healthy Vigor'}` : 'Plot B Soybean Pioneer'}
            </span>
          </div>
        </div>

        {/* Metric 3: Root Hydration & Weather Delta-T */}
        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.statIconBadge, backgroundColor: 'rgba(136, 255, 118, 0.15)', borderColor: 'var(--color-tertiary)' }}>
            <CloudSun size={20} color="var(--color-tertiary)" />
          </div>
          <div>
            <span style={styles.statLabel}>Spray Suitability (Delta-T)</span>
            <div style={{ ...styles.statValue, color: 'var(--color-tertiary)' }}>
              3.8 <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Optimal</span>
            </div>
            <span style={styles.statHelper}>
              {weather?.current?.tempCelsius || 27.4}°C • {weather?.current?.humidityPercent || 65}% RH • Wind 11 km/h
            </span>
          </div>
        </div>

        {/* Metric 4: Pest Vulnerability Index */}
        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.statIconBadge, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <ShieldAlert size={20} color="#ffb4ab" />
          </div>
          <div>
            <span style={styles.statLabel}>Pest / Pathogen Risk</span>
            <div style={{ ...styles.statValue, color: '#fbbf24' }}>
              {isLoading ? '...' : (risks ? `${risks.overallRiskScore}%` : '18%')}
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginLeft: '0.4rem', fontWeight: 'bold' }}>
                LOW
              </span>
            </div>
            <span style={styles.statHelper}>
              Spodoptera: 3 spores/trap (Suppressed)
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section: PRIMARY 3D DIGITAL TWIN CANVAS (DESIGN 02 HERO) */}
      <div style={{ position: 'relative' }}>
        <DigitalTwinCanvas
          farm={activeFarm}
          indices={indices}
          onTriggerAction={() => handleExecuteDronePlan()}
        />

        {/* Floating 4D Bio-Dynamic Simulation Timeline Bar */}
        <div style={styles.timelineBar} className="hud-glow">
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsPlayingSim(!isPlayingSim)}
              className="cyber-gradient-btn"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={isPlayingSim ? 'Pause Timeline' : 'Play Timeline Simulation'}
            >
              {isPlayingSim ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', display: 'block', lineHeight: 1.2 }}>
                Digital Twin Timeline
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                4D Bio-Dynamic Simulation
              </span>
            </div>

            <div style={{ height: '20px', width: '1px', background: 'var(--color-border-subtle)', margin: '0 0.25rem' }} />

            {/* Speed Pills */}
            <div style={{ display: 'flex', background: 'rgba(23, 34, 29, 0.7)', borderRadius: '6px', padding: '2px', border: '1px solid var(--color-border-subtle)' }}>
              {['1x', '4x', '24x'].map(speed => (
                <button
                  key={speed}
                  onClick={() => setSimSpeed(speed)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: simSpeed === speed ? 'var(--color-primary-light)' : 'transparent',
                    color: simSpeed === speed ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: simSpeed === speed ? '700' : 'normal',
                    cursor: 'pointer',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Checkpoints */}
          <div style={{ flex: 1, maxWidth: '480px', padding: '0 0.5rem' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '4px', background: 'rgba(34, 44, 40, 0.9)', borderRadius: '4px', display: 'flex' }}>
                <div style={{ width: '65%', height: '100%', background: 'linear-gradient(to right, var(--color-border), var(--color-primary))', borderRadius: '4px 0 0 4px' }} />
                <div style={{ width: '35%', height: '100%', background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', borderRadius: '0 4px 4px 0' }} />
              </div>

              {/* Step Markers */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                {['d28', 'd21', 'd14', 'd07'].map(step => (
                  <div key={step} style={{ width: '8px', height: '8px', borderRadius: '50%', background: simStep === step ? 'var(--color-secondary)' : 'var(--color-text-muted)' }} />
                ))}
                {/* Active LIVE TWIN TODAY */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    boxShadow: '0 0 12px #22e58a',
                    border: '2px solid #05140d'
                  }} />
                  <span style={{
                    position: 'absolute',
                    top: '-20px',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    background: 'var(--color-primary)',
                    color: '#05140d',
                    padding: '1px 5px',
                    borderRadius: '4px'
                  }}>
                    LIVE
                  </span>
                </div>
                {['p3d', 'p7d'].map(step => (
                  <div key={step} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-secondary)' }} />
                ))}
              </div>
            </div>

            {/* Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
              <span onClick={() => handleTimelineStep('d28')} style={{ cursor: 'pointer' }}>D-28</span>
              <span onClick={() => handleTimelineStep('d21')} style={{ cursor: 'pointer' }}>D-21</span>
              <span onClick={() => handleTimelineStep('d14')} style={{ cursor: 'pointer' }}>D-14</span>
              <span onClick={() => handleTimelineStep('d07')} style={{ cursor: 'pointer' }}>D-07</span>
              <span onClick={() => handleTimelineStep('today')} style={{ color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer' }}>TODAY</span>
              <span onClick={() => handleTimelineStep('p3d')} style={{ color: 'var(--color-secondary)', cursor: 'pointer' }}>+3D</span>
              <span onClick={() => handleTimelineStep('p7d')} style={{ color: 'var(--color-secondary)', cursor: 'pointer' }}>+7D BioSim</span>
            </div>
          </div>

          {/* Active Overlay Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(23, 34, 29, 0.7)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}>
            <Radio size={14} color="var(--color-primary)" />
            <span style={{ color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>NDVI + UAV Geofence</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', boxShadow: '0 0 6px #22e58a' }} />
          </div>
        </div>
      </div>

      {/* Drone Feedback Banner */}
      {droneFeedback && (
        <div style={{
          background: 'rgba(34, 229, 138, 0.15)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--color-primary)',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: '600' }}>{droneFeedback}</span>
        </div>
      )}

      {/* Bottom Auxiliary Telemetry Modules */}
      <div style={styles.modulesGrid}>
        {/* Module 1: Predictive Neural Crop Engine */}
        <div className="card" style={styles.moduleCard}>
          <div style={styles.moduleHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Neural Crop Engine (BioNeural-7)</h3>
            </div>
            <span className="badge badge-primary font-mono text-[10px]">94.6% CONF</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0 0.85rem 0' }}>
            7-day crop stress projection indicates a <strong>-61%</strong> reduction in nitrogen deficit post-spray.
          </p>

          {/* Stepped Micro-Chart Projection */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '6px', height: '60px', padding: '0 0.5rem', background: 'rgba(7, 14, 11, 0.5)', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '100%', height: '42px', background: 'rgba(239, 68, 68, 0.7)', borderRadius: '3px 3px 0 0' }} />
              <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>D0</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '100%', height: '36px', background: 'rgba(239, 68, 68, 0.6)', borderRadius: '3px 3px 0 0' }} />
              <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>D+1</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '100%', height: '24px', background: 'rgba(245, 158, 11, 0.7)', borderRadius: '3px 3px 0 0' }} />
              <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>D+2</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '100%', height: '18px', background: 'rgba(34, 229, 138, 0.7)', borderRadius: '3px 3px 0 0' }} />
              <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>D+3</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '100%', height: '14px', background: 'rgba(34, 229, 138, 0.85)', borderRadius: '3px 3px 0 0' }} />
              <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>D+4</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '100%', height: '10px', background: 'var(--color-primary)', borderRadius: '3px 3px 0 0', boxShadow: '0 0 6px #22e58a' }} />
              <span style={{ fontSize: '9px', color: 'var(--color-primary)', fontWeight: 'bold', fontFamily: 'JetBrains Mono, monospace' }}>D+7</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)' }}>UAV Alpha-1 Assigned</span>
            <button
              onClick={handleExecuteDronePlan}
              className="btn btn-primary cyber-gradient-btn"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            >
              <span>Execute Plan</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Module 2: Satellite Telemetry Ingestion */}
        <div className="card" style={styles.moduleCard}>
          <div style={styles.moduleHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Satellite size={18} color="var(--color-secondary)" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Copernicus Sentinel-2 MSI</h3>
            </div>
            <Link to="/satellite" className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}>
              <span>View Band Layers</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0 0.85rem 0' }}>
            Multispectral 10m bands calibrated with Sen2Cor Level-2A bottom-of-atmosphere reflectance.
          </p>

          <div style={styles.miniStatsRow}>
            <div>
              <span style={styles.miniLabel}>NDVI Index</span>
              <span style={styles.miniVal}>{indices?.current?.NDVI || 0.74}</span>
            </div>
            <div>
              <span style={styles.miniLabel}>NDRE Red-Edge</span>
              <span style={styles.miniVal}>{indices?.current?.NDRE || 0.48}</span>
            </div>
            <div>
              <span style={styles.miniLabel}>SAVI Soil Adj.</span>
              <span style={styles.miniVal}>{indices?.current?.SAVI || 0.65}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
            <span>Orbit #4028 • Cloud Cover 0%</span>
            <span style={{ color: 'var(--color-primary)' }}>10m Ground Sampling Distance</span>
          </div>
        </div>

        {/* Module 3: Biomass Yield Forecaster */}
        <div className="card" style={styles.moduleCard}>
          <div style={styles.moduleHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--color-tertiary)" />
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Biomass Yield Forecaster</h3>
            </div>
            <Link to="/yield" className="btn btn-secondary" style={{ padding: '0.3rem 0.65rem', fontSize: '0.72rem' }}>
              <span>Simulation</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0 0.85rem 0' }}>
            Cumulative biomass growth integral calibrated against seasonal Growing Degree Days (GDD).
          </p>

          <div style={styles.miniStatsRow}>
            <div>
              <span style={styles.miniLabel}>Est. Yield/Ha</span>
              <span style={{ ...styles.miniVal, color: 'var(--color-tertiary)' }}>
                {yieldData?.projectedYieldPerHa || '3.42'} Tons
              </span>
            </div>
            <div>
              <span style={styles.miniLabel}>Total Metric Tons</span>
              <span style={{ ...styles.miniVal, color: 'var(--color-primary)' }}>
                {yieldData?.totalYieldTons || '16.58'} T
              </span>
            </div>
            <div>
              <span style={styles.miniLabel}>Confidence</span>
              <span style={{ ...styles.miniVal, color: 'var(--color-secondary)' }}>95% CI</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
            <span>Stage: R3 Beginning Pod</span>
            <span style={{ color: 'var(--color-primary)' }}>+8.4% above regional baseline</span>
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
    gap: '1.25rem'
  },
  topRibbon: {
    backgroundColor: 'rgba(15, 28, 22, 0.85)',
    backdropFilter: 'blur(20px)',
    padding: '1.25rem 1.5rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  ribbonTitle: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  ribbonSubtitle: {
    fontSize: '0.82rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
    marginTop: '3px'
  },
  farmSelect: {
    padding: '0.55rem 0.85rem',
    fontSize: '0.8rem',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'rgba(23, 34, 29, 0.8)',
    border: '1px solid var(--color-border)',
    color: '#ffffff',
    cursor: 'pointer'
  },
  actionBtn: {
    padding: '0.55rem 1.1rem',
    fontSize: '0.8rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1rem'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '1.1rem'
  },
  statIconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  statValue: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1.2',
    margin: '2px 0',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  statHelper: {
    fontSize: '0.7rem',
    color: 'var(--color-text-secondary)',
    display: 'block'
  },
  timelineBar: {
    marginTop: '0.75rem',
    backgroundColor: 'rgba(11, 21, 17, 0.92)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '0.75rem 1.25rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  moduleCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  moduleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.65rem',
    borderBottom: '1px solid var(--color-border-subtle)'
  },
  miniStatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(7, 14, 11, 0.6)',
    padding: '0.65rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border-subtle)'
  },
  miniLabel: {
    display: 'block',
    fontSize: '0.65rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '600',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  miniVal: {
    display: 'block',
    fontSize: '0.88rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    fontFamily: 'Space Grotesk, sans-serif'
  }
};
