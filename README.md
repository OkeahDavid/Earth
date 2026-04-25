# Earth

An interactive 3D globe where you can click on any country to discover random facts and explore country data — featuring 195 countries, local time display, an orbiting moon, and a starfield background.

## Preview
![2023-11-26 (6)](https://github.com/OkeahDavid/Earth/assets/82973470/734c9bdf-eacf-4a01-95de-2193f522a5e3)

## Features
- **Interactive Globe** — Click any country to view its flag, capital, population, languages, and a random fun fact
- **195 Countries** — Locally stored facts for 195 countries with 5 unique facts each
- **Country Highlighting** — Hover to highlight borders, click to select with fly-to camera animation
- **Local Time** — Shows the selected country's current local time, live-updating every second
- **Clickable Clock** — Click the clock in the top bar to cycle through 6 time formats (12h, 24h, with date, etc.) — preference saved in localStorage
- **Stars Background** — 10,000-particle starfield surrounding the globe
- **Moon Orbit** — Realistic orbiting moon with textured surface
- **Keyboard Navigation** — Arrow keys to pan, +/- to zoom, Space to toggle rotation, Escape to close
- **Auto-Rotate** — Globe spins automatically with a toggle to pause
- **Responsive** — Works on desktop and mobile devices with touch support

## Usage
- **Click** a country on the globe to see its info and a random fact
- **Drag** to rotate the globe manually (or swipe on mobile)
- **Scroll** to zoom in and out (or pinch on mobile)
- **Arrow keys** to pan the camera
- **+/-** to zoom in/out
- **Space** to toggle auto-rotation
- **Escape** to close the info panel
- Click **"Show Another Fact"** to cycle through facts for the selected country
- Click **"Rotate"** to toggle auto-rotation
- **Click the clock** to cycle time formats (12h, 24h, date+time, etc.)

## Tech Stack
- **[globe.gl](https://globe.gl)** — WebGL globe with built-in country polygon rendering and interaction
- **[Three.js](https://threejs.org)** — 3D rendering (bundled with globe.gl), used for stars and moon orbit
- **[topojson-client](https://github.com/topojson/topojson-client)** — Converts TopoJSON world-atlas data to GeoJSON
- **[Parcel](https://parceljs.org)** — Bundler for development and production builds

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation
```bash
git clone https://github.com/OkeahDavid/Earth.git
cd Earth
npm install
```

### Development
```bash
npm start
```
Opens a dev server at `http://localhost:1234`.

### Production Build
```bash
npm run build
```
Output goes to the `dist/` directory.

## Project Structure
```
├── index.html              # Entry point
├── css/styles.css          # Styles for UI panels
├── js/
│   ├── script.js           # Main entry point (globe init, interactions, UI)
│   ├── country-map.js      # ISO 3166-1 numeric → alpha-2 country mapping
│   ├── scene.js            # Stars and moon orbit
│   ├── timezones.js        # ISO alpha-2 → IANA timezone mapping
│   └── metrics-tracking.js # Analytics tracking
├── data/
│   └── country-facts.json  # Facts database for 195 countries
└── textures/               # Earth and moon textures
```

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
