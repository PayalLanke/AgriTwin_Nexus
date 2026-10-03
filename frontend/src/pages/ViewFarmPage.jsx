import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import FarmMap from '../components/FarmMap';
import {
  ArrowLeft,
  Edit2,
  Sprout,
  Calendar,
  Layers,
  MapPin,
  Code2,
  Cpu,
<<<<<<< HEAD
  ShieldCheck,
  Crosshair,
  Satellite,
  Compass,
  Activity
=======
  Satellite,
  Activity,
  ShieldAlert,
  TrendingUp,
  Sparkles,
  CloudSun
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
} from 'lucide-react';

export default function ViewFarmPage() {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGeoJson, setShowGeoJson] = useState(false);

  useEffect(() => {
    loadFarm();
  }, [id]);

  const loadFarm = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarmById(id);
      setFarm(data);
    } catch (err) {
      setError(err.message || 'Failed to load farm details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          LOADING DIGITAL TWIN TELEMETRY...
        </p>
      </div>
    );
  }

  if (error || !farm) {
    return (
<<<<<<< HEAD
      <div style={styles.errorCard}>
        <h3 style={{ color: '#f87171', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>Farm Record Not Found</h3>
        <p style={{ color: '#94a3b8', margin: 0 }}>{error || 'The requested digital twin record does not exist.'}</p>
        <Link to="/farms" style={styles.backBtnAction}>
=======
      <div className="card" style={styles.errorCard}>
        <h3 style={{ color: 'var(--color-error)' }}>Farm Record Not Found</h3>
        <p>{error || 'The requested farm record does not exist.'}</p>
        <Link to="/farms" className="btn btn-secondary">
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          <ArrowLeft size={16} />
          <span>Return to Farms Dock</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header Bar */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/farms" style={styles.backBtn} title="Back to farms list">
            <ArrowLeft size={18} color="#22e58a" />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={styles.title}>{farm.farmName}</h1>
<<<<<<< HEAD
              <span style={styles.activeBadge}>
                <span style={styles.livePulse}></span>
                {farm.status.toUpperCase()}
              </span>
              <span style={styles.roiTag}>
                <Satellite size={12} color="#00d9ff" />
                SENTINEL-2 ROI ACTIVE
              </span>
=======
              <span className="badge badge-primary">{farm.status || 'Active'}</span>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
            </div>
            <p style={styles.subtitle}>Digital Twin Spatial Polygon & Spectral ROI Specification</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to={`/digital-twin`} style={styles.twinActionBtn}>
            <Activity size={16} />
            <span>Launch 3D Twin View</span>
          </Link>
          <Link to={`/farms/edit/${farm.id}`} className="cyber-gradient-btn" style={{ padding: '0.625rem 1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit2 size={16} />
            <span>Edit Polygon ROI</span>
          </Link>
        </div>
      </div>

      {/* Primary Grid Layout */}
      <div style={styles.contentGrid}>
        {/* Left Column: Farm Specs & GeoJSON Payload Inspector */}
        <div style={styles.leftCol}>
          <div style={styles.specCard}>
            <div style={styles.cardHeader}>
              <div style={styles.iconCircle}>
                <Sprout size={18} color="#22e58a" />
              </div>
              <div>
                <h3 style={styles.sectionHeading}>Spatial Vector Telemetry</h3>
                <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Plot ID: {farm.id}</span>
              </div>
            </div>

            <div style={styles.specList}>
              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
                  <Sprout size={15} color="#22e58a" />
                  <span style={styles.specLabel}>Crop Variety</span>
                </div>
                <span style={styles.specVal}>{farm.cropType}</span>
              </div>

              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
                  <Calendar size={15} color="#00d9ff" />
                  <span style={styles.specLabel}>Sowing / Emergence Date</span>
                </div>
                <span style={styles.specVal}>{farm.sowingDate}</span>
              </div>

              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
<<<<<<< HEAD
                  <Layers size={15} color="#fbbf24" />
                  <span style={styles.specLabel}>Computed Surface Area</span>
=======
                  <Layers size={16} color="var(--color-warning)" />
                  <span style={styles.specLabel}>Calculated Area</span>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
                </div>
                <span style={styles.specVal}>
                  <b style={{ color: '#22e58a' }}>{farm.areaHectares} Ha</b>{' '}
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({farm.areaAcres} Acres)</span>
                </span>
              </div>

              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
                  <Compass size={15} color="#38bdf8" />
                  <span style={styles.specLabel}>ROI Center Datum</span>
                </div>
                <span style={{ ...styles.specVal, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {farm.latitude.toFixed(6)}°N, {farm.longitude.toFixed(6)}°E
                </span>
              </div>
            </div>
          </div>

          {/* GeoJSON Polygon Raw Payload Inspection */}
          <div style={styles.geoJsonCard}>
            <div style={styles.geoJsonHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={16} color="#00d9ff" />
                <h4 style={styles.subHeading}>GeoJSON Polygon Boundary Payload</h4>
              </div>
              <button
                type="button"
                style={styles.inspectBtn}
                onClick={() => setShowGeoJson(!showGeoJson)}
              >
                {showGeoJson ? 'Hide Payload' : 'Inspect GeoJSON'}
              </button>
            </div>

            {showGeoJson && (
              <pre style={styles.jsonCodeBlock}>
                {JSON.stringify(farm.boundary, null, 2)}
              </pre>
            )}
          </div>
<<<<<<< HEAD

          {/* Future Integration Readiness Badge */}
          <div style={styles.integrationCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={18} color="#22e58a" />
              <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif' }}>
                GEE Sentinel-2 Pipeline Active
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8', margin: 0, lineHeight: '1.45' }}>
              This farm boundary polygon is registered with the Google Earth Engine ingestion orchestrator. 10m L2A multispectral tiles are synchronized on every Sentinel-2 overpass.
            </p>
          </div>
=======
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
        </div>

        {/* Right Column: Read-Only Leaflet Map displaying Polygon */}
        <div style={styles.rightCol}>
          <div style={styles.mapCard}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconCircle, background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                <Cpu size={18} color="#00d9ff" />
              </div>
              <div>
                <h3 style={styles.sectionHeading}>Spatial Vector Boundary Map</h3>
                <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Satellite L2A Overlay Mode</span>
              </div>
            </div>

            <div style={{ height: '360px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FarmMap
                initialLat={farm.latitude}
                initialLng={farm.longitude}
                initialBoundary={farm.boundary}
                readOnly={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Farm Digital Twin Foundation Modules Section */}
      <div style={styles.digitalTwinSection}>
        <div style={styles.dtSectionHeader}>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Farm Digital Twin Modules</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
              Status of analytical modules for field boundary: <b>{farm.farmName}</b>
            </p>
          </div>
          <span className="badge badge-coming-soon">Roadmap View</span>
        </div>

        <div style={styles.moduleCardsGrid}>
          {/* Card 1: Satellite Monitoring */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Satellite size={18} color="var(--color-teal)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Satellite Monitoring</h4>
              </div>
              <span className="badge badge-coming-soon">Coming Soon</span>
            </div>
            <div style={styles.emptyStateContainer}>
              <p style={styles.emptyStateText}>
                Satellite analysis will appear after satellite data integration.
              </p>
            </div>
          </div>

          {/* Card 2: Crop Health */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--color-primary)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Crop Health</h4>
              </div>
              <span className="badge badge-coming-soon">Coming Soon</span>
            </div>
            <div style={styles.emptyStateContainer}>
              <p style={styles.emptyStateText}>
                Crop health analysis will appear after satellite processing.
              </p>
            </div>
          </div>

          {/* Card 3: Weather Insights */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CloudSun size={18} color="var(--color-warning)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Weather Telemetry</h4>
              </div>
              <span className="badge badge-coming-soon">Coming Soon</span>
            </div>
            <div style={styles.emptyStateContainer}>
              <p style={styles.emptyStateText}>
                Weather information will appear after weather service integration.
              </p>
            </div>
          </div>

          {/* Card 4: Risk Analysis */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} color="var(--color-error)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Risk Analysis</h4>
              </div>
              <span className="badge badge-coming-soon">Coming Soon</span>
            </div>
            <div style={styles.emptyStateContainer}>
              <p style={styles.emptyStateText}>
                Risk analysis will appear after the risk model is integrated.
              </p>
            </div>
          </div>

          {/* Card 5: Yield Estimation */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="var(--color-primary)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Yield Estimation</h4>
              </div>
              <span className="badge badge-coming-soon">Coming Soon</span>
            </div>
            <div style={styles.emptyStateContainer}>
              <p style={styles.emptyStateText}>
                Yield estimation will appear after the prediction model is integrated.
              </p>
            </div>
          </div>

          {/* Card 6: Recommendations */}
          <div className="card" style={styles.moduleCard}>
            <div style={styles.moduleCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-teal)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Recommendations</h4>
              </div>
              <span className="badge badge-coming-soon">Coming Soon</span>
            </div>
            <div style={styles.emptyStateContainer}>
              <p style={styles.emptyStateText}>
                Agronomic recommendations will appear after analytical engines are active.
              </p>
            </div>
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
    border: '3px solid rgba(34, 229, 138, 0.15)',
    borderTop: '3px solid #22e58a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorCard: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(15, 27, 21, 0.72)',
    borderRadius: '18px',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  backBtnAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#e2e8f0',
    textDecoration: 'none'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  backBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 27, 21, 0.8)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none'
  },
  title: {
<<<<<<< HEAD
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
=======
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    margin: 0
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  subtitle: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    margin: '4px 0 0 0'
  },
  activeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  livePulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#22e58a',
    boxShadow: '0 0 8px #22e58a'
  },
  roiTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid rgba(0, 217, 255, 0.25)',
    color: '#00d9ff',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  twinActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    borderRadius: '12px',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.35)',
    color: '#00d9ff',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.825rem',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '1.5rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  specCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(34, 229, 138, 0.1)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeading: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  subHeading: {
    margin: 0,
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#e2e8f0',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  specList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  specItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 0.875rem',
    background: 'rgba(8, 17, 13, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '0.85rem'
  },
  specLabelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  specLabel: {
    color: '#94a3b8',
    fontWeight: '500'
  },
  specVal: {
    fontWeight: '600',
    color: '#f8fafc'
  },
  geoJsonCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.25rem'
  },
  geoJsonHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inspectBtn: {
    padding: '0.35rem 0.75rem',
    background: 'rgba(0, 217, 255, 0.1)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '8px',
    color: '#00d9ff',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  jsonCodeBlock: {
    backgroundColor: 'rgba(5, 11, 9, 0.95)',
    color: '#00d9ff',
    padding: '0.875rem',
    borderRadius: '12px',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    fontSize: '0.725rem',
    maxHeight: '220px',
    overflowY: 'auto',
    fontFamily: 'monospace'
  },
<<<<<<< HEAD
  integrationCard: {
    padding: '1.25rem',
    backgroundColor: 'rgba(34, 229, 138, 0.06)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '16px'
  },
  mapCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
=======
  mapCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  digitalTwinSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingTop: '0.5rem'
  },
  dtSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid var(--color-border)'
  },
  moduleCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem'
  },
  moduleCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  moduleCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  emptyStateContainer: {
    padding: '0.875rem',
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed #cbd5e1'
  },
  emptyStateText: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic',
    margin: 0
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
