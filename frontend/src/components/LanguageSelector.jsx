import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ style, variant = 'dropdown' }) {
  const { language, setLanguage, t } = useLanguage();

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
              borderRadius: 'var(--radius-md)',
              border: language === item.code ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              backgroundColor: language === item.code ? 'var(--color-light-green)' : '#ffffff',
              color: language === item.code ? 'var(--color-primary)' : 'var(--color-text-main)',
              fontWeight: '700',
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', ...style }}>
      <Globe size={16} color="var(--color-primary)" />
      <select
        aria-label="Select Dashboard Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          padding: '0.375rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: '#ffffff',
          color: 'var(--color-text-main)',
          fontWeight: '700',
          fontSize: '0.825rem',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <option value="en">🇬🇧 English</option>
        <option value="hi">🇮🇳 हिंदी (Hindi)</option>
        <option value="mr">🇮🇳 मराठी (Marathi)</option>
      </select>
    </div>
  );
}
