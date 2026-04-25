# Earth 2.0

An interactive 3D globe where you can click on any country to discover random facts, explore country data, and see which countries are trending worldwide.

## Preview
![2023-11-26 (6)](https://github.com/OkeahDavid/Earth/assets/82973470/734c9bdf-eacf-4a01-95de-2193f522a5e3)

## Features
- **Interactive Globe** — Click any country to view its flag, capital, population, languages, and a random fun fact
- **80+ Countries** — Locally stored facts for over 80 countries with 5 unique facts each
- **Country Highlighting** — Hover to highlight borders, click to select with fly-to camera animation
- **Trending Leaderboard** — See the top 10 most clicked countries across all users worldwide
- **Moon Orbit** — Realistic orbiting moon with textured surface
- **Auto-Rotate** — Globe spins automatically with a toggle to pause
- **Responsive** — Works on desktop and mobile devices

## Usage
- **Click** a country on the globe to see its info and a random fact
- **Drag** to rotate the globe manually
- **Scroll** to zoom in and out
- Click **"Show Another Fact"** to cycle through facts for the selected country
- Click **"Trending"** to view the most explored countries
- Click **"Rotate"** to toggle auto-rotation

## Tech Stack
- **[globe.gl](https://globe.gl)** — WebGL globe with built-in country polygon rendering and interaction
- **[Three.js](https://threejs.org)** — 3D rendering (bundled with globe.gl), used for moon orbit
- **[Parcel](https://parceljs.org)** — Bundler for development and production builds
- **[Neon](https://neon.tech)** — Serverless PostgreSQL for tracking country click counts
- **[Netlify Functions](https://www.netlify.com/products/functions/)** — Serverless API endpoints for click tracking and leaderboard

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
│   ├── api.js              # API helpers (country tracking + leaderboard)
│   └── metrics-tracking.js # Analytics tracking
├── data/
│   └── country-facts.json  # Facts database for 80+ countries
├── textures/               # Earth and moon textures
├── netlify-functions/       # Serverless functions (deploy to metrics-hub)
│   ├── country-click.js    # POST: track country clicks
│   └── leaderboard.js      # GET: top 10 countries
└── .env                    # Database connection string (not committed)
```

## Environment Variables
Create a `.env` file in the root (already in `.gitignore`):
```
DATABASE_URL=your_neon_connection_string
```

For deployed Netlify functions, set `DATABASE_URL` in your Netlify site's environment variables.

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
