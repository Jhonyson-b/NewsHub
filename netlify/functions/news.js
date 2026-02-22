const BASE_URL = 'https://gnews.io/api/v4';
const CATEGORY_QUERIES = {
    technology: 'tecnologia OR IA OR software OR hardware OR aplicativos OR internet OR gadgets OR inovacao OR smartphones OR notebooks',
    economy: 'economia OR mercado OR negocios OR inflacao OR juros OR bolsa OR investimentos OR financas',
    science: 'ciencia OR pesquisa OR espaco OR astronomia OR medicina',
    health: 'saude OR medicina OR hospitais OR vacinas OR bem-estar',
    sports: 'esportes OR futebol OR basquete OR tenis OR formula 1 OR olimpiadas OR campeonatos OR atletas'
};

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };
    }

    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Missing GNEWS_API_KEY' })
        };
    }

    const params = new URLSearchParams(event.queryStringParameters || {});
    const q = params.get('q') || '';
    const category = params.get('category') || '';
    const query = q || CATEGORY_QUERIES[category] || category;

    if (!query) {
        return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Missing query' })
        };
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}/search?token=${apiKey}&lang=pt&q=${encodedQuery}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return {
            statusCode: response.status,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Failed to fetch news' })
        };
    }
};
