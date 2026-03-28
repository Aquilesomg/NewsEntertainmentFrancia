/**
 * Configuración global para la API de The News API.
 * @constant {string} API_TOKEN - Token de autorización.
 * @constant {string} BASE_URL - URL base de la API.
 */
const API_TOKEN = "9asFlDq4r9eLsjxt5WdypDdyGPBR0EN5og6hP1fd";
const BASE_URL = "https://api.thenewsapi.com/v1/news";
const container = document.getElementById("news");

/**
 * Función genérica para realizar peticiones a la API.
 * Implementa el manejo de errores y estados de carga.
 * 
 * @async
 * @param {string} endpoint - El endpoint específico (all, top, sources).
 * @param {string} params - Parámetros de consulta adicionales.
 */
async function fetchNews(endpoint, params = "") {
    // Mostrar estado de carga
    container.innerHTML = "<div class='loading'><h2>Cargando noticias...</h2></div>";

    const url = `${BASE_URL}/${endpoint}?locale=fr&categories=entertainment&language=fr&api_token=${API_TOKEN}${params}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();

        // Manejar diferentes estructuras de respuesta (noticias vs fuentes)
        if (endpoint === "sources") {
            displaySources(data.data);
        } else {
            displayNews(data.data);
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        container.innerHTML = `
            <div class="error">
                <h2>Ocurrió un problema</h2>
                <p>No se pudo conectar con la API. Verifica tu conexión o el token.</p>
                <p><small>${error.message}</small></p>
            </div>
        `;
    }
}

/**
 * Renderiza las noticias en el contenedor principal.
 * @param {Array} articles - Arreglo de objetos de noticias.
 */
function displayNews(articles) {
    container.innerHTML = "";

    if (!articles || articles.length === 0) {
        container.innerHTML = "<h2>No se encontraron resultados para esta búsqueda.</h2>";
        return;
    }

    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "card";

        // Estructura de la tarjeta con imagen, título y descripción
        card.innerHTML = `
            <img src="${article.image_url || 'https://via.placeholder.com/400x200?text=Sin+Imagen'}" alt="${article.title}">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description || "Sin descripción disponible."}</p>
                <p class="source-tag">Fuente: <b>${article.source}</b></p>
                <a href="${article.url}" target="_blank" class="btn-more">Leer noticia completa</a>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Renderiza la lista de fuentes disponibles.
 * @param {Array} sources - Arreglo de objetos de fuentes.
 */
function displaySources(sources) {
    container.innerHTML = "<div class='sources-list'><h2>Fuentes de noticias soportadas:</h2><ul></ul></div>";
    const list = container.querySelector("ul");

    if (!sources || sources.length === 0) {
        container.innerHTML = "<h2>No se encontraron fuentes disponibles actualmente.</h2>";
        return;
    }

    sources.forEach(source => {
        const li = document.createElement("li");
        // Usar el nombre si existe, de lo cual contrario usar el dominio capitalizado
        const displayName = source.name || source.domain.split('.')[0].toUpperCase();
        li.textContent = `${displayName} (${source.domain})`;
        li.className = "source-item";
        list.appendChild(li);
    });
}

/**
 * Endpoint 1: Noticias Generales (all)
 * Obtiene todas las noticias de entretenimiento de Francia.
 */
function latestNews() {
    fetchNews("all", "&sort=published_desc");
}

/**
 * Endpoint 2: Tendencias (top)
 * Obtiene las historias más relevantes (headlines).
 */
function topNews() {
    fetchNews("top", "");
}

/**
 * Endpoint 3: Fuentes (sources)
 * Lista las fuentes de noticias locales disponibles.
 */
function getSources() {
    fetchNews("sources", "");
}

/**
 * Endpoint 4: Búsqueda por palabra (all + search)
 * Permite filtrar noticias por un término específico.
 */
function searchNews() {
    const word = document.getElementById("searchInput").value.trim();

    if (!word) {
        alert("Por favor, ingresa un término de búsqueda.");
        return;
    }

    fetchNews("all", `&search=${word}`);
}

/**
 * Endpoint 5: Filtrado por Fecha (all + published_on)
 * Obtiene noticias publicadas en un día específico.
 */
function newsByDate() {
    const date = document.getElementById("dateInput").value;

    if (!date) {
        alert("Por favor, selecciona una fecha válida.");
        return;
    }

    fetchNews("all", `&published_on=${date}`);
}

/**
 * Endpoint 6: Filtrado por Fuente Específica (all + source)
 * Obtiene noticias exclusivamente de una fuente dada.
 * @param {string} sourceId - El dominio de la fuente (ej. arte.tv).
 */
function newsBySource(sourceId) {
    fetchNews("all", `&domains=${sourceId}`);
}

/**
 * Limpia los resultados actuales.
 */
function clearResults() {
    container.innerHTML = "<h2>Resultados limpiados. Selecciona una opción del menú.</h2>";
}

// Inicialización: Carga las noticias más recientes al entrar.
latestNews();
