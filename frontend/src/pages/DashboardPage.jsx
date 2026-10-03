import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { authService } from '../services/authService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { useLanguage } from '../context/LanguageContext';
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
  Sparkles,
  ShieldAlert,
  Radio,
  CheckCircle2,
  User,
  ExternalLink,
  List,
  Calendar,
  Droplets,
  Zap,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentUser = authService.getCurrentUser();

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [indices, setIndices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setIndices(getFarmIndicesAnalysis(data[0].cropType, data[0].sowingDate));
      }
    } catch (e) {
      console.error('Error loading farms:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFarm = (farm) => {
    setSelectedFarm(farm);
    setIndices(getFarmIndicesAnalysis(farm.cropType, farm.sowingDate));
  };

  const totalFarms = farms.length;
  const totalAreaHectares = farms.reduce((acc, f) => acc + (f.areaHectares || 0), 0);
  const totalAreaAcres = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0);
  const uniqueCrops = Array.from(new Set(farms.map((f) => f.cropType).filter(Boolean)));
  const cropsText = uniqueCrops.length > 0 ? uniqueCrops.join(', ') : 'Soybean, Wheat';

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Executive Mission Banner */}
      <div style={styles.topRibbon} className="hud-glow">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={styles.avatarBadge}>
            <User size={26} color="#22e58a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={styles.ribbonTitle}>
                Welcome, {currentUser?.fullName || 'Rajesh Patil'}
              </h1>
              <span className="badge badge-teal font-mono">
                AGRI-AI MISSION ACTIVE
              </span>
            </div>
            <p style={styles.ribbonSubtitle}>
              Executive Farm Overview & Agro-AI Intelligence Hub • {totalFarms} Active Plots ({totalAreaHectares.toFixed(2)} Ha)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {farms.length > 1 && (
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => {
                const f = farms.find(farm => String(farm.id) === e.target.value);
                if (f) handleSelectFarm(f);
              }}
              style={styles.farmSelect}
            >
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.farmName} ({f.cropType || 'Crop'})</option>
              ))}
            </select>
          )}

          <Link to="/digital-twin" className="cyber-gradient-btn" style={{ padding: '0.55rem 1.1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <Cpu size={16} />
            <span>Launch 3D Twin 🌐</span>
          </Link>

          <Link to="/farms" style={styles.secondaryBtn}>
            <List size={16} color="#00d9ff" />
            <span>Farms Directory 📋</span>
          </Link>

          <Link to="/farms/add" className="btn btn-primary cyber-gradient-btn" style={styles.actionBtn}>
            <PlusCircle size={16} />
            <span>+ {t('add_farm_btn')}</span>
          </Link>
        </div>
      </div>

      {/* AI Agro-Precision Telemetry Grid */}
      <div style={styles.telemetryGrid}>
        {/* Card 1: Crop Vigor & NDVI Health */}
        <div style={styles.telemetryCard} className="hud-glow">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ ...styles.cardIconBadge, backgroundColor: 'rgba(34, 229, 138, 0.15)', borderColor: 'var(--color-primary)' }}>
                <Sprout size={18} color="var(--color-primary)" />
              </div>
              <h3 style={styles.cardHeading}>Crop Vigor & NDVI Status</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#22e58a', background: 'rgba(34, 229, 138, 0.15)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
              HEALTHY • 0.78
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Active Crop Plot:</span>
              <span style={styles.metricVal}>{selectedFarm ? selectedFarm.farmName : 'Green Valley Plot'}</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Crop Phenology:</span>
              <span style={styles.metricVal}>{selectedFarm ? selectedFarm.cropType : 'Soybean (Pioneer)'} • Stage R3</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Canopy Chlorophyll:</span>
              <span style={{ color: '#22e58a', fontWeight: 'bold' }}>82.4 SPAD Index</span>
            </div>

            <div style={styles.aiAdvisoryBox}>
              <Sparkles size={16} color="#22e58a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                <strong style={{ color: '#22e58a' }}>AI Recommendation:</strong> Canopy density is optimal. Schedule light nitrogen top-dressing in 3 days.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Micro-Climate & Irrigation */}
        <div style={styles.telemetryCard} className="hud-glow">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ ...styles.cardIconBadge, backgroundColor: 'rgba(0, 217, 255, 0.15)', borderColor: '#00d9ff' }}>
                <CloudSun size={18} color="#00d9ff" />
              </div>
              <h3 style={styles.cardHeading}>Weather & Root Hydration</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#00d9ff', background: 'rgba(0, 217, 255, 0.15)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
              OPTIMAL
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Temperature / RH:</span>
              <span style={styles.metricVal}>27.4°C • 65% RH</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Soil Moisture (VWC):</span>
              <span style={styles.metricVal}>34.2% VWC (Root Zone 30cm)</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Wind Speed / Direction:</span>
              <span style={styles.metricVal}>11 km/h • South-West</span>
            </div>

            <div style={{ ...styles.aiAdvisoryBox, borderColor: 'rgba(0, 217, 255, 0.3)', background: 'rgba(0, 217, 255, 0.08)' }}>
              <Droplets size={16} color="#00d9ff" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                <strong style={{ color: '#00d9ff' }}>Irrigation Alert:</strong> Soil moisture is sufficient. Next drip cycle recommended tomorrow at 06:00 AM.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Pest & Disease Risk Warning */}
        <div style={styles.telemetryCard} className="hud-glow">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ ...styles.cardIconBadge, backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                <ShieldAlert size={18} color="#ffb4ab" />
              </div>
              <h3 style={styles.cardHeading}>Pest & Disease Intelligence</h3>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
              18% LOW RISK
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Fungal Leaf Blight Risk:</span>
              <span style={{ color: '#22e58a', fontWeight: 'bold' }}>Negligible (5%)</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Fall Armyworm Monitor:</span>
              <span style={styles.metricVal}>Suppressed (Bio-Spray active)</span>
            </div>
            <div style={styles.metricRow}>
              <span style={styles.metricLabel}>Thermal Canopy Variance:</span>
              <span style={styles.metricVal}>Normal (&lt; 0.5°C variance)</span>
            </div>

            <div style={{ ...styles.aiAdvisoryBox, borderColor: 'rgba(251, 191, 36, 0.3)', background: 'rgba(251, 191, 36, 0.08)' }}>
              <CheckCircle2 size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                <strong style={{ color: '#fbbf24' }}>Pest Status:</strong> No intervention required. Pheromone trap density normal across Sub-Plot B.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Activity & Launch Grid Section */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionHeaderTitle}>AgriTwin Nexus Control Modules</h2>

        <div style={styles.quickActionsGrid}>
          <Link to="/digital-twin" style={styles.actionCardLink}>
            <div style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: 'rgba(34, 229, 138, 0.15)', borderColor: 'var(--color-primary)' }}>
                  <Cpu size={22} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>3D Spatial Digital Twin</h4>
                  <p style={styles.actionSub}>Full 3D WebGL topographic farm simulation & UAV patrol</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--color-primary)" />
            </div>
          </Link>

          <Link to="/farms" style={styles.actionCardLink}>
            <div style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: 'rgba(0, 217, 255, 0.15)', borderColor: '#00d9ff' }}>
                  <Sprout size={22} color="#00d9ff" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>Registered Farms Directory</h4>
                  <p style={styles.actionSub}>View & manage all registered farm plots, GPS boundaries & area</p>
                </div>
              </div>
              <ChevronRight size={20} color="#00d9ff" />
            </div>
          </Link>

          <Link to="/satellite" style={styles.actionCardLink}>
            <div style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8' }}>
                  <Satellite size={22} color="#38bdf8" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>Satellite Remote Sensing</h4>
                  <p style={styles.actionSub}>Copernicus Sentinel-2 multispectral RGB, NDVI & EVI analytics</p>
                </div>
              </div>
              <ChevronRight size={20} color="#38bdf8" />
            </div>
          </Link>

          <Link to="/pest-risk" style={styles.actionCardLink}>
            <div style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: 'rgba(251, 191, 36, 0.15)', borderColor: '#fbbf24' }}>
                  <ShieldAlert size={22} color="#fbbf24" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>Pest & Disease AI Diagnostics</h4>
                  <p style={styles.actionSub}>Real-time crop infection risk modeling & biological control</p>
                </div>
              </div>
              <ChevronRight size={20} color="#fbbf24" />
            </div>
          </Link>
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
  topRibbon: {
    backgroundColor: 'rgba(15, 28, 22, 0.85)',
    backdropFilter: 'blur(20px)',
    padding: '1.25rem 1.5rem',
    borderRadius: '20px',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  avatarBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
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
    borderRadius: '12px',
    backgroundColor: 'rgba(23, 34, 29, 0.8)',
    border: '1px solid var(--color-border)',
    color: '#ffffff',
    cursor: 'pointer'
  },
  secondaryBtn: {
    padding: '0.55rem 1rem',
    fontSize: '0.8rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    color: '#00d9ff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    textDecoration: 'none',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  actionBtn: {
    padding: '0.55rem 1.1rem',
    fontSize: '0.8rem'
  },
  telemetryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  telemetryCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '20px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column'
  },
  cardIconBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardHeading: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  metricRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.82rem',
    paddingBottom: '0.4rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  metricLabel: {
    color: 'var(--color-text-secondary)'
  },
  metricVal: {
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  aiAdvisoryBox: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(34, 229, 138, 0.08)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem'
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  sectionHeaderTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem'
  },
  actionCardLink: {
    textDecoration: 'none'
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  actionIconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  actionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  actionSub: {
    fontSize: '0.76rem',
    color: '#94a3b8',
    margin: '3px 0 0 0',
    lineHeight: '1.3'
  }
};
