import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { calculatePolygonArea, isValidPolygon } from '../utils/geoUtils';
import { Search, MapPin, Trash2, CheckCircle2, AlertCircle, Edit3, Compass } from 'lucide-react';

// Fix for default Leaflet icon paths in Vite / React build
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

export default function FarmMap({
  initialLat = 18.5204, // Default to Pune, India coordinates
  initialLng = 73.8567,
  initialBoundary = null, // GeoJSON Polygon feature
  readOnly = false,
  onLocationChange,
  onBoundaryChange
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const centerMarkerRef = useRef(null);
  const activePolygonLayerRef = useRef(null);

  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(initialBoundary);
  const [areaStats, setAreaStats] = useState({ hectares: 0, acres: 0, sqMeters: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: true
    });

    // Satellite / OpenStreetMap Tile Layer
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tileLayer.addTo(map);

    mapInstanceRef.current = map;

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
        // Only update marker if not currently drawing a polygon
        if (!map.pm || !map.pm.globalDrawModeEnabled()) {
          const { lat: newLat, lng: newLng } = e.latlng;
          marker.setLatLng([newLat, newLng]);
          updateLocation(newLat, newLng);
        }
      });
    }

    // Configure Geoman Drawing Controls if not readOnly
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
          color: '#0F766E', // Teal geospatial boundary
          fillColor: '#22C55E', // Leaf Green fill
          fillOpacity: 0.3,
          weight: 3
        }
      });

      // Handle Polygon Creation
      map.on('pm:create', (e) => {
        const layer = e.layer;
        
        // Remove prior layer if present
        if (activePolygonLayerRef.current && activePolygonLayerRef.current !== layer) {
          map.removeLayer(activePolygonLayerRef.current);
        }

        activePolygonLayerRef.current = layer;
        const geojson = layer.toGeoJSON();
        handlePolygonUpdated(geojson);

        // Attach edit/drag listeners on newly created layer
        layer.on('pm:edit', () => {
          handlePolygonUpdated(layer.toGeoJSON());
        });
        layer.on('pm:dragend', () => {
          handlePolygonUpdated(layer.toGeoJSON());
        });
      });

      // Handle Polygon Removal
      map.on('pm:remove', () => {
        activePolygonLayerRef.current = null;
        handlePolygonUpdated(null);
      });

      map.on('pm:drawstart', () => setIsDrawing(true));
      map.on('pm:drawend', () => setIsDrawing(false));
    }

    // Load initial boundary if passed
    if (initialBoundary && isValidPolygon(initialBoundary)) {
      renderGeoJSONBoundary(initialBoundary, map);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center location helper
  const updateLocation = (newLat, newLng) => {
    const fixedLat = parseFloat(newLat.toFixed(6));
    const fixedLng = parseFloat(newLng.toFixed(6));
    setLat(fixedLat);
    setLng(fixedLng);

    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([fixedLat, fixedLng]);
      centerMarkerRef.current.getPopup().setContent(`<b>Farm Location Center</b><br>Lat: ${fixedLat}<br>Lng: ${fixedLng}`);
    }

    if (onLocationChange) {
      onLocationChange(fixedLat, fixedLng);
    }
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

    // Enable editing on restored GeoJSON if not readOnly
    if (!readOnly && map.pm) {
      geoJsonLayer.eachLayer((layer) => {
        layer.pm.enable({
          allowSelfIntersection: false
        });
        layer.on('pm:edit', () => {
          handlePolygonUpdated(layer.toGeoJSON());
        });
        layer.on('pm:dragend', () => {
          handlePolygonUpdated(layer.toGeoJSON());
        });
      });
    }

    // Fit map bounds to polygon
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

  // OpenStreetMap Nominatim Geocoding Location Search
  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const topResult = data[0];
        const searchLat = parseFloat(topResult.lat);
        const searchLng = parseFloat(topResult.lon);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([searchLat, searchLng], 15);
          updateLocation(searchLat, searchLng);
        }
      } else {
        setSearchError('Location not found. Please try searching with city or district name.');
      }
    } catch (err) {
      setSearchError('Failed to search location. Check internet connection.');
    } finally {
      setIsSearching(false);
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
      {/* Map Control Header Bar */}
      {!readOnly && (
        <div style={styles.topControlBar}>
          {/* Location Search Input */}
          <form onSubmit={handleSearchLocation} style={styles.searchForm}>
            <div style={styles.searchWrapper}>
              <Search size={16} color="#6b7280" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search location (e.g., Pune, Nashik, Punjab)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <button type="submit" className="btn btn-teal" disabled={isSearching} style={styles.searchBtn}>
              {isSearching ? 'Searching...' : 'Locate'}
            </button>
          </form>

          {/* Quick Clear Action */}
          {boundaryGeoJSON && (
            <button type="button" onClick={handleClearPolygon} className="btn btn-secondary" style={styles.clearBtn}>
              <Trash2 size={16} color="var(--color-danger)" />
              <span>Clear Boundary</span>
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

      {/* Interactive Leaflet Canvas */}
      <div style={styles.mapCanvasWrapper}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '420px' }} />
        
        {/* Drawing Guidance Banner overlay */}
        {!readOnly && !boundaryGeoJSON && (
          <div style={styles.instructionOverlay}>
            <Edit3 size={16} color="var(--color-teal)" />
            <span>Click the polygon icon on the top-left map toolbar to draw farm boundary</span>
          </div>
        )}
      </div>

      {/* Spatial Metadata & Area Info Panel */}
      <div style={styles.metadataPanel}>
        <div style={styles.coordGroup}>
          <div style={styles.coordItem}>
            <MapPin size={16} color="var(--color-primary)" />
            <div>
              <span style={styles.metaLabel}>Latitude</span>
              <span style={styles.metaVal}>{lat.toFixed(6)}° N</span>
            </div>
          </div>
          <div style={styles.coordItem}>
            <Compass size={16} color="var(--color-teal)" />
            <div>
              <span style={styles.metaLabel}>Longitude</span>
              <span style={styles.metaVal}>{lng.toFixed(6)}° E</span>
            </div>
          </div>
        </div>

        {/* Boundary Selection Status & Area Calculation */}
        <div style={styles.boundaryStatusGroup}>
          {boundaryGeoJSON ? (
            <div style={styles.statusSuccessBadge}>
              <CheckCircle2 size={18} color="var(--color-primary)" />
              <div>
                <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '0.875rem' }}>
                  Farm Boundary Selected
                </span>
                <div style={styles.areaRow}>
                  <span>Approx Area: <b>{areaStats.hectares} Hectares</b> ({areaStats.acres} Acres)</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.statusWarningBadge}>
              <AlertCircle size={18} color="var(--color-accent)" />
              <span style={{ fontWeight: '600', color: '#b45309', fontSize: '0.85rem' }}>
                No boundary polygon drawn yet
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
  topControlBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1
  },
  searchWrapper: {
    position: 'relative',
    flex: 1
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  },
  searchInput: {
    paddingLeft: '2.25rem',
    fontSize: '0.875rem'
  },
  searchBtn: {
    whiteSpace: 'nowrap'
  },
  clearBtn: {
    padding: '0.5rem 0.875rem',
    fontSize: '0.8125rem'
  },
  searchErrorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 0.875rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.8125rem'
  },
  mapCanvasWrapper: {
    position: 'relative',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-glow)'
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
    border: '1px solid var(--color-primary)',
    boxShadow: '0 0 16px rgba(34, 229, 138, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    zIndex: 10,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  metadataPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    backgroundColor: 'rgba(15, 28, 22, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
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
    color: 'var(--color-text-secondary)',
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
    border: '1px solid var(--color-primary)',
    borderRadius: 'var(--radius-md)'
  },
  statusWarningBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    borderRadius: 'var(--radius-md)'
  },
  areaRow: {
    fontSize: '0.75rem',
    color: 'var(--color-text-main)',
    marginTop: '2px',
    fontFamily: 'JetBrains Mono, monospace'
  }
};
