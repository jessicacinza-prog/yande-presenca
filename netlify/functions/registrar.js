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

    await sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'presencas' AND column_name = 'id' AND is_identity = 'NO'
        ) THEN
          DROP TABLE presencas;
        END IF;
      END $$;
    `;

    // Garante que a tabela existe
    await sql`
      CREATE TABLE IF NOT EXISTS presencas (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        data DATE NOT NULL,
        hora TEXT NOT NULL,
        distancia INTEGER,
        perto BOOLEAN,
        criado_em TIMESTAMPTZ DEFAULT now()
      )
    `;

    const body = JSON.parse(event.body);
    const { nome, tipo, data, hora, distancia, perto } = body;

    if (!nome || !tipo || !data || !hora) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Dados incompletos' }) };
    }

    const [{ id }] = await sql`
      INSERT INTO presencas (nome, tipo, data, hora, distancia, perto)
      VALUES (${nome.trim()}, ${tipo}, ${data}, ${hora}, ${distancia ?? null}, ${perto ?? null})
      RETURNING id
    `;

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id }) };
  } catch (err) {
    console.error('Erro ao registrar:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Erro ao salvar no banco' }) };
  }
};
