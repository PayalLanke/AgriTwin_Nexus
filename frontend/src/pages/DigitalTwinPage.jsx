import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { getFarmIndicesAnalysis } from '../utils/indicesEngine';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Cpu, Sprout, Activity, Layers, RefreshCw, Sparkles, Zap } from 'lucide-react';

export default function DigitalTwinPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [indicesData, setIndicesData] = useState(null);
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
        setIndicesData(getFarmIndicesAnalysis(data[0].cropType, data[0].sowingDate));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFarm = (farmId) => {
    const farm = farms.find((f) => String(f.id) === String(farmId));
    if (farm) {
      setSelectedFarm(farm);
      setIndicesData(getFarmIndicesAnalysis(farm.cropType, farm.sowingDate));
    }
  };

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Digital Twin Workspace...</div>;
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Top Header & Farm Selector */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Farm Digital Twin Engine</h1>
            <span className="badge badge-teal">Live Simulation Mode</span>
          </div>
          <p style={styles.subtitle}>
            Multi-spectral spatial twin modeling, sub-plot micro-zone health, and historical index curves.
          </p>
        </div>

        {farms.length > 0 && (
          <div style={styles.farmSelectWrapper}>
            <Sprout size={16} color="var(--color-primary)" />
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => handleSelectFarm(e.target.value)}
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

      {!selectedFarm ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Farm Registered Yet</h3>
          <p>Register a farm boundary on the Leaflet map to generate its digital twin.</p>
        </div>
      ) : (
        <>
          {/* Digital Twin Spatial Grid Canvas */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <DigitalTwinCanvas farm={selectedFarm} indices={indicesData} />
          </div>

          {/* Time-Series Growth Curve Recharts */}
          <div className="card" style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Vegetation Indices Temporal Growth Curve</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  Multi-spectral Sentinel-2 NDVI, NDRE, EVI, and SAVI index tracking over sowing growth stages.
                </p>
              </div>
              <span className="badge badge-primary">Sentinel-2 10m Certified</span>
            </div>

            <div style={{ width: '100%', height: 320, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={indicesData?.growthSeries || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="stage" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[0, 1]} stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="NDVI" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="NDRE" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="SAVI" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="EVI" stroke="#7c3aed" strokeWidth={2} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
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
    fontWeight: '700',
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
  chartCard: {
    display: 'flex',
    flexDirection: 'column'
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  }
};
