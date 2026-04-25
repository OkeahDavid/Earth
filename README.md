# Earth

An interactive 3D globe where you can click on any country to discover random facts and explore country data.

## Preview
![2023-11-26 (6)](https://github.com/OkeahDavid/Earth/assets/82973470/734c9bdf-eacf-4a01-95de-2193f522a5e3)

## Features
- **Interactive Globe** — Click any country to view its flag, capital, population, languages, and a random fun fact
- **80+ Countries** — Locally stored facts for over 80 countries with 5 unique facts each
- **Country Highlighting** — Hover to highlight borders, click to select with fly-to camera animation
- **Moon Orbit** — Realistic orbiting moon with textured surface
- **Auto-Rotate** — Globe spins automatically with a toggle to pause
- **Responsive** — Works on desktop and mobile devices

## Usage
- **Click** a country on the globe to see its info and a random fact
- **Drag** to rotate the globe manually
- **Scroll** to zoom in and out
- Click **"Show Another Fact"** to cycle through facts for the selected country
- Click **"Rotate"** to toggle auto-rotation

## Tech Stack
- **[globe.gl](https://globe.gl)** — WebGL globe with built-in country polygon rendering and interaction
- **[Three.js](https://threejs.org)** — 3D rendering (bundled with globe.gl), used for moon orbit
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
│   ├── script.js           # Main globe logic (globe.gl + moon + interactions)
│   └── metrics-tracking.js # Analytics tracking
├── data/
│   └── country-facts.json  # Facts database for 80+ countries
└── textures/               # Earth and moon textures
```

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
