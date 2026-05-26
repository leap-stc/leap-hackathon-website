# LEAP Hackathon 2026 — Website

**Climate Resilience Through Collaborative Data Science**

A static website showcasing the 15 projects produced during the LEAP Hackathon in January 2026, featuring an interactive Mapbox map with climate data overlays across 5 NYC neighborhoods.

---

## Quick Start

This is a static site — no build step required.

```bash
# Clone the repo
git clone https://github.com/YOUR-ORG/leap-hackathon-2026.git
cd leap-hackathon-2026

# Serve locally (Python 3)
python3 -m http.server 8080

# Or with Node
npx serve .
```

Then open `http://localhost:8080`.

---

## Mapbox Token

The map requires a free Mapbox token.

1. Sign up at [mapbox.com](https://www.mapbox.com) (free tier is sufficient)
2. Copy your public token
3. Open `data/content.js` and replace the value of `SITE_CONFIG.mapboxToken`

```js
mapboxToken: 'pk.eyJ1IjoiWU9VUi1VU0VSTkFNRSIsImEiOiJ...'}
```

---

## Deploying to GitHub Pages

### Option A: GitHub Actions (recommended)

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** → select **GitHub Actions**
3. Push to `main` — the site deploys automatically via `.github/workflows/deploy.yml`

### Option B: Manual

1. Go to **Settings → Pages → Source**
2. Select `main` branch, root `/`
3. Click Save

---

## Adding Real Data Layers

The map currently shows **demo overlay polygons** for the four climate layers. To swap in real data:

### Cloudburst / Stormwater
- Source: https://data.cityofnewyork.us/Environment/NYC-Stormwater-Flood-Maps/9i7c-xyvv
- Download the shapefile, convert to GeoJSON or vector tiles (see below)
- Update `js/main.js`: set `tileUrl` for the `cloudburst` layer and remove the `DEMO_OVERLAYS` source

### Heat (Surface Temperature)
- Source: https://github.com/NewYorkCityCouncil/heat_map
- There is a `.tiff` in the repo — process with `gdal2tiles.py` to get raster tiles:
  ```bash
  gdal2tiles.py --zoom=10-14 heat_map.tiff tiles/heat/
  ```
- Or use [titiler](https://github.com/developmentseed/titiler) to serve the COG directly
- Update the layer to type `raster` in Mapbox GL JS

### Coastal Surge 2050s / 2080s
- Source: https://data.cityofnewyork.us/Environment/Sea-Level-Rise-Maps-2050s-100-year-Floodplain-/hbw8-2bah
- Download shapefile, convert:
  ```bash
  ogr2ogr -f GeoJSON surge_2050.geojson sea_level_rise_2050s.shp
  tippecanoe -o surge_2050.mbtiles surge_2050.geojson
  ```
- Host tiles on Mapbox Studio, Maptiler, or a self-hosted tile server

### General Tile Pipeline
```bash
# Install tippecanoe (for vector tiles)
brew install tippecanoe

# Convert shapefile → GeoJSON
ogr2ogr -f GeoJSON output.geojson input.shp -t_srs EPSG:4326

# Convert GeoJSON → vector tiles
tippecanoe -o output.mbtiles -z14 -Z9 output.geojson

# Upload to Mapbox Studio or serve with tileserver-gl
```

---

## Updating Content

All content (neighborhoods, projects, site config) lives in `data/content.js`.

### Adding a project
```js
{
  id: "unique-id",
  neighborhoodId: "south-bronx",  // must match a neighborhood id
  title: "Project Title",
  team: "Team Name",
  description: "One or two sentence description.",
  isWinner: false,
  tags: ["heat", "equity"],
  demoAvailable: false
}
```

### Adding a winner
Set `isWinner: true` and `winnerRank: 1` (1–4), and optionally add `evalQuote`.

### Updating neighborhood descriptions
Edit the `description` and `pullQuote` fields in the `NEIGHBORHOODS` array.

---

## Neighborhood GeoJSON

The file `data/neighborhoods.geojson` contains approximate bounding polygons for the five neighborhoods. Replace these with precise neighborhood boundaries from:
- NYC PUMA boundaries: https://data.cityofnewyork.us/City-Government/2020-Census-Tracts-Tabulation-Areas-PUMAs-/qmjd-a9dy
- Neighborhood tabulation areas: https://data.cityofnewyork.us/City-Government/Neighborhood-Tabulation-Areas-NTA-/cpf4-rkhq

---

## Hosting Project Demos

For teams that want to show live demos:

| Option | Best for | Notes |
|--------|----------|-------|
| **JupyterHub** (2i2c) | Notebooks | Re-grant access to winning groups; embed via iframe |
| **Voilà** | Notebook → app | Converts notebooks to standalone web apps |
| **Streamlit Cloud** | Python dashboards | Free hosting, easy deploy from GitHub |
| **Hugging Face Spaces** | ML/data apps | Free, supports Gradio/Streamlit |
| **Screen recordings** | Any project | Host on YouTube/Vimeo, embed in site |

To embed a demo, add a `demoUrl` field to the project in `content.js` and update the project card template in `js/main.js`.

---

## File Structure

```
leap-hackathon-2026/
├── index.html              # Main page
├── css/
│   └── style.css           # All styles
├── js/
│   └── main.js             # Map + UI logic
├── data/
│   ├── content.js          # All neighborhoods + projects content
│   └── neighborhoods.geojson  # Map polygon data
├── images/                 # Project thumbnails (add your own)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions → GitHub Pages
└── README.md
```

---

## Design System

- **Display font:** DM Serif Display
- **UI font:** DM Sans
- **Monospace:** IBM Plex Mono
- **Primary palette:** Warm paper tones (`#F5F2EC`, `#EDE8DF`) with ink dark (`#0F1117`)
- **Neighborhood colors:** Each neighborhood has a unique accent color used consistently across map, panel, and cards

---

## TODO (Next Steps)

- [ ] Add real Mapbox token
- [ ] Replace neighborhood GeoJSON with precise boundaries
- [ ] Process and host real data tiles (cloudburst, heat, surge)
- [ ] Add project thumbnails to `/images/` and reference in `content.js`
- [ ] Finalize real team names, descriptions, and pull quotes
- [ ] Set up demo hosting for 4 winning projects
- [ ] Add participant survey/evaluation quotes
- [ ] Add video captures if live demos aren't feasible
- [ ] Review graphic design conventions (mock-up milestone)
- [ ] Connect Urban Omnibus branding/partner pages
