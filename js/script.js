import Globe from 'globe.gl';
import * as THREE from 'three';
import countryFacts from '../data/country-facts.json';

const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const EARTH_TEXTURE = new URL('../textures/earthmap10k.jpg', import.meta.url).href;
const MOON_TEXTURE = new URL('../textures/moonmap4k.jpg', import.meta.url).href;

let globe, moonMesh;
let selectedCountry = null;
let hoveredCountry = null;
let autoRotate = true;
let countries = [];

// ── Initialize Globe ──
async function init() {
  const container = document.getElementById('globe-container');

  globe = new Globe(container, { animateIn: true })
    .globeImageUrl(EARTH_TEXTURE)
    .backgroundColor('rgba(0, 0, 17, 1)')
    .showAtmosphere(true)
    .atmosphereColor('lightskyblue')
    .atmosphereAltitude(0.2)
    .polygonAltitude(d => d === selectedCountry ? 0.02 : 0.006)
    .polygonCapColor(d => {
      if (d === selectedCountry) return 'rgba(0, 180, 255, 0.45)';
      if (d === hoveredCountry) return 'rgba(100, 200, 255, 0.2)';
      return 'rgba(255, 255, 255, 0)';
    })
    .polygonSideColor(() => 'rgba(100, 200, 255, 0.08)')
    .polygonStrokeColor(() => 'rgba(100, 200, 255, 0.25)')
    .polygonLabel(d => {
      const props = d.properties;
      return `<div class="scene-tooltip">${props.name}</div>`;
    })
    .onPolygonClick(handleCountryClick)
    .onPolygonHover(handleCountryHover)
    .polygonsTransitionDuration(200);

  // Auto-rotate
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.4;
  globe.controls().enableDamping = true;

  // Load country polygons
  await loadCountries();

  // Add moon
  addMoon();

  // Set up UI
  setupUI();

  // Hide loading
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 1500);
}

// ── Load GeoJSON Countries ──
async function loadCountries() {
  try {
    const topojson = await import('topojson-client');
    const res = await fetch(GEOJSON_URL);
    const world = await res.json();
    countries = topojson.feature(world, world.objects.countries).features;

    // Map numeric IDs to ISO alpha-2 codes
    const idToAlpha2 = await loadCountryIdMap();
    countries.forEach(c => {
      const info = idToAlpha2[c.id];
      if (info) {
        c.properties = { ...c.properties, name: info.name, iso_a2: info.iso_a2 };
      }
    });

    globe.polygonsData(countries);
  } catch (err) {
    console.error('Failed to load countries:', err);
  }
}

// ── Map numeric country IDs (ISO 3166-1 numeric) to names + alpha-2 codes ──
async function loadCountryIdMap() {
  // Mapping from ISO 3166-1 numeric IDs used in world-atlas to alpha-2 codes
  return {
    "004": { name: "Afghanistan", iso_a2: "AF" },
    "008": { name: "Albania", iso_a2: "AL" },
    "012": { name: "Algeria", iso_a2: "DZ" },
    "024": { name: "Angola", iso_a2: "AO" },
    "032": { name: "Argentina", iso_a2: "AR" },
    "051": { name: "Armenia", iso_a2: "AM" },
    "036": { name: "Australia", iso_a2: "AU" },
    "040": { name: "Austria", iso_a2: "AT" },
    "031": { name: "Azerbaijan", iso_a2: "AZ" },
    "044": { name: "Bahamas", iso_a2: "BS" },
    "050": { name: "Bangladesh", iso_a2: "BD" },
    "112": { name: "Belarus", iso_a2: "BY" },
    "056": { name: "Belgium", iso_a2: "BE" },
    "084": { name: "Belize", iso_a2: "BZ" },
    "204": { name: "Benin", iso_a2: "BJ" },
    "064": { name: "Bhutan", iso_a2: "BT" },
    "068": { name: "Bolivia", iso_a2: "BO" },
    "070": { name: "Bosnia and Herz.", iso_a2: "BA" },
    "072": { name: "Botswana", iso_a2: "BW" },
    "076": { name: "Brazil", iso_a2: "BR" },
    "096": { name: "Brunei", iso_a2: "BN" },
    "100": { name: "Bulgaria", iso_a2: "BG" },
    "854": { name: "Burkina Faso", iso_a2: "BF" },
    "108": { name: "Burundi", iso_a2: "BI" },
    "116": { name: "Cambodia", iso_a2: "KH" },
    "120": { name: "Cameroon", iso_a2: "CM" },
    "124": { name: "Canada", iso_a2: "CA" },
    "140": { name: "Central African Rep.", iso_a2: "CF" },
    "148": { name: "Chad", iso_a2: "TD" },
    "152": { name: "Chile", iso_a2: "CL" },
    "156": { name: "China", iso_a2: "CN" },
    "170": { name: "Colombia", iso_a2: "CO" },
    "178": { name: "Congo", iso_a2: "CG" },
    "180": { name: "DR Congo", iso_a2: "CD" },
    "188": { name: "Costa Rica", iso_a2: "CR" },
    "384": { name: "Côte d'Ivoire", iso_a2: "CI" },
    "191": { name: "Croatia", iso_a2: "HR" },
    "192": { name: "Cuba", iso_a2: "CU" },
    "196": { name: "Cyprus", iso_a2: "CY" },
    "203": { name: "Czechia", iso_a2: "CZ" },
    "208": { name: "Denmark", iso_a2: "DK" },
    "262": { name: "Djibouti", iso_a2: "DJ" },
    "214": { name: "Dominican Rep.", iso_a2: "DO" },
    "218": { name: "Ecuador", iso_a2: "EC" },
    "818": { name: "Egypt", iso_a2: "EG" },
    "222": { name: "El Salvador", iso_a2: "SV" },
    "226": { name: "Equatorial Guinea", iso_a2: "GQ" },
    "232": { name: "Eritrea", iso_a2: "ER" },
    "233": { name: "Estonia", iso_a2: "EE" },
    "748": { name: "Eswatini", iso_a2: "SZ" },
    "231": { name: "Ethiopia", iso_a2: "ET" },
    "238": { name: "Falkland Is.", iso_a2: "FK" },
    "242": { name: "Fiji", iso_a2: "FJ" },
    "246": { name: "Finland", iso_a2: "FI" },
    "250": { name: "France", iso_a2: "FR" },
    "266": { name: "Gabon", iso_a2: "GA" },
    "270": { name: "Gambia", iso_a2: "GM" },
    "268": { name: "Georgia", iso_a2: "GE" },
    "276": { name: "Germany", iso_a2: "DE" },
    "288": { name: "Ghana", iso_a2: "GH" },
    "300": { name: "Greece", iso_a2: "GR" },
    "304": { name: "Greenland", iso_a2: "GL" },
    "320": { name: "Guatemala", iso_a2: "GT" },
    "324": { name: "Guinea", iso_a2: "GN" },
    "624": { name: "Guinea-Bissau", iso_a2: "GW" },
    "328": { name: "Guyana", iso_a2: "GY" },
    "332": { name: "Haiti", iso_a2: "HT" },
    "340": { name: "Honduras", iso_a2: "HN" },
    "348": { name: "Hungary", iso_a2: "HU" },
    "352": { name: "Iceland", iso_a2: "IS" },
    "356": { name: "India", iso_a2: "IN" },
    "360": { name: "Indonesia", iso_a2: "ID" },
    "364": { name: "Iran", iso_a2: "IR" },
    "368": { name: "Iraq", iso_a2: "IQ" },
    "372": { name: "Ireland", iso_a2: "IE" },
    "376": { name: "Israel", iso_a2: "IL" },
    "380": { name: "Italy", iso_a2: "IT" },
    "388": { name: "Jamaica", iso_a2: "JM" },
    "392": { name: "Japan", iso_a2: "JP" },
    "400": { name: "Jordan", iso_a2: "JO" },
    "398": { name: "Kazakhstan", iso_a2: "KZ" },
    "404": { name: "Kenya", iso_a2: "KE" },
    "408": { name: "North Korea", iso_a2: "KP" },
    "410": { name: "South Korea", iso_a2: "KR" },
    "414": { name: "Kuwait", iso_a2: "KW" },
    "417": { name: "Kyrgyzstan", iso_a2: "KG" },
    "418": { name: "Laos", iso_a2: "LA" },
    "428": { name: "Latvia", iso_a2: "LV" },
    "422": { name: "Lebanon", iso_a2: "LB" },
    "426": { name: "Lesotho", iso_a2: "LS" },
    "430": { name: "Liberia", iso_a2: "LR" },
    "434": { name: "Libya", iso_a2: "LY" },
    "440": { name: "Lithuania", iso_a2: "LT" },
    "442": { name: "Luxembourg", iso_a2: "LU" },
    "807": { name: "North Macedonia", iso_a2: "MK" },
    "450": { name: "Madagascar", iso_a2: "MG" },
    "454": { name: "Malawi", iso_a2: "MW" },
    "458": { name: "Malaysia", iso_a2: "MY" },
    "466": { name: "Mali", iso_a2: "ML" },
    "478": { name: "Mauritania", iso_a2: "MR" },
    "484": { name: "Mexico", iso_a2: "MX" },
    "498": { name: "Moldova", iso_a2: "MD" },
    "496": { name: "Mongolia", iso_a2: "MN" },
    "499": { name: "Montenegro", iso_a2: "ME" },
    "504": { name: "Morocco", iso_a2: "MA" },
    "508": { name: "Mozambique", iso_a2: "MZ" },
    "104": { name: "Myanmar", iso_a2: "MM" },
    "516": { name: "Namibia", iso_a2: "NA" },
    "524": { name: "Nepal", iso_a2: "NP" },
    "528": { name: "Netherlands", iso_a2: "NL" },
    "540": { name: "New Caledonia", iso_a2: "NC" },
    "554": { name: "New Zealand", iso_a2: "NZ" },
    "558": { name: "Nicaragua", iso_a2: "NI" },
    "562": { name: "Niger", iso_a2: "NE" },
    "566": { name: "Nigeria", iso_a2: "NG" },
    "578": { name: "Norway", iso_a2: "NO" },
    "512": { name: "Oman", iso_a2: "OM" },
    "586": { name: "Pakistan", iso_a2: "PK" },
    "275": { name: "Palestine", iso_a2: "PS" },
    "591": { name: "Panama", iso_a2: "PA" },
    "598": { name: "Papua New Guinea", iso_a2: "PG" },
    "600": { name: "Paraguay", iso_a2: "PY" },
    "604": { name: "Peru", iso_a2: "PE" },
    "608": { name: "Philippines", iso_a2: "PH" },
    "616": { name: "Poland", iso_a2: "PL" },
    "620": { name: "Portugal", iso_a2: "PT" },
    "630": { name: "Puerto Rico", iso_a2: "PR" },
    "634": { name: "Qatar", iso_a2: "QA" },
    "642": { name: "Romania", iso_a2: "RO" },
    "643": { name: "Russia", iso_a2: "RU" },
    "646": { name: "Rwanda", iso_a2: "RW" },
    "682": { name: "Saudi Arabia", iso_a2: "SA" },
    "686": { name: "Senegal", iso_a2: "SN" },
    "688": { name: "Serbia", iso_a2: "RS" },
    "694": { name: "Sierra Leone", iso_a2: "SL" },
    "703": { name: "Slovakia", iso_a2: "SK" },
    "705": { name: "Slovenia", iso_a2: "SI" },
    "090": { name: "Solomon Is.", iso_a2: "SB" },
    "706": { name: "Somalia", iso_a2: "SO" },
    "710": { name: "South Africa", iso_a2: "ZA" },
    "728": { name: "South Sudan", iso_a2: "SS" },
    "724": { name: "Spain", iso_a2: "ES" },
    "144": { name: "Sri Lanka", iso_a2: "LK" },
    "729": { name: "Sudan", iso_a2: "SD" },
    "740": { name: "Suriname", iso_a2: "SR" },
    "752": { name: "Sweden", iso_a2: "SE" },
    "756": { name: "Switzerland", iso_a2: "CH" },
    "760": { name: "Syria", iso_a2: "SY" },
    "158": { name: "Taiwan", iso_a2: "TW" },
    "762": { name: "Tajikistan", iso_a2: "TJ" },
    "834": { name: "Tanzania", iso_a2: "TZ" },
    "764": { name: "Thailand", iso_a2: "TH" },
    "626": { name: "Timor-Leste", iso_a2: "TL" },
    "768": { name: "Togo", iso_a2: "TG" },
    "780": { name: "Trinidad and Tobago", iso_a2: "TT" },
    "788": { name: "Tunisia", iso_a2: "TN" },
    "792": { name: "Turkey", iso_a2: "TR" },
    "795": { name: "Turkmenistan", iso_a2: "TM" },
    "800": { name: "Uganda", iso_a2: "UG" },
    "804": { name: "Ukraine", iso_a2: "UA" },
    "784": { name: "UAE", iso_a2: "AE" },
    "826": { name: "United Kingdom", iso_a2: "GB" },
    "840": { name: "United States", iso_a2: "US" },
    "858": { name: "Uruguay", iso_a2: "UY" },
    "860": { name: "Uzbekistan", iso_a2: "UZ" },
    "548": { name: "Vanuatu", iso_a2: "VU" },
    "862": { name: "Venezuela", iso_a2: "VE" },
    "704": { name: "Vietnam", iso_a2: "VN" },
    "887": { name: "Yemen", iso_a2: "YE" },
    "894": { name: "Zambia", iso_a2: "ZM" },
    "716": { name: "Zimbabwe", iso_a2: "ZW" },
    "010": { name: "Antarctica", iso_a2: "AQ" },
    "260": { name: "Fr. S. Antarctic Lands", iso_a2: "TF" },
    "732": { name: "W. Sahara", iso_a2: "EH" },
    "702": { name: "Singapore", iso_a2: "SG" }
  };
}

// ── Country Click Handler ──
function handleCountryClick(polygon, event, { lat, lng }) {
  if (!polygon) return;

  selectedCountry = polygon;
  const props = polygon.properties;
  const code = props.iso_a2;
  const name = props.name;

  // Re-render polygon styles
  globe
    .polygonAltitude(d => d === selectedCountry ? 0.02 : 0.006)
    .polygonCapColor(d => {
      if (d === selectedCountry) return 'rgba(0, 180, 255, 0.45)';
      if (d === hoveredCountry) return 'rgba(100, 200, 255, 0.2)';
      return 'rgba(255, 255, 255, 0)';
    });

  // Fly camera to country
  globe.pointOfView({ lat, lng, altitude: 1.8 }, 1000);

  // Show info panel
  showCountryInfo(code, name);

  // Pause auto-rotate briefly
  globe.controls().autoRotate = false;
}

// ── Country Hover Handler ──
function handleCountryHover(polygon) {
  hoveredCountry = polygon;
  globe.polygonCapColor(d => {
    if (d === selectedCountry) return 'rgba(0, 180, 255, 0.45)';
    if (d === hoveredCountry) return 'rgba(100, 200, 255, 0.2)';
    return 'rgba(255, 255, 255, 0)';
  });

  // Change cursor
  document.body.style.cursor = polygon ? 'pointer' : 'default';
}

// ── Show Country Info Panel ──
function showCountryInfo(code, name) {
  const panel = document.getElementById('info-panel');
  const facts = countryFacts[code];

  if (!facts) {
    // Country not in our database — show basic info
    document.getElementById('info-name').textContent = name;
    document.getElementById('info-flag').textContent = '';
    document.getElementById('info-capital').textContent = '—';
    document.getElementById('info-population').textContent = '—';
    document.getElementById('info-continent').textContent = '—';
    document.getElementById('info-languages').textContent = '—';
    document.getElementById('info-fact-text').textContent = 'No facts available yet for this country.';
    panel.classList.add('visible');
    return;
  }

  document.getElementById('info-name').textContent = facts.name;
  document.getElementById('info-flag').textContent = facts.flag;
  document.getElementById('info-capital').textContent = facts.capital;
  document.getElementById('info-population').textContent = facts.population;
  document.getElementById('info-continent').textContent = facts.continent;
  document.getElementById('info-languages').textContent = facts.languages.join(', ');

  showRandomFact(facts.facts);
  panel.classList.add('visible');

  // Wire up "new fact" button
  const btn = document.getElementById('btn-new-fact');
  btn.onclick = () => showRandomFact(facts.facts);
}

let lastFactIndex = -1;
function showRandomFact(factsArray) {
  let idx;
  do {
    idx = Math.floor(Math.random() * factsArray.length);
  } while (idx === lastFactIndex && factsArray.length > 1);
  lastFactIndex = idx;
  document.getElementById('info-fact-text').textContent = factsArray[idx];
}

// ── Moon ──
function addMoon() {
  const scene = globe.scene();
  const globeRadius = globe.getGlobeRadius();

  const moonGeometry = new THREE.SphereGeometry(globeRadius * 0.27, 32, 32);
  const moonTexture = new THREE.TextureLoader().load(MOON_TEXTURE);
  const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
  moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  scene.add(moonMesh);

  // Animate moon orbit
  function animateMoon() {
    requestAnimationFrame(animateMoon);
    const t = Date.now() * 0.0001;
    const orbitX = globeRadius * 4;
    const orbitZ = globeRadius * 3.5;
    const inclination = 0.087;

    moonMesh.position.x = orbitX * Math.cos(t);
    moonMesh.position.y = orbitX * Math.sin(t) * Math.sin(inclination);
    moonMesh.position.z = orbitZ * Math.sin(t);
    moonMesh.rotation.y += 0.001;
  }
  animateMoon();
}

// ── UI Setup ──
function setupUI() {
  // Close info panel
  document.getElementById('info-close').addEventListener('click', () => {
    document.getElementById('info-panel').classList.remove('visible');
    selectedCountry = null;
    globe
      .polygonAltitude(() => 0.006)
      .polygonCapColor(d => {
        if (d === hoveredCountry) return 'rgba(100, 200, 255, 0.2)';
        return 'rgba(255, 255, 255, 0)';
      });
  });

  // Toggle auto-rotate
  document.getElementById('btn-rotate').addEventListener('click', () => {
    autoRotate = !autoRotate;
    globe.controls().autoRotate = autoRotate;
    document.getElementById('btn-rotate').classList.toggle('active', autoRotate);
  });

  // Mark rotate active initially
  document.getElementById('btn-rotate').classList.add('active');
}

// ── Start ──
init();