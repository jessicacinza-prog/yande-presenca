const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    await sql`
      CREATE TABLE IF NOT EXISTS presencas (
        id BIGINT PRIMARY KEY,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        data DATE NOT NULL,
        hora TEXT NOT NULL,
        distancia INTEGER,
        perto BOOLEAN,
        criado_em TIMESTAMPTZ DEFAULT now()
      )
    `;

    const rows = await sql`SELECT id, nome, tipo, to_char(data, 'YYYY-MM-DD') as data, hora, distancia, perto FROM presencas ORDER BY id ASC`;

    return { statusCode: 200, headers, body: JSON.stringify({ dados: rows }) };
  } catch (err) {
    console.error('Erro ao listar:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Erro ao buscar dados' }) };
  }
};
