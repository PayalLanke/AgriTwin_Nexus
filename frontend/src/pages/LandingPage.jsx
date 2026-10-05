import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Satellite,
  CloudSun,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Layers,
  BarChart3,
  Globe,
  Check,
  Cpu,
  FileText,
  TrendingUp,
  Activity,
  Database,
  Code2,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  // 5-Step Project Workflow Data
  const workflowSteps = [
    {
      step: '01',
      title: 'Register Farm',
      badge: 'Account Setup',
      desc: 'Farmer creates an account and enters core field metadata, including farm name, crop type, and sowing date.',
      icon: Sprout,
      color: '#16a34a'
    },
    {
      step: '02',
      title: 'Map Farm Boundary',
      badge: 'GIS Boundary Mapping',
      desc: 'Farmer searches location and draws exact field polygon vertices on an interactive satellite map to generate GeoJSON boundaries and calculate area in Hectares & Acres.',
      icon: MapPin,
      color: '#0284c7'
    },
    {
      step: '03',
      title: 'Collect Satellite & Weather Data',
      badge: 'Earth Observation Data',
      desc: 'Automated retrieval of Copernicus Sentinel-2 10-meter multispectral tiles via Google Earth Engine alongside real-time weather feeds for the farm location.',
      icon: Satellite,
      color: '#2563eb'
    },
    {
      step: '04',
      title: 'Analyze Crop Condition',
      badge: 'Vegetation Index Modeling',
      desc: 'Mathematical calculation of NDVI, NDRE, and SAVI indices to evaluate canopy photosynthetic vigor, chlorophyll levels, and soil water stress.',
      icon: Layers,
      color: '#059669'
    },
    {
      step: '05',
      title: 'Generate Recommendations',
      badge: 'Decision Support & Advisory',
      desc: 'Machine learning & rule-based diagnostics synthesize field data into actionable crop health insights, pest risk warnings, yield estimates, and downloadable PDF reports.',
      icon: BarChart3,
      color: '#d97706'
    }
  ];

  // Core Platform Features Data
  const platformFeatures = [
    {
      title: 'Farm Management',
      desc: 'Centralized directory to register, organize, and manage multiple farm holdings with crop types and planting dates.',
      icon: Sprout,
      accentColor: '#16a34a',
      bgColor: '#f0fdf4'
    },
    {
      title: 'Farm Boundary Mapping',
      desc: 'Interactive Leaflet vector engine for drawing field polygon vertices with real-time geodesic area calculation (Ha & Acres).',
      icon: MapPin,
      accentColor: '#0284c7',
      bgColor: '#f0f9ff'
    },
    {
      title: 'Satellite Monitoring',
      desc: 'Integration with Copernicus Sentinel-2 10m multispectral satellite imagery through Google Earth Engine (GEE) overpass streams.',
      icon: Satellite,
      accentColor: '#2563eb',
      bgColor: '#eff6ff'
    },
    {
      title: 'NDVI / NDRE / SAVI',
      desc: 'Multi-index vegetation analytics evaluating photosynthetic canopy vigor, red-edge chlorophyll, and soil-adjusted vegetation index.',
      icon: Layers,
      accentColor: '#059669',
      bgColor: '#ecfdf5'
    },
    {
      title: 'Weather Monitoring',
      desc: 'Localized temperature, relative humidity, precipitation, and wind telemetry feeds aligned with crop phenology stages.',
      icon: CloudSun,
      accentColor: '#0284c7',
      bgColor: '#f0f9ff'
    },
    {
      title: 'Crop Health Analysis',
      desc: 'Digital twin spatial representation combining satellite vegetation indices and weather data to track field vigor over time.',
      icon: Activity,
      accentColor: '#16a34a',
      bgColor: '#f0fdf4'
    },
    {
      title: 'Risk Analysis',
      desc: 'Pest and disease vulnerability diagnostics analyzing micro-climate conditions and crop stress patterns to issue early alerts.',
      icon: ShieldAlert,
      accentColor: '#d97706',
      bgColor: '#fffbeb'
    },
    {
      title: 'Yield Estimation',
      desc: 'Machine learning regression modeling synthesizing historical biomass curves, crop type, and field area for yield forecasting.',
      icon: TrendingUp,
      accentColor: '#7c3aed',
      bgColor: '#f5f3ff'
    },
    {
      title: 'Recommendations',
      desc: 'Agronomic decision support offering tailored advice on irrigation timing, nitrogen top-dressing, and crop protection actions.',
      icon: CheckCircle2,
      accentColor: '#16a34a',
      bgColor: '#f0fdf4'
    },
    {
      title: 'Reports',
      desc: 'Comprehensive summary reports compiling field metadata, boundary GeoJSON, satellite index trends, and risk assessments for records.',
      icon: FileText,
      accentColor: '#475569',
      bgColor: '#f8fafc'
    }
  ];

  // Tech Stack Data
  const techStack = [
    { name: 'React.js', category: 'Frontend UI Framework' },
    { name: 'FastAPI', category: 'Python REST API Backend' },
    { name: 'PostgreSQL', category: 'Relational & Spatial Database' },
    { name: 'Leaflet', category: 'Interactive Map Engine' },
    { name: 'GeoJSON', category: 'Geospatial Data Format' },
    { name: 'Sentinel-2', category: 'Copernicus 10m Satellite' },
    { name: 'Google Earth Engine', category: 'Cloud Earth Observation Pipeline' },
    { name: 'Python', category: 'Core Backend & Analytics' },
    { name: 'Scikit-learn', category: 'Machine Learning Models' },
    { name: 'NumPy', category: 'Scientific Computing & Matrix Math' }
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Top Header */}
      <header style={styles.navHeader}>
        <div style={styles.navContent}>
          <div style={styles.brand}>
            <div style={styles.logoIconBox}>
              <Sprout size={22} color="#ffffff" />
            </div>
            <div>
              <span style={styles.brandTitle}>AgriTwin <span style={{ color: '#22c55e' }}>Nexus</span></span>
              <span style={styles.brandSub}>Agricultural Digital Twin Platform</span>
            </div>
          </div>

          <nav style={styles.navLinks}>
            <a href="#how-it-works" style={styles.navLink}>How It Works</a>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#technology" style={styles.navLink}>Technology</a>
            <a href="#portals" style={styles.navLink}>Portals</a>
          </nav>

          <div style={styles.navActions}>
            <Link to="/farmer/login" style={styles.navBtnPrimary}>
              <span>Farmer Login</span>
            </Link>
            <Link to="/admin/login" style={styles.navBtnSecondary}>
              <ShieldCheck size={16} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroBadge}>
            <Globe size={15} color="#16a34a" />
            <span>Precision Agriculture & Remote Sensing Software</span>
          </div>

          <h1 style={styles.heroTitle}>
            Intelligent Digital Twin Platform for <span style={styles.highlightText}>Precision Farming</span>
          </h1>

          <p style={styles.heroDesc}>
            AgriTwin Nexus combines farm mapping, satellite imagery, weather data and machine learning to create a digital representation of agricultural fields and support data-driven farm decisions.
          </p>

          <div style={styles.heroCtaRow}>
            <Link to="/farmer/login" style={styles.primaryCtaBtn}>
              <span>Farmer Login</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/farmer/register" style={styles.secondaryCtaBtn}>
              <Sprout size={18} color="#15803d" />
              <span>Register Farm</span>
            </Link>

            <Link to="/admin/login" style={styles.adminCtaBtn}>
              <ShieldCheck size={18} color="#475569" />
              <span>Administrator Portal</span>
            </Link>
          </div>

          {/* Quick Summary Highlights */}
          <div style={styles.heroHighlightsGrid}>
            <div style={styles.highlightCard}>
              <MapPin size={20} color="#0284c7" />
              <div>
                <strong style={styles.highlightTitle}>Interactive Field Mapping</strong>
                <span style={styles.highlightSub}>GeoJSON boundary drawing & area math</span>
              </div>
            </div>

            <div style={styles.highlightCard}>
              <Satellite size={20} color="#2563eb" />
              <div>
                <strong style={styles.highlightTitle}>Sentinel-2 Satellite Feed</strong>
                <span style={styles.highlightSub}>10m resolution multispectral optical data</span>
              </div>
            </div>

            <div style={styles.highlightCard}>
              <Layers size={20} color="#059669" />
              <div>
                <strong style={styles.highlightTitle}>Vegetation Indices</strong>
                <span style={styles.highlightSub}>NDVI, NDRE & SAVI crop canopy vigor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How AgriTwin Nexus Works (5 Steps Workflow) */}
      <section id="how-it-works" style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>System Architecture</span>
          <h2 style={styles.sectionTitle}>How AgriTwin Nexus Works</h2>
          <p style={styles.sectionSub}>
            A complete software-based workflow bridging field boundary drawing with satellite Earth observation and machine learning analytics.
          </p>
        </div>

        <div style={styles.workflowGrid}>
          {workflowSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.step} style={styles.workflowCard}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ ...styles.stepNumber, color: step.color }}>{step.step}</span>
                  <div style={{ ...styles.stepIconCircle, backgroundColor: `${step.color}15`, borderColor: step.color }}>
                    <IconComponent size={22} color={step.color} />
                  </div>
                </div>
                <span style={styles.stepBadge}>{step.badge}</span>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" style={{ ...styles.sectionContainer, backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={styles.sectionHeader}>
          <span style={{ ...styles.sectionBadge, color: '#0284c7', backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
            Comprehensive Capabilities
          </span>
          <h2 style={{ ...styles.sectionTitle, color: '#0f172a' }}>Platform Features</h2>
          <p style={{ ...styles.sectionSub, color: '#64748b' }}>
            End-to-end analytical modules designed for precision agronomic decision support.
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {platformFeatures.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div key={idx} style={styles.featureCard}>
                <div style={{ ...styles.featureIconBox, backgroundColor: feat.bgColor, borderColor: `${feat.accentColor}30` }}>
                  <IconComp size={22} color={feat.accentColor} />
                </div>
                <h3 style={styles.featureTitle}>{feat.title}</h3>
                <p style={styles.featureDesc}>{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Used Section */}
      <section id="technology" style={styles.sectionContainer}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Technical Stack</span>
          <h2 style={styles.sectionTitle}>Technology Used</h2>
          <p style={styles.sectionSub}>
            Built using modern web technologies, spatial GIS tools, and machine learning frameworks.
          </p>
        </div>

        <div style={styles.techStackGrid}>
          {techStack.map((tech, idx) => (
            <div key={idx} style={styles.techItemCard}>
              <div style={styles.techIconDot} />
              <div>
                <h4 style={styles.techName}>{tech.name}</h4>
                <span style={styles.techCategory}>{tech.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portals Access Section */}
      <section id="portals" style={{ ...styles.sectionContainer, backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Access Gateways</span>
          <h2 style={{ ...styles.sectionTitle, color: '#0f172a' }}>Platform Gateways</h2>
          <p style={{ ...styles.sectionSub, color: '#64748b' }}>
            Dedicated portals for farmers and system administrators.
          </p>
        </div>

        <div style={styles.portalsRow}>
          {/* Farmer Portal Card */}
          <div style={styles.portalBox}>
            <div style={styles.portalHeader}>
              <div style={styles.portalIconGreen}>
                <Sprout size={24} color="#15803d" />
              </div>
              <div>
                <h3 style={styles.portalTitle}>Farmer Portal</h3>
                <span style={styles.portalSubtitle}>Field Management & Digital Twin</span>
              </div>
            </div>
            <p style={styles.portalText}>
              Register your farm, draw precise field boundaries on satellite maps, view calculated land acreage, and inspect vegetation health indices.
            </p>
            <div style={styles.portalButtonRow}>
              <Link to="/farmer/login" style={styles.portalBtnPrimary}>
                <span>Farmer Login</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/farmer/register" style={styles.portalBtnOutline}>
                <span>Register Farm</span>
              </Link>
            </div>
          </div>

          {/* Admin Portal Card */}
          <div style={styles.portalBoxAdmin}>
            <div style={styles.portalHeader}>
              <div style={styles.portalIconSlate}>
                <ShieldCheck size={24} color="#0f172a" />
              </div>
              <div>
                <h3 style={styles.portalTitle}>Administrator Portal</h3>
                <span style={styles.portalSubtitle}>Platform Oversight & System Records</span>
              </div>
            </div>
            <p style={styles.portalText}>
              Review registered farms directory, monitor platform usage across districts, track satellite data ingestion pipelines, and manage system users.
            </p>
            <div style={styles.portalButtonRow}>
              <Link to="/admin/login" style={styles.adminBtnPrimary}>
                <span>Admin Login</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <div style={styles.brand}>
              <div style={{ ...styles.logoIconBox, backgroundColor: '#15803d' }}>
                <Sprout size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                AgriTwin <span style={{ color: '#4ade80' }}>Nexus</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem', maxWidth: '360px', lineHeight: '1.5' }}>
              Intelligent Digital Twin Platform for Precision Farming
            </p>
          </div>

          <div style={styles.footerLinksCol}>
            <h4 style={styles.footerHeading}>Navigation</h4>
            <a href="#how-it-works" style={styles.footerNavLink}>How It Works</a>
            <a href="#features" style={styles.footerNavLink}>Features</a>
            <a href="#technology" style={styles.footerNavLink}>Technology</a>
            <a href="#portals" style={styles.footerNavLink}>Portals</a>
          </div>

          <div style={styles.footerLinksCol}>
            <h4 style={styles.footerHeading}>Portals</h4>
            <Link to="/farmer/login" style={styles.footerNavLink}>Farmer Login</Link>
            <Link to="/farmer/register" style={styles.footerNavLink}>Register Farm</Link>
            <Link to="/admin/login" style={styles.footerNavLink}>Administrator Portal</Link>
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
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  navHeader: {
    backgroundColor: '#0f172a',
    borderBottom: '1px solid #1e293b',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.875rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  brandTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#ffffff',
    display: 'block',
    lineHeight: '1.1'
  },
  brandSub: {
    fontSize: '0.68rem',
    color: '#94a3b8',
    display: 'block'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
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
  navBtnPrimary: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.825rem',
    textDecoration: 'none',
    transition: 'background 0.15s ease'
  },
  navBtnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.825rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  heroSection: {
    backgroundColor: '#0f172a',
    backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 75%)',
    color: '#ffffff',
    padding: '4rem 1.5rem 4.5rem 1.5rem',
    borderBottom: '1px solid #1e293b'
  },
  heroContainer: {
    maxWidth: '960px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem'
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    padding: '0.375rem 0.875rem',
    borderRadius: '9999px',
    fontSize: '0.8125rem',
    fontWeight: '600',
    color: '#4ade80'
  },
  heroTitle: {
    fontSize: '2.6rem',
    fontWeight: '800',
    lineHeight: '1.25',
    color: '#ffffff',
    margin: 0,
    maxWidth: '840px'
  },
  highlightText: {
    color: '#4ade80'
  },
  heroDesc: {
    fontSize: '1.05rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: 0,
    maxWidth: '780px'
  },
  heroCtaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap'
  },
  primaryCtaBtn: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.925rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)'
  },
  secondaryCtaBtn: {
    backgroundColor: '#ffffff',
    color: '#15803d',
    padding: '0.75rem 1.35rem',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.925rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid #cbd5e1'
  },
  adminCtaBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#f8fafc',
    padding: '0.75rem 1.35rem',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '0.925rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  heroHighlightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '900px'
  },
  highlightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    textAlign: 'left'
  },
  highlightTitle: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  highlightSub: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '2px'
  },
  sectionContainer: {
    padding: '4rem 1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  sectionBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#15803d',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    padding: '3px 10px',
    borderRadius: '9999px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  sectionSub: {
    fontSize: '0.95rem',
    color: '#64748b',
    margin: 0,
    maxWidth: '640px',
    lineHeight: '1.5'
  },
  workflowGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem'
  },
  workflowCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column'
  },
  stepNumber: {
    fontSize: '1.75rem',
    fontWeight: '900',
    fontFamily: 'Space Grotesk, sans-serif',
    lineHeight: '1'
  },
  stepIconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBadge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.35rem'
  },
  stepTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.5rem 0'
  },
  stepDesc: {
    fontSize: '0.825rem',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.25rem'
  },
  featureCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
  },
  featureIconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 0.4rem 0'
  },
  featureDesc: {
    fontSize: '0.825rem',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5'
  },
  techStackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  techItemCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
  },
  techIconDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#16a34a',
    flexShrink: 0
  },
  techName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  techCategory: {
    fontSize: '0.725rem',
    color: '#64748b',
    display: 'block',
    marginTop: '2px'
  },
  portalsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  portalBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #bbf7d0',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 16px rgba(22, 163, 74, 0.06)'
  },
  portalBoxAdmin: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)'
  },
  portalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  portalIconGreen: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  portalIconSlate: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  portalTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  portalSubtitle: {
    fontSize: '0.75rem',
    color: '#64748b',
    display: 'block'
  },
  portalText: {
    fontSize: '0.875rem',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  portalButtonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  portalBtnPrimary: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '0.625rem 1.25rem',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.85rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  portalBtnOutline: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    color: '#0f172a',
    padding: '0.625rem 1.25rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.85rem',
    textDecoration: 'none'
  },
  adminBtnPrimary: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '0.625rem 1.25rem',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.85rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  footer: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    borderTop: '1px solid #1e293b',
    marginTop: 'auto'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem 2rem 1.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem'
  },
  footerHeading: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  footerLinksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  footerNavLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: '0.85rem',
    transition: 'color 0.15s ease'
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid #1e293b',
    fontSize: '0.8rem',
    color: '#64748b',
    textAlign: 'center'
  }
};
