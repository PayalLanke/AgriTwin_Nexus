import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FarmMap from '../components/FarmMap';
import { farmService, CROP_OPTIONS } from '../services/farmService';
import { authService } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Sprout,
  Layers,
  Calendar,
  FileText,
  CheckCircle2,
  Code,
  MapPin
} from 'lucide-react';

export default function AddFarmPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentUser = authService.getCurrentUser();

  const [farmName, setFarmName] = useState('');
  const [cropType, setCropType] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [latitude, setLatitude] = useState(18.5204);
  const [longitude, setLongitude] = useState(73.8567);
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(null);
  const [showGeoJsonModal, setShowGeoJsonModal] = useState(false);

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

  // Helper to get calculated area if boundary exists
  const calculatedAreaHa = boundaryGeoJSON?.properties?.areaHectares || 0;
  const calculatedAreaAcres = boundaryGeoJSON?.properties?.areaAcres || 0;

  const handleSaveFarm = async (e) => {
    e.preventDefault();
    setError('');

    if (!farmName.trim()) {
      setError(t('farm_name') + ' is required.');
      return;
    }
    if (!cropType) {
      setError(t('crop_type') + ' is required.');
      return;
    }
    if (!sowingDate) {
      setError(t('sowing_date') + ' is required.');
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

      navigate('/farms');
    } catch (err) {
      setError(err.message || 'Failed to save farm record. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/farms" style={styles.backBtn} title="Back to farms">
            <ArrowLeft size={20} color="#4b5563" />
          </Link>
          <div>
            <h1 style={styles.title}>{t('add_farm_title')}</h1>
            <p style={styles.subtitle}>
              {t('add_farm_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={20} color="var(--color-error)" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveFarm} style={styles.formLayout}>
        {/* LEFT COLUMN: Farm Information Form */}
        <div style={styles.leftCol}>
          <div className="card" style={styles.cardSection}>
            <div style={styles.cardSectionHeader}>
              <Sprout size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('add_farm_title')}</h3>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="farmName">
                {t('farm_name')} <span style={{ color: 'var(--color-error)' }}>*</span>
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
                {t('crop_type')} <span style={{ color: 'var(--color-error)' }}>*</span>
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
                  <option value="">-- {t('crop_type')} --</option>
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
                {t('sowing_date')} <span style={{ color: 'var(--color-error)' }}>*</span>
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

            {/* Calculated Area Display */}
            <div style={styles.areaInfoBox}>
              <span style={styles.areaInfoLabel}>{t('field_area')}:</span>
              <div style={styles.areaValRow}>
                <span style={styles.areaValPrimary}>
                  {calculatedAreaHa > 0 ? `${calculatedAreaHa} ${t('hectares')}` : '—'}
                </span>
                <span style={styles.areaValSecondary}>
                  {calculatedAreaAcres > 0 ? `(${calculatedAreaAcres} ${t('acres')})` : t('boundary_none')}
                </span>
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
              <span>{isLoading ? 'Saving...' : t('save_farm_btn')}</span>
            </button>
            <p style={styles.actionNote}>
              {t('boundary_active')}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Farm Map & Boundary Delineation */}
        <div style={styles.rightCol}>
          <div className="card" style={styles.mapCard}>
            <div style={styles.cardSectionHeader}>
              <Layers size={20} color="var(--color-teal)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t('add_farm_title')}</h3>
                <p style={{ margin: 0, fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                  {t('search_location_placeholder')}
                </p>
              </div>
            </div>

            {/* Leaflet Map */}
            <div style={{ height: '380px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FarmMap
                initialLat={latitude}
                initialLng={longitude}
                onLocationChange={handleLocationChange}
                onBoundaryChange={handleBoundaryChange}
              />
            </div>

            {/* BOUNDARY INFORMATION SECTION BELOW MAP */}
            <div style={styles.boundaryInfoSection}>
              {!boundaryGeoJSON ? (
                <div style={styles.boundaryPendingBox}>
                  <MapPin size={18} color="var(--color-warning)" />
                  <div>
                    <span style={styles.boundaryStatusText}>
                      {t('add_farm_subtitle')}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={styles.boundarySuccessBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <CheckCircle2 size={20} color="var(--color-primary)" />
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                        {t('boundary_active')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowGeoJsonModal(true)}
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    <Code size={14} />
                    <span>GeoJSON</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* GeoJSON Inspector Modal */}
      {showGeoJsonModal && boundaryGeoJSON && (
        <div style={styles.modalOverlay} onClick={() => setShowGeoJsonModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code size={18} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Spatial GeoJSON Schema</h3>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowGeoJsonModal(false)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <pre style={styles.jsonPre}>
                {JSON.stringify(boundaryGeoJSON, null, 2)}
              </pre>
            </div>
            <div style={styles.modalFooter}>
              <button className="btn btn-primary" onClick={() => setShowGeoJsonModal(false)}>
                Close
              </button>
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
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: 0
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    backgroundColor: 'var(--color-error-light)',
    border: '1px solid #fecaca',
    color: 'var(--color-error)',
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-md)',
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
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#fafdfa'
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
  },
  boundaryInfoSection: {
    paddingTop: '0.5rem'
  },
  boundaryPendingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    backgroundColor: 'var(--color-warning-light)',
    border: '1px solid #fde68a',
    borderRadius: 'var(--radius-md)'
  },
  boundaryStatusText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#b45309'
  },
  boundarySuccessBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1rem',
    backgroundColor: 'var(--color-light-green)',
    border: '1px solid #bbf7d0',
    borderRadius: 'var(--radius-md)',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  boundaryTagsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '4px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--color-border)',
    width: '100%',
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--color-border)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#6b7280'
  },
  modalBody: {
    padding: '1.25rem',
    maxHeight: '60vh',
    overflowY: 'auto'
  },
  jsonPre: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    margin: 0
  },
  modalFooter: {
    padding: '0.875rem 1.25rem',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#f8fafc'
  }
};
