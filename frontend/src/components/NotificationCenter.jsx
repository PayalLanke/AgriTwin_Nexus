import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, ShieldAlert, Sparkles, Send } from 'lucide-react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'critical'

  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Sub-Plot B2: -14 kg N/ha Deficit Anomaly',
      message: 'Multi-spectral Red-Edge band & Probe #08 detected nitrogen uptake drop. Immediate foliar spray recommended.',
      type: 'critical',
      timestamp: '2 mins ago',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Sentinel-2 L2A BOA Reflectance Synced',
      message: 'ESA Copernicus 10m tile ingested. Mean parcel NDVI updated to 0.74 with 0% cloud occlusion.',
      type: 'info',
      timestamp: '18 mins ago',
      read: false
    },
    {
      id: 'notif_3',
      title: 'Microclimate Delta-T Window: 3.8 Optimal',
      message: 'Safe spraying window open for the next 4.5 hours (Wind 11 km/h ESE, safe chemical drift envelope).',
      type: 'success',
      timestamp: '1 hour ago',
      read: true
    },
    {
      id: 'notif_4',
      title: 'Autonomous UAV Alpha-1 Ready for Mission',
      message: 'Drone telemetry link verified with 42ms ping. Battery at 98%, ready for precision variable-rate spray.',
      type: 'info',
      timestamp: '3 hours ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotif = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.type === 'critical';
    return true;
  });

  return (
    <div style={{ position: 'relative' }}>
      {/* Topbar Bell Icon Trigger */}
      <button
        type="button"
        style={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Telemetry Notifications & Agronomic Alerts"
      >
        <Bell size={18} color="var(--color-primary)" />
        {unreadCount > 0 && <span style={styles.unreadBadge}>{unreadCount}</span>}
      </button>

      {/* Floating Notification Drawer */}
      {isOpen && (
        <div style={styles.dropdownDrawer} className="animate-fade-in">
          {/* Header */}
          <div style={styles.drawerHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                Tactical Alerts & Telemetry
              </h4>
            </div>
            <button style={styles.iconCloseBtn} onClick={() => setIsOpen(false)}>
              <X size={16} color="var(--color-text-secondary)" />
            </button>
          </div>

          {/* Filter Bar */}
          <div style={styles.filterBar}>
            <button
              style={{ ...styles.filterChip, ...(filter === 'all' ? styles.filterChipActive : {}) }}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              style={{ ...styles.filterChip, ...(filter === 'unread' ? styles.filterChipActive : {}) }}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              style={{ ...styles.filterChip, ...(filter === 'critical' ? styles.filterChipActive : {}) }}
              onClick={() => setFilter('critical')}
            >
              Critical
            </button>

            {unreadCount > 0 && (
              <button style={styles.markReadTextBtn} onClick={handleMarkAllAsRead}>
                Mark All Read
              </button>
            )}
          </div>

          {/* Notifications Scroll Area */}
          <div style={styles.notifList}>
            {filteredNotifs.length === 0 ? (
              <div style={styles.emptyState}>
                <CheckCircle size={28} color="var(--color-primary)" />
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  All agricultural telemetry is nominal.
                </p>
              </div>
            ) : (
              filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  style={{
                    ...styles.notifItem,
                    ...(n.read ? styles.notifItemRead : styles.notifItemUnread)
                  }}
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div style={styles.itemIconCol}>
                    {n.type === 'critical' ? (
                      <AlertTriangle size={18} color="#ef4444" />
                    ) : n.type === 'success' ? (
                      <CheckCircle size={18} color="var(--color-primary)" />
                    ) : (
                      <Info size={18} color="var(--color-secondary)" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h5 style={styles.itemTitle}>{n.title}</h5>
                      <button
                        style={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearNotif(n.id);
                        }}
                        title="Dismiss"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p style={styles.itemMessage}>{n.message}</p>
                    <span style={styles.itemTimestamp}>{n.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  bellButton: {
    position: 'relative',
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    backgroundColor: 'rgba(23, 34, 29, 0.75)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: 'var(--shadow-sm)'
  },
  unreadBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: 'var(--color-primary)',
    color: '#05140d',
    fontSize: '0.68rem',
    fontWeight: '800',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 8px #22e58a'
  },
  dropdownDrawer: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '380px',
    maxWidth: '90vw',
    backgroundColor: 'rgba(11, 21, 17, 0.95)',
    backdropFilter: 'blur(24px)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-glow)',
    zIndex: 100,
    overflow: 'hidden'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--color-border-subtle)',
    backgroundColor: 'rgba(23, 34, 29, 0.6)'
  },
  iconCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px'
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1.25rem',
    borderBottom: '1px solid var(--color-border-subtle)',
    backgroundColor: 'rgba(15, 28, 22, 0.4)'
  },
  filterChip: {
    padding: '0.25rem 0.65rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '9999px',
    border: '1px solid var(--color-border-subtle)',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  filterChipActive: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    borderColor: 'var(--color-primary)'
  },
  markReadTextBtn: {
    marginLeft: 'auto',
    fontSize: '0.72rem',
    color: 'var(--color-secondary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600'
  },
  notifList: {
    maxHeight: '340px',
    overflowY: 'auto'
  },
  emptyState: {
    padding: '2.5rem 1.5rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  notifItem: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.85rem 1.25rem',
    borderBottom: '1px solid var(--color-border-subtle)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  },
  notifItemUnread: {
    backgroundColor: 'rgba(34, 229, 138, 0.06)'
  },
  notifItemRead: {
    opacity: 0.8
  },
  itemIconCol: {
    marginTop: '2px'
  },
  itemTitle: {
    margin: 0,
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    padding: '2px'
  },
  itemMessage: {
    margin: '0.25rem 0',
    fontSize: '0.78rem',
    color: 'var(--color-text-main)',
    lineHeight: '1.4'
  },
  itemTimestamp: {
    fontSize: '0.7rem',
    color: 'var(--color-text-secondary)',
    fontFamily: 'JetBrains Mono, monospace'
  }
};
