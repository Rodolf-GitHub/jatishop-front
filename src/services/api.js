import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const services = {
  // Marketplace
  getStores: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.provincia) queryParams.append("provincia", params.provincia);
    if (params.municipio) queryParams.append("municipio", params.municipio);
    if (params.search) queryParams.append("search", params.search);

    return api.get(`/marketplace/negocios/?${queryParams.toString()}`);
  },
  getMarketplaceProducts: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.provincia) queryParams.append("provincia", params.provincia);
    if (params.municipio) queryParams.append("municipio", params.municipio);
    if (params.search) queryParams.append("search", params.search);

    return api.get(`/marketplace/productos/?${queryParams.toString()}`);
  },

  // Tienda específica
  getStore: (slug) => api.get(`/tienda/${slug}/`),

  // Categorías
  getCategorias: (slug) => api.get(`/tienda/${slug}/categorias/`),
  getCategoria: (slug, id) => api.get(`/tienda/${slug}/categorias/${id}/`),

  // Subcategorías
  getSubcategorias: (slug) => api.get(`/tienda/${slug}/subcategorias/`),
  getSubcategoria: (slug, id) =>
    api.get(`/tienda/${slug}/subcategorias/${id}/`),

  // Productos
  getProductos: (slug, page = 1, pageSize = 20) =>
    api.get(`/tienda/${slug}/productos/?page=${page}&page_size=${pageSize}`),
  getProductosDestacados: (slug) =>
    api.get(`/tienda/${slug}/productos/destacados/`),
  getProductosPorCategoria: (slug, categoriaId) =>
    api.get(`/tienda/${slug}/productos/categoria/`, {
      params: { categoria_id: categoriaId },
    }),
  getProductosPorSubcategoria: (slug, subcategoriaId) =>
    api.get(`/tienda/${slug}/productos/subcategoria/`, {
      params: { subcategoria_id: subcategoriaId },
    }),
  getProducto: (slug, id) => api.get(`/tienda/${slug}/productos/${id}/`),

  buscarProductos(slug, query, categoriaId = null) {
    let url = `/tienda/${slug}/productos/buscar/?search=${query}`;
    if (categoriaId) {
      url += `&categoria=${categoriaId}`;
    }
    return api.get(url);
  },

  // Productos específicos de una tienda con paginación
  getProductosPorTienda: (slug, page = 1, pageSize = 20) =>
    api.get(`/tienda/${slug}/productos/todos/`, {
      params: {
        page,
        page_size: pageSize,
      },
    }),

  getStoreProducts: (storeSlug, page = 1) => {
    return api.get(`/tienda/${storeSlug}/productos/`, {
      params: { page },
    });
  },

  // Obtener lista de provincias
  getProvincias() {
    return api.get("/ubicaciones/provincias/");
  },

  // Obtener municipios de una provincia específica - Corregida la URL
  getMunicipios(provincia) {
    return api.get(`/ubicaciones/municipios/${encodeURIComponent(provincia)}/`);
  },
};

// Interceptor para debugging
api.interceptors.request.use(
  (config) => {
    console.log("Request Config:", {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("Response Data Type:", typeof response.data);
    console.log("Response Headers:", response.headers);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  },
);

export default api;
