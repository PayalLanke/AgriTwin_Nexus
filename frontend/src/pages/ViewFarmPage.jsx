import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import FarmMap from '../components/FarmMap';
import { ArrowLeft, Edit2, Sprout, Calendar, Layers, MapPin, Code2, Cpu, ShieldCheck } from 'lucide-react';

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
        <h3 style={{ color: 'var(--color-danger)' }}>Farm Record Not Found</h3>
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
              <span className="badge badge-primary">{farm.status}</span>
            </div>
            <p style={styles.subtitle}>Digital Twin Boundary & Metadata Overview</p>
          </div>
        </div>

        <Link to={`/farms/edit/${farm.id}`} className="btn btn-secondary">
          <Edit2 size={16} />
          <span>Edit Farm & Boundary</span>
        </Link>
      </div>

      {/* Grid Layout */}
      <div style={styles.contentGrid}>
        {/* Left Column: Farm Specs & GeoJSON Raw Viewer */}
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
                  <Layers size={16} color="var(--color-accent)" />
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

          {/* Future Integration Readiness Badge */}
          <div style={styles.integrationCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--color-primary)" />
              <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                Module 7 Satellite Pipeline Ready
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.4' }}>
              This farm's GeoJSON polygon is registered and ready to receive Sentinel-2 multispectral imagery and compute NDVI/NDRE/SAVI indices in Module 7.
            </p>
          </div>
        </div>

        {/* Right Column: Leaflet Read-Only Map displaying Polygon */}
        <div style={styles.rightCol}>
          <div className="card" style={styles.mapCard}>
            <div style={styles.cardHeader}>
              <Cpu size={20} color="var(--color-teal)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Spatial Boundary Map</h3>
            </div>

            {/* Read-Only Leaflet Map with GeoJSON Boundary */}
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
    fontWeight: '700',
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
    gridTemplateColumns: '1fr 1.6fr',
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
  integrationCard: {
    padding: '1rem 1.25rem',
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid #bbf7d0',
    borderRadius: 'var(--radius-lg)'
  },
  mapCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }
};
