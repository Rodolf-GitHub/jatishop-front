import axios from "axios";

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
  login: (credentials) => adminApi.post("/auth/login/", credentials),

  register: (userData) => adminApi.post("/auth/register/", userData),

  logout: () => {
    const token = localStorage.getItem("admin_token");
    return adminApi.post("/auth/logout/", {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
  },

  // Verificar token/sesión
  verifySession: () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      return Promise.reject('No token found');
    }
    return adminApi.get('/auth/verify/');
  },
};

// Interceptor para manejar errores de autenticación
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      // Puedes añadir aquí lógica adicional para redireccionar al login
    }
    return Promise.reject(error);
  }
);

export default adminApi;
