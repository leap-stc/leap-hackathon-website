/* ============================================================
   LEAP Hackathon 2026 — Main JavaScript
   Map: Mapbox GL JS
   Layers:
     Cloudburst  — data/cloudburst_moderate_current.geojson (local, 5 MB)
     Heat        — unavailable until COG hosted; set HEAT_COG_URL to enable
     PFIRM 2015  — NYC DCP ArcGIS MapServer tiles (tiles.arcgis.com)
     Surge 2050  — NYC DCP ArcGIS MapServer tiles (Future_Floodplain_2050s)
     Surge 2080  — NYC DCP ArcGIS MapServer tiles (Future_Floodplain_2080s)
   ============================================================ */

// ArcGIS tile base for DCP flood layers (GfwWNkhOj9bNBqoJ org)
const DCP_TILES = 'https://tiles.arcgis.com/tiles/GfwWNkhOj9bNBqoJ/arcgis/rest/services';


// ---- Source configs for each data overlay ----
const OVERLAY_SOURCES = {
  cloudburst: {
    kind: 'geojson',
    url: 'data/cloudburst_moderate_current.geojson',
    color: '#5B8DD9',
    opacity: 0.55
  },
  heat: { kind: 'raster', tiles: ['data/tiles/heat/{z}/{x}/{y}.png'],
           tileSize: 256, opacity: 0.7,
           attribution: 'Mean Surface Temp 2020-22 — NYC City Council' },
  pfirm:      { kind: 'raster',
                tiles: [`${DCP_TILES}/2015PFIRMS/MapServer/tile/{z}/{y}/{x}`],
                tileSize: 256, opacity: 0.75,
                attribution: '2015 PFIRM Flood Zones — FEMA / NYC DCP' },
  surge2050:  { kind: 'raster',
                tiles: [`${DCP_TILES}/Future_Floodplain_2050s/MapServer/tile/{z}/{y}/{x}`],
                tileSize: 256, opacity: 0.65,
                attribution: 'Future Floodplain 2050s — NYC DCP' },
  surge2080:  { kind: 'raster',
                tiles: [`${DCP_TILES}/Future_Floodplain_2080s/MapServer/tile/{z}/{y}/{x}`],
                tileSize: 256, opacity: 0.65,
                attribution: 'Future Floodplain 2080s — NYC DCP' }
};

// Neighborhood color map (matches content.js)
const NHOOD_COLORS = {
  'south-bronx': '#C8373A',
  'red-hook': '#1B4F8A',
  'east-new-york': '#1D6B45',
  'flushing': '#6B2D8B',
  'staten-island-north': '#C4611A'
};


// ---- Map initialization ----
let map;
let activeNeighborhood = null;

function initMap() {
  mapboxgl.accessToken = SITE_CONFIG.mapboxToken;

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: SITE_CONFIG.mapCenter,
    zoom: SITE_CONFIG.mapZoom,
    minZoom: 9,
    maxZoom: 16
  });

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
  map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'imperial' }), 'bottom-left');

  map.on('load', () => {
    addNeighborhoodLayer();
    addOverlayLayers();
    setupLayerToggles();
    setupLegend();
  });
}

function addNeighborhoodLayer() {
  // Source: local GeoJSON
  map.addSource('neighborhoods', {
    type: 'geojson',
    data: 'data/neighborhoods.geojson'
  });

  // Fill layer
  map.addLayer({
    id: 'neighborhoods-fill',
    type: 'fill',
    source: 'neighborhoods',
    paint: {
      'fill-color': [
        'match', ['get', 'id'],
        'south-bronx', '#C8373A',
        'red-hook', '#1B4F8A',
        'east-new-york', '#1D6B45',
        'flushing', '#6B2D8B',
        'staten-island-north', '#C4611A',
        '#888888'
      ],
      'fill-opacity': 0.15
    }
  });

  // Hover fill
  map.addLayer({
    id: 'neighborhoods-fill-hover',
    type: 'fill',
    source: 'neighborhoods',
    paint: {
      'fill-color': [
        'match', ['get', 'id'],
        'south-bronx', '#C8373A',
        'red-hook', '#1B4F8A',
        'east-new-york', '#1D6B45',
        'flushing', '#6B2D8B',
        'staten-island-north', '#C4611A',
        '#888888'
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.35,
        0
      ]
    }
  });

  // Outline
  map.addLayer({
    id: 'neighborhoods-line',
    type: 'line',
    source: 'neighborhoods',
    paint: {
      'line-color': [
        'match', ['get', 'id'],
        'south-bronx', '#C8373A',
        'red-hook', '#1B4F8A',
        'east-new-york', '#1D6B45',
        'flushing', '#6B2D8B',
        'staten-island-north', '#C4611A',
        '#888888'
      ],
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'active'], false],
        3, 1.5
      ],
      'line-opacity': 0.9
    }
  });

  // Labels
  map.addLayer({
    id: 'neighborhoods-label',
    type: 'symbol',
    source: 'neighborhoods',
    layout: {
      'text-field': ['get', 'name'],
      'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
      'text-size': 11,
      'text-anchor': 'center'
    },
    paint: {
      'text-color': '#0F1117',
      'text-halo-color': 'rgba(245,242,236,0.85)',
      'text-halo-width': 2
    }
  });

  // Hover interaction
  let hoveredId = null;
  map.on('mousemove', 'neighborhoods-fill', (e) => {
    if (e.features.length > 0) {
      if (hoveredId !== null) {
        map.setFeatureState({ source: 'neighborhoods', id: hoveredId }, { hover: false });
      }
      hoveredId = e.features[0].id;
      map.setFeatureState({ source: 'neighborhoods', id: hoveredId }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
    }
  });

  map.on('mouseleave', 'neighborhoods-fill', () => {
    if (hoveredId !== null) {
      map.setFeatureState({ source: 'neighborhoods', id: hoveredId }, { hover: false });
    }
    hoveredId = null;
    map.getCanvas().style.cursor = '';
  });

  // Click: show neighborhood panel
  map.on('click', 'neighborhoods-fill', (e) => {
    if (e.features.length > 0) {
      const nhood = e.features[0].properties;
      showNeighborhoodPanel(nhood.id);
    }
  });
}

function addOverlayLayers() {
  Object.entries(OVERLAY_SOURCES).forEach(([key, cfg]) => {
    if (cfg.kind === 'unavailable') return; // skip until data is ready

    if (cfg.kind === 'raster') {
      map.addSource(`overlay-${key}`, {
        type: 'raster',
        tiles: cfg.tiles,
        tileSize: cfg.tileSize,
        attribution: cfg.attribution || ''
      });
      map.addLayer({
        id: `overlay-${key}`,
        type: 'raster',
        source: `overlay-${key}`,
        paint: { 'raster-opacity': cfg.opacity },
        layout: { visibility: 'none' }
      }, 'neighborhoods-line');
    } else {
      map.addSource(`overlay-${key}`, {
        type: 'geojson',
        data: cfg.url
      });
      map.addLayer({
        id: `overlay-${key}`,
        type: 'fill',
        source: `overlay-${key}`,
        paint: { 'fill-color': cfg.color, 'fill-opacity': cfg.opacity },
        layout: { visibility: 'none' }
      }, 'neighborhoods-line');
      map.addLayer({
        id: `overlay-${key}-line`,
        type: 'line',
        source: `overlay-${key}`,
        paint: { 'line-color': cfg.color, 'line-width': 1, 'line-opacity': 0.8 },
        layout: { visibility: 'none' }
      }, 'neighborhoods-line');
    }
  });
}

function setupLayerToggles() {
  const toggles = document.querySelectorAll('.layer-toggle input[type="checkbox"]');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const layerId = toggle.dataset.layer;
      const visibility = toggle.checked ? 'visible' : 'none';

      if (layerId === 'neighborhoods') {
        ['neighborhoods-fill', 'neighborhoods-line', 'neighborhoods-label', 'neighborhoods-fill-hover']
          .forEach(id => map.setLayoutProperty(id, 'visibility', visibility));
        return;
      }

      if (map.getLayer(`overlay-${layerId}`)) {
        map.setLayoutProperty(`overlay-${layerId}`, 'visibility', visibility);
      }
      // Vector layers also have a companion line layer
      if (map.getLayer(`overlay-${layerId}-line`)) {
        map.setLayoutProperty(`overlay-${layerId}-line`, 'visibility', visibility);
      }

    });
  });
}

function showLayerNote(id, message) {
  if (document.getElementById(`note-${id}`)) return;
  const el = document.createElement('div');
  el.id = `note-${id}`;
  el.style.cssText = `
    position: absolute; bottom: 2.5rem; left: 1.25rem; z-index: 20;
    background: #0F1117; color: #F5F2EC; padding: 0.75rem 1rem;
    font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem;
    letter-spacing: 0.05em; max-width: 280px; line-height: 1.65;
    border-left: 2px solid #C4871A;
  `;
  el.innerHTML = `${message}<br><button onclick="this.parentElement.remove()" style="margin-top:0.5rem;background:none;border:1px solid rgba(245,242,236,0.3);color:#F5F2EC;padding:0.2rem 0.5rem;cursor:pointer;font-family:inherit;font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;">Dismiss</button>`;
  document.getElementById('map-container').appendChild(el);
}

// ---- Neighborhood Panel ----
function showNeighborhoodPanel(neighborhoodId) {
  const nhood = NEIGHBORHOODS.find(n => n.id === neighborhoodId);
  if (!nhood) return;

  activeNeighborhood = neighborhoodId;

  // Hide default, show neighborhood panel
  document.getElementById('panel-default').style.display = 'none';
  const panels = document.querySelectorAll('.panel-neighborhood');
  panels.forEach(p => p.classList.remove('active'));

  let panel = document.getElementById(`panel-nhood-${neighborhoodId}`);
  if (!panel) {
    panel = buildNeighborhoodPanel(nhood);
    document.getElementById('map-panel').appendChild(panel);
  }
  panel.classList.add('active');

  // Fly to neighborhood
  map.flyTo({ center: nhood.coordinates, zoom: 13, duration: 1000 });

  // Highlight on map
  updateActiveNeighborhoodStyle(neighborhoodId);
}

function buildNeighborhoodPanel(nhood) {
  const projects = PROJECTS.filter(p => p.neighborhoodId === nhood.id);
  const color = NHOOD_COLORS[nhood.id];

  const panel = document.createElement('div');
  panel.id = `panel-nhood-${nhood.id}`;
  panel.className = 'panel-neighborhood';

  panel.innerHTML = `
    <div class="panel-nhood-header">
      <div class="panel-nhood-color-bar" style="background: ${color};"></div>
      <div class="back-btn" onclick="closeNeighborhoodPanel()">← All neighborhoods</div>
      <div class="panel-nhood-borough">${nhood.borough}</div>
      <div class="panel-nhood-name">${nhood.name}</div>
    </div>
    <div class="panel-nhood-body">
      <p class="panel-nhood-desc">${nhood.description}</p>
      <blockquote class="panel-pullquote" style="border-color: ${color};">
        "${nhood.pullQuote}"
      </blockquote>
      <div class="panel-projects-title">${projects.length} Projects</div>
      ${projects.map(p => `
        <div class="project-card-mini" onclick="scrollToProject('${p.id}')">
          <div class="project-card-mini-title">
            ${p.title}
            ${p.isWinner ? `<span class="winner-badge">★ Winner #${p.winnerRank}</span>` : ''}
          </div>
          <div class="project-card-mini-team">${p.team}</div>
          <div class="project-card-mini-desc">${p.description}</div>
        </div>
      `).join('')}
    </div>
  `;

  return panel;
}

function closeNeighborhoodPanel() {
  activeNeighborhood = null;
  document.getElementById('panel-default').style.display = 'flex';
  document.querySelectorAll('.panel-neighborhood').forEach(p => p.classList.remove('active'));
  map.flyTo({ center: SITE_CONFIG.mapCenter, zoom: SITE_CONFIG.mapZoom, duration: 800 });
  clearActiveNeighborhoodStyle();
}

function updateActiveNeighborhoodStyle(id) {
  // TODO: use feature state to highlight active neighborhood outline
  // This requires numeric feature IDs in the GeoJSON
}

function clearActiveNeighborhoodStyle() {}

// ---- Legend (click to activate panel) ----
function setupLegend() {
  document.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.neighborhood;
      showNeighborhoodPanel(id);
    });
  });
}

// ---- Projects Grid ----
function renderProjects(filterNeighborhood = 'all', filterWinner = false) {
  const grid = document.getElementById('projects-grid');
  const filtered = PROJECTS.filter(p => {
    if (filterWinner && !p.isWinner) return false;
    if (filterNeighborhood !== 'all' && p.neighborhoodId !== filterNeighborhood) return false;
    return true;
  });

  grid.innerHTML = filtered.map(p => {
    const nhood = NEIGHBORHOODS.find(n => n.id === p.neighborhoodId);
    const color = NHOOD_COLORS[p.neighborhoodId];
    return `
      <div class="project-card ${p.isWinner ? 'winner' : ''}" id="proj-${p.id}">
        ${p.isWinner ? `<div class="winner-ribbon">Winner #${p.winnerRank}</div>` : ''}
        <div class="project-card-top">
          <div>
            <div class="project-card-title">${p.title}</div>
            <div class="project-card-team">${p.team}</div>
            <div class="project-card-neighborhood" style="color: ${color};">
              <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${color};margin-right:0.4rem;vertical-align:middle;"></span>
              ${nhood ? nhood.name : ''}
            </div>
          </div>
          <div class="project-neighborhood-dot" style="background: ${color};"></div>
        </div>
        <p class="project-card-desc">${p.description}</p>
        <div class="project-card-footer">
          ${p.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}
          ${p.demoAvailable ? `<a href="#" class="demo-link" onclick="return false;">View Demo →</a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function scrollToProject(projectId) {
  const el = document.getElementById(`proj-${projectId}`);
  if (el) {
    document.getElementById('projects-section').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.outline = '2px solid var(--accent-blue)';
      setTimeout(() => el.style.outline = '', 2000);
    }, 600);
  }
}

// ---- Filter buttons ----
function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (filter === 'winners') {
        renderProjects('all', true);
      } else {
        renderProjects(filter, false);
      }
    });
  });
}

// ---- Hero animation ----
function animateHeroBoroughTags() {
  const tags = document.querySelectorAll('.borough-tag');
  let i = 0;
  setInterval(() => {
    tags.forEach(t => t.classList.remove('highlighted'));
    if (tags[i]) tags[i].classList.add('highlighted');
    i = (i + 1) % tags.length;
  }, 1800);
}

// ---- Nav scroll behavior ----
function setupNav() {
  const sections = ['map-section', 'projects-section', 'winners-section', 'about-section', 'resources-section'];
  const links = document.querySelectorAll('nav a[data-section]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.offsetTop - 80;
      const bottom = top + el.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`nav a[data-section="${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ---- Winners section ----
function renderWinners() {
  const winners = PROJECTS.filter(p => p.isWinner).sort((a, b) => a.winnerRank - b.winnerRank);
  const grid = document.getElementById('winners-grid');

  grid.innerHTML = winners.map(p => {
    const nhood = NEIGHBORHOODS.find(n => n.id === p.neighborhoodId);
    return `
      <div class="winner-card" data-rank="${p.winnerRank}">
        <div class="winner-rank">Winner #${p.winnerRank}</div>
        <div class="winner-card-title">${p.title}</div>
        <div class="winner-card-team">${p.team} — ${nhood ? nhood.name : ''}</div>
        <p class="winner-card-desc">${p.description}</p>
        ${p.evalQuote ? `
          <blockquote class="winner-eval-quote">
            "${p.evalQuote}"
            <div class="winner-eval-attr">— Evaluation Committee</div>
          </blockquote>
        ` : ''}
        ${p.demoAvailable ? `<a href="#" class="demo-link" style="color: rgba(196,135,26,0.8); border-color: rgba(196,135,26,0.5);" onclick="return false;">View Project Demo →</a>` : ''}
      </div>
    `;
  }).join('');
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderWinners();
  setupFilters();
  setupNav();
  animateHeroBoroughTags();

  if (typeof mapboxgl !== 'undefined') {
    initMap();
  } else {
    document.getElementById('map').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#E8E3D8;font-family:'IBM Plex Mono',monospace;font-size:0.8rem;color:#7A7468;text-align:center;padding:2rem;">
        Map requires a Mapbox token.<br>Add yours to data/content.js → SITE_CONFIG.mapboxToken
      </div>`;
  }
});
