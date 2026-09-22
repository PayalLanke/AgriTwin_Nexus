import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'critical'

  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Pest Risk Alert: Powdery Mildew',
      message: 'High humidity (68%) and canopy density triggered Powder Mildew warning on Green Valley Plot A.',
      type: 'critical',
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Sentinel-2 Satellite Scene Updated',
      message: 'New 10m multispectral satellite imagery tile processed. NDVI calculated at 0.76.',
      type: 'info',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 'notif_3',
      title: 'Weather Spraying Suitability',
      message: 'Optimal spraying window open today (Wind < 12 km/h, No rain expected).',
      type: 'success',
      timestamp: '3 hours ago',
      read: true
    },
    {
      id: 'notif_4',
      title: 'Digital Twin Model Synced',
      message: 'Sub-plot canopy vigor grid updated. Zone B requires variable-rate nitrogen advisory.',
      type: 'info',
      timestamp: 'Yesterday',
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
        title="Notifications & Agronomic Alerts"
      >
        <Bell size={18} color="#4b5563" />
        {unreadCount > 0 && <span style={styles.unreadBadge}>{unreadCount}</span>}
      </button>

      {/* Floating Notification Drawer */}
      {isOpen && (
        <div style={styles.dropdownDrawer} className="animate-fade-in">
          {/* Header */}
          <div style={styles.drawerHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-primary)" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>Platform Notifications</h4>
            </div>
            <button style={styles.iconCloseBtn} onClick={() => setIsOpen(false)}>
              <X size={16} color="#6b7280" />
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
              <button style={styles.markAllBtn} onClick={handleMarkAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={styles.notifList}>
            {filteredNotifs.length === 0 ? (
              <div style={styles.emptyNotifBox}>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8' }}>
                  No notifications match selected filter.
                </p>
              </div>
            ) : (
              filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    ...styles.notifItem,
                    backgroundColor: notif.read ? '#ffffff' : 'var(--color-primary-light)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    {notif.type === 'critical' && <ShieldAlert size={18} color="var(--color-danger)" style={{ marginTop: '2px' }} />}
                    {notif.type === 'info' && <Info size={18} color="var(--color-teal)" style={{ marginTop: '2px' }} />}
                    {notif.type === 'success' && <CheckCircle size={18} color="var(--color-primary)" style={{ marginTop: '2px' }} />}

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={styles.notifTitle}>{notif.title}</span>
                        <span style={styles.notifTime}>{notif.timestamp}</span>
                      </div>
                      <p style={styles.notifMessage}>{notif.message}</p>

                      <div style={styles.notifFooter}>
                        {!notif.read && (
                          <button
                            style={styles.actionTextBtn}
                            onClick={() => handleMarkAsRead(notif.id)}
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          style={{ ...styles.actionTextBtn, color: '#94a3b8' }}
                          onClick={() => handleClearNotif(notif.id)}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
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
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.15s ease'
  },
  unreadBadge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    backgroundColor: 'var(--color-danger)',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: '800',
    padding: '0.125rem 0.35rem',
    borderRadius: '9999px',
    border: '2px solid #ffffff'
  },
  dropdownDrawer: {
    position: 'absolute',
    right: 0,
    top: '48px',
    width: '360px',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 50,
    overflow: 'hidden'
  },
  drawerHeader: {
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc'
  },
  iconCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem'
  },
  filterBar: {
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#ffffff'
  },
  filterChip: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.725rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    cursor: 'pointer'
  },
  filterChipActive: {
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    fontWeight: '700'
  },
  markAllBtn: {
    marginLeft: 'auto',
    fontSize: '0.7rem',
    color: 'var(--color-primary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600'
  },
  notifList: {
    maxHeight: '340px',
    overflowY: 'auto'
  },
  emptyNotifBox: {
    padding: '2rem',
    textAlign: 'center'
  },
  notifItem: {
    padding: '0.875rem 1rem',
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.15s ease'
  },
  notifTitle: {
    fontSize: '0.8125rem',
    fontWeight: '700',
    color: 'var(--color-text-main)'
  },
  notifTime: {
    fontSize: '0.675rem',
    color: '#94a3b8'
  },
  notifMessage: {
    fontSize: '0.775rem',
    color: '#475569',
    margin: '4px 0 6px 0',
    lineHeight: '1.4'
  },
  notifFooter: {
    display: 'flex',
    gap: '0.75rem'
  },
  actionTextBtn: {
    background: 'none',
    border: 'none',
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    padding: 0
  }
};
