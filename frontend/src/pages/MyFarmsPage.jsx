import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { useLanguage } from '../context/LanguageContext';
import Modal from '../components/Modal';
import { Sprout, PlusCircle, Eye, Edit2, Trash2, Calendar, MapPin, Layers, Search } from 'lucide-react';

export default function MyFarmsPage() {
  const { t } = useLanguage();
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

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{t('my_farms_title')}</h1>
          <p style={styles.subtitle}>{t('my_farms_subtitle')}</p>
        </div>
        <Link to="/farms/add" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>+ {t('add_farm_btn')}</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      {farms.length > 0 && (
        <div style={styles.filterRow}>
          <div style={styles.searchBox}>
            <Search size={16} color="#9ca3af" style={styles.searchIcon} />
            <input
              type="text"
              placeholder={t('search_location_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Showing <b>{filteredFarms.length}</b> of {farms.length} {t('total_farms')}
          </div>
        </div>
      )}

      {/* Farms Grid or Professional Empty State */}
      {isLoading ? (
        <div style={styles.loadingBox}>
          <p>Loading registered farms...</p>
        </div>
      ) : farms.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <div style={styles.emptyIconBadge}>
            <Sprout size={36} color="var(--color-primary)" />
          </div>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
            {t('my_farms_title')}
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: '420px', lineHeight: '1.5', margin: 0 }}>
            {t('add_farm_subtitle')}
          </p>
          <Link to="/farms/add" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
            <PlusCircle size={18} />
            <span>+ {t('add_farm_btn')}</span>
          </Link>
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="card" style={styles.emptyCard}>
          <Search size={32} color="var(--color-text-secondary)" />
          <h3>No matching farms found</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            No farm matched "{searchQuery}". Try altering your search query.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredFarms.map((farm) => (
            <div key={farm.id} className="card" style={styles.farmCard}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={styles.farmName}>{farm.farmName}</h3>
                  <span style={styles.cropBadge}>{farm.cropType}</span>
                </div>
                <span className="badge badge-primary">{farm.status || t('boundary_active')}</span>
              </div>

              <div style={styles.cardDetails}>
                <div style={styles.detailRow}>
                  <div style={styles.detailIconGroup}>
                    <Calendar size={15} color="var(--color-teal)" />
                    <span style={styles.detailLabel}>{t('sowing_date')}:</span>
                  </div>
                  <span style={styles.detailVal}>{farm.sowingDate}</span>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailIconGroup}>
                    <Layers size={15} color="var(--color-warning)" />
                    <span style={styles.detailLabel}>{t('field_area')}:</span>
                  </div>
                  <span style={styles.detailVal}>
                    <b>{farm.areaHectares} {t('hectares')}</b> ({farm.areaAcres} {t('acres')})
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <div style={styles.detailIconGroup}>
                    <MapPin size={15} color="var(--color-primary)" />
                    <span style={styles.detailLabel}>{t('location')}:</span>
                  </div>
                  <span style={styles.detailVal}>
                    {farm.latitude.toFixed(4)}° N, {farm.longitude.toFixed(4)}° E
                  </span>
                </div>
              </div>

              {/* Actions: View, Edit, Delete */}
              <div style={styles.cardActions}>
                <Link to={`/farms/view/${farm.id}`} className="btn btn-teal" style={styles.actionBtn}>
                  <Eye size={15} />
                  <span>{t('view')}</span>
                </Link>
                <Link to={`/farms/edit/${farm.id}`} className="btn btn-secondary" style={styles.actionBtn}>
                  <Edit2 size={15} />
                  <span>{t('edit')}</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ ...styles.actionBtn, color: 'var(--color-error)', borderColor: '#fecaca' }}
                  onClick={() => promptDeleteFarm(farm)}
                  title="Delete farm"
                >
                  <Trash2 size={15} />
                  <span>{t('delete')}</span>
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
            ? `Are you sure you want to delete "${selectedFarmToDelete.farmName}"? This action will remove its geographical boundary and cannot be undone.`
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
    color: 'var(--color-primary)',
    margin: 0
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    backgroundColor: '#ffffff',
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)'
  },
  searchBox: {
    position: 'relative',
    width: '320px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  loadingBox: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--color-text-secondary)'
  },
  emptyCard: {
    padding: '3.5rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  emptyIconBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-light-green)',
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
    gap: '1rem'
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
    color: 'var(--color-text-main)'
  },
  cropBadge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--color-teal)',
    backgroundColor: 'var(--color-teal-light)',
    padding: '0.125rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    marginTop: '4px'
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    padding: '0.75rem 0',
    borderTop: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)'
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
    color: 'var(--color-text-secondary)'
  },
  detailVal: {
    fontWeight: '600',
    color: 'var(--color-text-main)'
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  actionBtn: {
    flex: 1,
    padding: '0.5rem 0.625rem',
    fontSize: '0.8125rem'
  }
};
