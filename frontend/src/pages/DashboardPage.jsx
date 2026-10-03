import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { farmService } from '../services/farmService';
<<<<<<< HEAD
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { yieldEngine } from '../services/yieldEngine';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
=======
import { useLanguage } from '../context/LanguageContext';
import FarmMap from '../components/FarmMap';
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
import {
  Sprout,
  PlusCircle,
  MapPin,
  Layers,
  ArrowRight,
  Cpu,
  Satellite,
  CloudSun,
  Activity,
  TrendingUp,
<<<<<<< HEAD
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
=======
  ShieldAlert
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4D Bio-Dynamic Simulation Timeline state
  const [isPlayingSim, setIsPlayingSim] = useState(false);
  const [simSpeed, setSimSpeed] = useState('4x');
  const [simStep, setSimStep] = useState('today'); // 'd28', 'd21', 'd14', 'd07', 'today', 'p3d', 'p7d'
  const [droneFeedback, setDroneFeedback] = useState(null);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0]);
      }
    } catch (e) {
      console.error('Error loading farms:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Real calculations
  const totalFarms = farms.length;
  const totalAreaHectares = farms.reduce((acc, f) => acc + (f.areaHectares || 0), 0);
<<<<<<< HEAD

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
=======
  const totalAreaAcres = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0);
  
  // Unique crops
  const uniqueCrops = Array.from(new Set(farms.map((f) => f.cropType).filter(Boolean)));
  const cropsText = uniqueCrops.length > 0 ? uniqueCrops.join(', ') : '—';

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header / Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <div>
          <h1 style={styles.welcomeTitle}>{t('dashboard_overview_title')}</h1>
          <p style={styles.welcomeSubtitle}>
            {t('dashboard_overview_subtitle')}
          </p>
        </div>
        <Link to="/farms/add" className="btn btn-primary" style={styles.addBtn}>
          <PlusCircle size={18} />
          <span>+ {t('add_farm_btn')}</span>
        </Link>
      </div>

      {/* SECTION 1: FARM SUMMARY */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionHeaderTitle}>{t('quick_actions')}</h2>

        <div style={styles.summaryGrid}>
          {/* Card 1: Total Farms */}
          <div className="card" style={styles.summaryCard}>
            <div style={styles.iconContainer}>
              <Sprout size={22} color="var(--color-primary)" />
            </div>
            <div>
              <span style={styles.cardLabel}>{t('total_farms')}</span>
              <div style={styles.cardVal}>{isLoading ? '...' : totalFarms}</div>
              <span style={styles.cardHelper}>{t('view_farms_btn')}</span>
            </div>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>

<<<<<<< HEAD
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
=======
          {/* Card 2: Active Farm */}
          <div className="card" style={styles.summaryCard}>
            <div style={{ ...styles.iconContainer, backgroundColor: 'var(--color-teal-light)' }}>
              <MapPin size={22} color="var(--color-teal)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={styles.cardLabel}>{t('farm_name')}</span>
              <div style={styles.cardValTruncated} title={selectedFarm ? selectedFarm.farmName : 'No farm selected'}>
                {isLoading ? '...' : (selectedFarm ? selectedFarm.farmName : '—')}
              </div>
              <span style={styles.cardHelper}>
                {selectedFarm ? `${t('crop_type')}: ${selectedFarm.cropType}` : t('boundary_none')}
              </span>
            </div>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>

<<<<<<< HEAD
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
=======
          {/* Card 3: Total Farm Area */}
          <div className="card" style={styles.summaryCard}>
            <div style={{ ...styles.iconContainer, backgroundColor: '#fffbeb' }}>
              <Layers size={22} color="var(--color-warning)" />
            </div>
            <div>
              <span style={styles.cardLabel}>{t('total_area_ha')}</span>
              <div style={styles.cardVal}>
                {isLoading
                  ? '...'
                  : totalFarms > 0
                  ? `${totalAreaHectares.toFixed(2)} Ha`
                  : '—'}
              </div>
              <span style={styles.cardHelper}>
                {totalFarms > 0 ? `${totalAreaAcres.toFixed(2)} ${t('acres')}` : '0 Acres'}
              </span>
            </div>
          </div>

          {/* Card 4: Registered Crops */}
          <div className="card" style={styles.summaryCard}>
            <div style={{ ...styles.iconContainer, backgroundColor: 'var(--color-light-green)' }}>
              <Activity size={22} color="var(--color-primary)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={styles.cardLabel}>{t('crop_type')}</span>
              <div style={styles.cardValTruncated} title={cropsText}>
                {isLoading ? '...' : cropsText}
              </div>
              <span style={styles.cardHelper}>
                {uniqueCrops.length > 0 ? `${uniqueCrops.length} ${t('crop_type')}` : '—'}
              </span>
            </div>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* SECTION 2: FARM MAP */}
      <div style={styles.sectionContainer}>
        <div style={styles.sectionHeaderRow}>
          <div>
            <h2 style={styles.sectionHeaderTitle}>{t('my_farms_title')}</h2>
            <p style={styles.sectionHeaderSub}>
              {t('my_farms_subtitle')}
            </p>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>
          {totalFarms > 0 && (
            <span className="badge badge-primary">
              <MapPin size={12} />
              <span>{totalFarms} {t('boundary_active')}</span>
            </span>
          )}
        </div>
<<<<<<< HEAD
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
=======

        <div className="card" style={styles.mapCard}>
          {totalFarms === 0 ? (
            <div style={styles.emptyMapContainer}>
              <div style={styles.emptyMapBadge}>
                <Sprout size={36} color="var(--color-primary)" />
              </div>
              <h3 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '1.2rem', color: 'var(--color-text-main)' }}>
                {t('add_farm_subtitle')}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '420px', lineHeight: '1.5' }}>
                {t('add_farm_subtitle')}
              </p>
              <Link to="/farms/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <PlusCircle size={16} />
                <span>{t('add_farm_btn')}</span>
              </Link>
            </div>
          ) : (
            <div style={{ height: '420px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FarmMap farms={farms} selectedFarm={selectedFarm} readOnly={true} />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: QUICK ACTIONS */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionHeaderTitle}>{t('quick_actions')}</h2>

        <div style={styles.quickActionsGrid}>
          <Link to="/farms/add" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={styles.actionIconBadge}>
                  <PlusCircle size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>{t('nav_add_farm')}</h4>
                  <p style={styles.actionSub}>{t('add_farm_subtitle')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--color-primary)" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/farms" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: 'var(--color-teal-light)' }}>
                  <Sprout size={20} color="var(--color-teal)" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>{t('nav_my_farms')}</h4>
                  <p style={styles.actionSub}>{t('my_farms_subtitle')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--color-teal)" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/digital-twin" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: '#f1f5f9' }}>
                  <Cpu size={20} color="#475569" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={styles.actionTitle}>{t('nav_digital_twin')}</h4>
                    <span className="badge badge-coming-soon">Soon</span>
                  </div>
                  <p style={styles.actionSub}>{t('digital_twin_subtitle')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="#94a3b8" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/satellite" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: '#f1f5f9' }}>
                  <Satellite size={20} color="#475569" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={styles.actionTitle}>{t('nav_satellite')}</h4>
                    <span className="badge badge-coming-soon">Soon</span>
                  </div>
                  <p style={styles.actionSub}>{t('layer_rgb')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="#94a3b8" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/weather" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: '#f1f5f9' }}>
                  <CloudSun size={20} color="#475569" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={styles.actionTitle}>{t('nav_weather')}</h4>
                    <span className="badge badge-coming-soon">Soon</span>
                  </div>
                  <p style={styles.actionSub}>{t('weather_summary')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="#94a3b8" style={styles.arrowIcon} />
            </div>
          </Link>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
<<<<<<< HEAD
    gap: '1.25rem'
  },
  topRibbon: {
    backgroundColor: 'rgba(15, 28, 22, 0.85)',
    backdropFilter: 'blur(20px)',
    padding: '1.25rem 1.5rem',
    borderRadius: 'var(--radius-xl)',
=======
    gap: '2rem'
  },
  welcomeBanner: {
    backgroundColor: '#ffffff',
    padding: '1.5rem 1.75rem',
    borderRadius: 'var(--radius-lg)',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
<<<<<<< HEAD
  ribbonTitle: {
    fontSize: '1.35rem',
=======
  welcomeTitle: {
    fontSize: '1.4rem',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
<<<<<<< HEAD
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
=======
  welcomeSubtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0'
  },
  addBtn: {
    padding: '0.625rem 1.25rem'
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    gap: '1rem'
  },
  sectionHeaderRow: {
    display: 'flex',
    alignItems: 'center',
<<<<<<< HEAD
    gap: '0.85rem',
    padding: '1.1rem'
  },
  statIconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid var(--color-border)',
=======
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  sectionHeaderTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0
  },
  sectionHeaderSub: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    margin: 0
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem'
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1.25rem'
  },
  iconContainer: {
    width: '46px',
    height: '46px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-light-green)',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
<<<<<<< HEAD
  statLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    fontFamily: 'Space Grotesk, sans-serif'
=======
  cardLabel: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  cardVal: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1.2',
    margin: '2px 0',
    fontFamily: 'Space Grotesk, sans-serif'
  },
<<<<<<< HEAD
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
=======
  cardValTruncated: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1.2',
    margin: '2px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cardHelper: {
    fontSize: '0.725rem',
    color: '#94a3b8'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  mapCard: {
    padding: '0.75rem',
    backgroundColor: '#ffffff'
  },
  emptyMapContainer: {
    minHeight: '320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2.5rem 1.5rem',
    backgroundColor: '#fafdfa',
    borderRadius: 'var(--radius-md)',
    border: '1px stroke border'
  },
  emptyMapBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-light-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  actionCardLink: {
    textDecoration: 'none'
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
<<<<<<< HEAD
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
=======
    padding: '1rem 1.25rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  actionIconBadge: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-light-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  actionTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0
  },
  actionSub: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0'
  },
  arrowIcon: {
    flexShrink: 0
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
