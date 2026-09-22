import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FarmMap from '../components/FarmMap';
import { farmService, CROP_OPTIONS } from '../services/farmService';
import { ArrowLeft, Save, AlertCircle, Sprout, Layers, Calendar, FileText } from 'lucide-react';

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
        <p>Loading farm record into editor...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header Bar */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to={`/farms/view/${id}`} style={styles.backBtn} title="Cancel and go back">
            <ArrowLeft size={20} color="#4b5563" />
          </Link>
          <div>
            <h1 style={styles.title}>Edit Farm Boundary & Details</h1>
            <p style={styles.subtitle}>Modify farm metadata or adjust boundary polygon vertices on Leaflet map</p>
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={20} color="var(--color-danger)" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdateFarm} style={styles.formLayout}>
        {/* Left Column: Form Details */}
        <div style={styles.leftCol}>
          <div className="card" style={styles.cardSection}>
            <div style={styles.cardSectionHeader}>
              <Sprout size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Farm Metadata</h3>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="farmName">Farm Name</label>
              <div style={styles.inputIconWrapper}>
                <FileText size={16} color="#9ca3af" style={styles.inputIcon} />
                <input
                  id="farmName"
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  style={{ paddingLeft: '2.375rem' }}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="cropType">Crop Type</label>
              <div style={styles.inputIconWrapper}>
                <Sprout size={16} color="#9ca3af" style={styles.inputIcon} />
                <select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={{ paddingLeft: '2.375rem' }}
                  required
                >
                  {CROP_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="sowingDate">Sowing Date</label>
              <div style={styles.inputIconWrapper}>
                <Calendar size={16} color="#9ca3af" style={styles.inputIcon} />
                <input
                  id="sowingDate"
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  style={{ paddingLeft: '2.375rem' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="card" style={styles.actionCard}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
              style={{ width: '100%', padding: '0.875rem' }}
            >
              <Save size={18} />
              <span>{isSaving ? 'Updating Farm Record...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Editable Leaflet Map with Existing Polygon Loaded */}
        <div style={styles.rightCol}>
          <div className="card" style={styles.mapCard}>
            <div style={styles.cardSectionHeader}>
              <Layers size={20} color="var(--color-teal)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Edit Spatial Polygon Boundary</h3>
                <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                  Drag polygon vertices to adjust boundary, or clear to re-draw.
                </p>
              </div>
            </div>

            {/* Map Editor with restored initial boundary */}
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
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  loadingContainer: {
    padding: '4rem',
    textAlign: 'center',
    color: 'var(--color-text-secondary)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    fontSize: '1.35rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    margin: 0
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    backgroundColor: 'var(--color-danger-light)',
    border: '1px solid #fecaca',
    color: 'var(--color-danger)',
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-lg)',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  formLayout: {
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
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  cardSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputIconWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#f9fafb'
  },
  mapCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }
};
