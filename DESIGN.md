# AgriTwin Nexus — Design System & Implementation Specification
> **Generated via Google Stitch MCP**  
> **Creative North Star: The Cyber-Agronomic Command Center**  
> **Theme:** Dark-First Cybernetic Telemetry / High-Tech Agricultural Digital Twin

---

## 1. Creative North Star & Aesthetic Philosophy

AgriTwin Nexus merges satellite Earth Observation (Sentinel-2 via Google Earth Engine), hyper-local meteorological telemetry, sub-plot micro-climate soil physics, and deep neural digital twins into an authoritative aerospace/precision-agronomy command platform.

The visual identity decisively rejects dated agricultural templates, earthy mud-brown palettes, and generic SaaS admin kits. Instead, it presents an **AI Agriculture Command Deck**:
- **Deep Obsidian Voids:** Creating high-contrast spatial depth where telemetry data floats organically.
- **Bio-Luminescent Signals:** Neon emerald (`#22E58A`) for optimal vegetation health and primary system activity.
- **Cybernetic Cyan Streams:** Cyan (`#00D9FF`) for satellite links, multispectral bands, and live sensor networks.
- **Electric Lime Accents:** Lime (`#7CFF6B`) for active vegetative biomass trends and growth acceleration.
- **Infrared & Solar Indicators:** Solar Amber (`#FFB020`) for moisture/pathogen stress and Infrared Red (`#FF3B56`) for critical crop disease risks.
- **Ghost Borders & Holographic Glass:** Translucent frosted glass containers with thin neon boundaries and subtle backdrop diffusion.

---

## 2. Color Palette & Token System

### 2.1 Surfaces & Layers
| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--color-bg` | `#07110D` | Main cosmic obsidian canvas |
| `--color-surface` | `#0B1511` | Persistent sidebar, command topbar, dark modal backdrops |
| `--color-card` | `rgba(15, 28, 22, 0.78)` | Glassmorphic HUD cards with backdrop blur |
| `--color-card-elevated` | `rgba(21, 39, 31, 0.85)` | Hovered states, active sub-plot inspection panels, dropdowns |
| `--color-surface-hover` | `rgba(34, 229, 138, 0.08)` | Table row hovers, menu item hovers |
| `--color-border` | `rgba(34, 229, 138, 0.14)` | Ghost borders for cards and dividers |
| `--color-border-glow` | `rgba(34, 229, 138, 0.38)` | Active card boundaries, focused inputs, selected nodes |

### 2.2 Brand & Telemetry Colors
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--color-primary` | `#22E58A` | Bio-luminescent emerald: primary brand, high vigor, healthy states |
| `--color-primary-glow` | `rgba(34, 229, 138, 0.25)` | Outer glow for buttons, badges, and chart nodes |
| `--color-secondary` | `#00D9FF` | Electric cyan: satellite orbits, moisture sensors, GEE queries |
| `--color-accent` | `#7CFF6B` | Electric lime: biomass growth curves, yield increments, optimal spray |
| `--color-warning` | `#FFB020` | Solar amber: moderate stress, elevated humidity, caution alerts |
| `--color-danger` | `#FF3B56` | Infrared neon red: high fungal/pathogen risk, water deficit anomalies |
| `--color-purple` | `#A855F7` | Deep multispectral infrared / vegetation red-edge (NDRE) |

### 2.3 Typography & Readout Text
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--color-text-main` | `#F5FFF9` | Crisp frost white for high-priority numbers, headers, and values |
| `--color-text-secondary` | `#8CA698` | Muted atmospheric mint-slate for labels, subtitles, metadata |
| `--color-text-muted` | `#587364` | Disabled states, table header labels, timestamps |

---

## 3. Elevation, Depth & Glassmorphism Rules

1. **The Ghost Border Rule:**
   - Standard 1px solid harsh white/gray borders are prohibited.
   - All panels utilize translucent ghost borders (`1px solid rgba(34, 229, 138, 0.14)`).
   - Card headers incorporate a luminous top gradient shine:
     `linear-gradient(180deg, rgba(34, 229, 138, 0.05) 0%, rgba(15, 28, 22, 0) 100%)`.

2. **Glassmorphism Blur:**
   - Cards and floating overlays must apply `backdrop-filter: blur(16px)` and `-webkit-backdrop-filter: blur(16px)`.

3. **Ambient Holographic Glows:**
   - Use subtle colored drop shadows to imply active sensor feeds:
     `box-shadow: 0 0 20px rgba(34, 229, 138, 0.15)`.

---

## 4. Typography Scale

- **Headlines & Technical Metrics:** `'Space Grotesk', 'Outfit', sans-serif`
  - High-impact data values, KPI numerals, and section titles.
  - Tracking: `-0.02em` for dense technical precision.
- **Body & Data Feed:** `'Inter', 'Plus Jakarta Sans', sans-serif`
  - High legibility across sensor tables and agronomic advisory text.
- **Monospace Telemetry:** `'JetBrains Mono', 'Courier New', monospace`
  - Coordinates (Lat/Lng), GeoJSON vertex coordinates, satellite band identifiers (B2, B4, B8, B5).

---

## 5. Component DNA & Patterns

### 5.1 Command Sidebar
- Fixed 260px wide bar in `#0B1511` with a right border in `--color-border`.
- **Brand Lockup:** Hexagonal/seed icon glowing in emerald `#22E58A`, with `AgriTwin Nexus` typography and `Certified Modules 1–10+` enterprise badge.
- **Navigation Links:** Frosted glass links with hover highlights. Active state features a glowing left border pill and subtle emerald background glow.
- **Badges:** Pill badges (`Live Grid`, `GEE`, `Risk Model`, `PDF`) with subtle glowing text.

### 5.2 Topbar Command Header
- Sticky header with backdrop blur, breadcrumbs, live telemetry sync pill (`Live Telemetry Stream: 120 pkt/s`), interactive Notification Center with live unread badge, and user session badge with quick logout.

### 5.3 Holographic KPI Cards
- 4-column responsive grid featuring icon enclosures with radial background glows, large high-contrast numbers, and micro trend badges (+4.2% vs previous orbit).

### 5.4 Digital Twin 5×5 Matrix Canvas
- Interactive spatial sub-plot grid (A1 to E5).
- Multi-layer spectrum switchers (`Canopy Vigor`, `Soil Moisture`, `Chlorophyll`, `Water Stress`).
- Sub-plot inspection detail card showing real-time nitrogen status, canopy vigor, soil moisture, and 1-click micro-action triggers.

### 5.5 Leaflet Map Styling
- Dark-first map container with customized attribution and controls.
- GeoJSON boundary lines styled in glowing cyan `#00D9FF` and emerald `#22E58A` fill with 0.35 opacity.
- Geoman drawing toolbar styled with obsidian buttons and neon active icons.

### 5.6 Form Controls & Inputs
- Dark obsidian inputs (`#07110D`) with ghost borders.
- Focused state transitions to `1px solid #22E58A` with a soft 3px emerald glow ring (`box-shadow: 0 0 0 3px rgba(34, 229, 138, 0.18)`).

### 5.7 Action Buttons
- **Primary:** `linear-gradient(135deg, #19C37D 0%, #00D9FF 100%)` with dark text `#07110D` or crisp white `#ffffff`, accompanied by subtle neon glow.
- **Secondary:** Frosted glass `#0F1C16` with ghost border `rgba(34, 229, 138, 0.25)` and crisp text.
- **Danger:** Infrared crimson `rgba(255, 59, 86, 0.15)` with `#FF3B56` text and border.

---

## 6. Implementation Checklist

- [x] Design System established in Stitch MCP (`AgriTwin Nexus Cyber-Command Design System`).
- [x] High-fidelity Desktop Screen generated in Stitch (`c8656320219d43f7b32584ee3a071a5a`).
- [x] Create DESIGN.md in project root.
- [ ] Implement dark-first tokens and utility styles in `frontend/src/index.css`.
- [ ] Upgrade `Sidebar.jsx`, `Topbar.jsx`, and `DashboardLayout.jsx` with command center aesthetic.
- [ ] Upgrade `DashboardPage.jsx` into the Cybernetic KPI & Telemetry Command Center.
- [ ] Upgrade `DigitalTwinPage.jsx` and `DigitalTwinCanvas.jsx` with glowing telemetry cells and inspection drawer.
- [ ] Enhance `FarmMap.jsx` with cybernetic dark map styling and neon polygon coordinates.
- [ ] Polish analytical pages (`SatellitePage.jsx`, `WeatherPage.jsx`, `PestRiskPage.jsx`, `YieldPage.jsx`, `RecommendationsPage.jsx`, `ReportsPage.jsx`, `SettingsPage.jsx`).
- [ ] Upgrade `LoginPage.jsx` and `RegisterPage.jsx` into high-security AI platform gateways.
- [ ] Verify build with `npm run build` and test in the browser.
