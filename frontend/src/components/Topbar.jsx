import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import NotificationCenter from './NotificationCenter';
import { 
  LogOut, 
  UserCheck, 
  Box, 
  RefreshCw, 
  Thermometer, 
  Plane, 
  Radio, 
  Sliders, 
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Topbar({ pageTitle = 'Dashboard' }) {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState('2m ago');

  const currentUser = authService.getCurrentUser() || {
    fullName: 'Elena Rostova',
    email: 'elena.rostova@agritwin.com',
    role: 'Chief Agronomist'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTimestamp('Just now');
    }, 1200);
  };

  return (
    <header style={styles.topbar} className="hud-glow">
      {/* Left: Branding & Farm Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'rgba(34, 229, 138, 0.15)',
            border: '1px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            boxShadow: '0 0 12px rgba(34, 229, 138, 0.25)'
          }}>
            <Box size={20} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 8px #22e58a'
            }}></span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.05rem',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                AgriTwin <span style={{ color: 'var(--color-primary)' }}>Nexus</span>
              </span>
              <span style={{
                fontSize: '9px',
                fontFamily: 'JetBrains Mono, monospace',
                backgroundColor: 'rgba(34, 229, 138, 0.12)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(34, 229, 138, 0.3)',
                padding: '2px 6px',
                borderRadius: '9999px',
                fontWeight: '700'
              }}>
                3D SPATIAL
              </span>
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.7rem',
              color: 'var(--color-text-secondary)',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Cyber-Agronomic Mission Hub
            </p>
          </div>
        </div>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border-subtle)' }} />

        {/* Farm & Plot Selector Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: 'rgba(23, 34, 29, 0.7)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.35rem 0.75rem',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/farms')}
        title="Switch Farm / Parcel View"
        >
          <Layers size={15} color="var(--color-secondary)" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Green Valley Farm - Plot B
              </span>
              <ChevronDown size={13} color="var(--color-text-secondary)" />
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ color: 'var(--color-secondary)' }}>Sector Gamma</span>
              <span>•</span>
              <span>Soybean Pioneer</span>
              <span>•</span>
              <span>4.85 Ha (25 Cells)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Live Sentinel-2 Sync Telemetry Capsule */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        backgroundColor: 'rgba(6, 16, 12, 0.85)',
        border: '1px solid var(--color-border)',
        borderRadius: '9999px',
        padding: '0.35rem 0.95rem',
        boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.6)'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isSyncing ? '#00d9ff' : 'var(--color-primary)',
          boxShadow: isSyncing ? '0 0 10px #00d9ff' : '0 0 8px #22e58a',
          display: 'inline-block'
        }}></span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'Space Grotesk, sans-serif' }}>
          <strong style={{ color: 'var(--color-primary)' }}>Sentinel-2 MSI</strong>
          <span style={{ color: 'var(--color-text-secondary)' }}>Sync {syncTimestamp}</span>
          <span style={{ color: 'var(--color-border-subtle)' }}>|</span>
          <span style={{ color: 'var(--color-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>42ms Latency</span>
          <span style={{ color: 'var(--color-border-subtle)' }}>|</span>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Level-2A BOA Reflex</span>
        </div>

        <button
          onClick={handleTriggerSync}
          style={{
            background: 'none',
            border: 'none',
            color: isSyncing ? '#00d9ff' : 'var(--color-primary)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Force Telemetry Sync"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Right: Weather Pill, Quick Actions, Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Micro-Climate Capsule */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: 'rgba(23, 34, 29, 0.7)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.35rem 0.75rem'
        }}>
          <Thermometer size={16} color="var(--color-secondary)" />
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.78rem', fontWeight: '600', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
              <span>27.4°C</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>65% RH</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>11 km/h</span>
            </div>
            <div style={{ fontSize: '0.68rem', display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Delta-T:</span>
              <strong style={{ color: 'var(--color-tertiary)' }}>3.8</strong>
              <span style={{ color: 'var(--color-primary)' }}>(Optimal Spray)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (Drone planner, Sensor mesh) */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => navigate('/satellite')}
            className="tab-btn"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center', borderRadius: '10px' }}
            title="Satellite Multispectral Earth Observation"
          >
            <Radio size={16} color="var(--color-secondary)" />
          </button>
          <button
            onClick={() => navigate('/recommendations')}
            className="tab-btn"
            style={{ width: '36px', height: '36px', padding: 0, justifyContent: 'center', borderRadius: '10px' }}
            title="AI Agronomic Prescriptions"
          >
            <Sparkles size={16} color="var(--color-primary)" />
          </button>
        </div>

        {/* Notification Center */}
        <NotificationCenter />

        {/* Chief Agronomist Profile Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.3rem 0.65rem',
          backgroundColor: 'rgba(23, 34, 29, 0.7)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(34, 229, 138, 0.15)',
            border: '1px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)'
          }}>
            <UserCheck size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
              {currentUser.fullName}
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
              Chief Agronomist
            </span>
          </div>
        </div>

        {/* Logout Action */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--color-text-secondary)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'Space Grotesk, sans-serif'
          }}
          onClick={handleLogout}
          title="Logout session"
        >
          <LogOut size={14} color="#ffb4ab" />
          <span style={{ color: '#ffb4ab' }}>Exit</span>
        </button>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    height: '68px',
    backgroundColor: 'rgba(11, 21, 17, 0.92)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 40
  }
};
