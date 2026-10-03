import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
<<<<<<< HEAD
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Cpu, 
  Sprout, 
  Activity, 
  Layers, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  Radio, 
  Compass, 
  ShieldCheck,
  TrendingUp,
  Droplets
} from 'lucide-react';
=======
import FarmMap from '../components/FarmMap';
import { Cpu, Sprout, Layers, Code2, Clock } from 'lucide-react';
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4

export default function DigitalTwinPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
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
<<<<<<< HEAD
        setIndicesData(getFarmIndicesAnalysis(data[0].cropType || data[0].crop_type, data[0].sowingDate || data[0].sowing_date));
=======
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const handleSelectFarm = (farmId) => {
    const farm = farms.find((f) => String(f.id) === String(farmId));
    if (farm) {
      setSelectedFarm(farm);
      setIndicesData(getFarmIndicesAnalysis(farm.cropType || farm.crop_type, farm.sowingDate || farm.sowing_date));
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-primary)' }} className="hud-glow">
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Calibrating 3D Spatial Digital Twin Engine...</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Ingesting Sentinel-2 multispectral mesh and IoT probe telemetry</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Top Header & Farm Selector */}
      <div style={styles.header} className="hud-glow">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={styles.title}>Farm 3D Digital Twin Engine</h1>
            <span className="badge badge-teal font-mono">
              THREE.JS SPATIAL REALTIME
            </span>
          </div>
          <p style={styles.subtitle}>
            Interactive 3D topographic farm plot with 25 sub-plot prisms, multi-depth layer mesh, and autonomous UAV flight patrol.
=======
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Digital Twin Engine</h1>
            <span className="badge badge-coming-soon">Coming Soon</span>
          </div>
          <p style={styles.subtitle}>
            Multi-spectral spatial twin rendering canopy vigor, soil moisture, and sub-plot spatial layers.
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </p>
        </div>

        {farms.length > 0 && (
          <div style={styles.farmSelectWrapper}>
            <Sprout size={16} color="var(--color-primary)" />
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => {
                const found = farms.find((f) => String(f.id) === e.target.value);
                if (found) setSelectedFarm(found);
              }}
              style={styles.farmSelect}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmName || f.name} ({f.cropType || f.crop_type || 'Soybean'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

<<<<<<< HEAD
      {!selectedFarm ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', background: 'rgba(15, 28, 22, 0.8)' }}>
          <Cpu size={40} color="var(--color-primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#ffffff' }}>No Farm Parcel Registered Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', margin: '0.5rem 0 1.5rem 0' }}>
            Register a farm boundary on the GIS Leaflet map to generate its 3D spatial digital twin.
          </p>
        </div>
      ) : (
        <>
          {/* Main 3D Spatial Grid Canvas */}
          <DigitalTwinCanvas farm={selectedFarm} indices={indicesData} />

          {/* Subterranean Soil & Multi-Probe Telemetry Bento */}
          <div style={styles.bentoGrid}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Droplets size={18} color="var(--color-secondary)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff' }}>Subterranean Rootzone Strata</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Volumetric water content across topsoil (0-15cm), active root zone (15-40cm), and deep loam strata.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Topsoil (0–15cm)</span>
                    <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>34.2% VWC (Optimal)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(34, 44, 40, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '68%', height: '100%', background: 'linear-gradient(to right, #00d9ff, #22e58a)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Root Taproot Penetration (15–40cm)</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>32cm Depth (Stage R3)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(34, 44, 40, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '80%', height: '100%', background: 'linear-gradient(to right, #22e58a, #88ff76)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Deep Loam Water Table (40–100cm)</span>
                    <span style={{ color: 'var(--color-tertiary)', fontWeight: 'bold' }}>Steady Capillary Fringe</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(34, 44, 40, 0.8)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '55%', height: '100%', background: 'linear-gradient(to right, #88ff76, #00d9ff)' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Zap size={18} color="var(--color-primary)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff' }}>LoRaWAN IoT Sensor Mesh Alpha</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.85rem' }}>
                25 telemetry nodes reporting real-time soil electrochemical resistance, moisture, and temperature.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div style={{ background: 'rgba(7, 14, 11, 0.6)', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'block' }}>MESH HEALTH</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>25/25 Locked</span>
                </div>
                <div style={{ background: 'rgba(7, 14, 11, 0.6)', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'block' }}>PING LATENCY</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>42ms</span>
                </div>
                <div style={{ background: 'rgba(7, 14, 11, 0.6)', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'block' }}>PACKET DROP</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-tertiary)', fontFamily: 'Space Grotesk, sans-serif' }}>0.02%</span>
                </div>
                <div style={{ background: 'rgba(7, 14, 11, 0.6)', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'block' }}>BATTERY RESERVE</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>98% Solar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time-Series Growth Curve Recharts */}
          <div className="card" style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>Vegetation Indices Temporal Growth Curve</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  Multi-spectral Sentinel-2 NDVI, NDRE, EVI, and SAVI index tracking over sowing phenology stages.
                </p>
              </div>
              <span className="badge badge-primary font-mono text-[10px]">Copernicus 10m L2A</span>
            </div>

            <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={indicesData?.growthSeries || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(133, 149, 135, 0.15)" />
                  <XAxis dataKey="stage" stroke="var(--color-text-secondary)" fontSize={12} fontFamily="Space Grotesk, sans-serif" />
                  <YAxis domain={[0, 1]} stroke="var(--color-text-secondary)" fontSize={12} fontFamily="Space Grotesk, sans-serif" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(11, 21, 17, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '12px',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', fontFamily: 'Space Grotesk, sans-serif' }} />
                  <Line type="monotone" dataKey="NDVI" stroke="#22e58a" strokeWidth={3} dot={{ r: 4, fill: '#22e58a' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="NDRE" stroke="#00d9ff" strokeWidth={2.5} dot={{ r: 4, fill: '#00d9ff' }} />
                  <Line type="monotone" dataKey="SAVI" stroke="#88ff76" strokeWidth={2} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="EVI" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
=======
      {/* Module Overview & Status Banner */}
      <div className="card" style={styles.bannerCard}>
        <div style={styles.bannerHeader}>
          <div style={styles.iconBadge}>
            <Cpu size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-text-main)' }}>
              Spatial Digital Twin Canvas (Phase 2 Roadmap)
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              This module will render sub-plot micro-zones once Google Earth Engine & Sentinel-2 satellite ingestion pipelines are connected.
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Loading farm boundaries...
        </div>
      ) : !selectedFarm ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Sprout size={36} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>No Farm Registered Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Register your first farm boundary on the map to initialize its spatial digital twin foundation.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {/* Spatial Field Canvas Card */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={styles.cardSectionHeader}>
              <Layers size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                Spatial Field Boundary Canvas: {selectedFarm.farmName}
              </h3>
            </div>

            <div style={{ height: '380px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FarmMap
                initialLat={selectedFarm.latitude}
                initialLng={selectedFarm.longitude}
                initialBoundary={selectedFarm.boundary}
                readOnly={true}
              />
            </div>
          </div>

          {/* Module Information Side Card */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={styles.cardSectionHeader}>
              <Clock size={20} color="var(--color-teal)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Planned Digital Twin Overlays</h3>
            </div>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <span style={styles.featureBullet}>•</span>
                <div>
                  <h4 style={styles.featureTitle}>NDVI Canopy Vigor Layer</h4>
                  <p style={styles.featureDesc}>Sub-plot chlorophyll absorption mapping via 10m Sentinel-2 Band 4 & Band 8 ratios.</p>
                </div>
              </div>

              <div style={styles.featureItem}>
                <span style={styles.featureBullet}>•</span>
                <div>
                  <h4 style={styles.featureTitle}>NDRE & Chlorophyll Index</h4>
                  <p style={styles.featureDesc}>Red-edge band analysis detecting mid-to-late stage nitrogen deficiency and senescence.</p>
                </div>
              </div>

              <div style={styles.featureItem}>
                <span style={styles.featureBullet}>•</span>
                <div>
                  <h4 style={styles.featureTitle}>SAVI Soil-Adjusted Index</h4>
                  <p style={styles.featureDesc}>Soil brightness correction factor for early crop growth stages before canopy closure.</p>
                </div>
              </div>
            </div>

            <div style={styles.statusBox}>
              <span className="badge badge-coming-soon" style={{ width: 'fit-content' }}>Data Engine Pending</span>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                Field boundary (<b>{selectedFarm.areaHectares} Ha</b>) is delineated and stored. High-resolution raster overlays will be rendered upon satellite engine connection.
              </p>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
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
    gap: '1.25rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    backgroundColor: 'rgba(15, 28, 22, 0.85)',
    backdropFilter: 'blur(20px)',
    padding: '1.25rem 1.5rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)'
  },
  title: {
<<<<<<< HEAD
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
=======
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    margin: 0
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  subtitle: {
    fontSize: '0.82rem',
    color: 'var(--color-text-secondary)',
    margin: 0,
    marginTop: '3px'
  },
  farmSelectWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(23, 34, 29, 0.8)',
    padding: '0.35rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)'
  },
  farmSelect: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: '0.82rem',
    color: '#ffffff',
    cursor: 'pointer'
  },
<<<<<<< HEAD
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem'
  },
  chartCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(15, 28, 22, 0.75)',
    backdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    padding: '1.5rem'
=======
  bannerCard: {
    padding: '1.25rem 1.5rem'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  bannerHeader: {
    display: 'flex',
    alignItems: 'center',
<<<<<<< HEAD
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border-subtle)',
    flexWrap: 'wrap',
    gap: '0.5rem'
=======
    gap: '1rem'
  },
  iconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-light-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '1.25rem',
    alignItems: 'start'
  },
  cardSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.625rem',
    borderBottom: '1px solid var(--color-border)'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.625rem'
  },
  featureBullet: {
    color: 'var(--color-primary)',
    fontWeight: '800',
    fontSize: '1.1rem',
    lineHeight: '1'
  },
  featureTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    margin: 0,
    color: 'var(--color-text-main)'
  },
  featureDesc: {
    fontSize: '0.775rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0',
    lineHeight: '1.4'
  },
  statusBox: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    marginTop: 'auto'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
