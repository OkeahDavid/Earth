const API_BASE = 'https://metrics-hub.netlify.app/api';

export async function trackCountryClick(countryCode, countryName) {
  try {
    await fetch(`${API_BASE}/country-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country_code: countryCode, name: countryName }),
      keepalive: true
    });
  } catch (err) {
    console.error('Country tracking error:', err);
  }
}

export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Leaderboard fetch error:', err);
    return [];
  }
}
