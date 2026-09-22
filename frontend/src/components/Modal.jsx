import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function Modal({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose, isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard} className="animate-fade-in">
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {isDanger && <AlertTriangle size={20} color="var(--color-danger)" />}
            <h3 style={styles.title}>{title}</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="#6b7280" />
          </button>
        </div>

        <div style={styles.body}>
          <p style={styles.message}>{message}</p>
        </div>

        <div style={styles.footer}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button
            type="button"
            className={isDanger ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '450px',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden'
  },
  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: '1.1rem',
    margin: 0,
    fontWeight: '700'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    padding: '1.5rem'
  },
  message: {
    fontSize: '0.9rem',
    color: '#4b5563',
    lineHeight: '1.5',
    margin: 0
  },
  footer: {
    padding: '1rem 1.5rem',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem'
  }
};
