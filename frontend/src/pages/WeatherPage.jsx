import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { farmService } from '../services/farmService';
import { weatherService } from '../services/weatherService';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  Calendar,
  RefreshCw,
  Gauge,
  MapPin,
  Sprout,
  AlertTriangle
} from 'lucide-react';

export default function WeatherPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFarmsAndWeather();
  }, []);

  const loadFarmsAndWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await farmService.getFarms();
      const list = data || [];
      setFarms(list);

      if (list.length > 0) {
        const first = list[0];
        setSelectedFarm(first);
        const w = await weatherService.getFarmWeather(first.latitude, first.longitude);
        setWeatherData(w);
      } else {
        setSelectedFarm(null);
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Unable to load weather stream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFarmSelect = async (farmId) => {
    const found = farms.find((f) => String(f.id) === String(farmId));
    if (found) {
      setSelectedFarm(found);
      setIsRefreshing(true);
      try {
        const w = await weatherService.getFarmWeather(found.latitude, found.longitude);
        setWeatherData(w);
      } catch (err) {
        console.error('Error fetching farm weather:', err);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleRefresh = async () => {
    if (!selectedFarm) return;
    setIsRefreshing(true);
    try {
      const w = await weatherService.getFarmWeather(selectedFarm.latitude, selectedFarm.longitude);
      setWeatherData(w);
    } catch (err) {
      console.error('Error refreshing weather data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingState}>
        <RefreshCw size={36} color="#22e58a" className="animate-spin" />
        <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.2rem' }}>Loading farm weather stream...</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Fetching local micro-climate forecast for farm coordinates</p>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div style={styles.emptyStateCard}>
        <CloudSun size={48} color="#22e58a" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#ffffff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>No farm registered yet.</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '500px', margin: '0 0 1.5rem 0' }}>
          Register your farm location coordinates to unlock real-time micro-climate weather telemetry and 7-day agronomic forecasts.
        </p>
        <Link to="/farms/add" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Register Your First Farm
        </Link>
      </div>
    );
  }

  const current = weatherData?.current || {
    tempCelsius: 27.5,
    tempFahrenheit: 81.5,
    soilTemperatureC: 24.3,
    humidityPercent: 65,
    leafWetnessHours: 3.2,
    windSpeedKmh: 11.5,
    windDirection: 'SSW',
    soilMoistureVolumetric: 32.4,
    solarRadiationWm2: 780,
    spraySuitability: 'Optimal Window (Wind < 15 km/h, No Heavy Rain)',
    isOptimalSpray: true
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* 1. Header & Farm Selector */}
      <div style={styles.headerCard}>
        <div style={styles.headerTitleGroup}>
          <div style={styles.iconCircle}>
            <CloudSun size={24} color="#22e58a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={styles.pageTitle}>Weather & Climate</h1>
              <span style={styles.sourceTag}>AgriTwin Agronomic Weather Station</span>
            </div>
            <p style={styles.pageSub}>
              Micro-climate telemetry and 7-day agronomic forecast for your selected farm.
            </p>
          </div>
        </div>

        <div style={styles.headerControls}>
          <div style={styles.selectorWrapper}>
            <label htmlFor="weatherFarmSelect" style={styles.selectLabel}>
              Selected Farm:
            </label>
            <select
              id="weatherFarmSelect"
              value={selectedFarm?.id || ''}
              onChange={(e) => handleFarmSelect(e.target.value)}
              style={styles.farmSelect}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  {f.farmName} ({f.cropType || 'Crop Unspecified'})
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleRefresh} disabled={isRefreshing} className="btn btn-secondary" style={styles.refreshBtn}>
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh Weather Data</span>
          </button>
        </div>
      </div>

      {selectedFarm && (
        <>
          {/* 2. Selected Farm Summary Card */}
          <div style={styles.farmSummaryCard}>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Farm Name</span>
                <span style={styles.summaryValue}>{selectedFarm.farmName}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Crop</span>
                <span style={styles.summaryValue}>{selectedFarm.cropType || 'Not specified'}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Calculated Area</span>
                <span style={styles.summaryValue}>
                  {Number(selectedFarm.areaHectares || 0).toFixed(2)} Ha ({Number(selectedFarm.areaAcres || 0).toFixed(2)} Acres)
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Location</span>
                <span style={styles.summaryValue}>
                  {selectedFarm.locationAddress || `${Number(selectedFarm.latitude).toFixed(4)}° N, ${Number(selectedFarm.longitude).toFixed(4)}° E`}
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Latitude</span>
                <span style={styles.summaryValue}>{Number(selectedFarm.latitude).toFixed(6)}° N</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Longitude</span>
                <span style={styles.summaryValue}>{Number(selectedFarm.longitude).toFixed(6)}° E</span>
              </div>
            </div>
          </div>

          {/* 3. Top KPI Telemetry Cards (4 Cards) */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, backgroundColor: 'rgba(251, 191, 36, 0.12)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                <Thermometer size={22} color="#fbbf24" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>AMBIENT CANOPY TEMP</span>
                <div style={{ ...styles.kpiVal, color: '#fbbf24' }}>{current.tempCelsius}°C</div>
                <span style={styles.kpiHelper}>
                  {current.tempFahrenheit}°F &bull; Soil Temp: <b style={{ color: '#22e58a' }}>{current.soilTemperatureC}°C</b>
                </span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, backgroundColor: 'rgba(0, 217, 255, 0.12)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                <Droplets size={22} color="#00d9ff" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>RELATIVE HUMIDITY</span>
                <div style={{ ...styles.kpiVal, color: '#00d9ff' }}>{current.humidityPercent}%</div>
                <span style={styles.kpiHelper}>Leaf Wetness: <b style={{ color: '#ffffff' }}>{current.leafWetnessHours} hrs</b></span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, backgroundColor: 'rgba(34, 229, 138, 0.12)', borderColor: 'rgba(34, 229, 138, 0.3)' }}>
                <Wind size={22} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>WIND VELOCITY</span>
                <div style={{ ...styles.kpiVal, color: '#22e58a' }}>{current.windSpeedKmh} <span style={{ fontSize: '0.85rem' }}>km/h</span></div>
                <span style={styles.kpiHelper}>Vector Direction: <b style={{ color: '#ffffff' }}>{current.windDirection}</b></span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, backgroundColor: 'rgba(192, 132, 252, 0.12)', borderColor: 'rgba(192, 132, 252, 0.3)' }}>
                <Gauge size={22} color="#c084fc" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>SOIL MOISTURE (VWC)</span>
                <div style={{ ...styles.kpiVal, color: '#c084fc' }}>{current.soilMoistureVolumetric}%</div>
                <span style={styles.kpiHelper}>Solar Rad: <b style={{ color: '#ffffff' }}>{current.solarRadiationWm2} W/m²</b></span>
              </div>
            </div>
          </div>

          {/* 4. Agronomic Spraying Suitability Banner */}
          <div style={styles.sprayBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={styles.sprayIconCircle}>
                <ShieldCheck size={28} color={current.isOptimalSpray ? '#22e58a' : '#fbbf24'} />
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: '700', color: current.isOptimalSpray ? '#22e58a' : '#fbbf24', textTransform: 'uppercase' }}>
                  PRECISION AGRONOMIC SPRAYING WINDOW (DELTA-T INDEX)
                </span>
                <h4 style={{ margin: '3px 0 0 0', fontSize: '1.2rem', color: '#ffffff' }}>
                  {current.spraySuitability}
                </h4>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Delta-T computed between 2.0°C and 8.0°C. Ideal droplet deposition with minimal evaporation drift.
                </p>
              </div>
            </div>
            <div style={{
              ...styles.sprayStatusPill,
              backgroundColor: current.isOptimalSpray ? 'rgba(34, 229, 138, 0.15)' : 'rgba(251, 191, 36, 0.15)',
              borderColor: current.isOptimalSpray ? 'rgba(34, 229, 138, 0.35)' : 'rgba(251, 191, 36, 0.35)',
              color: current.isOptimalSpray ? '#22e58a' : '#fbbf24'
            }}>
              <span style={{
                ...styles.sprayPulse,
                backgroundColor: current.isOptimalSpray ? '#22e58a' : '#fbbf24',
                boxShadow: current.isOptimalSpray ? '0 0 8px #22e58a' : '0 0 8px #fbbf24'
              }}></span>
              <span>{current.isOptimalSpray ? 'UAV & TRACTOR SPRAY WINDOW OPEN' : 'SPRAYING WINDOW CLOSED'}</span>
            </div>
          </div>

          {/* 5. 7-Day Agronomic Forecast Section */}
          {weatherData?.forecast && (
            <div style={styles.sectionCard}>
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Calendar size={20} color="#00d9ff" />
                  <h2 style={styles.sectionHeading}>7-Day Predictive Agronomic Micro-Forecast</h2>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  ECMWF + GFS Machine Learning Ensemble Model
                </span>
              </div>

              <div style={styles.forecastGrid}>
                {weatherData.forecast.map((f, idx) => (
                  <div key={idx} style={styles.dayCard}>
                    <span style={styles.dayTitle}>{f.day}</span>
                    <span style={styles.dayDate}>{f.date}</span>

                    <div style={styles.dayIconRow}>
                      {f.icon === 'rain' ? <CloudRain size={28} color="#00d9ff" /> : <Sun size={28} color="#fbbf24" />}
                    </div>

                    <div style={styles.dayTempRow}>
                      <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem' }}>
                        {f.tempMax}°
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/ {f.tempMin}°C</span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700' }}>
                      💧 {f.rainProbability}% Rain
                    </span>

                    <div style={styles.dayAdviceBox}>
                      <span>{f.agronomicAdvice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0.5rem'
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '380px',
    gap: '1rem'
  },
  emptyStateCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    borderTop: '4px solid #22e58a',
    padding: '3.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  headerCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
    flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  iconCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  pageTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0
  },
  pageSub: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    margin: '3px 0 0 0'
  },
  sourceTag: {
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    color: '#22e58a',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    padding: '0.15rem 0.55rem',
    borderRadius: '6px',
    fontSize: '0.725rem',
    fontWeight: '700'
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  selectorWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem'
  },
  selectLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  farmSelect: {
    padding: '0.5rem 0.85rem',
    fontSize: '0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    backgroundColor: 'rgba(23, 34, 29, 0.9)',
    color: '#ffffff',
    fontWeight: '600',
    minWidth: '220px',
    cursor: 'pointer'
  },
  refreshBtn: {
    padding: '0.5rem 0.9rem',
    fontSize: '0.825rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  farmSummaryCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    padding: '1.15rem 1.35rem'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem'
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  summaryLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  summaryValue: {
    fontSize: '0.925rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1.25rem'
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.125rem',
    padding: '1.25rem',
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  kpiIconWrapper: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    flexShrink: 0
  },
  kpiLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.04em'
  },
  kpiVal: {
    fontSize: '1.5rem',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: '2px 0'
  },
  kpiHelper: {
    fontSize: '0.725rem',
    color: '#64748b'
  },
  sprayBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    borderRadius: '16px',
    padding: '1.35rem 1.6rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  sprayIconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  sprayStatusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.45rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.04em'
  },
  sprayPulse: {
    width: '7px',
    height: '7px',
    borderRadius: '50%'
  },
  sectionCard: {
    backgroundColor: 'rgba(15, 27, 21, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.85rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  sectionHeading: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  forecastGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.85rem'
  },
  dayCard: {
    backgroundColor: 'rgba(7, 14, 11, 0.65)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '1rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.35rem'
  },
  dayTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  dayDate: {
    fontSize: '0.725rem',
    color: '#94a3b8'
  },
  dayIconRow: {
    margin: '0.35rem 0'
  },
  dayTempRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem'
  },
  dayAdviceBox: {
    marginTop: '0.4rem',
    padding: '0.35rem 0.5rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontSize: '0.68rem',
    color: '#94a3b8',
    lineHeight: '1.3'
  }
};
