import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { authService } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';
import Modal from '../components/Modal';
import { Sprout, PlusCircle, Eye, Edit2, Trash2, Calendar, MapPin, Layers, Search, User, CheckCircle2, Navigation } from 'lucide-react';

export default function MyFarmsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const currentUser = authService.getCurrentUser();

  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [selectedFarmToDelete, setSelectedFarmToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      setFilteredFarms(data);
    } catch (err) {
      console.error('Failed to load farms list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFarms(farms);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredFarms(
        farms.filter(
          (f) =>
            f.farmName.toLowerCase().includes(q) ||
            f.cropType.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, farms]);

  const promptDeleteFarm = (farm) => {
    setSelectedFarmToDelete(farm);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFarmToDelete) return;
    try {
      await farmService.deleteFarm(selectedFarmToDelete.id);
      setIsDeleteModalOpen(false);
      setSelectedFarmToDelete(null);
      loadFarms();
    } catch (err) {
      alert(err.message || 'Failed to delete farm record.');
    }
  };

  const totalAreaHectares = farms.reduce((acc, f) => acc + (f.areaHectares || 0), 0);
  const totalAreaAcres = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0);

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Farmer Profile & Holdings Summary Header Banner */}
      <div style={styles.farmerBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={styles.avatarBox}>
            <User size={28} color="#22e58a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={styles.farmerName}>{currentUser?.fullName || 'Rajesh Patil'}</h2>
              <span style={styles.roleTag}>{t('farmer_portal').toUpperCase()}</span>
            </div>
            <p style={styles.farmerMeta}>
              {currentUser?.email || 'farmer@agritwin.org'} • Mobile: {currentUser?.mobileNumber || '+91 98765 43210'}
            </p>
          </div>
        </div>

        <div style={styles.statsPillGroup}>
          <div style={styles.statPill}>
            <span style={styles.pillLabel}>{t('dash_total_farms').toUpperCase()}</span>
            <span style={styles.pillVal}>{farms.length}</span>
          </div>
          <div style={styles.statPill}>
            <span style={styles.pillLabel}>{t('dash_total_area_ha').toUpperCase()}</span>
            <span style={styles.pillVal}>{totalAreaHectares.toFixed(2)} {t('common_hectares')} ({totalAreaAcres.toFixed(2)} {t('common_acres')})</span>
          </div>
        </div>
      </div>

      {/* Header Bar with Action Button */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{t('farms_title')}</h1>
          <p style={styles.subtitle}>{t('farms_subtitle')}</p>
        </div>
        <Link to="/farms/add" className="btn btn-primary cyber-gradient-btn" style={{ textDecoration: 'none' }}>
          <PlusCircle size={18} />
          <span>+ {t('nav_add_farm')}</span>
        </Link>
      </div>

      {/* Filter / Search Bar for 50+ Farms */}
      {farms.length > 0 && (
        <div style={styles.filterRow}>
          <div style={styles.searchBox}>
            <Search size={16} color="#9ca3af" style={styles.searchIcon} />
            <input
              type="text"
              placeholder={t('search_location_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontFamily: 'Space Grotesk, sans-serif' }}>
            {t('common_searching')} <b style={{ color: '#ffffff' }}>{filteredFarms.length}</b> / <b style={{ color: '#22e58a' }}>{farms.length}</b>
          </div>
        </div>
      )}

      {/* Farms Grid or Professional Empty State */}
      {isLoading ? (
        <div style={styles.loadingBox}>
          <p>{t('common_loading')}</p>
        </div>
      ) : farms.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <div style={styles.emptyIconBadge}>
            <Sprout size={36} color="var(--color-primary)" />
          </div>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem', color: '#ffffff' }}>
            {t('farms_title')}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '420px', lineHeight: '1.5', margin: 0 }}>
            {t('add_farm_subtitle')}
          </p>
          <Link to="/farms/add" className="cyber-gradient-btn" style={{ marginTop: '0.75rem', padding: '0.6rem 1.25rem', textDecoration: 'none' }}>
            <PlusCircle size={18} />
            <span>+ {t('nav_add_farm')}</span>
          </Link>
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <Search size={32} color="#94a3b8" />
          <h3 style={{ color: '#ffffff' }}>{t('common_no_data')}</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
            No farm plot matched "{searchQuery}".
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredFarms.map((farm) => (
            <div key={farm.id} className="card" style={styles.farmCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.farmName}>{farm.farmName}</h3>
                  <span style={styles.cropBadge}>{farm.cropType ? t(`crop_${farm.cropType.toLowerCase()}`) || farm.cropType : t('crop_unspecified')}</span>
                </div>
                <span className="badge badge-teal font-mono">{farm.status || t('common_available')}</span>
              </div>

              <div style={styles.cardDetails}>
                <div style={styles.detailRow}>
                  <div style={styles.detailIconGroup}>
                    <Calendar size={15} color="#00d9ff" />
                    <span style={styles.detailLabel}>{t('common_sowing_date')}:</span>
                  </div>
                  <span style={styles.detailVal}>{farm.sowingDate}</span>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailIconGroup}>
                    <Layers size={15} color="#fbbf24" />
                    <span style={styles.detailLabel}>{t('common_area')}:</span>
                  </div>
                  <span style={styles.detailVal}>
                    <b style={{ color: '#22e58a' }}>{farm.areaHectares} {t('common_hectares')}</b> ({farm.areaAcres} {t('common_acres')})
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailIconGroup}>
                    <MapPin size={15} color="#22e58a" />
                    <span style={styles.detailLabel}>{t('common_location')}:</span>
                  </div>
                  <span style={styles.detailVal}>
                    {farm.latitude.toFixed(4)}° N, {farm.longitude.toFixed(4)}° E
                  </span>
                </div>
              </div>

              {/* Actions: View 3D, Edit, Delete */}
              <div style={styles.cardActions}>
                <Link to={`/farms/view/${farm.id}`} className="btn btn-teal" style={styles.actionBtn}>
                  <Eye size={15} />
                  <span>{t('nav_digital_twin')}</span>
                </Link>
                <Link to={`/farms/edit/${farm.id}`} className="btn btn-secondary" style={styles.actionBtn}>
                  <Edit2 size={15} />
                  <span>{t('common_edit')}</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ ...styles.actionBtn, color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={() => promptDeleteFarm(farm)}
                  title="Delete farm record"
                >
                  <Trash2 size={15} />
                  <span>{t('common_delete')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Farm Record?"
        message={
          selectedFarmToDelete
            ? `Are you sure you want to delete "${selectedFarmToDelete.farmName}"? This action will remove its spatial boundary and cannot be undone.`
            : 'Are you sure you want to delete this farm?'
        }
        confirmText="Delete Farm"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  farmerBanner: {
    background: 'linear-gradient(135deg, rgba(34, 229, 138, 0.12) 0%, rgba(15, 27, 21, 0.85) 100%)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '20px',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  avatarBox: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  farmerName: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  roleTag: {
    fontSize: '0.625rem',
    fontWeight: '800',
    color: '#00d9ff',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontFamily: 'JetBrains Mono, monospace'
  },
  farmerMeta: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    margin: '3px 0 0 0'
  },
  statsPillGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  statPill: {
    background: 'rgba(8, 17, 13, 0.8)',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    borderRadius: '14px',
    padding: '0.6rem 1rem',
    display: 'flex',
    flexDirection: 'column'
  },
  pillLabel: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  pillVal: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#22e58a',
    fontFamily: 'JetBrains Mono, monospace',
    marginTop: '2px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    margin: '2px 0 0 0'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    backgroundColor: 'rgba(15, 27, 21, 0.72)',
    padding: '0.875rem 1.25rem',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    flexWrap: 'wrap'
  },
  searchBox: {
    position: 'relative',
    width: '340px',
    maxWidth: '100%'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '0.65rem 1rem 0.65rem 2.4rem',
    background: 'rgba(9, 18, 14, 0.9)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none'
  },
  loadingBox: {
    padding: '3rem',
    textAlign: 'center',
    color: '#94a3b8'
  },
  emptyCard: {
    padding: '3.5rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(15, 27, 21, 0.72)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px'
  },
  emptyIconBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
    gap: '1.25rem'
  },
  farmCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1rem',
    background: 'rgba(15, 27, 21, 0.72)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.25rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  farmName: {
    fontSize: '1.15rem',
    fontWeight: '700',
    margin: 0,
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  cropBadge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#22e58a',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.125rem 0.6rem',
    borderRadius: '9999px',
    marginTop: '4px'
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    padding: '0.75rem 0',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.8125rem'
  },
  detailIconGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem'
  },
  detailLabel: {
    color: '#94a3b8'
  },
  detailVal: {
    fontWeight: '600',
    color: '#ffffff'
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  actionBtn: {
    flex: 1,
    padding: '0.5rem 0.625rem',
    fontSize: '0.8125rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem',
    textDecoration: 'none'
  }
};
