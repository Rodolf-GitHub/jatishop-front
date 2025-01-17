import axios from "axios";
import { services } from "./api"; // Importamos los servicios generales

const API_URL = import.meta.env.VITE_API_BASE_URL;

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para añadir el token a las peticiones
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminServices = {
  // Autenticación
  login: async (credentials) => {
    const response = await adminApi.post("/auth/login/", credentials);
    // Guardar datos del usuario en localStorage
    if (response.data) {
      localStorage.setItem("admin_token", response.data.token);
      localStorage.setItem("admin_user", JSON.stringify({
        id: response.data.user_id,
        email: response.data.email,
        username: response.data.username,
        negocio: response.data.negocio
      }));
    }
    return response;
  },

  // Obtener información del usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem("admin_user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  // Verificar si el usuario tiene negocio
  hasNegocio: () => {
    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");
    return user.negocio !== null;
  },

  logout: () => {
    const token = localStorage.getItem("admin_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    return adminApi.post("/auth/logout/", {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },

  // Verificar token/sesión
  verifySession: () => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    if (!token || !user) {
      return Promise.reject('No session found');
    }
    return adminApi.get('/auth/verify/');
  },

  // Negocios
  getNegocio: (slug) => adminApi.get(`/marketplace/negocios/${slug}/`),
  
  createNegocio: (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'logo' || key === 'img_portada') {
          if (data[key] instanceof File) {
            formData.append(key, data[key]);
          }
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    return adminApi.post('/marketplace/negocios/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateNegocio: (slug, data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'logo' || key === 'img_portada') {
          if (data[key] instanceof File) {
            formData.append(key, data[key]);
          }
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    return adminApi.patch(`/marketplace/negocios/${slug}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Reutilizamos las funciones de ubicación del api general
  getProvincias: services.getProvincias,
  getMunicipios: services.getMunicipios,
};

// Interceptor para manejar errores de autenticación
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    return Promise.reject(error);
  }
);

export default adminApi;
