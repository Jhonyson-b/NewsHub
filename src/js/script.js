/* API */
const BASE_URL = 'https://gnews.io/api/v4';
const API_KEY = 'd0ed69c8eabc419e760efff246f557b7';
const CATEGORY_QUERIES = {
    technology: 'tecnologia OR IA OR software OR hardware OR aplicativos OR internet OR gadgets OR inovação OR smartphones OR notebooks',
    economy: 'economia OR mercado OR negocios OR inflacao OR juros OR bolsa OR investimentos OR finançass',
    science: 'ciencia OR pesquisa OR espac\u0327o OR astronomia OR medicina',
    health: 'saude OR medicina OR hospitais OR vacinas',
    sports: 'esportes OR futebol OR basquete OR tenis OR formula 1 OR olimpíadas OR campeonatos OR atletas',
};
// Troque para false quando for usar a API real.
const USE_MOCK_DATA = false;

const MOCK_DATA = {
    articles: [
        {
            title: 'Noticia destaque para layout',
            description: 'Resumo curto apenas para testar o design do card em destaque. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque, rem quisquam illum, assumenda excepturi alias, repudiandae nesciunt soluta quos et debitis id animi a minima? Alias, expedita. Praesentium, dignissimos dolores? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque, rem quisquam illum, assumenda excepturi alias, repudiandae nesciunt soluta quos et debitis id animi a minima? Alias, expedita. Praesentium, dignissimos dolores?',
            publishedAt: '2026-02-20T10:00:00Z',
            url: '#',
            source: { name: 'NewsHub' }
        },
        {
            title: 'Outra noticia para testar a lista',
            description: 'Texto de exemplo para alinhar fontes, espacos e links.a excepturi alias, repudiandae nesciunt soluta quos et debitis id animi a minima? Alias, expedita. Praesentium, dignissimos dolores? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque, rem quisquam illum, assumenda excepturi alias, repudiandae nesciunt soluta quos et debitis id animi a minima? Alias, expedita. Praesentium, dignissimos dolores?',
            publishedAt: '2026-02-20T09:00:00Z',
            url: '#',
            source: { name: 'NewsHub' }
        },
        {
            title: 'Mais uma noticia simulada',
            description: 'Esse conteudo e apenas temporario para estilizacao.',
            publishedAt: '2026-02-19T18:30:00Z',
            url: '#',
            source: { name: 'NewsHub' }
        }
    ]
};

const fetchNewsByCategory = async (category) => {
    if (USE_MOCK_DATA) {
        return MOCK_DATA;
    }
    const query = CATEGORY_QUERIES[category] || category; // Usa palavras-chave da categoria (fallback para o nome)
    const encodedQuery = encodeURIComponent(query); // Garante que a busca funcione na URL
    const response = await fetch(
        `${BASE_URL}/search?token=${API_KEY}&lang=pt&q=${encodedQuery}`
);

    if (!response.ok) {
        throw new Error('Erro ao buscar as noticias');
    }

    return await response.json();
};

/* DOM */
const categoryNav = document.querySelector('.category-navigation');
const buttons = document.querySelectorAll('.category-navigation .btn');
const featuredSection = document.querySelector('.featured-news');
const newsList = document.querySelector('.news');

featuredSection.classList.add('oculto');
newsList.classList.add('oculto');

const setActiveButton = (activeButton) => {
    buttons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
};

const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
};

const renderFeatured = (article) => {
    if (!article) {
        featuredSection.innerHTML = '<p>Nenhuma noticia encontrada.</p>';
        return;
    }

    featuredSection.innerHTML = `
        <h2 class="title">${article.title}</h2>
        <p class="news-source">${article.source?.name || 'Fonte desconhecida'} • ${formatDate(article.publishedAt)}</p>
        <p class="description">${article.description || ''}</p>
        <a class="link" href="${article.url}" target="_blank" rel="noopener">Ler noticia completa</a>
    `;
};

const renderList = (articles) => {
    if (!articles.length) {
        newsList.innerHTML = '<p>Nenhuma noticia disponivel.</p>';
        return;
    }

    newsList.innerHTML = articles
        .map(
            (article) => `
            <article>
                <div class="news-container">
                    <h3 class="title">${article.title}</h3>
                    <p class="news-source">${article.source?.name || 'Fonte desconhecida'} • ${formatDate(article.publishedAt)}</p>
                    <p class="description">${article.description || ''}</p>
                    <a class="link" href="${article.url}" target="_blank" rel="noopener">Ler noticia</a>
                </div>
            </article>
        `
        )
        .join('');
};

const loadCategory = async (category, button) => {
    try {
        setActiveButton(button);
        featuredSection.innerHTML = '<p>Carregando...</p>';
        newsList.innerHTML = '<p>Carregando...</p>';

        featuredSection.classList.remove('oculto');
        newsList.classList.remove('oculto');

        const data = await fetchNewsByCategory(category);
        const articles = data.articles || [];

        renderFeatured(articles[0]);
        renderList(articles.slice(1));
    } catch (error) {
        featuredSection.innerHTML = '<p>Erro ao carregar noticias.</p>';
        newsList.innerHTML = '';
        console.error(error);
    }
};

categoryNav.addEventListener('click', (event) => {
    const button = event.target.closest('.btn');
    if (!button) return;

    const category = button.dataset.category;
    if (!category) return;

    loadCategory(category, button);
});

