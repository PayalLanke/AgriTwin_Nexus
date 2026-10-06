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

import { cropDetectionEngine } from '../services/cropDetectionEngine';

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
  const [detectedCropInfo, setDetectedCropInfo] = useState(null);
  const [showGeoJsonModal, setShowGeoJsonModal] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = (newLat, newLng) => {
    setLatitude(newLat);
    setLongitude(newLng);
  };

  const handleBoundaryChange = async (geojson) => {
    setBoundaryGeoJSON(geojson);
    if (error) setError('');

    if (geojson) {
      try {
        const detection = await cropDetectionEngine.detectCropFromSpectralSignature(geojson, latitude, longitude);
        setDetectedCropInfo(detection);
        if (!cropType) {
          setCropType(detection.detectedCropName);
        }
      } catch (err) {
        console.error('Crop detection error:', err);
      }
    }
  };

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
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/farms" style={styles.backBtn} title="Back to farms">
            <ArrowLeft size={18} color="#22e58a" />
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
          <AlertCircle size={20} color="#f87171" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveFarm} style={styles.formLayout}>
        {/* LEFT COLUMN: Farm Specifications Form */}
        <div style={styles.leftCol}>
          <div style={styles.cardSection}>
            <div style={styles.cardSectionHeader}>
              <div style={styles.iconCircle}>
                <Sprout size={18} color="#22e58a" />
              </div>
              <h3 style={styles.sectionHeading}>{t('add_farm_title')}</h3>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="farmName">
                {t('farms_name')} <span style={{ color: '#f87171' }}>*</span>
              </label>
              <div style={styles.inputIconWrapper}>
                <FileText size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  id="farmName"
                  type="text"
                  placeholder="e.g. Green Valley Plot A"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="cropType">
                {t('farms_crop')} <span style={{ color: '#f87171' }}>*</span>
              </label>
              <div style={styles.inputIconWrapper}>
                <Sprout size={16} color="#64748b" style={styles.inputIcon} />
                <select
                  id="cropType"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="" style={{ background: '#0b1612', color: '#94a3b8' }}>-- Select Crop Variety --</option>
                  {CROP_OPTIONS.map((c) => (
                    <option key={c} value={c} style={{ background: '#0b1612', color: '#f1f5f9' }}>
                      {t(`crop_${c.toLowerCase()}`) || c}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Satellite Crop Detection Result Banner */}
              {detectedCropInfo && (
                <div style={{
                  marginTop: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  background: 'rgba(0, 217, 255, 0.08)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: '700', color: '#00d9ff', fontFamily: 'Space Grotesk, sans-serif' }}>
                      🛰️ SATELLITE SPECTRAL CROP CLASSIFIER
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#22e58a', background: 'rgba(34, 229, 138, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '9999px' }}>
                      {detectedCropInfo.confidenceScore}% MATCH
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: '#f1f5f9', fontWeight: '600' }}>
                    Detected Crop: <span style={{ color: '#22e58a' }}>{detectedCropInfo.detectedCropName}</span>
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Optimal Temp Range: {detectedCropInfo.optimalTempRange} &bull; Stage: {detectedCropInfo.criticalStage}
                  </span>
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="sowingDate">
                {t('farms_sowing')} <span style={{ color: '#f87171' }}>*</span>
              </label>
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

            {/* Area Display Box */}
            <div style={styles.areaInfoBox}>
              <span style={styles.areaInfoLabel}>{t('farms_area').toUpperCase()}:</span>
              <div style={styles.areaValRow}>
                <span style={styles.areaValPrimary}>
                  {calculatedAreaHa > 0 ? `${calculatedAreaHa} ${t('common_hectares')}` : '—'}
                </span>
                <span style={styles.areaValSecondary}>
                  {calculatedAreaAcres > 0 ? `(${calculatedAreaAcres} ${t('common_acres')})` : `(${t('draw_instructions')})`}
                </span>
              </div>
            </div>
          </div>

          {/* Save Action Card */}
          <div style={styles.actionCard}>
            <button
              type="submit"
              className="cyber-gradient-btn"
              disabled={isLoading}
              style={{ width: '100%', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}
            >
              <Save size={18} />
              <span>{isLoading ? t('common_loading') : t('save_farm_btn')}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Farm Map & Boundary Delineation */}
        <div style={styles.rightCol}>
          <div style={styles.mapCard}>
            <div style={styles.cardSectionHeader}>
              <div style={{ ...styles.iconCircle, background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                <Layers size={18} color="#00d9ff" />
              </div>
              <div>
                <h3 style={styles.sectionHeading}>Spatial Location & Boundary Map</h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                  Search city/town (e.g., Jalna, Kopargaon) or click quick location chips to center map.
                </p>
              </div>
            </div>

            {/* Leaflet Farm Map */}
            <FarmMap
              initialLat={latitude}
              initialLng={longitude}
              onLocationChange={handleLocationChange}
              onBoundaryChange={handleBoundaryChange}
            />

            {/* GeoJSON status bar */}
            <div style={styles.boundaryInfoSection}>
              {!boundaryGeoJSON ? (
                <div style={styles.boundaryPendingBox}>
                  <MapPin size={18} color="#fbbf24" />
                  <div>
                    <span style={styles.boundaryPendingText}>
                      Pending Boundary Selection: Click top-left polygon icon on map to draw farm perimeter.
                    </span>
                  </div>
                </div>
              ) : (
                <div style={styles.boundarySuccessBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <CheckCircle2 size={20} color="#22e58a" />
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', color: '#22e58a' }}>
                        Polygon Delineated ({calculatedAreaHa} Ha)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGeoJsonModal(true)}
                    style={styles.geoJsonBtn}
                  >
                    <Code size={14} color="#00d9ff" />
                    <span>View GeoJSON</span>
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
                <Code size={18} color="#22e58a" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                  Spatial GeoJSON Schema
                </h3>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowGeoJsonModal(false)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <pre style={styles.jsonPre}>
                {JSON.stringify(boundaryGeoJSON, null, 2)}
              </pre>
            </div>
            <div style={styles.modalFooter}>
              <button className="cyber-gradient-btn" onClick={() => setShowGeoJsonModal(false)} style={{ padding: '0.5rem 1.25rem' }}>
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
    gap: '1.5rem'
  },
  pageHeader: {
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
    textDecoration: 'none'
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  subtitle: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    margin: '4px 0 0 0'
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#f87171',
    padding: '0.875rem 1.25rem',
    borderRadius: '14px',
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
  areaInfoBox: {
    backgroundColor: 'rgba(0, 217, 255, 0.08)',
    padding: '0.875rem',
    borderRadius: '12px',
    border: '1px solid rgba(0, 217, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  areaInfoLabel: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  areaValRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem'
  },
  areaValPrimary: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#22e58a',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  areaValSecondary: {
    fontSize: '0.775rem',
    color: '#94a3b8'
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.25rem'
  },
  actionNote: {
    fontSize: '0.725rem',
    color: '#64748b',
    textAlign: 'center',
    margin: 0
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
  },
  boundaryInfoSection: {
    paddingTop: '0.25rem'
  },
  boundaryPendingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    borderRadius: '12px'
  },
  boundaryPendingText: {
    fontSize: '0.825rem',
    fontWeight: '600',
    color: '#fbbf24'
  },
  boundarySuccessBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1rem',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    borderRadius: '12px',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  geoJsonBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '8px',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    color: '#00d9ff',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  },
  modalContent: {
    backgroundColor: '#0b1612',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
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
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#94a3b8'
  },
  modalBody: {
    padding: '1.25rem 1.5rem',
    maxHeight: '60vh',
    overflowY: 'auto'
  },
  jsonPre: {
    backgroundColor: '#040d09',
    color: '#00d9ff',
    padding: '1rem',
    borderRadius: '12px',
    fontSize: '0.775rem',
    fontFamily: 'JetBrains Mono, monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    margin: 0,
    border: '1px solid rgba(0, 217, 255, 0.2)'
  },
  modalFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 17, 13, 0.9)'
  }
};
