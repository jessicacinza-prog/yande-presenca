const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const body = JSON.parse(event.body);
    const { mesAno, senha } = body; // mesAno formato 'YYYY-MM'

    if (senha !== process.env.RELATORIO_SENHA) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Senha incorreta' }) };
    }

    if (!mesAno) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Mês não informado' }) };
    }

    await sql`DELETE FROM presencas WHERE to_char(data, 'YYYY-MM') = ${mesAno}`;

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Erro ao limpar:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Erro ao apagar dados' }) };
  }
};
