import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { useLanguage } from '../context/LanguageContext';
import FarmMap from '../components/FarmMap';
import {
  Sprout,
  PlusCircle,
  MapPin,
  Layers,
  ArrowRight,
  Cpu,
  Satellite,
  CloudSun,
  Activity,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0]);
      }
    } catch (e) {
      console.error('Error loading farms:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Real calculations
  const totalFarms = farms.length;
  const totalAreaHectares = farms.reduce((acc, f) => acc + (f.areaHectares || 0), 0);
  const totalAreaAcres = farms.reduce((acc, f) => acc + (f.areaAcres || 0), 0);
  
  // Unique crops
  const uniqueCrops = Array.from(new Set(farms.map((f) => f.cropType).filter(Boolean)));
  const cropsText = uniqueCrops.length > 0 ? uniqueCrops.join(', ') : '—';

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header / Welcome Banner */}
      <div style={styles.welcomeBanner}>
        <div>
          <h1 style={styles.welcomeTitle}>{t('dashboard_overview_title')}</h1>
          <p style={styles.welcomeSubtitle}>
            {t('dashboard_overview_subtitle')}
          </p>
        </div>
        <Link to="/farms/add" className="btn btn-primary" style={styles.addBtn}>
          <PlusCircle size={18} />
          <span>+ {t('add_farm_btn')}</span>
        </Link>
      </div>

      {/* SECTION 1: FARM SUMMARY */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionHeaderTitle}>{t('quick_actions')}</h2>

        <div style={styles.summaryGrid}>
          {/* Card 1: Total Farms */}
          <div className="card" style={styles.summaryCard}>
            <div style={styles.iconContainer}>
              <Sprout size={22} color="var(--color-primary)" />
            </div>
            <div>
              <span style={styles.cardLabel}>{t('total_farms')}</span>
              <div style={styles.cardVal}>{isLoading ? '...' : totalFarms}</div>
              <span style={styles.cardHelper}>{t('view_farms_btn')}</span>
            </div>
          </div>

          {/* Card 2: Active Farm */}
          <div className="card" style={styles.summaryCard}>
            <div style={{ ...styles.iconContainer, backgroundColor: 'var(--color-teal-light)' }}>
              <MapPin size={22} color="var(--color-teal)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={styles.cardLabel}>{t('farm_name')}</span>
              <div style={styles.cardValTruncated} title={selectedFarm ? selectedFarm.farmName : 'No farm selected'}>
                {isLoading ? '...' : (selectedFarm ? selectedFarm.farmName : '—')}
              </div>
              <span style={styles.cardHelper}>
                {selectedFarm ? `${t('crop_type')}: ${selectedFarm.cropType}` : t('boundary_none')}
              </span>
            </div>
          </div>

          {/* Card 3: Total Farm Area */}
          <div className="card" style={styles.summaryCard}>
            <div style={{ ...styles.iconContainer, backgroundColor: '#fffbeb' }}>
              <Layers size={22} color="var(--color-warning)" />
            </div>
            <div>
              <span style={styles.cardLabel}>{t('total_area_ha')}</span>
              <div style={styles.cardVal}>
                {isLoading
                  ? '...'
                  : totalFarms > 0
                  ? `${totalAreaHectares.toFixed(2)} Ha`
                  : '—'}
              </div>
              <span style={styles.cardHelper}>
                {totalFarms > 0 ? `${totalAreaAcres.toFixed(2)} ${t('acres')}` : '0 Acres'}
              </span>
            </div>
          </div>

          {/* Card 4: Registered Crops */}
          <div className="card" style={styles.summaryCard}>
            <div style={{ ...styles.iconContainer, backgroundColor: 'var(--color-light-green)' }}>
              <Activity size={22} color="var(--color-primary)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={styles.cardLabel}>{t('crop_type')}</span>
              <div style={styles.cardValTruncated} title={cropsText}>
                {isLoading ? '...' : cropsText}
              </div>
              <span style={styles.cardHelper}>
                {uniqueCrops.length > 0 ? `${uniqueCrops.length} ${t('crop_type')}` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: FARM MAP */}
      <div style={styles.sectionContainer}>
        <div style={styles.sectionHeaderRow}>
          <div>
            <h2 style={styles.sectionHeaderTitle}>{t('my_farms_title')}</h2>
            <p style={styles.sectionHeaderSub}>
              {t('my_farms_subtitle')}
            </p>
          </div>
          {totalFarms > 0 && (
            <span className="badge badge-primary">
              <MapPin size={12} />
              <span>{totalFarms} {t('boundary_active')}</span>
            </span>
          )}
        </div>

        <div className="card" style={styles.mapCard}>
          {totalFarms === 0 ? (
            <div style={styles.emptyMapContainer}>
              <div style={styles.emptyMapBadge}>
                <Sprout size={36} color="var(--color-primary)" />
              </div>
              <h3 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '1.2rem', color: 'var(--color-text-main)' }}>
                {t('add_farm_subtitle')}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '420px', lineHeight: '1.5' }}>
                {t('add_farm_subtitle')}
              </p>
              <Link to="/farms/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <PlusCircle size={16} />
                <span>{t('add_farm_btn')}</span>
              </Link>
            </div>
          ) : (
            <div style={{ height: '420px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FarmMap farms={farms} selectedFarm={selectedFarm} readOnly={true} />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: QUICK ACTIONS */}
      <div style={styles.sectionContainer}>
        <h2 style={styles.sectionHeaderTitle}>{t('quick_actions')}</h2>

        <div style={styles.quickActionsGrid}>
          <Link to="/farms/add" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={styles.actionIconBadge}>
                  <PlusCircle size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>{t('nav_add_farm')}</h4>
                  <p style={styles.actionSub}>{t('add_farm_subtitle')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--color-primary)" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/farms" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: 'var(--color-teal-light)' }}>
                  <Sprout size={20} color="var(--color-teal)" />
                </div>
                <div>
                  <h4 style={styles.actionTitle}>{t('nav_my_farms')}</h4>
                  <p style={styles.actionSub}>{t('my_farms_subtitle')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="var(--color-teal)" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/digital-twin" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: '#f1f5f9' }}>
                  <Cpu size={20} color="#475569" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={styles.actionTitle}>{t('nav_digital_twin')}</h4>
                    <span className="badge badge-coming-soon">Soon</span>
                  </div>
                  <p style={styles.actionSub}>{t('digital_twin_subtitle')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="#94a3b8" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/satellite" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: '#f1f5f9' }}>
                  <Satellite size={20} color="#475569" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={styles.actionTitle}>{t('nav_satellite')}</h4>
                    <span className="badge badge-coming-soon">Soon</span>
                  </div>
                  <p style={styles.actionSub}>{t('layer_rgb')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="#94a3b8" style={styles.arrowIcon} />
            </div>
          </Link>

          <Link to="/weather" style={styles.actionCardLink}>
            <div className="card" style={styles.actionCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.actionIconBadge, backgroundColor: '#f1f5f9' }}>
                  <CloudSun size={20} color="#475569" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={styles.actionTitle}>{t('nav_weather')}</h4>
                    <span className="badge badge-coming-soon">Soon</span>
                  </div>
                  <p style={styles.actionSub}>{t('weather_summary')}</p>
                </div>
              </div>
              <ArrowRight size={18} color="#94a3b8" style={styles.arrowIcon} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  welcomeBanner: {
    backgroundColor: '#ffffff',
    padding: '1.5rem 1.75rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap'
  },
  welcomeTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    margin: 0
  },
  welcomeSubtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0'
  },
  addBtn: {
    padding: '0.625rem 1.25rem'
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sectionHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  sectionHeaderTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0
  },
  sectionHeaderSub: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)',
    margin: 0
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem'
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1.25rem'
  },
  iconContainer: {
    width: '46px',
    height: '46px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-light-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardLabel: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em'
  },
  cardVal: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1.2',
    margin: '2px 0'
  },
  cardValTruncated: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1.2',
    margin: '2px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cardHelper: {
    fontSize: '0.725rem',
    color: '#94a3b8'
  },
  mapCard: {
    padding: '0.75rem',
    backgroundColor: '#ffffff'
  },
  emptyMapContainer: {
    minHeight: '320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '2.5rem 1.5rem',
    backgroundColor: '#fafdfa',
    borderRadius: 'var(--radius-md)',
    border: '1px stroke border'
  },
  emptyMapBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-light-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  actionCardLink: {
    textDecoration: 'none'
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  actionIconBadge: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-light-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  actionTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    margin: 0
  },
  actionSub: {
    fontSize: '0.75rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0'
  },
  arrowIcon: {
    flexShrink: 0
  }
};
