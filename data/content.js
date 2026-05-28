const NEIGHBORHOODS = [
  {
    id: "south-bronx",
    name: "South Bronx",
    borough: "Bronx",
    description: "A historically underserved community facing compounding climate risks from extreme heat, stormwater flooding, and proximity to industrial waterfront corridors. Teams here examined how green infrastructure could be equitably distributed across census tracts with the highest vulnerability indices.",
    pullQuote: "The data told a story we already knew — now we have the tools to prove it.",
    coordinates: [-73.9196, 40.8136],
    color: "#E63946",
    projects: ["bronx-heat-equity", "bronx-flood-corridors", "bronx-green-infra"]
  },
  {
    id: "red-hook",
    name: "Red Hook",
    borough: "Brooklyn",
    description: "A waterfront neighborhood that experienced severe flooding during Hurricane Sandy, Red Hook remains one of NYC's most flood-exposed communities. Teams investigated coastal surge projections under 2050 and 2080 scenarios alongside existing community resilience assets.",
    pullQuote: "Sandy showed us what's coming. This hackathon gave us a framework to respond.",
    coordinates: [-74.0099, 40.6758],
    color: "#457B9D",
    projects: ["red-hook-surge", "red-hook-assets", "red-hook-community"]
  },
  {
    id: "east-new-york",
    name: "East New York",
    borough: "Brooklyn",
    description: "One of the city's hottest neighborhoods in summer months, East New York sits at the intersection of the urban heat island effect and socioeconomic vulnerability. Teams mapped cooling center access gaps and proposed data-driven interventions for extreme heat events.",
    pullQuote: "When you layer heat, income, and age — the picture becomes impossible to ignore.",
    coordinates: [-73.8769, 40.6661],
    color: "#2D6A4F",
    projects: ["eny-heat-island", "eny-cooling-access", "eny-tree-canopy"]
  },
  {
    id: "flushing",
    name: "Flushing",
    borough: "Queens",
    description: "Flushing faces a unique confluence of stormwater flooding from the Flushing Creek watershed and an increasingly dense built environment. Teams analyzed cloudburst mapping data to identify priority infrastructure investments and community preparedness strategies.",
    pullQuote: "The creek doesn't know borough boundaries — and neither should our solutions.",
    coordinates: [-73.8330, 40.7675],
    color: "#7B2D8B",
    projects: ["flushing-cloudburst", "flushing-watershed", "flushing-prep"]
  },
  {
    id: "staten-island-north",
    name: "North Shore, Staten Island",
    borough: "Staten Island",
    description: "The North Shore of Staten Island combines industrial legacy, waterfront flooding exposure, and limited transit connectivity. Teams here focused on compound risk scenarios and the role of community land trusts in building long-term climate resilience.",
    pullQuote: "Resilience isn't just about surviving the storm — it's about who gets to stay after.",
    coordinates: [-74.0776, 40.6412],
    color: "#E9762B",
    projects: ["si-compound-risk", "si-land-trust", "si-shoreline"]
  }
];

const PROJECTS = [
  // South Bronx
  {
    id: "bronx-heat-equity",
    neighborhoodId: "south-bronx",
    title: "Thermal Equity Index",
    team: "Team Albedo",
    description: "A composite vulnerability index that layers surface temperature data, tree canopy cover, and demographic indicators to identify the highest-priority census tracts for cooling interventions in the South Bronx.",
    isWinner: true,
    winnerRank: 1,
    evalQuote: "Exceptional methodological rigor combined with actionable policy recommendations. The index is immediately usable by city agencies.",
    tags: ["heat", "equity", "index"],
    demoAvailable: true
  },
  {
    id: "bronx-flood-corridors",
    neighborhoodId: "south-bronx",
    title: "Stormwater Flow Corridors",
    team: "Team Confluence",
    description: "Mapping the hidden drainage pathways through the South Bronx street grid to predict where cloudburst flooding concentrates and which corridors could be retrofitted as green streets.",
    isWinner: false,
    tags: ["stormwater", "green-infrastructure", "mapping"],
    demoAvailable: false
  },
  {
    id: "bronx-green-infra",
    neighborhoodId: "south-bronx",
    title: "Green Infrastructure Gap Analysis",
    team: "Team Root System",
    description: "An audit of existing DEP green infrastructure installations versus modeled need, identifying neighborhoods where investment has lagged behind vulnerability exposure.",
    isWinner: false,
    tags: ["green-infrastructure", "policy", "data"],
    demoAvailable: true
  },
  // Red Hook
  {
    id: "red-hook-surge",
    neighborhoodId: "red-hook",
    title: "2050 Surge Scenario Planner",
    team: "Team Tidemark",
    description: "An interactive scenario tool comparing 2050s and 2080s 100-year floodplain projections with current land use to quantify assets at risk and prioritize protection strategies.",
    isWinner: true,
    winnerRank: 2,
    evalQuote: "The scenario comparison interface is intuitive and the underlying data methodology is sound. A strong foundation for community engagement.",
    tags: ["coastal-flooding", "sea-level-rise", "scenario-planning"],
    demoAvailable: true
  },
  {
    id: "red-hook-assets",
    neighborhoodId: "red-hook",
    title: "Community Asset Resilience Map",
    team: "Team Anchor",
    description: "A participatory mapping project cataloguing Red Hook's social infrastructure — community organizations, food access points, informal support networks — and their flood vulnerability.",
    isWinner: false,
    tags: ["community-assets", "participatory", "social-infrastructure"],
    demoAvailable: false
  },
  {
    id: "red-hook-community",
    neighborhoodId: "red-hook",
    title: "Recovery Time Estimator",
    team: "Team Watermark",
    description: "Using Sandy recovery data as a baseline, this model estimates post-flood recovery timelines for different surge scenarios and household income levels in Red Hook.",
    isWinner: false,
    tags: ["recovery", "equity", "modeling"],
    demoAvailable: false
  },
  // East New York
  {
    id: "eny-heat-island",
    neighborhoodId: "east-new-york",
    title: "Urban Heat Island Dynamics",
    team: "Team Thermal",
    description: "A time-series analysis of Landsat surface temperature data over East New York from 2000–2024, correlating heat island intensification with development patterns and tree canopy loss.",
    isWinner: true,
    winnerRank: 3,
    evalQuote: "Sophisticated temporal analysis that clearly demonstrates the relationship between development decisions and heat vulnerability. Compelling visualizations.",
    tags: ["heat", "remote-sensing", "time-series"],
    demoAvailable: true
  },
  {
    id: "eny-cooling-access",
    neighborhoodId: "east-new-york",
    title: "Cooling Center Accessibility",
    team: "Team Refuge",
    description: "Network analysis of pedestrian travel times to cooling centers during extreme heat events, accounting for age, mobility, and transit access across East New York.",
    isWinner: false,
    tags: ["cooling-centers", "accessibility", "network-analysis"],
    demoAvailable: false
  },
  {
    id: "eny-tree-canopy",
    neighborhoodId: "east-new-york",
    title: "Tree Canopy Expansion Model",
    team: "Team Canopy",
    description: "Identifying optimal planting sites for maximum cooling impact in East New York using a multi-criteria spatial analysis of impervious surface, soil quality, and pedestrian exposure.",
    isWinner: false,
    tags: ["urban-forestry", "heat", "spatial-analysis"],
    demoAvailable: false
  },
  // Flushing
  {
    id: "flushing-cloudburst",
    neighborhoodId: "flushing",
    title: "Cloudburst Priority Map",
    team: "Team Deluge",
    description: "Integrating NYC's stormwater flood maps with real-time rainfall data to produce a dynamic cloudburst risk surface for Flushing, with recommendations for cloudburst management infrastructure.",
    isWinner: true,
    winnerRank: 4,
    evalQuote: "Strong integration of multiple datasets with clear utility for the Department of Environmental Protection's cloudburst planning program.",
    tags: ["cloudburst", "stormwater", "dynamic-mapping"],
    demoAvailable: true
  },
  {
    id: "flushing-watershed",
    neighborhoodId: "flushing",
    title: "Creek Watershed Restoration",
    team: "Team Watershed",
    description: "A restoration opportunity analysis for the Flushing Creek watershed, identifying parcels where daylighting or green infrastructure could reduce peak stormwater flows.",
    isWinner: false,
    tags: ["watershed", "restoration", "stormwater"],
    demoAvailable: false
  },
  {
    id: "flushing-prep",
    neighborhoodId: "flushing",
    title: "Community Preparedness Index",
    team: "Team Ready",
    description: "Surveying existing emergency preparedness resources and social capital in Flushing to build a neighborhood-level resilience score that can track progress over time.",
    isWinner: false,
    tags: ["preparedness", "social-capital", "index"],
    demoAvailable: false
  },
  // Staten Island
  {
    id: "si-compound-risk",
    neighborhoodId: "staten-island-north",
    title: "Compound Risk Assessment",
    team: "Team Cascade",
    description: "Modeling simultaneous exposure to coastal surge, extreme heat, and air quality degradation on the North Shore to understand how compound climate events interact and amplify vulnerability.",
    isWinner: false,
    tags: ["compound-risk", "modeling", "multi-hazard"],
    demoAvailable: false
  },
  {
    id: "si-land-trust",
    neighborhoodId: "staten-island-north",
    title: "Climate Land Trust Feasibility",
    team: "Team Tenure",
    description: "Assessing the feasibility of a community land trust model on the North Shore that could preserve affordable housing while implementing climate resilience upgrades across a portfolio of properties.",
    isWinner: false,
    tags: ["housing", "land-trust", "policy"],
    demoAvailable: false
  },
  {
    id: "si-shoreline",
    neighborhoodId: "staten-island-north",
    title: "Living Shoreline Siting",
    team: "Team Littoral",
    description: "Identifying optimal locations for living shoreline installations along the North Shore using wave energy, sediment, and ecological data to maximize both protection and habitat co-benefits.",
    isWinner: false,
    tags: ["living-shoreline", "coastal", "ecology"],
    demoAvailable: false
  }
];

const SITE_CONFIG = {
  title: "LEAP Hackathon 2026",
  subtitle: "Climate Resilience Through Collaborative Data Science",
  date: "January 2026",
  location: "New York City",
  mapboxToken: typeof MAPBOX_TOKEN !== 'undefined' ? MAPBOX_TOKEN : '',
  mapCenter: [-73.94, 40.72],
  mapZoom: 10.5,
  dataSources: [
    { name: "NYC Stormwater Flood Maps (Cloudburst)", url: "https://data.cityofnewyork.us/Environment/NYC-Stormwater-Flood-Maps/9i7c-xyvv/about_data", org: "NYC Open Data" },
    { name: "NYC Heat Vulnerability Index", url: "https://github.com/NewYorkCityCouncil/heat_map", org: "NYC City Council" },
    { name: "Sea Level Rise Maps — 2050s", url: "https://data.cityofnewyork.us/Environment/Sea-Level-Rise-Maps-2050s-100-year-Floodplain-/hbw8-2bah", org: "NYC Open Data" },
    { name: "Sea Level Rise Maps — 2080s", url: "https://data.cityofnewyork.us/Environment/Sea-Level-Rise-Maps-2080s-100-year-Floodplain-/ek8y-fsqz/about_data", org: "NYC Open Data" },
    { name: "NYC Street Tree Census", url: "https://data.cityofnewyork.us/Environment/2015-Street-Tree-Census-Tree-Data/uvpi-gqnh", org: "NYC Parks" },
    { name: "PFIRM Flood Insurance Rate Maps", url: "https://www.arcgis.com/apps/webappviewer/index.html?id=1c37d271fba14163bbb520517153d6d5", org: "FEMA / NYC" }
  ],
  sponsors: [
    { name: "Leap NYC", url: "#" },
    { name: "Urban Omnibus", url: "https://urbanomnibus.net" },
    { name: "NYC Department of City Planning", url: "https://www.nyc.gov/site/planning" },
    { name: "JupyterHub / 2i2c", url: "https://2i2c.org" }
  ]
};
