import * as turf from '@turf/turf';

/**
 * Calculates the approximate area of a GeoJSON polygon in Hectares and Acres.
 * @param {Object} geojsonPolygon - GeoJSON Polygon or Feature
 * @returns {Object} { hectares: number, acres: number, sqMeters: number }
 */
export const calculatePolygonArea = (geojsonPolygon) => {
  if (!geojsonPolygon) return { hectares: 0, acres: 0, sqMeters: 0 };
  
  try {
    let feature = geojsonPolygon;
    if (geojsonPolygon.type !== 'Feature') {
      feature = turf.feature(geojsonPolygon);
    }
    
    // Area in square meters
    const sqMeters = turf.area(feature);
    const hectares = sqMeters / 10000;
    const acres = sqMeters / 4046.8564224;

    return {
      sqMeters: Math.round(sqMeters * 100) / 100,
      hectares: Math.round(hectares * 100) / 100,
      acres: Math.round(acres * 100) / 100
    };
  } catch (error) {
    console.error('Error calculating polygon area:', error);
    return { hectares: 0, acres: 0, sqMeters: 0 };
  }
};

/**
 * Computes the center (centroid) latitude and longitude of a GeoJSON polygon.
 * @param {Object} geojsonPolygon 
 * @returns {Array|null} [lat, lng] or null
 */
export const getPolygonCenter = (geojsonPolygon) => {
  if (!geojsonPolygon) return null;
  try {
    let feature = geojsonPolygon;
    if (geojsonPolygon.type !== 'Feature') {
      feature = turf.feature(geojsonPolygon);
    }
    const centerFeature = turf.centroid(feature);
    const [lng, lat] = centerFeature.geometry.coordinates;
    return [lat, lng];
  } catch (error) {
    console.error('Error getting polygon center:', error);
    return null;
  }
};

/**
 * Validates whether a GeoJSON object is a valid Polygon structure.
 * @param {Object} geojson 
 * @returns {boolean}
 */
export const isValidPolygon = (geojson) => {
  if (!geojson) return false;
  const geomType = geojson.type === 'Feature' ? geojson.geometry?.type : geojson.type;
  if (geomType !== 'Polygon') return false;
  
  const coords = geojson.type === 'Feature' ? geojson.geometry?.coordinates : geojson.coordinates;
  return Array.isArray(coords) && coords.length > 0 && Array.isArray(coords[0]) && coords[0].length >= 4;
};
