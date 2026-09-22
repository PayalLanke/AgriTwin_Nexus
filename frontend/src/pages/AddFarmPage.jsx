import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FarmMap from '../components/FarmMap';
import { farmService, CROP_OPTIONS } from '../services/farmService';
import { authService } from '../services/authService';
import { ArrowLeft, Save, AlertCircle, Sprout, Layers, Calendar, FileText } from 'lucide-react';

export default function AddFarmPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [farmName, setFarmName] = useState('');
  const [cropType, setCropType] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [latitude, setLatitude] = useState(18.5204); // Default center
  const [longitude, setLongitude] = useState(73.8567);
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = (newLat, newLng) => {
    setLatitude(newLat);
    setLongitude(newLng);
  };

  const handleBoundaryChange = (geojson) => {
    setBoundaryGeoJSON(geojson);
    if (error) setError('');
  };

  const handleSaveFarm = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation rules (STEP 9)
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
    if (!latitude || !longitude) {
      setError('Farm center location coordinates are required.');
      return;
    }
    if (!boundaryGeoJSON) {
      setError('Please draw the farm boundary polygon on the map before saving.');
      return;
    }

    setIsLoading(true);
    try {
      await farmService.createFarm({
        userId: currentUser?.id || 'usr_default',
        farmName,
        cropType,
        sowingDate,
        latitude,
        longitude,
        boundary: boundaryGeoJSON
      });

      // Redirect to My Farms on success
      navigate('/farms');
    } catch (err) {
      setError(err.message || 'Failed to save farm record. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header Bar */}
      <div style={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/farms" style={styles.backBtn} title="Back to farms">
            <ArrowLeft size={20} color="#4b5563" />
          </Link>
          <div>
            <h1 style={styles.title}>Register New Farm</h1>
            <p style={styles.subtitle}>Enter farm metadata and delineate exact spatial field boundaries</p>
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={20} color="var(--color-danger)" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveFarm} style={styles.formLayout}>
        {/* Left Column: Form Inputs */}
        <div style={styles.leftCol}>
          <div className="card" style={styles.cardSection}>
            <div style={styles.cardSectionHeader}>
              <Sprout size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>A. Farm Metadata Details</h3>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="farmName">
                Farm Name <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div style={styles.inputIconWrapper}>
                <FileText size={16} color="#9ca3af" style={styles.inputIcon} />
                <input
                  id="farmName"
                  type="text"
                  placeholder="e.g. Green Valley Plot A"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  style={{ paddingLeft: '2.375rem' }}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="cropType">
                Crop Type <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <div style={styles.inputIconWrapper}>
                <Sprout size={16} color="#9ca3af" style={styles.inputIcon} />
                <select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={{ paddingLeft: '2.375rem' }}
                  required
                >
                  <option value="">-- Select Sown Crop --</option>
                  {CROP_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="sowingDate">
                Sowing Date <span style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
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

          {/* Action Button Card */}
          <div className="card" style={styles.actionCard}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '0.875rem' }}
            >
              <Save size={18} />
              <span>{isLoading ? 'Saving Farm Record...' : 'Save & Register Farm'}</span>
            </button>
            <p style={styles.actionNote}>
              Spatial GeoJSON polygon will be validated & saved for future GEE / Sentinel-2 satellite analysis.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Map & Boundary Polygon Delineation */}
        <div style={styles.rightCol}>
          <div className="card" style={styles.mapCard}>
            <div style={styles.cardSectionHeader}>
              <Layers size={20} color="var(--color-teal)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>B. Location & Farm Boundary Selection</h3>
                <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                  Locate farm on map and draw polygon boundary enclosing your field.
                </p>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <FarmMap
              initialLat={latitude}
              initialLng={longitude}
              onLocationChange={handleLocationChange}
              onBoundaryChange={handleBoundaryChange}
            />
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
  pageHeader: {
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
  actionNote: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    margin: 0
  },
  mapCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }
};
