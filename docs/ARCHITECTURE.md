# AgriTwin Nexus — Technical Architecture & Integration Spec

## 1. Module 6: Farm Module Specifications

The **Farm Module** establishes the digital twin anchor for each field.

### Key Data Entities Preserved for Future Integration:
- `farm_id`: Unique identifier binding satellite observations to a specific field.
- `user_id`: Farmer ownership reference.
- `latitude` / `longitude`: Centroid for localized weather API fetching.
- `boundary_geojson`: GeoJSON Polygon coordinates defining the Region of Interest (ROI) for Sentinel-2 satellite clipping.
- `crop_type`: Agronomic crop context for classification and health thresholding.
- `sowing_date`: Temporal baseline for time-series vegetation index tracking (NDVI curve).

---

## 2. Module 7+ Integration Data Pipeline Flow

```
+------------------+
| Farm Registration|
| (GeoJSON Polygon)|
+--------+---------+
         |
         v
+------------------+     +------------------+
|  Google Earth    | <---| Sentinel-2 L2A   |
|   Engine API     |     | Multispectral    |
+--------+---------+     +------------------+
         |
         v (Clip ROI by GeoJSON)
+------------------+
| Vegetation Band  |
| Extraction (B4,B8|
+--------+---------+
         |
         v
+------------------+
| Vegetation Index |
| Engine           |---> NDVI = (B8 - B4) / (B8 + B4)
| (NDVI/NDRE/SAVI) |---> NDRE = (B8 - B5) / (B8 + B5)
+--------+---------+---> SAVI = ((B8 - B4)/(B8 + B4 + 0.5)) * 1.5
         |
         v
+------------------+
| Crop Health &    |
| Digital Twin     |---> Yield Estimation & Risk Alerts
+------------------+
```
