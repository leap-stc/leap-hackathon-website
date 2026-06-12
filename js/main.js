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
           tileSize: 256, minzoom: 9, maxzoom: 14, opacity: 0.75, scheme: 'tms',
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

const LAYER_DESCRIPTIONS = {
  cloudburst: {
    title: 'Cloudburst Flooding',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. This layer maps areas at risk of stormwater flooding during moderate cloudburst events, based on NYC stormwater flood modeling. Blue zones indicate predicted inundation under moderate storm conditions across the five boroughs.',
    source: 'NYC Open Data — NYC Stormwater Flood Maps'
  },
  heat: {
    title: 'Urban Heat',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mean surface temperature data from 2020–2022. Warmer tones highlight neighborhoods with the greatest heat burden — typically areas with dense pavement, limited tree canopy, and lower access to cooling resources.',
    source: 'NYC City Council — Mean Surface Temperature 2020–2022'
  },
  pfirm: {
    title: 'PFIRM 2015 Flood Zones',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. FEMA\'s Preliminary Flood Insurance Rate Maps show regulatory flood risk zones across New York City, distinguishing between 1% annual chance (100-year) and 0.2% annual chance (500-year) floodplains based on current conditions.',
    source: 'FEMA / NYC DCP — 2015 Preliminary Flood Insurance Rate Maps'
  },
  surge2050: {
    title: 'Coastal Surge 2050s',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Projected 100-year floodplain under 2050s sea level rise scenarios. This layer reflects moderate acceleration in coastal flood risk driven by rising seas and intensifying storm surge over the coming decades.',
    source: 'NYC Department of City Planning — Future Floodplain 2050s'
  },
  surge2080: {
    title: 'Coastal Surge 2080s',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Projected 100-year floodplain under 2080s sea level rise scenarios — the most severe long-term outlook modeled by NYC DCP. Communities shown here face significant displacement and infrastructure risk by end of century without major adaptation.',
    source: 'NYC Department of City Planning — Future Floodplain 2080s'
  },
  'flushing-rain-gardens': {
    title: 'Rain Gardens',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Green infrastructure assets constructed by NYC DEP to capture and filter stormwater runoff before it enters the combined sewer system. Each installation reduces the volume of untreated sewage discharged into Flushing Bay during storm events.',
    source: 'NYC DEP — Green Infrastructure Map'
  },
  'flushing-cso': {
    title: 'Combined Sewer Overflow',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In combined sewer areas, a single pipe carries both stormwater and sewage. During heavy rain events, the system overflows directly into waterways. This layer shows DEP green infrastructure assets specifically built in combined sewer drainage areas to reduce overflow frequency and volume.',
    source: 'NYC DEP — Green Infrastructure Map'
  }
};

const NEIGHBORHOOD_LAYERS = {
  flushing: [
    {
      id: 'flushing-rain-gardens',
      label: 'Rain Gardens',
      color: '#22c55e',
      sourceId: 'src-flushing-rain-gardens',
      layerId: 'lyr-flushing-rain-gardens',
      fetchUrl: 'https://data.cityofnewyork.us/resource/df32-vzax.geojson?' +
        '$where=' + encodeURIComponent("latitude > 40.74 AND latitude < 40.78 AND longitude > -73.84 AND longitude < -73.78") +
        '&$limit=1000',
      paint: {
        'circle-color': '#22c55e',
        'circle-radius': 4,
        'circle-opacity': 0.85,
        'circle-stroke-color': '#16a34a',
        'circle-stroke-width': 1
      }
    },
    {
      id: 'flushing-cso',
      label: 'Combined Sewer Overflow',
      color: '#6366f1',
      sourceId: 'src-flushing-cso',
      layerId: 'lyr-flushing-cso',
      fetchUrl: 'https://data.cityofnewyork.us/resource/df32-vzax.geojson?' +
        '$where=' + encodeURIComponent("latitude > 40.74 AND latitude < 40.78 AND longitude > -73.84 AND longitude < -73.78 AND sewer_type = 'Combined'") +
        '&$limit=1000',
      paint: {
        'circle-color': '#6366f1',
        'circle-radius': 5,
        'circle-opacity': 0.75,
        'circle-stroke-color': '#4338ca',
        'circle-stroke-width': 1.5
      }
    }
  ]
};

// Neighborhood color map (matches content.js)
const NHOOD_COLORS = {
  'east-harlem': '#C8373A',
  'soundview': '#1B5E8A',
  'flushing': '#1D6B45',
  'brownsville': '#6B2D8B',
  'stapleton': '#C4611A'
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
        'east-harlem', '#C8373A',
        'soundview', '#1B5E8A',
        'flushing', '#1D6B45',
        'brownsville', '#6B2D8B',
        'stapleton', '#C4611A',
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
        'east-harlem', '#C8373A',
        'soundview', '#1B5E8A',
        'flushing', '#1D6B45',
        'brownsville', '#6B2D8B',
        'stapleton', '#C4611A',
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
        'east-harlem', '#C8373A',
        'soundview', '#1B5E8A',
        'flushing', '#1D6B45',
        'brownsville', '#6B2D8B',
        'stapleton', '#C4611A',
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
        ...(cfg.minzoom != null && { minzoom: cfg.minzoom }),
        ...(cfg.maxzoom != null && { maxzoom: cfg.maxzoom }),
        ...(cfg.scheme && { scheme: cfg.scheme }),
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

      setLayerDescriptionVisible(layerId, toggle.checked);

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

// ---- Rain Gardens (Flushing only) ----
function fetchAndAddNeighborhoodLayer(cfg) {
  fetch(cfg.fetchUrl)
    .then(res => {
      if (!res.ok) throw new Error(`Layer fetch failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!map.getSource(cfg.sourceId)) {
        map.addSource(cfg.sourceId, { type: 'geojson', data });
      }
      if (!map.getLayer(cfg.layerId)) {
        map.addLayer({ id: cfg.layerId, type: 'circle', source: cfg.sourceId, paint: cfg.paint });
      }
    })
    .catch(err => console.error(`Neighborhood layer ${cfg.id}:`, err));
}

function removeNeighborhoodLayer(cfg) {
  if (map.getLayer(cfg.layerId)) map.removeLayer(cfg.layerId);
  if (map.getSource(cfg.sourceId)) map.removeSource(cfg.sourceId);
}

function setLayerDescriptionVisible(layerId, visible) {
  const container = document.getElementById('layer-descriptions');
  if (visible) {
    if (container.querySelector(`.layer-desc-block[data-layer="${layerId}"]`)) return;
    const desc = LAYER_DESCRIPTIONS[layerId];
    if (!desc) return;
    const block = document.createElement('div');
    block.className = 'layer-desc-block';
    block.dataset.layer = layerId;
    block.innerHTML = `<p class="label ldb-title">${desc.title}</p><p class="ldb-body">${desc.body}</p><p class="ldb-source">Source: ${desc.source}</p>`;
    container.appendChild(block);
    container.removeAttribute('hidden');
  } else {
    const block = container.querySelector(`.layer-desc-block[data-layer="${layerId}"]`);
    if (block) block.remove();
    if (container.children.length === 0) container.setAttribute('hidden', '');
  }
}

function showNeighborhoodLayers(neighborhoodId) {
  const layers = NEIGHBORHOOD_LAYERS[neighborhoodId];
  const panel = document.getElementById('neighborhood-layers-control');
  if (!layers || layers.length === 0) {
    panel.setAttribute('hidden', '');
    return;
  }
  panel.innerHTML = `<div class="control-panel-title">${NEIGHBORHOODS.find(n => n.id === neighborhoodId)?.name} Data</div>` +
    layers.map(l => `
      <label class="layer-toggle">
        <input type="checkbox" data-layer="${l.id}" data-nhood-layer="true">
        <div class="layer-dot" style="background: ${l.color};"></div>
        <span>${l.label}</span>
      </label>
    `).join('');
  panel.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      const cfg = layers.find(l => l.id === cb.dataset.layer);
      if (!cfg) return;
      if (cb.checked) {
        fetchAndAddNeighborhoodLayer(cfg);
      } else {
        removeNeighborhoodLayer(cfg);
      }
      setLayerDescriptionVisible(cb.dataset.layer, cb.checked);
    });
  });
  panel.removeAttribute('hidden');
}

function hideNeighborhoodLayers(neighborhoodId) {
  const layers = NEIGHBORHOOD_LAYERS[neighborhoodId] || [];
  layers.forEach(cfg => {
    removeNeighborhoodLayer(cfg);
    setLayerDescriptionVisible(cfg.id, false);
  });
  const panel = document.getElementById('neighborhood-layers-control');
  panel.innerHTML = '';
  panel.setAttribute('hidden', '');
}

// ---- Neighborhood Panel ----
function showNeighborhoodPanel(neighborhoodId) {
  const nhood = NEIGHBORHOODS.find(n => n.id === neighborhoodId);
  if (!nhood) return;

  if (activeNeighborhood) hideNeighborhoodLayers(activeNeighborhood);
  activeNeighborhood = neighborhoodId;

  // Lock the map area to its current height so it doesn't shrink when
  // the neighborhood description panel is inserted above it.
  const mapInner = document.getElementById('map-section-inner');
  mapInner.style.height = mapInner.offsetHeight + 'px';
  mapInner.style.flex = 'none';

  map.flyTo({ center: nhood.coordinates, zoom: 13, duration: 1000 });
  updateActiveNeighborhoodStyle(neighborhoodId);

  // Populate and show neighborhood description bar
  document.getElementById('nhood-name').textContent = nhood.name;
  document.getElementById('nhood-borough').textContent = nhood.borough;
  document.getElementById('nhood-col1').textContent = nhood.description;
  document.getElementById('nhood-col2').textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  document.getElementById('neighborhood-state').removeAttribute('hidden');

  // Show neighborhood-specific layer toggles
  showNeighborhoodLayers(neighborhoodId);

  // Build and show project cards for this neighborhood
  const projects = PROJECTS.filter(p => p.neighborhoodId === neighborhoodId);
  const inner = document.getElementById('neighborhood-projects-inner');
  inner.innerHTML = projects.map(p => `
    <div class="nhood-project-card${p.isWinner ? ' nhood-project-card--winner' : ''}">
      ${p.isWinner ? `<span class="nhood-winner-tag">${p.isWinnerCategory}</span>` : ''}
      <p class="nhood-project-team">${p.team}</p>
      ${p.title ? `<p class="nhood-project-title">${p.title}</p>` : ''}
      <p class="nhood-project-desc">${p.description}</p>
      ${p.demoAvailable ? `<span class="nhood-demo-tag">Demo available</span>` : ''}
    </div>
  `).join('');
  document.getElementById('neighborhood-projects').removeAttribute('hidden');
}

function closeNeighborhoodPanel() {
  if (activeNeighborhood) hideNeighborhoodLayers(activeNeighborhood);
  activeNeighborhood = null;
  map.flyTo({ center: SITE_CONFIG.mapCenter, zoom: SITE_CONFIG.mapZoom, duration: 800 });
  clearActiveNeighborhoodStyle();

  // Restore the map area to flex-driven sizing
  const mapInner = document.getElementById('map-section-inner');
  mapInner.style.height = '';
  mapInner.style.flex = '';

  document.getElementById('neighborhood-state').setAttribute('hidden', '');
  document.getElementById('neighborhood-projects').setAttribute('hidden', '');
  document.getElementById('neighborhood-projects-inner').innerHTML = '';
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
        ${p.isWinner ? `<div class="winner-ribbon">Winner</div>` : ''}
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
  if (!tags.length) return;
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
  const winners = PROJECTS.filter(p => p.isWinner);
  const container = document.getElementById('winners-grid');

  container.innerHTML = winners.map(p => {
    const nhood = NEIGHBORHOODS.find(n => n.id === p.neighborhoodId);
    const displayTitle = p.title || p.team;
    const meta = `${p.team}${nhood ? ' · ' + nhood.name + ', ' + nhood.borough : ''}`;
    return `
      <div class="winner-acc-item" data-id="${p.id}">
        <button class="winner-acc-trigger" aria-expanded="false" onclick="toggleWinnerAcc('${p.id}')">
          <div class="acc-title-block">
            <div class="acc-title-row">
              <div class="acc-title">${displayTitle}</div>
              <div class="acc-winner-label">${p.isWinnerCategory}</div>
            </div>
            <div class="acc-meta">${meta}</div>
          </div>
          <span class="acc-chevron" aria-hidden="true"></span>
        </button>
        <div class="winner-acc-body">
          <div class="winner-acc-inner">
            <div class="winner-acc-content">
              <p class="acc-block-body">${p.description}</p>
              ${p.evalQuote ? `
                <blockquote class="acc-eval-quote">
                  "${p.evalQuote}"
                  <cite class="acc-eval-attr">— Evaluation Committee</cite>
                </blockquote>
              ` : ''}
              <div class="acc-tags">${p.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleWinnerAcc(id) {
  const item = document.querySelector(`.winner-acc-item[data-id="${id}"]`);
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.winner-acc-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.winner-acc-trigger').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    item.querySelector('.winner-acc-trigger').setAttribute('aria-expanded', 'true');
  }
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
