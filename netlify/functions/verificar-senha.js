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
    const body = JSON.parse(event.body);
    const { senha } = body;

    if (senha === process.env.RELATORIO_SENHA) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Erro' }) };
  }
};
