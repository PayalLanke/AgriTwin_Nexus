import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'agritwin_unit_preferences';

const defaultPreferences = {
  areaUnit: 'hectares', // 'hectares' | 'acres'
  tempUnit: 'celsius', // 'celsius' | 'fahrenheit'
  notifications: {
    weatherAlerts: true,
    cropHealthAlerts: true,
    riskAlerts: true,
    recommendationUpdates: true,
    satelliteDataAvailability: true
  }
};

const UnitContext = createContext();

export function UnitProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultPreferences, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved unit preferences:', e);
    }
    return defaultPreferences;
  });

  const savePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save unit preferences:', e);
    }
  };

  /**
   * Format field area according to current unit preference (Hectares vs. Acres)
   */
  const formatArea = (haValue) => {
    const ha = Number(haValue || 0);
    if (preferences.areaUnit === 'acres') {
      const acres = ha * 2.47105;
      return `${acres.toFixed(2)} acres`;
    }
    return `${ha.toFixed(2)} ha`;
  };

  /**
   * Format temperature according to current unit preference (Celsius vs. Fahrenheit)
   */
  const formatTemp = (celsiusValue) => {
    const c = Number(celsiusValue || 0);
    if (preferences.tempUnit === 'fahrenheit') {
      const f = (c * 9) / 5 + 32;
      return `${f.toFixed(1)}°F`;
    }
    return `${c.toFixed(1)}°C`;
  };

  return (
    <UnitContext.Provider
      value={{
        areaUnit: preferences.areaUnit,
        tempUnit: preferences.tempUnit,
        notifications: preferences.notifications,
        savePreferences,
        formatArea,
        formatTemp
      }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitProvider');
  }
  return context;
}
