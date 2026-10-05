import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Satellite,
  CloudSun,
  ShieldCheck,
  Cpu,
  MapPin,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Layers,
  Sparkles,
  BarChart3,
  Globe,
  Sliders,
  Eye,
  UserPlus,
  Compass,
  Activity,
  Zap,
  Check
} from 'lucide-react';

export default function LandingPage() {
  // State for Interactive Hero Digital Twin Preview Layer Sandbox
  const [activePreviewLayer, setActivePreviewLayer] = useState('ndvi');
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(0);

  // Digital Twin Sandbox Data
  const twinLayers = {
    satellite: {
      name: 'Sentinel-2 Satellite RGB',
      badge: '10m True Color Tile',
      desc: 'High-resolution multispectral imagery captured via European Space Agency (ESA) Sentinel-2 constellation.',
      color: '#0f766e',
      bgGradient: 'radial-gradient(circle at center, #134e4a 0%, #064e3b 100%)',
      metricVal: 'Band 4-3-2',
      metricLabel: 'Optical Spectrum'
    },
    ndvi: {
      name: 'NDVI Vigor Heatmap',
      badge: 'Normalized Difference Vegetation Index',
      desc: 'Canopy density calculation: (NIR - Red) / (NIR + Red) highlighting active photosynthesis zones.',
      color: '#16a34a',
      bgGradient: 'radial-gradient(circle at center, #15803d 0%, #052e16 100%)',
      metricVal: '0.78 NDVI',
      metricLabel: 'Healthy Photosynthetic Vigor'
    },
    moisture: {
      name: 'Root-Zone Thermal Moisture',
      badge: 'Soil Moisture Index (SMI)',
      desc: 'Shortwave infrared (SWIR) soil surface reflectance identifying volumetric water content.',
      color: '#0284c7',
      bgGradient: 'radial-gradient(circle at center, #0369a1 0%, #0c4a6e 100%)',
      metricVal: '34% VWC',
      metricLabel: 'Optimal Root Hydration'
    },
    geojson: {
      name: 'GeoJSON Vector Delineation',
      badge: 'Geospatial Field Boundary',
      desc: 'Exact coordinates polygon boundary drawn by farmer with real-time geodesic area computation.',
      color: '#d97706',
      bgGradient: 'radial-gradient(circle at center, #b45309 0%, #451a03 100%)',
      metricVal: '3.85 Hectares',
      metricLabel: 'Delineated Farm Area'
    }
  };

  // Workflow Pipeline Data
  const workflowSteps = [
    {
      num: '01',
      title: 'Farmer Profile & Farm Entry',
      subtitle: 'Initialization',
      desc: 'Farmer registers on the platform and creates a plot record specifying crop type and planting date.',
      tech: 'FastAPI / PostgreSQL Metadata'
    },
    {
      num: '02',
      title: 'Geospatial Delineation',
      subtitle: 'Leaflet Vector Engine',
      desc: 'Delineate field boundary vertices on Leaflet interactive satellite map with live area calculation.',
      tech: 'GeoJSON & Geoman IO'
    },
    {
      num: '03',
      title: 'Sentinel-2 Ingestion',
      subtitle: 'Earth Observation Data',
      desc: 'Automated retrieval of 10-meter resolution multispectral tiles matching farm bounding box coordinates.',
      tech: 'Google Earth Engine API'
    },
    {
      num: '04',
      title: 'Multispectral Index Modeling',
      subtitle: 'Agronomic Bands',
      desc: 'Mathematical computation of NDVI (NDVI = NIR-Red/NIR+Red), NDRE, and SAVI vegetation indices.',
      tech: 'Rasterio & NumPy Matrix Math'
    },
    {
      num: '05',
      title: 'Spatial Digital Twin Synthesis',
      subtitle: 'Field Replica Canvas',
      desc: 'Combine spatial grid, micro-climate feeds, and soil parameters into a cohesive virtual field replica.',
      tech: 'Digital Twin Spatial Grid'
    },
    {
      num: '06',
      title: 'Agronomic Risk Engine',
      subtitle: 'Rule & ML Diagnostics',
      desc: 'Identify pest infestation vulnerability, irrigation deficit, and estimated harvest yield.',
      tech: 'ML Pathogen Risk Classifier'
    },
    {
      num: '07',
      title: 'Actionable Advisory',
      subtitle: 'Precision Farming',
      desc: 'Deliver localized recommendations for variable-rate fertilizer application and irrigation scheduling.',
      tech: 'Agronomic Rule Engine'
    }
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Top Glassmorphic Navigation Header */}
      <header style={styles.navHeader}>
        <div style={styles.navContent}>
          <div style={styles.brand}>
            <div style={styles.logoIconBox}>
              <Sprout size={24} color="#ffffff" />
            </div>
            <div>
              <span style={styles.brandTitle}>AgriTwin <span style={{ color: '#4ade80' }}>Nexus</span></span>
              <span style={styles.brandSub}>Intelligent Precision Farming Digital Twin</span>
            </div>
          </div>

          <nav style={styles.navLinks}>
            <a href="#home" style={styles.navLink}>Home</a>
            <a href="#sandbox" style={styles.navLink}>Live Digital Twin</a>
            <a href="#portals" style={styles.navLink}>Portals</a>
            <a href="#pipeline" style={styles.navLink}>7-Step Pipeline</a>
            <a href="#technology" style={styles.navLink}>Technology</a>
          </nav>

          <div style={styles.navActions}>
            <Link to="/farmer/login" className="btn btn-primary" style={styles.navBtn}>
              <span>Farmer Portal</span>
            </Link>
            <Link to="/admin/login" className="btn btn-teal" style={styles.navBtn}>
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Interactive Sandbox */}
      <section id="home" style={styles.heroSection}>
        <div style={styles.heroContainer}>
          {/* Left Column: Vision & CTAs */}
          <div style={styles.heroLeftCol}>
            <div style={styles.heroBadge}>
              <Sparkles size={16} color="#4ade80" />
              <span>Next-Gen Earth Observation Platform</span>
            </div>

            <h1 style={styles.heroTitle}>
              Intelligent Digital Twin Platform for <span style={styles.highlightText}>Precision Farming</span>
            </h1>

            <p style={styles.heroDesc}>
              Bridge physical field management with satellite imagery, weather telemetry, and vegetation index modeling. Monitor farm boundaries, analyze canopy health, and receive agronomic recommendations.
            </p>

            {/* Role Action CTAs */}
            <div style={styles.heroCtaGrid}>
              <div style={styles.ctaBox}>
                <div style={styles.ctaHeader}>
                  <Sprout size={20} color="var(--color-primary)" />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Farmer Portal</span>
                </div>
                <p style={styles.ctaSub}>Register field boundary & view crop twin</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Link to="/farmer/register" className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>
                    <span>Register Farm</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/farmer/login" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                    Login
                  </Link>
                </div>
              </div>

              <div style={styles.ctaBoxTeal}>
                <div style={styles.ctaHeader}>
                  <ShieldAlert size={20} color="var(--color-teal)" />
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Admin Console</span>
                </div>
                <p style={styles.ctaSub}>Platform operations & farm monitoring</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Link to="/admin/login" className="btn btn-teal" style={{ flex: 1, fontSize: '0.8rem' }}>
                    <span>Admin Login</span>
                  </Link>
                  <Link to="/admin/register" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                    <UserPlus size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={styles.quickMetricsRow}>
              <div style={styles.quickMetricItem}>
                <Zap size={16} color="#4ade80" />
                <span>10m Band Resolution</span>
              </div>
              <div style={styles.quickMetricItem}>
                <Layers size={16} color="#38bdf8" />
                <span>NDVI / NDRE / SAVI</span>
              </div>
              <div style={styles.quickMetricItem}>
                <Compass size={16} color="#facc15" />
                <span>GeoJSON Vectors</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Digital Twin Sandbox */}
          <div id="sandbox" style={styles.sandboxCard} className="animate-fade-in">
            <div style={styles.sandboxHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} color="#4ade80" />
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff' }}>
                  Interactive Digital Twin Sandbox
                </span>
              </div>
              <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>Live Demo View</span>
            </div>

            {/* Layer Selector Controls */}
            <div style={styles.layerSelectorBar}>
              {Object.keys(twinLayers).map((layerKey) => (
                <button
                  key={layerKey}
                  onClick={() => setActivePreviewLayer(layerKey)}
                  style={{
                    ...styles.layerBtn,
                    backgroundColor: activePreviewLayer === layerKey ? twinLayers[layerKey].color : 'transparent',
                    color: activePreviewLayer === layerKey ? '#ffffff' : '#94a3b8',
                    borderColor: activePreviewLayer === layerKey ? twinLayers[layerKey].color : 'rgba(255,255,255,0.15)'
                  }}
                >
                  {layerKey === 'satellite' && <Satellite size={14} />}
                  {layerKey === 'ndvi' && <Sprout size={14} />}
                  {layerKey === 'moisture' && <CloudSun size={14} />}
                  {layerKey === 'geojson' && <MapPin size={14} />}
                  <span>{twinLayers[layerKey].name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Interactive Canvas Simulation Box */}
            <div
              style={{
                ...styles.canvasViewport,
                background: twinLayers[activePreviewLayer].bgGradient
              }}
            >
              {/* Overlay Grid Lines */}
              <div style={styles.gridOverlay} />

              {/* Dynamic Polygon Boundary Mock */}
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                <polygon
                  points="60,40 280,30 320,180 120,210 40,120"
                  fill={twinLayers[activePreviewLayer].color}
                  fillOpacity="0.3"
                  stroke={twinLayers[activePreviewLayer].color}
                  strokeWidth="3"
                  strokeDasharray={activePreviewLayer === 'geojson' ? '6,4' : 'none'}
                />
                <circle cx="180" cy="110" r="6" fill="#ffffff" />
                <text x="192" y="115" fill="#ffffff" fontSize="12" fontWeight="700">Farm Center (Lat 18.52° N)</text>
              </svg>

              {/* Live Metric Floating Pill */}
              <div style={styles.liveMetricBadge}>
                <Activity size={14} color="#4ade80" />
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>
                    {twinLayers[activePreviewLayer].metricLabel}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
                    {twinLayers[activePreviewLayer].metricVal}
                  </span>
                </div>
              </div>
            </div>

            {/* Layer Description Footer */}
            <div style={styles.sandboxFooter}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '0.5rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#ffffff' }}>
                  {twinLayers[activePreviewLayer].name}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px' }}>
                  {twinLayers[activePreviewLayer].badge}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                {twinLayers[activePreviewLayer].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Portal Selection Section */}
      <section id="portals" style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <span className="badge badge-teal">Access Gateways</span>
          <h2 style={styles.sectionTitle}>Select Platform Portal</h2>
          <p style={styles.sectionSub}>Tailored operational control for both individual farmers and system administrators.</p>
        </div>

        <div style={styles.portalsGrid}>
          {/* Farmer Portal Card */}
          <div className="card" style={styles.portalCard}>
            <div style={styles.portalBadgeRow}>
              <div style={styles.portalIconBoxGreen}>
                <Sprout size={28} color="var(--color-primary)" />
              </div>
              <span className="badge badge-primary">Farmer Portal</span>
            </div>
            <h3 style={styles.portalTitle}>Farmer Interface</h3>
            <p style={styles.portalDesc}>
              Register your farm location, delineate plot boundaries on satellite maps, calculate field area in Hectares and Acres, and track digital twin health.
            </p>
            <div style={styles.portalFeaturesList}>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-primary)" /> Interactive GeoJSON boundary drawing</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-primary)" /> Automated geodesic field area computation</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-primary)" /> Sentinel-2 satellite canopy monitoring</div>
            </div>
            <div style={styles.portalActionGroup}>
              <Link to="/farmer/login" className="btn btn-primary" style={{ flex: 1 }}>
                <span>Farmer Login</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/farmer/register" className="btn btn-secondary" style={{ flex: 1 }}>
                <span>Register Farm</span>
              </Link>
            </div>
          </div>

          {/* Administrator Portal Card */}
          <div className="card" style={styles.portalCardTeal}>
            <div style={styles.portalBadgeRow}>
              <div style={styles.portalIconBoxTeal}>
                <ShieldAlert size={28} color="var(--color-teal)" />
              </div>
              <span className="badge badge-teal">Admin Control</span>
            </div>
            <h3 style={styles.portalTitle}>Administrator Console</h3>
            <p style={styles.portalDesc}>
              Monitor registered farms across regions, track satellite ingestion status, review crop distribution statistics, and manage platform user directories.
            </p>
            <div style={styles.portalFeaturesList}>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-teal)" /> Geospatial platform farm map oversight</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-teal)" /> Regional crop density & land coverage stats</div>
              <div style={styles.portalCheckItem}><Check size={16} color="var(--color-teal)" /> Sentinel-2 API pipeline telemetry logs</div>
            </div>
            <div style={styles.portalActionGroup}>
              <Link to="/admin/login" className="btn btn-teal" style={{ flex: 1 }}>
                <span>Admin Login</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/admin/register" className="btn btn-secondary" style={{ flex: 1 }}>
                <UserPlus size={16} />
                <span>Register Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 7-Step Pipeline Section */}
      <section id="pipeline" style={{ ...styles.sectionContainer, backgroundColor: '#ffffff' }}>
        <div style={styles.sectionHeader}>
          <span className="badge badge-primary">Platform Lifecycle</span>
          <h2 style={styles.sectionTitle}>7-Step Precision Agriculture Pipeline</h2>
          <p style={styles.sectionSub}>From raw farmer vector boundaries to automated satellite digital twin recommendations.</p>
        </div>

        <div style={styles.pipelineInteractiveLayout}>
          {/* Stepper Tabs Bar */}
          <div style={styles.stepperNav}>
            {workflowSteps.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => setSelectedWorkflowStep(idx)}
                style={{
                  ...styles.stepperTab,
                  backgroundColor: selectedWorkflowStep === idx ? 'var(--color-primary-light)' : 'transparent',
                  borderColor: selectedWorkflowStep === idx ? 'var(--color-primary)' : 'var(--color-border)',
                  color: selectedWorkflowStep === idx ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                }}
              >
                <span style={styles.stepperNum}>{step.num}</span>
                <span style={styles.stepperTitleShort}>{step.title}</span>
              </button>
            ))}
          </div>

          {/* Stepper Detail Showcase Box */}
          <div style={styles.stepperDetailBox} className="card">
            <div style={styles.stepperDetailHeader}>
              <div style={styles.stepperBigBadge}>{workflowSteps[selectedWorkflowStep].num}</div>
              <div>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  {workflowSteps[selectedWorkflowStep].subtitle}
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
                  {workflowSteps[selectedWorkflowStep].title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              {workflowSteps[selectedWorkflowStep].desc}
            </p>

            <div style={styles.stepperTechBox}>
              <Cpu size={18} color="var(--color-teal)" />
              <span><b>Engine Module</b>: {workflowSteps[selectedWorkflowStep].tech}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Grid Section */}
      <section id="technology" style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <span className="badge badge-teal">Architecture</span>
          <h2 style={styles.sectionTitle}>Built on Earth Observation & Spatial Intelligence</h2>
          <p style={styles.sectionSub}>Modern tech stack engineered for scalability and data accuracy.</p>
        </div>

        <div style={styles.techGrid}>
          <div className="card" style={styles.techCard}>
            <Satellite size={32} color="var(--color-primary)" />
            <h4 style={styles.techCardTitle}>Sentinel-2 Multispectral</h4>
            <p style={styles.techCardDesc}>
              Utilizes 10m spatial resolution optical bands (Band 4 Red, Band 8 NIR, Band 5 Vegetation Red Edge) for canopy vigor.
            </p>
          </div>

          <div className="card" style={styles.techCard}>
            <MapPin size={32} color="var(--color-teal)" />
            <h4 style={styles.techCardTitle}>Leaflet GeoJSON Vector Engine</h4>
            <p style={styles.techCardDesc}>
              Real-time geodesic area calculation in Hectares and Acres using GeoJSON polygon vertex coordinate math.
            </p>
          </div>

          <div className="card" style={styles.techCard}>
            <Globe size={32} color="var(--color-warning)" />
            <h4 style={styles.techCardTitle}>Google Earth Engine Pipeline</h4>
            <p style={styles.techCardDesc}>
              Pre-configured cloud computing pipeline for historical satellite band extraction and temporal curve modeling.
            </p>
          </div>

          <div className="card" style={styles.techCard}>
            <Cpu size={32} color="#7c3aed" />
            <h4 style={styles.techCardTitle}>Machine Learning Risk Engine</h4>
            <p style={styles.techCardDesc}>
              Rule-based and supervised ML models predicting pathogen infection risk windows and yield output.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <div style={styles.brand}>
              <Sprout size={24} color="#ffffff" />
              <span style={{ ...styles.brandTitle, color: '#ffffff' }}>AgriTwin Nexus</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: '320px' }}>
              Intelligent Digital Twin Platform for Precision Farming
            </p>
          </div>

          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>Quick Links</h4>
            <a href="#home" style={styles.footerLink}>Home</a>
            <a href="#sandbox" style={styles.footerLink}>Live Digital Twin</a>
            <a href="#portals" style={styles.footerLink}>Portals</a>
            <a href="#pipeline" style={styles.footerLink}>7-Step Pipeline</a>
            <a href="#technology" style={styles.footerLink}>Technology</a>
          </div>

          <div style={styles.footerCol}>
            <h4 style={styles.footerColTitle}>Access Gateways</h4>
            <Link to="/farmer/login" style={styles.footerLink}>Farmer Portal Login</Link>
            <Link to="/farmer/register" style={styles.footerLink}>Register New Farm</Link>
            <Link to="/admin/login" style={styles.footerLink}>Administrator Portal</Link>
            <Link to="/admin/register" style={styles.footerLink}>Register New Admin</Link>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span>© 2026 AgriTwin Nexus Platform. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#090d16',
    color: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  navHeader: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContent: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '0.875rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoIconBox: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(22, 163, 74, 0.5)'
  },
  brandTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    display: 'block',
    lineHeight: '1.1'
  },
  brandSub: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    display: 'block'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem'
  },
  navLink: {
    textDecoration: 'none',
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'color 0.15s ease'
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  navBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.825rem'
  },
  heroSection: {
    padding: '3.5rem 1.5rem 4.5rem 1.5rem',
    background: 'radial-gradient(circle at 50% 20%, #064e3b 0%, #0f172a 70%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  heroContainer: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '3rem',
    alignItems: 'center'
  },
  heroLeftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.3)',
    padding: '0.375rem 0.875rem',
    borderRadius: '9999px',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: '#4ade80',
    width: 'fit-content'
  },
  heroTitle: {
    fontSize: '2.65rem',
    fontWeight: '800',
    lineHeight: '1.2',
    color: '#ffffff',
    margin: 0
  },
  highlightText: {
    background: 'linear-gradient(135deg, #4ade80 0%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroDesc: {
    fontSize: '1.025rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: 0
  },
  heroCtaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  ctaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '14px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  ctaBoxTeal: {
    backgroundColor: 'rgba(15, 118, 110, 0.15)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    borderRadius: '14px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  ctaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#ffffff'
  },
  ctaSub: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    margin: '2px 0 6px 0'
  },
  quickMetricsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap'
  },
  quickMetricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#cbd5e1'
  },
  sandboxCard: {
    backgroundColor: '#0f172a',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  sandboxHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  layerSelectorBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem'
  },
  layerBtn: {
    padding: '0.5rem 0.375rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.725rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.375rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  canvasViewport: {
    height: '240px',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'background 0.4s ease'
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    pointerEvents: 'none'
  },
  liveMetricBadge: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '0.5rem 0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    zIndex: 10
  },
  sandboxFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '0.75rem 1rem'
  },
  sectionContainer: {
    padding: '4.5rem 1.5rem',
    maxWidth: '1240px',
    margin: '0 auto',
    width: '100%'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '2.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  sectionSub: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    margin: 0,
    maxWidth: '650px'
  },
  portalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2rem'
  },
  portalCard: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    borderRadius: '18px'
  },
  portalCardTeal: {
    backgroundColor: '#092327',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    padding: '2.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    borderRadius: '18px'
  },
  portalBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  portalIconBoxGreen: {
    width: '54px',
    height: '54px',
    borderRadius: '14px',
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  portalIconBoxTeal: {
    width: '54px',
    height: '54px',
    borderRadius: '14px',
    backgroundColor: 'rgba(15, 118, 110, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  portalTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  portalDesc: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: 0
  },
  portalFeaturesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '12px'
  },
  portalCheckItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    fontSize: '0.825rem',
    color: '#cbd5e1',
    fontWeight: '600'
  },
  portalActionGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    marginTop: '0.5rem'
  },
  pipelineInteractiveLayout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  stepperNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem'
  },
  stepperTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.875rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  stepperNum: {
    fontSize: '0.9rem',
    fontWeight: '800',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepperTitleShort: {
    fontSize: '0.875rem',
    fontWeight: '700'
  },
  stepperDetailBox: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    borderRadius: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    position: 'sticky',
    top: '100px'
  },
  stepperDetailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  stepperBigBadge: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    width: '54px',
    height: '54px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepperTechBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    backgroundColor: 'rgba(15, 118, 110, 0.2)',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    fontSize: '0.825rem',
    color: '#38bdf8'
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem'
  },
  techCard: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.75rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem'
  },
  techCardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  techCardDesc: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: '1.5',
    margin: 0
  },
  footer: {
    backgroundColor: '#030712',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '3.5rem',
    marginTop: 'auto'
  },
  footerContent: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '0 1.5rem 3rem 1.5rem',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '2.5rem'
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  footerColTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 0.5rem 0'
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    transition: 'color 0.15s ease'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1.25rem 1.5rem',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#64748b'
  }
};
