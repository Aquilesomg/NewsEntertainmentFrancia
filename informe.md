# Informe de Uso de Endpoints - News Entertainment Francia

Este documento detalla los 6 endpoints y consultas utilizados en el desarrollo de la aplicación, conectándose a la API de **thenewsapi.com**.

## Configuración General
- **País:** Francia (locale=fr)
- **Categoría:** Entertainment (entertainment)
- **Idioma:** Francés (language=fr)

---

## 1. Últimas Noticias (Endpoint: /v1/news/all)
- **Función:** `latestNews()`
- **Descripción:** Recupera la lista general de noticias de entretenimiento en Francia, ordenadas por fecha de publicación descendente.
- **Parámetros clave:** `sort=published_desc`.

## 2. Tendencias / Top Stories (Endpoint: /v1/news/top)
- **Función:** `topNews()`
- **Descripción:** Accede a las noticias más relevantes y destacadas del momento (headlines) en la región seleccionada.
- **Diferencia:** Este endpoint prioriza la relevancia sobre la cronología.

## 3. Fuentes Disponibles (Endpoint: /v1/news/sources)
- **Función:** `getSources()`
- **Descripción:** Obtiene un listado de los medios de comunicación y dominios que proveen noticias para la región de Francia.
- **Uso:** Útil para que el usuario conozca de dónde proviene la información.

## 4. Búsqueda por Palabra Clave (Endpoint: /v1/news/all + Search)
- **Función:** `searchNews()`
- **Descripción:** Filtra el universo de noticias de entretenimiento buscando coincidencias en el título o descripción con el término ingresado por el usuario.
- **Parámetros clave:** `search=[término_usuario]`.

## 5. Filtrado por Fecha (Endpoint: /v1/news/all + Date)
- **Función:** `newsByDate()`
- **Descripción:** Permite al usuario consultar eventos ocurridos en una fecha específica del calendario.
- **Parámetros clave:** `published_on=[AAAA-MM-DD]`.

## 6. Filtrado por Fuente Específica (Endpoint: /v1/news/all + Domain)
- **Función:** `newsBySource(domain)`
- **Descripción:** Restringe los resultados a una fuente de confianza predefinida, en este caso `arte.tv` (un canal cultural franco-alemán de gran prestigio).
- **Parámetros clave:** `domains=arte.tv`.

---

## Enlace de la Aplicación
- **URL (Surge/GitHub Pages):** [PENDIENTE DE DESPLIEGUE]

### Manejo de Errores
Se implementó un bloque `try-catch` en la función principal `fetchNews` que captura problemas de red o de autenticación, mostrando un mensaje descriptivo en la interfaz en lugar de fallar silenciosamente.
