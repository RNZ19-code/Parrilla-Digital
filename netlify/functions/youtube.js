// Proxy seguro — la API Key vive aquí en el servidor, nunca en el cliente
exports.handler = async (event) => {
  const YT_KEY = process.env.YT_API_KEY;
 
  if (!YT_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API Key no configurada en el servidor' })
    };
  }
 
  // Construir URL de YouTube con la key secreta
  const params   = event.queryStringParameters || {};
  const endpoint = params.endpoint || 'channels';
  delete params.endpoint;
 
  const ytUrl = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => ytUrl.searchParams.set(k, v));
  ytUrl.searchParams.set('key', YT_KEY);
 
  try {
    const res  = await fetch(ytUrl.toString());
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
 
