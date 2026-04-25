import Globe from 'globe.gl';
import countryFacts from '../data/country-facts.json';
import COUNTRY_ID_MAP from './country-map.js';
import { addStars, addDayNightLighting, addMoon } from './scene.js';

const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const EARTH_TEXTURE = new URL('../textures/earthmap10k.jpg', import.meta.url).href;

let globe;
let selectedCountry = null;
let hoveredCountry = null;
let autoRotate = true;

// ── Initialize ──
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
    .polygonLabel(d => `<div class="scene-tooltip">${d.properties.name}</div>`)
    .onPolygonClick(handleCountryClick)
    .onPolygonHover(handleCountryHover)
    .polygonsTransitionDuration(200);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.4;
  globe.controls().enableDamping = true;

  await loadCountries();

  addStars(globe);
  addDayNightLighting(globe);
  addMoon(globe);

  setupUI();
  setupKeyboard();

  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 1500);
}

// ── Load Countries ──
async function loadCountries() {
  try {
    const topojson = await import('topojson-client');
    const res = await fetch(GEOJSON_URL);
    const world = await res.json();
    const countries = topojson.feature(world, world.objects.countries).features;

    countries.forEach(c => {
      const info = COUNTRY_ID_MAP[c.id];
      if (info) {
        c.properties = { ...c.properties, name: info.name, iso_a2: info.iso_a2 };
      }
    });

    globe.polygonsData(countries);
  } catch (err) {
    console.error('Failed to load countries:', err);
  }
}

// ── Country Click ──
function handleCountryClick(polygon, event, { lat, lng }) {
  if (!polygon) return;

  selectedCountry = polygon;
  const { iso_a2: code, name } = polygon.properties;

  globe
    .polygonAltitude(d => d === selectedCountry ? 0.02 : 0.006)
    .polygonCapColor(d => {
      if (d === selectedCountry) return 'rgba(0, 180, 255, 0.45)';
      if (d === hoveredCountry) return 'rgba(100, 200, 255, 0.2)';
      return 'rgba(255, 255, 255, 0)';
    });

  globe.pointOfView({ lat, lng, altitude: 1.8 }, 1000);
  showCountryInfo(code, name);
  globe.controls().autoRotate = false;
}

// ── Country Hover ──
function handleCountryHover(polygon) {
  hoveredCountry = polygon;
  globe.polygonCapColor(d => {
    if (d === selectedCountry) return 'rgba(0, 180, 255, 0.45)';
    if (d === hoveredCountry) return 'rgba(100, 200, 255, 0.2)';
    return 'rgba(255, 255, 255, 0)';
  });
  document.body.style.cursor = polygon ? 'pointer' : 'default';
}

// ── Info Panel ──
function showCountryInfo(code, name) {
  const panel = document.getElementById('info-panel');
  const facts = countryFacts[code];

  if (!facts) {
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

  document.getElementById('btn-new-fact').onclick = () => showRandomFact(facts.facts);
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

// ── Close Panel Helper ──
function closePanel() {
  document.getElementById('info-panel').classList.remove('visible');
  selectedCountry = null;
  globe
    .polygonAltitude(() => 0.006)
    .polygonCapColor(d => {
      if (d === hoveredCountry) return 'rgba(100, 200, 255, 0.2)';
      return 'rgba(255, 255, 255, 0)';
    });
}

function toggleRotation() {
  autoRotate = !autoRotate;
  globe.controls().autoRotate = autoRotate;
  document.getElementById('btn-rotate').classList.toggle('active', autoRotate);
}

// ── UI ──
function setupUI() {
  document.getElementById('info-close').addEventListener('click', closePanel);
  document.getElementById('btn-rotate').addEventListener('click', toggleRotation);
  document.getElementById('btn-rotate').classList.add('active');
}

// ── Keyboard ──
function setupKeyboard() {
  document.addEventListener('keydown', (e) => {
    const pov = globe.pointOfView();
    const step = 5;

    switch (e.key) {
      case 'ArrowLeft':  globe.pointOfView({ lng: pov.lng - step }, 200); break;
      case 'ArrowRight': globe.pointOfView({ lng: pov.lng + step }, 200); break;
      case 'ArrowUp':    globe.pointOfView({ lat: Math.min(pov.lat + step, 90) }, 200); break;
      case 'ArrowDown':  globe.pointOfView({ lat: Math.max(pov.lat - step, -90) }, 200); break;
      case '+': case '=': globe.pointOfView({ altitude: Math.max(pov.altitude * 0.85, 0.5) }, 200); break;
      case '-':          globe.pointOfView({ altitude: Math.min(pov.altitude * 1.15, 10) }, 200); break;
      case 'Escape':     closePanel(); break;
      case ' ':          e.preventDefault(); toggleRotation(); break;
    }
  });
}

// ── Start ──
init();