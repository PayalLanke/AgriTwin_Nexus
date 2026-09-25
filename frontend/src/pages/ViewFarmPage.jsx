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
  Satellite,
  Activity,
  ShieldAlert,
  TrendingUp,
  Sparkles,
  CloudSun
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
        <p>Loading Farm Digital Twin details...</p>
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="card" style={styles.errorCard}>
        <h3 style={{ color: 'var(--color-error)' }}>Farm Record Not Found</h3>
        <p>{error || 'The requested farm record does not exist.'}</p>
        <Link to="/farms" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to My Farms</span>
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
            <ArrowLeft size={20} color="#4b5563" />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={styles.title}>{farm.farmName}</h1>
              <span className="badge badge-primary">{farm.status || 'Active'}</span>
            </div>
            <p style={styles.subtitle}>Digital Twin Boundary & Metadata Overview</p>
          </div>
        </div>

        <Link to={`/farms/edit/${farm.id}`} className="btn btn-secondary">
          <Edit2 size={16} />
          <span>Edit Farm & Boundary</span>
        </Link>
      </div>

      {/* Primary Grid Layout */}
      <div style={styles.contentGrid}>
        {/* Left Column: Farm Specs & GeoJSON Payload Inspector */}
        <div style={styles.leftCol}>
          <div className="card" style={styles.specCard}>
            <div style={styles.cardHeader}>
              <Sprout size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Farm Specifications</h3>
            </div>

            <div style={styles.specList}>
              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
                  <Sprout size={16} color="var(--color-teal)" />
                  <span style={styles.specLabel}>Crop Type</span>
                </div>
                <span style={styles.specVal}>{farm.cropType}</span>
              </div>

              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
                  <Calendar size={16} color="var(--color-teal)" />
                  <span style={styles.specLabel}>Sowing Date</span>
                </div>
                <span style={styles.specVal}>{farm.sowingDate}</span>
              </div>

              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
                  <Layers size={16} color="var(--color-warning)" />
                  <span style={styles.specLabel}>Calculated Area</span>
                </div>
                <span style={styles.specVal}>
                  <b>{farm.areaHectares} Ha</b> ({farm.areaAcres} Acres)
                </span>
              </div>

              <div style={styles.specItem}>
                <div style={styles.specLabelGroup}>
                  <MapPin size={16} color="var(--color-primary)" />
                  <span style={styles.specLabel}>Center Coordinates</span>
                </div>
                <span style={styles.specVal}>
                  {farm.latitude.toFixed(6)}° N, {farm.longitude.toFixed(6)}° E
                </span>
              </div>
            </div>
          </div>

          {/* GeoJSON Polygon Raw Payload Inspection */}
          <div className="card" style={styles.geoJsonCard}>
            <div style={styles.geoJsonHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={18} color="var(--color-teal)" />
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>GeoJSON Boundary Data</h4>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
                onClick={() => setShowGeoJson(!showGeoJson)}
              >
                {showGeoJson ? 'Hide JSON' : 'Inspect GeoJSON'}
              </button>
            </div>

            {showGeoJson && (
              <pre style={styles.jsonCodeBlock}>
                {JSON.stringify(farm.boundary, null, 2)}
              </pre>
            )}
          </div>
        </div>

        {/* Right Column: Read-Only Leaflet Map displaying Polygon */}
        <div style={styles.rightCol}>
          <div className="card" style={styles.mapCard}>
            <div style={styles.cardHeader}>
              <Cpu size={20} color="var(--color-teal)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Spatial Boundary Map</h3>
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
    padding: '4rem',
    textAlign: 'center',
    color: 'var(--color-text-secondary)'
  },
  errorCard: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  backBtn: {
    width: '38px',
    height: '38px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    margin: 0
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
    gap: '1rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
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
    fontSize: '0.875rem'
  },
  specLabelGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  specLabel: {
    color: 'var(--color-text-secondary)',
    fontWeight: '500'
  },
  specVal: {
    fontWeight: '600',
    color: 'var(--color-text-main)'
  },
  geoJsonCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  geoJsonHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  jsonCodeBlock: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    padding: '0.875rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.725rem',
    maxHeight: '220px',
    overflowY: 'auto',
    fontFamily: 'monospace'
  },
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
  }
};
