import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import FarmMap from '../components/FarmMap';
import { Cpu, Sprout, Layers, Code2, Clock } from 'lucide-react';

export default function DigitalTwinPage() {
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
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Digital Twin Engine</h1>
            <span className="badge badge-coming-soon">Coming Soon</span>
          </div>
          <p style={styles.subtitle}>
            Multi-spectral spatial twin rendering canopy vigor, soil moisture, and sub-plot spatial layers.
          </p>
        </div>

        {farms.length > 0 && (
          <div style={styles.farmSelectWrapper}>
            <Sprout size={16} color="var(--color-primary)" />
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => {
                const found = farms.find((f) => String(f.id) === e.target.value);
                if (found) setSelectedFarm(found);
              }}
              style={styles.farmSelect}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmName} ({f.cropType})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Module Overview & Status Banner */}
      <div className="card" style={styles.bannerCard}>
        <div style={styles.bannerHeader}>
          <div style={styles.iconBadge}>
            <Cpu size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-text-main)' }}>
              Spatial Digital Twin Canvas (Phase 2 Roadmap)
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              This module will render sub-plot micro-zones once Google Earth Engine & Sentinel-2 satellite ingestion pipelines are connected.
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Loading farm boundaries...
        </div>
      ) : !selectedFarm ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Sprout size={36} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>No Farm Registered Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            Register your first farm boundary on the map to initialize its spatial digital twin foundation.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {/* Spatial Field Canvas Card */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={styles.cardSectionHeader}>
              <Layers size={20} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                Spatial Field Boundary Canvas: {selectedFarm.farmName}
              </h3>
            </div>

            <div style={{ height: '380px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <FarmMap
                initialLat={selectedFarm.latitude}
                initialLng={selectedFarm.longitude}
                initialBoundary={selectedFarm.boundary}
                readOnly={true}
              />
            </div>
          </div>

          {/* Module Information Side Card */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={styles.cardSectionHeader}>
              <Clock size={20} color="var(--color-teal)" />
              <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Planned Digital Twin Overlays</h3>
            </div>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <span style={styles.featureBullet}>•</span>
                <div>
                  <h4 style={styles.featureTitle}>NDVI Canopy Vigor Layer</h4>
                  <p style={styles.featureDesc}>Sub-plot chlorophyll absorption mapping via 10m Sentinel-2 Band 4 & Band 8 ratios.</p>
                </div>
              </div>

              <div style={styles.featureItem}>
                <span style={styles.featureBullet}>•</span>
                <div>
                  <h4 style={styles.featureTitle}>NDRE & Chlorophyll Index</h4>
                  <p style={styles.featureDesc}>Red-edge band analysis detecting mid-to-late stage nitrogen deficiency and senescence.</p>
                </div>
              </div>

              <div style={styles.featureItem}>
                <span style={styles.featureBullet}>•</span>
                <div>
                  <h4 style={styles.featureTitle}>SAVI Soil-Adjusted Index</h4>
                  <p style={styles.featureDesc}>Soil brightness correction factor for early crop growth stages before canopy closure.</p>
                </div>
              </div>
            </div>

            <div style={styles.statusBox}>
              <span className="badge badge-coming-soon" style={{ width: 'fit-content' }}>Data Engine Pending</span>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                Field boundary (<b>{selectedFarm.areaHectares} Ha</b>) is delineated and stored. High-resolution raster overlays will be rendered upon satellite engine connection.
              </p>
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
    margin: 0
  },
  farmSelectWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#ffffff',
    padding: '0.375rem 0.875rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)'
  },
  farmSelect: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: 'var(--color-text-main)',
    cursor: 'pointer'
  },
  bannerCard: {
    padding: '1.25rem 1.5rem'
  },
  bannerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-light-green)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '1.25rem',
    alignItems: 'start'
  },
  cardSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.625rem',
    borderBottom: '1px solid var(--color-border)'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.625rem'
  },
  featureBullet: {
    color: 'var(--color-primary)',
    fontWeight: '800',
    fontSize: '1.1rem',
    lineHeight: '1'
  },
  featureTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    margin: 0,
    color: 'var(--color-text-main)'
  },
  featureDesc: {
    fontSize: '0.775rem',
    color: 'var(--color-text-secondary)',
    margin: '2px 0 0 0',
    lineHeight: '1.4'
  },
  statusBox: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    marginTop: 'auto'
  }
};
