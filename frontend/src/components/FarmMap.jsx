import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { calculatePolygonArea, isValidPolygon } from '../utils/geoUtils';
import { Search, MapPin, Trash2, CheckCircle2, AlertCircle, Edit3, Compass, Navigation, Building2, Locate, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Fix for default Leaflet icon paths in Vite / React build
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

export default function FarmMap({
  initialLat = 18.5204,
  initialLng = 73.8567,
  initialBoundary = null,
  readOnly = false,
  onLocationChange,
  onBoundaryChange
}) {
  const { t } = useLanguage();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const centerMarkerRef = useRef(null);
  const activePolygonLayerRef = useRef(null);
  const searchContainerRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const labelTileLayerRef = useRef(null);

  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(initialBoundary);
  const [areaStats, setAreaStats] = useState({ hectares: 0, acres: 0, sqMeters: 0 });

  // Map Tile View Mode ('hybrid' | 'satellite' | 'street' | 'esri')
  const [tileMode, setTileMode] = useState('hybrid');

  // Real-time location & village search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchSuccess, setSearchSuccess] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  // Switch Leaflet Tile Layer with guaranteed high-zoom coverage for rural India
  const applyTileLayer = (mode, map = mapInstanceRef.current) => {
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }
    if (labelTileLayerRef.current) {
      map.removeLayer(labelTileLayerRef.current);
      labelTileLayerRef.current = null;
    }

    if (mode === 'street') {
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        maxNativeZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      currentTileLayerRef.current = osm;
    } else if (mode === 'esri') {
      // Esri Satellite with maxNativeZoom: 17 so Leaflet scales tiles cleanly without "Map data not available"
      const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        maxNativeZoom: 17,
        attribution: 'Esri World Imagery'
      }).addTo(map);
      currentTileLayerRef.current = esriSat;
    } else if (mode === 'satellite') {
      // Google Pure High-Res Satellite (Full HD coverage everywhere in India)
      const googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Satellite'
      }).addTo(map);
      currentTileLayerRef.current = googleSat;
    } else {
      // Hybrid: Google High-Res Satellite + Village & Road Labels (Default for Farm GIS)
      const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Hybrid Satellite'
      }).addTo(map);
      currentTileLayerRef.current = googleHybrid;
    }
    setTileMode(mode);
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: true,
      maxZoom: 20
    });

    mapInstanceRef.current = map;

    // Apply default Hybrid Satellite view mode for agricultural field clarity
    applyTileLayer('hybrid', map);

    // Add Center Marker
    const marker = L.marker([initialLat, initialLng], {
      draggable: !readOnly,
      title: 'Farm Center Location'
    }).addTo(map);
    centerMarkerRef.current = marker;

    marker.bindPopup(`<b>Farm Location Center</b><br>Lat: ${initialLat.toFixed(5)}<br>Lng: ${initialLng.toFixed(5)}`).openPopup();

    if (!readOnly) {
      marker.on('dragend', (e) => {
        const { lat: newLat, lng: newLng } = e.target.getLatLng();
        updateLocation(newLat, newLng);
      });

      map.on('click', (e) => {
        if (!map.pm || !map.pm.globalDrawModeEnabled()) {
          const { lat: newLat, lng: newLng } = e.latlng;
          marker.setLatLng([newLat, newLng]);
          updateLocation(newLat, newLng);
        }
        setShowSuggestions(false);
      });
    }

    // Configure Geoman Controls
    if (!readOnly && map.pm) {
      map.pm.addControls({
        position: 'topleft',
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawCircle: false,
        drawText: false,
        drawPolygon: true,
        editMode: true,
        dragMode: true,
        cutPolygon: false,
        removalMode: true
      });

      map.pm.setGlobalOptions({
        pathOptions: {
          color: '#00d9ff',
          fillColor: '#22e58a',
          fillOpacity: 0.35,
          weight: 3
        }
      });

      map.on('pm:create', (e) => {
        const layer = e.layer;
        if (activePolygonLayerRef.current && activePolygonLayerRef.current !== layer) {
          map.removeLayer(activePolygonLayerRef.current);
        }

        activePolygonLayerRef.current = layer;
        const geojson = layer.toGeoJSON();
        handlePolygonUpdated(geojson);

        layer.on('pm:edit', () => handlePolygonUpdated(layer.toGeoJSON()));
        layer.on('pm:dragend', () => handlePolygonUpdated(layer.toGeoJSON()));
      });

      map.on('pm:remove', () => {
        activePolygonLayerRef.current = null;
        handlePolygonUpdated(null);
      });

      map.on('pm:drawstart', () => setIsDrawing(true));
      map.on('pm:drawend', () => setIsDrawing(false));
    }

    // Render initial boundary if provided
    if (initialBoundary && isValidPolygon(initialBoundary)) {
      renderGeoJSONBoundary(initialBoundary, map);
    }

    // Click outside handler for search dropdown
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Synchronize when initialLat or initialLng prop updates
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (initialLat && initialLng && (initialLat !== lat || initialLng !== lng)) {
      setLat(initialLat);
      setLng(initialLng);
      mapInstanceRef.current.setView([initialLat, initialLng], 16);
      if (centerMarkerRef.current) {
        centerMarkerRef.current.setLatLng([initialLat, initialLng]);
        centerMarkerRef.current.getPopup()?.setContent(`<b>Farm Location Center</b><br>Lat: ${initialLat.toFixed(5)}<br>Lng: ${initialLng.toFixed(5)}`);
      }
    }
  }, [initialLat, initialLng]);

  // Real-time Autocomplete Debounced Search for Villages & Sub-locations
  useEffect(() => {
    const term = searchQuery.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError('');

      try {
        let response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term + ', Maharashtra, India')}&countrycodes=in&limit=8&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'AgriTwinNexus/1.0 (agritwin.precision.farming@gmail.com)'
            }
          }
        );
        let data = await response.json();

        if (!data || data.length === 0) {
          response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(term)}&countrycodes=in&limit=8&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'AgriTwinNexus/1.0 (agritwin.precision.farming@gmail.com)'
              }
            }
          );
          data = await response.json();
        }

        if (data && data.length > 0) {
          const parsed = data.map((item) => {
            const addr = item.address || {};
            const villageName = item.name || addr.village || addr.town || addr.city_district || addr.suburb || item.display_name.split(',')[0];
            
            const subDetailsParts = [
              addr.village || addr.town || addr.city_district || addr.suburb,
              addr.county || addr.subdistrict,
              addr.state_district || addr.district,
              addr.state
            ].filter(Boolean);

            const subDetails = Array.from(new Set(subDetailsParts)).slice(0, 3).join(', ');

            return {
              id: item.place_id,
              name: villageName,
              details: subDetails || item.display_name,
              type: item.type || item.addresstype || 'village',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            };
          });

          setSuggestions(parsed);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.warn('Geocoding autocomplete failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update center location helper
  const updateLocation = (newLat, newLng) => {
    const fixedLat = parseFloat(newLat.toFixed(6));
    const fixedLng = parseFloat(newLng.toFixed(6));
    setLat(fixedLat);
    setLng(fixedLng);

    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([fixedLat, fixedLng]);
      if (centerMarkerRef.current.getPopup()) {
        centerMarkerRef.current.getPopup().setContent(`<b>Farm Location Center</b><br>Lat: ${fixedLat}<br>Lng: ${fixedLng}`);
      }
    }

    if (onLocationChange) {
      onLocationChange(fixedLat, fixedLng);
    }
  };

  // Detect Farmer's exact real-time GPS Location
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGPS(true);
    setSearchError('');
    setSearchSuccess('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpsLat = position.coords.latitude;
        const gpsLng = position.coords.longitude;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([gpsLat, gpsLng], 17, { animate: true });
          updateLocation(gpsLat, gpsLng);
          if (centerMarkerRef.current) {
            centerMarkerRef.current.bindPopup(
              `<b>📍 Your Current Farm GPS Position</b><br>Lat: ${gpsLat.toFixed(5)}<br>Lng: ${gpsLng.toFixed(5)}`
            ).openPopup();
          }
          setSearchSuccess(`GPS Located! Zoomed in on your exact plot. Tap top-left polygon tool to trace field boundary.`);
        }
        setIsLocatingGPS(false);
      },
      (err) => {
        setSearchError('Unable to detect GPS position. Please allow location access or search your village name.');
        setIsLocatingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Process polygon changes
  const handlePolygonUpdated = (geojson) => {
    setBoundaryGeoJSON(geojson);
    if (geojson) {
      const stats = calculatePolygonArea(geojson);
      setAreaStats(stats);
    } else {
      setAreaStats({ hectares: 0, acres: 0, sqMeters: 0 });
    }

    if (onBoundaryChange) {
      onBoundaryChange(geojson);
    }
  };

  // Render passed GeoJSON boundary on map
  const renderGeoJSONBoundary = (geojson, map = mapInstanceRef.current) => {
    if (!map || !geojson) return;

    if (activePolygonLayerRef.current) {
      map.removeLayer(activePolygonLayerRef.current);
    }

    const geoJsonLayer = L.geoJSON(geojson, {
      style: {
        color: '#00d9ff',
        fillColor: '#22e58a',
        fillOpacity: 0.35,
        weight: 2.5
      }
    }).addTo(map);

    activePolygonLayerRef.current = geoJsonLayer;

    if (!readOnly && map.pm) {
      geoJsonLayer.eachLayer((layer) => {
        layer.pm.enable({ allowSelfIntersection: false });
        layer.on('pm:edit', () => handlePolygonUpdated(layer.toGeoJSON()));
        layer.on('pm:dragend', () => handlePolygonUpdated(layer.toGeoJSON()));
      });
    }

    try {
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    } catch (e) {
      console.warn('Could not fit map to polygon bounds:', e);
    }

    handlePolygonUpdated(geojson);
  };

  // Select location item from autocomplete dropdown
  const handleSelectSuggestion = (item) => {
    setSearchQuery(`${item.name} (${item.details})`);
    setShowSuggestions(false);
    setSearchError('');

    if (mapInstanceRef.current) {
      // Zoom to level 17 (field/plot level zoom)
      mapInstanceRef.current.setView([item.lat, item.lng], 17, { animate: true });
      updateLocation(item.lat, item.lng);
      if (centerMarkerRef.current) {
        centerMarkerRef.current.bindPopup(
          `<b>${item.name}</b><br><small style="color: #64748b;">${item.details}</small><br>Lat: ${item.lat.toFixed(5)}<br>Lng: ${item.lng.toFixed(5)}`
        ).openPopup();
      }
      setSearchSuccess(`Satellite View Active for ${item.name}! Zoom in on your green plot & click top-left polygon tool to draw boundary.`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  // Clear polygon boundary
  const handleClearPolygon = () => {
    if (activePolygonLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(activePolygonLayerRef.current);
      activePolygonLayerRef.current = null;
      handlePolygonUpdated(null);
    }
  };

  return (
    <div style={styles.container}>
      {/* Step-by-Step Farmer Guidance Banner */}
      {!readOnly && (
        <div style={styles.guidanceBanner}>
          <div style={styles.guidanceStep}>
            <span style={styles.stepNum}>1</span>
            <span>Search Village or tap <b>Detect GPS</b></span>
          </div>
          <div style={styles.guidanceArrow}>➔</div>
          <div style={styles.guidanceStep}>
            <span style={styles.stepNum}>2</span>
            <span>Zoom in on <b>Satellite View</b> to spot your field</span>
          </div>
          <div style={styles.guidanceArrow}>➔</div>
          <div style={styles.guidanceStep}>
            <span style={styles.stepNum}>3</span>
            <span>Click <b>Polygon Tool (Top-Left)</b> & tap corners</span>
          </div>
        </div>
      )}

      {/* Map Control Header Bar & Live Autocomplete Search */}
      {!readOnly && (
        <div style={styles.topControlBar}>
          <div ref={searchContainerRef} style={{ position: 'relative', flex: 1 }}>
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <div style={styles.searchWrapper}>
                <Search size={16} color="#6b7280" style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search village (e.g. Padhegaon, Dabhadi, Kasli, Badnapur)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  style={styles.searchInput}
                />
                {isSearching && (
                  <div style={styles.inlineSpinner} />
                )}
              </div>
              <button type="submit" className="cyber-gradient-btn" disabled={isSearching} style={styles.searchBtn}>
                <Navigation size={14} />
                <span>Locate</span>
              </button>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isLocatingGPS}
                style={styles.gpsBtn}
                title="Detect my exact GPS position"
              >
                <Locate size={15} color="#00d9ff" />
                <span>{isLocatingGPS ? 'GPS...' : t('map_detect_gps')}</span>
              </button>
            </form>

            {/* LIVE AUTOCOMPLETE SUGGESTIONS DROPDOWN */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={styles.suggestionsDropdown} className="animate-fade-in">
                <div style={styles.dropdownHeader}>
                  <Building2 size={14} color="#00d9ff" />
                  <span>VILLAGE & SUB-LOCATION RESULTS ({suggestions.length})</span>
                </div>
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    style={styles.suggestionItem}
                  >
                    <div style={styles.suggestionIconWrapper}>
                      <MapPin size={16} color="#22e58a" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                      <span style={styles.suggestionName}>
                        {item.name}
                        <span style={styles.suggestionTypeTag}>{item.type.toUpperCase()}</span>
                      </span>
                      <span style={styles.suggestionDetails}>
                        {item.details}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Clear Action */}
          {boundaryGeoJSON && (
            <button type="button" onClick={handleClearPolygon} style={styles.clearBtn}>
              <Trash2 size={16} color="#f87171" />
              <span>{t('map_clear_poly')}</span>
            </button>
          )}
        </div>
      )}

      {searchError && (
        <div style={styles.searchErrorBox}>
          <AlertCircle size={16} />
          <span>{searchError}</span>
        </div>
      )}

      {searchSuccess && (
        <div style={styles.searchSuccessBox}>
          <CheckCircle2 size={16} />
          <span>{searchSuccess}</span>
        </div>
      )}

      {/* Interactive Leaflet Canvas */}
      <div style={styles.mapCanvasWrapper}>
        {/* Floating Tile Layer Switcher Control Bar */}
        <div style={styles.tileModeSwitcher}>
          <span style={styles.tileModeLabel}>
            <Eye size={13} color="#00d9ff" />
            {t('map_view')}
          </span>
          <button
            type="button"
            onClick={() => applyTileLayer('hybrid')}
            style={{
              ...styles.tileBtn,
              ...(tileMode === 'hybrid' ? styles.tileBtnActive : {})
            }}
          >
            🛰️ {t('map_hybrid')}
          </button>
          <button
            type="button"
            onClick={() => applyTileLayer('satellite')}
            style={{
              ...styles.tileBtn,
              ...(tileMode === 'satellite' ? styles.tileBtnActive : {})
            }}
          >
            🌍 {t('map_satellite')}
          </button>
          <button
            type="button"
            onClick={() => applyTileLayer('street')}
            style={{
              ...styles.tileBtn,
              ...(tileMode === 'street' ? styles.tileBtnActive : {})
            }}
          >
            🗺️ {t('map_street')}
          </button>
        </div>

        <div ref={mapContainerRef} style={{ width: '100%', height: '440px' }} />

        {/* Guidance Overlay */}
        {!readOnly && !boundaryGeoJSON && (
          <div style={styles.instructionOverlay}>
            <Edit3 size={16} color="#22e58a" />
            <span>{t('draw_instructions')}</span>
          </div>
        )}
      </div>

      {/* Spatial Metadata & Area Info Panel */}
      <div style={styles.metadataPanel}>
        <div style={styles.coordGroup}>
          <div style={styles.coordItem}>
            <MapPin size={16} color="#22e58a" />
            <div>
              <span style={styles.metaLabel}>{t('common_lat')}</span>
              <span style={styles.metaVal}>{lat.toFixed(6)}° N</span>
            </div>
          </div>
          <div style={styles.coordItem}>
            <Compass size={16} color="#00d9ff" />
            <div>
              <span style={styles.metaLabel}>{t('common_lng')}</span>
              <span style={styles.metaVal}>{lng.toFixed(6)}° E</span>
            </div>
          </div>
        </div>

        {/* Boundary Selection Status & Area Calculation */}
        <div style={styles.boundaryStatusGroup}>
          {boundaryGeoJSON ? (
            <div style={styles.statusSuccessBadge}>
              <CheckCircle2 size={18} color="#22e58a" />
              <div>
                <span style={{ fontWeight: '700', color: '#22e58a', fontSize: '0.875rem' }}>
                  {t('farms_boundary_geojson')}
                </span>
                <div style={styles.areaRow}>
                  <span>{t('farms_area')}: <b style={{ color: '#ffffff' }}>{areaStats.hectares} {t('common_hectares')}</b> ({areaStats.acres} {t('common_acres')})</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.statusWarningBadge}>
              <AlertCircle size={18} color="#fbbf24" />
              <span style={{ fontWeight: '600', color: '#fbbf24', fontSize: '0.85rem' }}>
                {t('farms_boundary_marker')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
    width: '100%'
  },
  guidanceBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.625rem 1rem',
    background: 'rgba(11, 21, 17, 0.9)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    borderRadius: '14px',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  guidanceStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#cbd5e1',
    fontSize: '0.775rem',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  stepNum: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(34, 229, 138, 0.2)',
    border: '1px solid #22e58a',
    color: '#22e58a',
    fontSize: '0.7rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  guidanceArrow: {
    color: '#64748b',
    fontSize: '0.8rem'
  },
  topControlBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%'
  },
  searchWrapper: {
    position: 'relative',
    flex: 1
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.6rem',
    background: 'rgba(9, 18, 14, 0.95)',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    borderRadius: '14px',
    color: '#f8fafc',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
  },
  inlineSpinner: {
    position: 'absolute',
    right: '14px',
    top: '32%',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(34, 229, 138, 0.2)',
    borderTop: '2px solid #22e58a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  searchBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.75rem 1.15rem',
    borderRadius: '14px',
    whiteSpace: 'nowrap',
    fontSize: '0.825rem'
  },
  gpsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.75rem 1rem',
    borderRadius: '14px',
    background: 'rgba(0, 217, 255, 0.12)',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    color: '#00d9ff',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    right: 0,
    backgroundColor: '#0b1612',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    borderRadius: '16px',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    maxHeight: '320px',
    overflowY: 'auto',
    padding: '0.5rem 0'
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '0.675rem',
    fontWeight: '800',
    color: '#00d9ff',
    letterSpacing: '0.06em',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
  },
  suggestionIconWrapper: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  suggestionName: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Space Grotesk, sans-serif',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  suggestionTypeTag: {
    fontSize: '0.625rem',
    fontWeight: '800',
    background: 'rgba(0, 217, 255, 0.14)',
    color: '#00d9ff',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    padding: '1px 6px',
    borderRadius: '9999px',
    fontFamily: 'JetBrains Mono, monospace'
  },
  suggestionDetails: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  clearBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.55rem 0.95rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    borderRadius: '12px',
    color: '#f87171',
    cursor: 'pointer'
  },
  searchErrorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 0.875rem',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#f87171',
    borderRadius: '12px',
    fontSize: '0.8125rem'
  },
  searchSuccessBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 0.875rem',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    color: '#22e58a',
    borderRadius: '12px',
    fontSize: '0.8125rem',
    fontWeight: '600'
  },
  mapCanvasWrapper: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(34, 229, 138, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  },
  tileModeSwitcher: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'rgba(11, 21, 17, 0.92)',
    backdropFilter: 'blur(16px)',
    padding: '0.35rem 0.6rem',
    borderRadius: '12px',
    border: '1px solid rgba(34, 229, 138, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
  },
  tileModeLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#94a3b8',
    fontFamily: 'Space Grotesk, sans-serif',
    marginRight: '2px'
  },
  tileBtn: {
    padding: '0.3rem 0.6rem',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid transparent',
    color: '#94a3b8',
    fontSize: '0.725rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Space Grotesk, sans-serif',
    transition: 'all 0.15s ease'
  },
  tileBtnActive: {
    background: 'rgba(34, 229, 138, 0.18)',
    border: '1px solid #22e58a',
    color: '#22e58a',
    fontWeight: '700'
  },
  instructionOverlay: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(11, 21, 17, 0.9)',
    backdropFilter: 'blur(16px)',
    padding: '0.5rem 1.25rem',
    borderRadius: '9999px',
    border: '1px solid #22e58a',
    boxShadow: '0 0 16px rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#22e58a',
    zIndex: 10,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  metadataPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    backgroundColor: 'rgba(15, 27, 21, 0.72)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(34, 229, 138, 0.18)',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  coordGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  coordItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem'
  },
  metaLabel: {
    display: 'block',
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#94a3b8',
    fontWeight: '700',
    fontFamily: 'Space Grotesk, sans-serif'
  },
  metaVal: {
    display: 'block',
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'JetBrains Mono, monospace'
  },
  boundaryStatusGroup: {
    marginLeft: 'auto'
  },
  statusSuccessBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(34, 229, 138, 0.12)',
    border: '1px solid rgba(34, 229, 138, 0.35)',
    borderRadius: '12px'
  },
  statusWarningBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    borderRadius: '12px'
  },
  areaRow: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '2px',
    fontFamily: 'JetBrains Mono, monospace'
  }
};
