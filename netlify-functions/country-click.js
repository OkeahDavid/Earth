// Netlify Function: netlify/functions/country-click.js
// Deploy this to your metrics-hub.netlify.app project
// Requires @neondatabase/serverless package and DATABASE_URL env var

const { neon } = require('@neondatabase/serverless');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { country_code, name } = JSON.parse(event.body);

    if (!country_code || !name) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing country_code or name' }) };
    }

    // Sanitize: only allow alpha-2 codes (2 uppercase letters)
    if (!/^[A-Z]{2}$/.test(country_code)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid country code' }) };
    }

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO country_searches (country_code, name, search_count, last_searched)
      VALUES (${country_code}, ${name}, 1, NOW())
      ON CONFLICT (country_code)
      DO UPDATE SET search_count = country_searches.search_count + 1, last_searched = NOW()
    `;

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('country-click error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
