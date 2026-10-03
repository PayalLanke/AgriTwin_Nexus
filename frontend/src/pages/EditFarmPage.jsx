import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FarmMap from '../components/FarmMap';
import { farmService, CROP_OPTIONS } from '../services/farmService';
<<<<<<< HEAD
import { ArrowLeft, Save, AlertCircle, Sprout, Layers, Calendar, FileText, Crosshair, Sparkles } from 'lucide-react';
=======
import { ArrowLeft, Save, AlertCircle, Sprout, Layers, Calendar, FileText, CheckCircle2 } from 'lucide-react';
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4

export default function EditFarmPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [farmName, setFarmName] = useState('');
  const [cropType, setCropType] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFarmForEditing();
  }, [id]);

  const loadFarmForEditing = async () => {
    setIsLoading(true);
    try {
      const farm = await farmService.getFarmById(id);
      setFarmName(farm.farmName);
      setCropType(farm.cropType);
      setSowingDate(farm.sowingDate);
      setLatitude(farm.latitude);
      setLongitude(farm.longitude);
      setBoundaryGeoJSON(farm.boundary);
    } catch (err) {
      setError(err.message || 'Failed to load farm for editing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (newLat, newLng) => {
    setLatitude(newLat);
    setLongitude(newLng);
  };

  const handleBoundaryChange = (geojson) => {
    setBoundaryGeoJSON(geojson);
    if (error) setError('');
  };

  const calculatedAreaHa = boundaryGeoJSON?.properties?.areaHectares || 0;
  const calculatedAreaAcres = boundaryGeoJSON?.properties?.areaAcres || 0;

  const handleUpdateFarm = async (e) => {
    e.preventDefault();
    setError('');

    if (!farmName.trim()) {
      setError('Farm Name is required.');
      return;
    }
    if (!cropType) {
      setError('Please select a Crop Type.');
      return;
    }
    if (!sowingDate) {
      setError('Sowing Date is required.');
      return;
    }
    if (!boundaryGeoJSON) {
      setError('Please draw or retain a valid farm boundary polygon on the map.');
      return;
    }

    setIsSaving(true);
    try {
      await farmService.updateFarm(id, {
        farmName,
        cropType,
        sowingDate,
        latitude,
        longitude,
        boundary: boundaryGeoJSON
      });

      navigate(`/farms/view/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update farm record.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          INITIALIZING SPATIAL FARM EDITOR...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header Bar */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to={`/farms/view/${id}`} style={styles.backBtn} title="Cancel and go back">
            <ArrowLeft size={18} color="#22e58a" />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={styles.title}>Edit Farm Boundary & Coordinates</h1>
              <span style={styles.statusBadge}>
                <Crosshair size={12} color="#00d9ff" />
                GEOJSON CALIBRATION
              </span>
            </div>
            <p style={styles.subtitle}>
              Adjust polygon vertices on the spatial map to calibrate Sentinel-2 ROI & 3D Twin Prism mesh.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.errorBanner}>
<<<<<<< HEAD
          <AlertCircle size={20} color="#f87171" />
=======
          <AlertCircle size={20} color="var(--color-error)" />
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdateFarm} style={styles.formLayout}>
        {/* Left Column: Form Details */}
        <div style={styles.leftCol}>
          <div style={styles.cardSection}>
            <div style={styles.cardSectionHeader}>
<<<<<<< HEAD
              <div style={styles.iconCircle}>
                <Sprout size={18} color="#22e58a" />
              </div>
              <h3 style={styles.sectionHeading}>Farm Metadata Specs</h3>
=======
              <Sprout size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Farm Information</h3>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="farmName">FARM / PLOT IDENTIFIER</label>
              <div style={styles.inputIconWrapper}>
                <FileText size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  id="farmName"
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="cropType">PRIMARY CROP VARIETY</label>
              <div style={styles.inputIconWrapper}>
                <Sprout size={16} color="#64748b" style={styles.inputIcon} />
                <select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={styles.select}
                  required
                >
                  {CROP_OPTIONS.map((c) => (
                    <option key={c} value={c} style={{ background: '#0b1612', color: '#f1f5f9' }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="sowingDate">SOWING / PLANTING DATE</label>
              <div style={styles.inputIconWrapper}>
                <Calendar size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  id="sowingDate"
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

<<<<<<< HEAD
            {latitude && longitude && (
              <div style={styles.coordsCapsule}>
                <Crosshair size={14} color="#00d9ff" />
                <span>ROI Centroid: <b>{latitude.toFixed(5)}°N, {longitude.toFixed(5)}°E</b></span>
              </div>
            )}
=======
            {/* Calculated Area Display */}
            <div style={styles.areaInfoBox}>
              <span style={styles.areaInfoLabel}>Calculated Field Area:</span>
              <div style={styles.areaValRow}>
                <span style={styles.areaValPrimary}>
                  {calculatedAreaHa > 0 ? `${calculatedAreaHa} Ha` : '—'}
                </span>
                <span style={styles.areaValSecondary}>
                  {calculatedAreaAcres > 0 ? `(${calculatedAreaAcres} Acres)` : ''}
                </span>
              </div>
            </div>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>

          <div style={styles.actionCard}>
            <button
              type="submit"
              className="cyber-gradient-btn"
              disabled={isSaving}
              style={{ width: '100%', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}
            >
              <Save size={18} />
              <span>{isSaving ? 'Recalibrating Digital Twin...' : 'Update & Save Boundary'}</span>
            </button>
            <p style={{ margin: 0, fontSize: '0.725rem', color: '#64748b', textAlign: 'center' }}>
              Saving automatically synchronizes the 3D twin prism voxel elevation model.
            </p>
          </div>
        </div>

        {/* Right Column: Editable Leaflet Map with Existing Polygon Loaded */}
        <div style={styles.rightCol}>
          <div style={styles.mapCard}>
            <div style={styles.cardSectionHeader}>
              <div style={{ ...styles.iconCircle, background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                <Layers size={18} color="#00d9ff" />
              </div>
              <div>
                <h3 style={styles.sectionHeading}>Spatial Vector Boundary Editor</h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                  Drag polygon vertices to adjust perimeter, or delete to draw anew.
                </p>
              </div>
            </div>

<<<<<<< HEAD
            {latitude && longitude && (
              <FarmMap
                initialLat={latitude}
                initialLng={longitude}
                initialBoundary={boundaryGeoJSON}
                onLocationChange={handleLocationChange}
                onBoundaryChange={handleBoundaryChange}
              />
            )}
=======
            <div style={{ height: '380px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {latitude && longitude && (
                <FarmMap
                  initialLat={latitude}
                  initialLng={longitude}
                  initialBoundary={boundaryGeoJSON}
                  onLocationChange={handleLocationChange}
                  onBoundaryChange={handleBoundaryChange}
                />
              )}
            </div>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
          </div>
        </div>
      </form>
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  },
  title: {
<<<<<<< HEAD
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif',
    letterSpacing: '-0.02em'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '9999px',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    color: '#00d9ff',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif',
    letterSpacing: '0.04em'
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
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
<<<<<<< HEAD
    gap: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#fca5a5',
    padding: '0.875rem 1.25rem',
    borderRadius: '14px',
=======
    gap: '0.625rem',
    backgroundColor: 'var(--color-error-light)',
    border: '1px solid #fecaca',
    color: 'var(--color-error)',
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-md)',
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  formLayout: {
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
  cardSection: {
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
  cardSectionHeader: {
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94a3b8',
    fontFamily: 'Space Grotesk, sans-serif',
    letterSpacing: '0.05em'
  },
  inputIconWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
<<<<<<< HEAD
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.6rem',
    background: 'rgba(8, 17, 13, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.6rem',
    background: 'rgba(8, 17, 13, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  coordsCapsule: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 0.875rem',
    background: 'rgba(0, 217, 255, 0.08)',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    borderRadius: '10px',
    fontSize: '0.775rem',
    color: '#94a3b8'
=======
  areaInfoBox: {
    backgroundColor: '#f8fafc',
    padding: '0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  areaInfoLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase'
  },
  areaValRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem'
  },
  areaValPrimary: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--color-primary)'
  },
  areaValSecondary: {
    fontSize: '0.775rem',
    color: '#64748b'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
<<<<<<< HEAD
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.25rem'
=======
    backgroundColor: '#fafdfa'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
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
  }
};
