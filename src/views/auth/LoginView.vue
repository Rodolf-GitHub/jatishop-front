<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">¡Bienvenido de nuevo!</h2>
        <p class="text-gray-600 mt-2">Accede a tu panel de administración</p>
      </div>

      <!-- Tabs de navegación -->
      <div class="flex justify-center space-x-8 mb-8">
        <button
          class="text-gray-900 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600"
        >
          Iniciar Sesión
        </button>
        <router-link
          to="/register"
          class="text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Crear Cuenta
        </router-link>
      </div>

      <!-- Mensaje de Error -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
      >
        <p class="text-red-600 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Card con Formulario -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div class="p-6 md:p-8">
          <form @submit.prevent="handleLogin" class="space-y-5">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const router = useRouter();
const { login, loading } = useAuth();
const errorMessage = ref("");

const loginForm = ref({
  email: "",
  password: "",
});

const rules = {
  loginForm: {
    email: {
      required: helpers.withMessage(
        "El nombre de usuario es requerido",
        required,
      ),
    },
    password: {
      required: helpers.withMessage("La contraseña es requerida", required),
    },
  },
};

const v$ = useVuelidate(rules, { loginForm });

const handleLogin = async () => {
  errorMessage.value = "";

  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  try {
    await login({
      username: loginForm.value.email,
      password: loginForm.value.password,
    });
  } catch (err) {
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
