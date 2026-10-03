<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
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
  Sparkles,
  Compass,
  Radio,
  Clock,
  Gauge
} from 'lucide-react';

export default function WeatherPage() {
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
      if (data.length > 0) {
        setSelectedFarm(data[0]);
        const w = await weatherService.getFarmWeather(data[0].latitude, data[0].longitude);
        setWeatherData(w);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFarmSelect = async (farmId) => {
    const f = farms.find((farm) => String(farm.id) === String(farmId));
    if (f) {
      setSelectedFarm(f);
      setIsLoading(true);
      const w = await weatherService.getFarmWeather(f.latitude, f.longitude);
      setWeatherData(w);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#22e58a', fontFamily: 'Space Grotesk, sans-serif', marginTop: '1rem', letterSpacing: '0.05em' }}>
          CONNECTING HYPER-LOCAL MICROCLIMATE STATION STREAM...
        </p>
      </div>
    );
  }

  const current = weatherData?.current;

=======
import React from 'react';
import { CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';

export default function WeatherPage() {
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
<<<<<<< HEAD
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={styles.title}>Micro-Climate & Agronomic Weather Station</h1>
            <span style={styles.stationBadge}>
              <Radio size={12} color="#00d9ff" />
              LORA MESH TELEMETRY ACTIVE
            </span>
          </div>
          <p style={styles.subtitle}>
            In-situ soil probe volumetric moisture, ambient boundary layer temperature, and 7-day spray suitability index.
          </p>
        </div>

        {farms.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Space Grotesk, sans-serif' }}>TARGET PLOT:</span>
            <select
              value={selectedFarm?.id || ''}
              onChange={(e) => handleFarmSelect(e.target.value)}
              style={styles.selectInput}
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} style={{ background: '#0b1612', color: '#f1f5f9' }}>
                  {f.farmName} &bull; {f.cropType}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!selectedFarm ? (
        <div style={styles.noFarmCard}>
          <Thermometer size={48} color="#22e58a" />
          <h3 style={{ color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>No Farm Registered</h3>
          <p style={{ color: '#94a3b8', margin: 0 }}>Register a farm boundary to stream weather data for its location coordinates.</p>
        </div>
      ) : (
        <>
          {/* Top KPI Metrics Bar */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <Thermometer size={22} color="#fbbf24" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>AMBIENT CANOPY TEMP</span>
                <div style={{ ...styles.kpiVal, color: '#fbbf24' }}>{current.tempCelsius}°C</div>
                <span style={styles.kpiHelper}>
                  {current.tempFahrenheit}°F &bull; Soil: <b style={{ color: '#22e58a' }}>{current.soilTemperatureC}°C</b>
                </span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                <Droplets size={22} color="#00d9ff" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>RELATIVE HUMIDITY</span>
                <div style={{ ...styles.kpiVal, color: '#00d9ff' }}>{current.humidityPercent}%</div>
                <span style={styles.kpiHelper}>Leaf Wetness: <b style={{ color: '#ffffff' }}>{current.leafWetnessHours} hrs</b></span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, background: 'rgba(34, 229, 138, 0.1)', borderColor: 'rgba(34, 229, 138, 0.3)' }}>
                <Wind size={22} color="#22e58a" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>WIND VELOCITY</span>
                <div style={{ ...styles.kpiVal, color: '#22e58a' }}>{current.windSpeedKmh} <span style={{ fontSize: '0.9rem' }}>km/h</span></div>
                <span style={styles.kpiHelper}>Vector Direction: <b style={{ color: '#ffffff' }}>{current.windDirection}</b></span>
              </div>
            </div>

            <div style={styles.kpiCard}>
              <div style={{ ...styles.kpiIconWrapper, background: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                <Gauge size={22} color="#c084fc" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={styles.kpiLabel}>SOIL MOISTURE (VWC)</span>
                <div style={{ ...styles.kpiVal, color: '#c084fc' }}>{current.soilMoistureVolumetric}%</div>
                <span style={styles.kpiHelper}>Solar Rad: <b style={{ color: '#ffffff' }}>{current.solarRadiationWm2} W/m²</b></span>
              </div>
=======
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Weather Insights</h1>
            <span className="badge badge-coming-soon">Coming Soon</span>
          </div>
          <p style={styles.subtitle}>
            Agronomic micro-climate parameters, soil moisture, and spraying suitability forecasts.
          </p>
        </div>
      </div>

      {/* Main Status & Info Card */}
      <div className="card" style={styles.mainCard}>
        <div style={styles.iconContainer}>
          <CloudSun size={40} color="var(--color-warning)" />
        </div>
        <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>
          Weather Service Integration Under Development
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', maxWidth: '520px', lineHeight: '1.6', margin: 0, textAlign: 'center' }}>
          Weather information will appear after weather service integration. This module will stream hyper-local ambient temperature, volumetric soil moisture, relative humidity, and 7-day spraying suitability indices for registered farm locations.
        </p>

        <div style={styles.specsGrid}>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={16} color="var(--color-warning)" />
              <span style={styles.specTitle}>Air & Canopy Temp</span>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
            </div>
            <span style={styles.specDetail}>Thermal telemetry for heat stress & frost warning</span>
          </div>
<<<<<<< HEAD

          {/* Spraying Suitability Banner */}
          <div style={styles.sprayBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={styles.sprayIconCircle}>
                <ShieldCheck size={28} color="#22e58a" />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#22e58a', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Space Grotesk, sans-serif' }}>
                  PRECISION AGRONOMIC SPRAYING WINDOW (DELTA-T INDEX)
                </span>
                <h4 style={{ margin: '3px 0 0 0', fontSize: '1.25rem', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {current.spraySuitability} Condition
                </h4>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.775rem', color: '#94a3b8' }}>
                  Delta-T computed between 2.0°C and 8.0°C. Ideal droplet deposition with minimal evaporation drift.
                </p>
              </div>
            </div>
            <div style={styles.sprayStatusPill}>
              <span style={styles.sprayPulse}></span>
              <span>UAV & TRACTOR SPRAY WINDOW OPEN</span>
            </div>
          </div>

          {/* 7-Day Agronomic Forecast Table */}
          <div style={styles.forecastCard}>
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ ...styles.kpiIconWrapper, width: '36px', height: '36px', background: 'rgba(0, 217, 255, 0.1)', borderColor: 'rgba(0, 217, 255, 0.3)' }}>
                  <Calendar size={18} color="#00d9ff" />
                </div>
                <div>
                  <h3 style={styles.sectionHeading}>7-Day Predictive Agronomic Micro-Forecast</h3>
                  <span style={{ fontSize: '0.725rem', color: '#64748b' }}>ECMWF + GFS Machine Learning Ensemble Model</span>
                </div>
              </div>
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
                    <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '1rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {f.tempMax}°
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/ {f.tempMin}°C</span>
                  </div>

                  <span style={{ fontSize: '0.725rem', color: '#38bdf8', fontWeight: '600', fontFamily: 'Space Grotesk, sans-serif' }}>
                    💧 {f.rainProbability}% Rain
                  </span>

                  <div style={styles.dayAdviceBox}>
                    <span>{f.agronomicAdvice}</span>
                  </div>
                </div>
              ))}
=======
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={16} color="var(--color-teal)" />
              <span style={styles.specTitle}>Soil Moisture</span>
            </div>
            <span style={styles.specDetail}>Volumetric soil water content at 0-10cm root zone</span>
          </div>
          <div style={styles.specBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind size={16} color="var(--color-primary)" />
              <span style={styles.specTitle}>Spray Suitability</span>
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
            </div>
            <span style={styles.specDetail}>Wind speed & dew point thresholds for pesticide drift</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  loadingContainer: {
    padding: '6rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(34, 229, 138, 0.15)',
    borderTop: '3px solid #22e58a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
<<<<<<< HEAD
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
  stationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.35)',
    color: '#00d9ff',
    fontSize: '0.7rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  selectInput: {
    padding: '0.55rem 1rem',
    borderRadius: '12px',
    fontWeight: '600',
    background: 'rgba(9, 18, 14, 0.85)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    color: '#f8fafc',
    fontSize: '0.825rem',
    outline: 'none',
    cursor: 'pointer'
  },
  noFarmCard: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(15, 27, 21, 0.72)',
    borderRadius: '18px',
    border: '1px solid rgba(34, 229, 138, 0.18)'
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
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  kpiIconWrapper: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid'
  },
  kpiLabel: {
    fontSize: '0.675rem',
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  kpiVal: {
    fontSize: '1.5rem',
    fontWeight: '800',
    fontFamily: 'Space Grotesk, sans-serif',
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
    background: 'linear-gradient(135deg, rgba(34, 229, 138, 0.12) 0%, rgba(15, 27, 21, 0.85) 100%)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    borderRadius: '18px',
    padding: '1.5rem 1.75rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  sprayIconCircle: {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    background: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sprayStatusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    background: 'rgba(34, 229, 138, 0.15)',
    border: '1px solid rgba(34, 229, 138, 0.4)',
    color: '#22e58a',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif',
    letterSpacing: '0.04em'
  },
  sprayPulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#22e58a',
    boxShadow: '0 0 10px #22e58a'
  },
  forecastCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
=======
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
  mainCard: {
    padding: '3.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  iconContainer: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#fffbeb',
    display: 'flex',
    alignItems: 'center',
<<<<<<< HEAD
    justifyContent: 'space-between',
    paddingBottom: '0.875rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
  },
  sectionHeading: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
=======
    justifyContent: 'center',
    marginBottom: '0.5rem'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  },
  specsGrid: {
    display: 'grid',
<<<<<<< HEAD
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.875rem'
  },
  dayCard: {
    backgroundColor: 'rgba(8, 17, 13, 0.75)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '1.125rem 0.875rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.35rem',
    transition: 'all 0.2s ease'
  },
  dayTitle: {
    fontSize: '0.925rem',
    fontWeight: '700',
    color: '#22e58a',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  dayDate: {
    fontSize: '0.7rem',
    color: '#64748b'
  },
  dayIconRow: {
    margin: '0.35rem 0'
  },
  dayTempRow: {
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem'
  },
  dayAdviceBox: {
    marginTop: '0.5rem',
    padding: '0.45rem',
    backgroundColor: 'rgba(15, 27, 21, 0.9)',
    borderRadius: '8px',
    border: '1px solid rgba(34, 229, 138, 0.15)',
    fontSize: '0.675rem',
    color: '#94a3b8',
    fontWeight: '500',
    lineHeight: '1.3'
=======
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    width: '100%',
    maxWidth: '750px',
    marginTop: '1.5rem'
  },
  specBox: {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  specTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-text-main)',
    textTransform: 'uppercase'
  },
  specDetail: {
    fontSize: '0.8125rem',
    color: 'var(--color-text-secondary)'
>>>>>>> b270717684b57393302c90a3bbe76940a6e8fee4
  }
};
