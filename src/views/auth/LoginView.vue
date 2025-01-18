<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">
          {{ isLogin ? "¡Bienvenido de nuevo!" : "Crea tu tienda" }}
        </h2>
        <p class="text-gray-600 mt-2">
          {{
            isLogin
              ? "Accede a tu panel de administración"
              : "Comienza a vender en línea hoy mismo"
          }}
        </p>
      </div>

      <!-- Mensaje de Error -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
      >
        <p class="text-red-600 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Card con Formularios -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <!-- Tabs de Login/Register -->
        <div class="flex border-b border-gray-200">
          <button
            @click="isLogin = true"
            class="flex-1 py-4 text-sm font-medium transition-colors"
            :class="
              isLogin
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            Iniciar Sesión
          </button>
          <button
            @click="isLogin = false"
            class="flex-1 py-4 text-sm font-medium transition-colors"
            :class="
              !isLogin
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            Crear Cuenta
          </button>
        </div>

        <div class="p-6 md:p-8">
          <!-- Formulario de Login -->
          <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                v-model="loginForm.email"
                type="text"
                :class="{ 'border-red-300': v$.loginForm.email.$error }"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="usuario"
              />
              <span
                v-if="v$.loginForm.email.$error"
                class="text-red-500 text-xs mt-1"
              >
                {{ v$.loginForm.email.$errors[0].$message }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                v-model="loginForm.password"
                type="password"
                :class="{ 'border-red-300': v$.loginForm.password.$error }"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              <span
                v-if="v$.loginForm.password.$error"
                class="text-red-500 text-xs mt-1"
              >
                {{ v$.loginForm.password.$errors[0].$message }}
              </span>
            </div>

            <button
              type="submit"
              class="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{ loading ? "Iniciando sesión..." : "Iniciar Sesión" }}
            </button>
          </form>

          <!-- Formulario de Registro -->
          <form v-else @submit.prevent="handleRegister" class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos
                </label>
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                v-model="registerForm.username"
                type="text"
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="usuario123"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              class="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{ loading ? "Creando cuenta..." : "Crear Cuenta" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { useAuth } from "@/composables/useAuth";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";

const router = useRouter();
const route = useRoute();
const { login, register, loading, error } = useAuth();
const isLogin = ref(true);
const errorMessage = ref("");

const loginForm = ref({
  email: "",
  password: "",
});

const registerForm = ref({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Reglas de validación con mensajes personalizados
const rules = {
  loginForm: {
    email: {
      required: helpers.withMessage(
        "El nombre de usuario es requerido",
        required
      ),
      minLength: helpers.withMessage(
        "El nombre de usuario debe tener al menos 3 caracteres",
        minLength(3)
      ),
    },
    password: {
      required: helpers.withMessage("La contraseña es requerida", required),
      minLength: helpers.withMessage(
        "La contraseña debe tener al menos 6 caracteres",
        minLength(6)
      ),
    },
  },
};

const v$ = useVuelidate(rules, { loginForm });

const handleLogin = async () => {
  errorMessage.value = "";

  // Validar el formulario
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  try {
    await login({
      username: loginForm.value.email,
      password: loginForm.value.password,
    });
  } catch (err) {
    // Manejar diferentes tipos de errores
    if (err?.status === 400) {
      errorMessage.value =
        "Credenciales inválidas. Por favor, verifica tu usuario y contraseña.";
    } else if (err?.status === 401) {
      errorMessage.value =
        "No autorizado. Por favor, inicia sesión nuevamente.";
    } else {
      errorMessage.value =
        "Ha ocurrido un error. Por favor, intenta nuevamente más tarde.";
    }
    console.error(err);
  }
};

const handleRegister = async () => {
  errorMessage.value = "";

  // Validar que las contraseñas coincidan
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = "Las contraseñas no coinciden";
    return;
  }

  try {
    await register({
      username: registerForm.value.username,
      first_name: registerForm.value.firstName,
      last_name: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password,
    });

    toast.success("Cuenta creada exitosamente");
    router.push("/admin/home");
  } catch (err) {
    console.error("Error en registro:", err);
    // Manejar diferentes tipos de errores
    if (err.response?.data) {
      if (err.response.data.username) {
        errorMessage.value = "Este nombre de usuario ya está en uso";
      } else if (err.response.data.email) {
        errorMessage.value = "Este correo electrónico ya está registrado";
      } else if (typeof err.response.data === "object") {
        errorMessage.value = Object.values(err.response.data).flat().join(". ");
      } else {
        errorMessage.value = err.response.data;
      }
    } else {
      errorMessage.value =
        "Error al crear la cuenta. Por favor, intente nuevamente.";
    }
  }
};

const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

onMounted(() => {
  // Si viene el parámetro register=true, mostrar el formulario de registro
  if (route.query.register === "true") {
    isLogin.value = false;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
