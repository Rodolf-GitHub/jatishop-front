import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { adminServices } from "@/services/admin";

export function useAuth() {
  const router = useRouter();
  const token = ref(localStorage.getItem("admin_token"));
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      token.value = null;
      user.value = null;
      return false;
    }

    token.value = storedToken;
    return true;
  };

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await adminServices.login(credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem("admin_token", response.data.token);
      router.push("/admin/home");
    } catch (err) {
      error.value = err.response || "Error al iniciar sesión";
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await adminServices.register(userData);
      return response;
    } catch (err) {
      console.error("Error en registro:", err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === "object") {
          const errorMessages = Object.values(errorData).flat().join(". ");
          error.value = errorMessages;
        } else {
          error.value = errorData;
        }
      } else {
        error.value = "Error al registrar usuario";
      }
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      const currentToken = localStorage.getItem("admin_token");
      if (currentToken) {
        await adminServices.logout();
      }
    } catch (err) {
      console.error("Error durante el logout:", err);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem("admin_token");
      router.push("/login");
      loading.value = false;
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
}
