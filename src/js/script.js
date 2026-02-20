/* API */
const BASE_URL = 'https://gnews.io/api/v4';
const API_KEY = 'd0ed69c8eabc419e760efff246f557b7';

const fetchNewsByCategory = async (category) => {
    const response = await fetch(
        `${BASE_URL}/top-headlines?token=${API_KEY}&lang=pt&topic=${category}`
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
        <h2>${article.title}</h2>
        <p>${article.source?.name || 'Fonte desconhecida'} • ${formatDate(article.publishedAt)}</p>
        <p>${article.description || ''}</p>
        <a href="${article.url}" target="_blank" rel="noopener">Ler noticia completa</a>
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
                <h3>${article.title}</h3>
                <p>${article.source?.name || 'Fonte desconhecida'} • ${formatDate(article.publishedAt)}</p>
                <p>${article.description || ''}</p>
                <a href="${article.url}" target="_blank" rel="noopener">Ler noticia</a>
            </article>
        `
        )
        .join('');
};

const loadCategory = async (category, button) => {
    try {
        setActiveButton(button);
        featuredSection.innerHTML = '<p>Carregando...</p>';
        newsList.innerHTML = '';

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

if (buttons.length) {
    loadCategory(buttons[0].dataset.category, buttons[0]);
}