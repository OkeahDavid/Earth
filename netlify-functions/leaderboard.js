// Netlify Function: netlify/functions/leaderboard.js
// Deploy this to your metrics-hub.netlify.app project
// Requires @neondatabase/serverless package and DATABASE_URL env var

const { neon } = require('@neondatabase/serverless');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const rows = await sql`
      SELECT country_code, name, search_count
      FROM country_searches
      ORDER BY search_count DESC
      LIMIT 10
    `;

    return { statusCode: 200, headers, body: JSON.stringify(rows) };
  } catch (err) {
    console.error('leaderboard error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
