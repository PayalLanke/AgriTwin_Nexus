import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import { weatherService } from '../services/weatherService';
import { riskEngine } from '../services/riskEngine';
import { yieldEngine } from '../services/yieldEngine';
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
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [farms, setFarms] = useState([]);
  const [activeFarm, setActiveFarm] = useState(null);
  const [indices, setIndices] = useState(null);
  const [weather, setWeather] = useState(null);
  const [risks, setRisks] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const totalAreaAcres = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0);

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h1 style={styles.bannerTitle}>AgriTwin Digital Twin Command Center</h1>
            <span className="badge badge-teal">Modules 1–10+ Active</span>
          </div>
          <p style={styles.bannerSubtitle}>
            Real-time multispectral satellite analytics, sub-plot micro-zone health, and AI disease risk prediction.
          </p>
        </div>
        <Link to="/farms/add" className="btn btn-primary" style={styles.addFarmBtn}>
          <PlusCircle size={18} />
          <span>Register New Farm</span>
        </Link>
      </div>

      {/* Primary KPI Stats */}
      <div style={styles.statsGrid}>
        <div className="card" style={styles.statCard}>
          <div style={styles.statIconBadge}>
            <Sprout size={24} color="var(--color-primary)" />
          </div>
          <div>
            <span style={styles.statLabel}>Registered Fields</span>
            <div style={styles.statValue}>{isLoading ? '...' : totalFarms}</div>
            <span style={styles.statHelper}>Active digital twin fields</span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.statIconBadge, backgroundColor: 'var(--color-teal-light)' }}>
            <Cpu size={24} color="var(--color-teal)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={styles.statLabel}>Active Field Digital Twin</span>
            <div style={{ ...styles.statValue, fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isLoading ? '...' : (activeFarm ? activeFarm.farmName : 'No farm registered')}
            </div>
            <span style={styles.statHelper}>
              {activeFarm ? `NDVI: ${indices?.current?.NDVI || 0.76} (${indices?.current?.healthStatus})` : 'Register a farm field'}
            </span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.statIconBadge, backgroundColor: '#fffbeb' }}>
            <Layers size={24} color="var(--color-accent)" />
          </div>
          <div>
            <span style={styles.statLabel}>Total Farm Area</span>
            <div style={styles.statValue}>
              {isLoading ? '...' : (totalFarms > 0 ? `${totalAreaHectares.toFixed(2)} Ha` : '0 Ha')}
            </div>
            <span style={styles.statHelper}>
              {totalFarms > 0 ? `${totalAreaAcres.toFixed(2)} Acres total` : 'No spatial data'}
            </span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.statIconBadge, backgroundColor: 'var(--color-danger-light)' }}>
            <ShieldAlert size={24} color="var(--color-danger)" />
          </div>
          <div>
            <span style={styles.statLabel}>Pest / Pathogen Risk</span>
            <div style={styles.statValue}>
              {isLoading ? '...' : (risks ? `${risks.overallRiskScore}%` : 'N/A')}
            </div>
            <span style={styles.statHelper}>
              {risks ? risks.overallRiskLevel : 'Run risk engine'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Digital Twin Dashboard Analytics */}
      {activeFarm && (
        <div style={styles.modulesGrid}>
          {/* Module Quick Card 1: Digital Twin Grid */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Spatial Digital Twin Matrix</h3>
              </div>
              <Link to="/digital-twin" className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                <span>Open Canvas</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0.5rem 0 1rem 0' }}>
              Sub-plot micro-zone matrix rendering canopy vigor, soil moisture, and chlorophyll distribution.
            </p>
            <div style={styles.miniStatsRow}>
              <div>
                <span style={styles.miniLabel}>NDVI Vigor</span>
                <span style={styles.miniVal}>{indices?.current?.NDVI}</span>
              </div>
              <div>
                <span style={styles.miniLabel}>NDRE Chlorophyll</span>
                <span style={styles.miniVal}>{indices?.current?.NDRE}</span>
              </div>
              <div>
                <span style={styles.miniLabel}>Canopy Cover</span>
                <span style={styles.miniVal}>{indices?.current?.canopyCoverage}</span>
              </div>
            </div>
          </div>

          {/* Module Quick Card 2: Weather & Micro-Climate */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CloudSun size={20} color="var(--color-teal)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Micro-Climate & Soil Telemetry</h3>
              </div>
              <Link to="/weather" className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                <span>Forecast</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0.5rem 0 1rem 0' }}>
              Station parameters & spray suitability index ({weather?.current?.spraySuitability}).
            </p>
            <div style={styles.miniStatsRow}>
              <div>
                <span style={styles.miniLabel}>Air Temp</span>
                <span style={styles.miniVal}>{weather?.current?.tempCelsius}°C</span>
              </div>
              <div>
                <span style={styles.miniLabel}>Soil Moisture</span>
                <span style={styles.miniVal}>{weather?.current?.soilMoistureVolumetric}%</span>
              </div>
              <div>
                <span style={styles.miniLabel}>Humidity</span>
                <span style={styles.miniVal}>{weather?.current?.humidityPercent}%</span>
              </div>
            </div>
          </div>

          {/* Module Quick Card 3: Yield Projection */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="var(--color-accent)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Harvest Yield Projection</h3>
              </div>
              <Link to="/yield" className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                <span>Calculator</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0.5rem 0 1rem 0' }}>
              Projected harvest output calculated from cumulative satellite biomass integrals.
            </p>
            <div style={styles.miniStatsRow}>
              <div>
                <span style={styles.miniLabel}>Yield / Ha</span>
                <span style={styles.miniVal}>{yieldData?.projectedYieldPerHa} Tons</span>
              </div>
              <div>
                <span style={styles.miniLabel}>Total Metric Tons</span>
                <span style={styles.miniVal}>{yieldData?.totalYieldTons} Tons</span>
              </div>
              <div>
                <span style={styles.miniLabel}>Quintals Output</span>
                <span style={styles.miniVal}>{yieldData?.totalYieldQuintals} Qt</span>
              </div>
            </div>
          </div>
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
  welcomeBanner: {
    backgroundColor: '#ffffff',
    padding: '1.5rem 1.75rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap'
  },
  bannerTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    margin: 0
  },
  bannerSubtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
    marginTop: '2px'
  },
  addFarmBtn: {
    padding: '0.625rem 1.25rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1.25rem'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem'
  },
  statIconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--color-primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statLabel: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1.2',
    margin: '2px 0'
  },
  statHelper: {
    fontSize: '0.725rem',
    color: '#94a3b8'
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
    paddingBottom: '0.625rem',
    borderBottom: '1px solid var(--color-border)'
  },
  miniStatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: '0.625rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)'
  },
  miniLabel: {
    display: 'block',
    fontSize: '0.675rem',
    color: 'var(--color-text-secondary)',
    fontWeight: '600'
  },
  miniVal: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '800',
    color: 'var(--color-primary)'
  }
};
