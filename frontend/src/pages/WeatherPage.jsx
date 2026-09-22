import React, { useEffect, useState } from 'react';
import { farmService } from '../services/farmService';
import { weatherService } from '../services/weatherService';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Thermometer, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

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
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Micro-Climate Telemetry...</div>;
  }

  const current = weatherData?.current;

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={styles.title}>Micro-Climate & Agronomic Weather</h1>
            <span className="badge badge-primary">Hyper-Local Station Stream</span>
          </div>
          <p style={styles.subtitle}>
            Real-time weather parameters, volumetric soil moisture, and 7-day spray suitability forecast.
          </p>
        </div>

        {farms.length > 0 && (
          <select
            value={selectedFarm?.id || ''}
            onChange={(e) => handleFarmSelect(e.target.value)}
            style={styles.selectInput}
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.farmName} ({f.cropType})
              </option>
            ))}
          </select>
        )}
      </div>

      {!selectedFarm ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Farm Registered</h3>
          <p>Register a farm boundary to stream weather data for its location coordinates.</p>
        </div>
      ) : (
        <>
          {/* Top KPI Metrics Bar */}
          <div style={styles.kpiGrid}>
            <div className="card" style={styles.kpiCard}>
              <Thermometer size={24} color="#f59e0b" />
              <div>
                <span style={styles.kpiLabel}>Air Temperature</span>
                <div style={styles.kpiVal}>{current.tempCelsius}°C</div>
                <span style={styles.kpiHelper}>{current.tempFahrenheit}°F &bull; Soil: {current.soilTemperatureC}°C</span>
              </div>
            </div>

            <div className="card" style={styles.kpiCard}>
              <Droplets size={24} color="#0284c7" />
              <div>
                <span style={styles.kpiLabel}>Relative Humidity</span>
                <div style={styles.kpiVal}>{current.humidityPercent}%</div>
                <span style={styles.kpiHelper}>Leaf Wetness: {current.leafWetnessHours} hrs</span>
              </div>
            </div>

            <div className="card" style={styles.kpiCard}>
              <Wind size={24} color="var(--color-teal)" />
              <div>
                <span style={styles.kpiLabel}>Wind Velocity</span>
                <div style={styles.kpiVal}>{current.windSpeedKmh} km/h</div>
                <span style={styles.kpiHelper}>Direction: {current.windDirection}</span>
              </div>
            </div>

            <div className="card" style={styles.kpiCard}>
              <Sun size={24} color="#10b981" />
              <div>
                <span style={styles.kpiLabel}>Soil Moisture (VWC)</span>
                <div style={styles.kpiVal}>{current.soilMoistureVolumetric}%</div>
                <span style={styles.kpiHelper}>Solar Radiation: {current.solarRadiationWm2} W/m²</span>
              </div>
            </div>
          </div>

          {/* Spraying Suitability Banner */}
          <div style={styles.sprayBanner} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <ShieldCheck size={28} color="var(--color-primary)" />
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  Agronomic Spraying Index
                </span>
                <h4 style={{ margin: '2px 0 0 0', fontSize: '1.1rem' }}>{current.spraySuitability}</h4>
              </div>
            </div>
            <span className="badge badge-primary">Pesticide & Fertilizer Window Open</span>
          </div>

          {/* 7-Day Agronomic Forecast Table */}
          <div className="card" style={styles.forecastCard}>
            <div style={styles.cardHeader}>
              <Calendar size={20} color="var(--color-teal)" />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>7-Day Agronomic Forecast & Advisories</h3>
            </div>

            <div style={styles.forecastGrid}>
              {weatherData.forecast.map((f, idx) => (
                <div key={idx} style={styles.dayCard}>
                  <span style={styles.dayTitle}>{f.day}</span>
                  <span style={styles.dayDate}>{f.date}</span>

                  <div style={styles.dayIconRow}>
                    {f.icon === 'rain' ? <CloudRain size={28} color="#0284c7" /> : <Sun size={28} color="#f59e0b" />}
                  </div>

                  <div style={styles.dayTempRow}>
                    <span style={{ fontWeight: '700', color: 'var(--color-text-main)' }}>{f.tempMax}°C</span>
                    <span style={{ color: '#94a3b8' }}>/ {f.tempMin}°C</span>
                  </div>

                  <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Rain: {f.rainProbability}%</span>

                  <div style={styles.dayAdviceBox}>
                    <span>{f.agronomicAdvice}</span>
                  </div>
                </div>
              ))}
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
  selectInput: {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    width: 'auto'
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '1.25rem'
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem'
  },
  kpiLabel: {
    fontSize: '0.725rem',
    fontWeight: '700',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase'
  },
  kpiVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-text-main)',
    lineHeight: '1.2'
  },
  kpiHelper: {
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  sprayBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid #bbf7d0',
    padding: '1.25rem 1.5rem'
  },
  forecastCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--color-border)'
  },
  forecastGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '0.875rem'
  },
  dayCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    padding: '1rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.375rem'
  },
  dayTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--color-primary)'
  },
  dayDate: {
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  dayIconRow: {
    margin: '0.375rem 0'
  },
  dayTempRow: {
    fontSize: '0.85rem',
    display: 'flex',
    gap: '0.25rem'
  },
  dayAdviceBox: {
    marginTop: '0.375rem',
    padding: '0.375rem',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    fontSize: '0.675rem',
    color: '#475569',
    fontWeight: '500'
  }
};
