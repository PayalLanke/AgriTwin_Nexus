import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ style, variant = 'dropdown' }) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'buttons') {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', ...style }}>
        {[
          { code: 'en', label: 'English' },
          { code: 'hi', label: 'हिंदी' },
          { code: 'mr', label: 'मराठी' }
        ].map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            style={{
              padding: '0.4rem 0.875rem',
              borderRadius: '10px',
              border: language === item.code ? '1px solid #22e58a' : '1px solid rgba(34, 229, 138, 0.2)',
              backgroundColor: language === item.code ? 'rgba(34, 229, 138, 0.18)' : 'rgba(15, 27, 21, 0.8)',
              color: language === item.code ? '#22e58a' : '#94a3b8',
              fontWeight: '700',
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'Space Grotesk, sans-serif'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      aria-label="Select Dashboard Language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        padding: '0.4rem 0.85rem',
        borderRadius: '10px',
        border: '1px solid rgba(34, 229, 138, 0.35)',
        backgroundColor: 'rgba(15, 27, 21, 0.95)',
        color: '#ffffff',
        fontWeight: '700',
        fontSize: '0.8rem',
        cursor: 'pointer',
        outline: 'none',
        fontFamily: 'Space Grotesk, sans-serif',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        ...style
      }}
    >
      <option value="en" style={{ backgroundColor: '#0f1b15', color: '#ffffff' }}>🇬🇧 English</option>
      <option value="hi" style={{ backgroundColor: '#0f1b15', color: '#ffffff' }}>🇮🇳 हिंदी (Hindi)</option>
      <option value="mr" style={{ backgroundColor: '#0f1b15', color: '#ffffff' }}>🇮🇳 मराठी (Marathi)</option>
    </select>
  );
}
