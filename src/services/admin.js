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
      localStorage.setItem("admin_username", response.data.username);
      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          id: response.data.user_id,
          email: response.data.email,
          username: response.data.username,
          negocio: response.data.negocio,
        })
      );
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
    return adminApi.post(
      "/auth/logout/",
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  },

  // Verificar token/sesión
  verifySession: () => {
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");
    if (!token || !user) {
      return Promise.reject("No session found");
    }
    return adminApi.get("/auth/verify/");
  },

  // Negocios
  getNegocio: async () => {
    try {
      const response = await adminApi.get("/mi-negocio/negocio/my_business/");
      return response;
    } catch (error) {
      console.error("Error al obtener negocio:", error);
      throw error;
    }
  },

  createNegocio: (data) => {
    const formData = new FormData();

    // Asegurarse de que los campos requeridos estén presentes
    const requiredFields = ["nombre", "provincia", "municipio"];
    requiredFields.forEach((field) => {
      if (!data[field]) {
        throw new Error(`El campo ${field} es requerido`);
      }
    });

    // Procesar los campos con valores especiales
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === "logo" || key === "img_portada") {
          if (data[key] instanceof File) {
            formData.append(key, data[key]);
          }
        } else if (key === "latitud" || key === "longitud") {
          formData.append(key, data[key].toString());
        } else if (key === "tema") {
          // Manejar el objeto tema
          formData.append(
            "color_primario",
            data[key].color_primario || "#8E44AD"
          );
          formData.append(
            "color_secundario",
            data[key].color_secundario || "#E67E22"
          );
        } else if (typeof data[key] === "boolean") {
          formData.append(key, data[key].toString());
        } else {
          formData.append(key, data[key].toString());
        }
      }
    });

    // Establecer valores por defecto
    if (!data.moneda_principal) formData.append("moneda_principal", "CUP");
    if (!data.activo) formData.append("activo", "true");
    if (!data.hace_domicilio) formData.append("hace_domicilio", "false");
    if (!data.acepta_transferencia)
      formData.append("acepta_transferencia", "false");

    return adminApi.post("/marketplace/negocios/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateNegocio: (data) => {
    const formData = new FormData();
    const { tema, ...restData } = data; // Extraemos el tema del resto de los datos

    Object.keys(restData).forEach((key) => {
      if (restData[key] !== null && restData[key] !== undefined) {
        if (key === "logo" || key === "img_portada") {
          if (restData[key] instanceof File) {
            formData.append(key, restData[key]);
          }
        } else if (key === "latitud" || key === "longitud") {
          formData.append(key, restData[key].toString());
        } else if (typeof restData[key] === "boolean") {
          formData.append(key, restData[key].toString());
        } else {
          formData.append(key, restData[key]);
        }
      }
    });

    return adminApi.patch("/mi-negocio/negocio/my_business/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Nuevo método específico para actualizar el tema
  updateTema: (colores) => {
    return adminApi.put("/mi-negocio/negocio/update_theme/", {
      color_primario: colores.color_primario,
      color_secundario: colores.color_secundario,
    });
  },

  // Reutilizamos las funciones de ubicación del api general
  getProvincias: services.getProvincias,
  getMunicipios: (provincia) => {
    if (!provincia) {
      return Promise.reject("Provincia es requerida");
    }
    return adminApi.get(
      `/ubicaciones/municipios/${encodeURIComponent(provincia)}/`
    );
  },

  register: (userData) => adminApi.post("/auth/register/", userData),

  // Categorías
  getMyCategories() {
    return adminApi.get("/mi-negocio/categorias/my_categories/");
  },

  createCategory(formData) {
    return adminApi.post("/mi-negocio/categorias/my_categories/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateCategory(id, formData) {
    return adminApi.put(
      `/mi-negocio/categorias/${id}/manage_category/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  deleteCategory(id) {
    return adminApi.delete(`/mi-negocio/categorias/${id}/manage_category/`);
  },

  // Subcategorías
  getCategorySubcategories(categoryId) {
    return adminApi.get(`/mi-negocio/categorias/${categoryId}/subcategories/`);
  },

  createSubcategory(categoryId, formData) {
    return adminApi.post(
      `/mi-negocio/categorias/${categoryId}/subcategories/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  updateSubcategory(categoryId, subcategoryId, formData) {
    return adminApi.put(
      `/mi-negocio/categorias/${categoryId}/subcategories/${subcategoryId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  deleteSubcategory(categoryId, subcategoryId) {
    return adminApi.delete(
      `/mi-negocio/categorias/${categoryId}/subcategories/${subcategoryId}/`
    );
  },

  // Productos
  getMyProducts() {
    return adminApi.get("/mi-negocio/productos/my_products/");
  },

  createProduct(formData) {
    return adminApi.post("/mi-negocio/productos/my_products/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateProduct(id, formData) {
    return adminApi.put(
      `/mi-negocio/productos/${id}/update_product/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 0,
      }
    );
  },

  deleteProduct(id) {
    return adminApi.delete(`/mi-negocio/productos/${id}/delete_product/`);
  },

  getResumen() {
    return adminApi.get("/mi-negocio/resumen/");
  },

  // Pedidos
  getOrders() {
    return adminApi.get("/mi-negocio/pedidos-admin/");
  },

  createOrder(orderData) {
    const {
      nombre_cliente,
      email_cliente,
      telefono_cliente,
      direccion_entrega,
      productos,
      metodo_pago,
      nota_comprador,
    } = orderData;

    // Verificar que productos no esté vacío
    if (!productos || productos.length === 0) {
      return Promise.reject(
        new Error("El pedido debe tener al menos un producto.")
      );
    }

    return adminApi.post("/mi-negocio/pedidos-admin/", {
      nombre_cliente,
      email_cliente,
      telefono_cliente,
      direccion_entrega,
      productos,
      metodo_pago,
      nota_comprador,
    });
  },

  // Obtener un pedido por ID
  getOrderById(id) {
    return adminApi.get(`/mi-negocio/pedidos-admin/${id}/`);
  },

  // Actualizar un pedido existente
  updateOrder(id, orderData) {
    const {
      nombre_cliente,
      email_cliente,
      telefono_cliente,
      direccion_entrega,
      estado,
      metodo_pago,
      nota_comprador,
      nota_vendedor,
    } = orderData;

    // Solo enviamos los campos que pueden ser actualizados
    const updateData = {};
    if (nombre_cliente) updateData.nombre_cliente = nombre_cliente;
    if (email_cliente) updateData.email_cliente = email_cliente;
    if (telefono_cliente) updateData.telefono_cliente = telefono_cliente;
    if (direccion_entrega) updateData.direccion_entrega = direccion_entrega;
    if (estado) updateData.estado = estado;
    if (metodo_pago) updateData.metodo_pago = metodo_pago;
    if (nota_comprador !== undefined)
      updateData.nota_comprador = nota_comprador;
    if (nota_vendedor !== undefined) updateData.nota_vendedor = nota_vendedor;

    return adminApi.patch(`/mi-negocio/pedidos/${id}/`, updateData);
  },

  // // Nuevos servicios
  // deleteOrder(id) {
  //   return adminApi.delete(`/mi-negocio/pedidos/${id}/`);
  // },

  updateOrderStatus(id, status) {
    return adminApi.patch(`/mi-negocio/pedidos-admin/${id}/actualizar_estado/`, {
      estado: status,
    });
  },
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
