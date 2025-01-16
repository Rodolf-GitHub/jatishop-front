<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Botón Regresar -->
      <router-link
        to="/"
        class="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        Regresar
      </router-link>

      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <img
          src="@/assets/logo.svg"
          alt="Logo"
          class="w-16 h-16 mx-auto mb-4"
        />
        <h2 class="text-2xl font-bold text-white">Panel de Administración</h2>
        <p class="text-gray-400 mt-2">
          {{
            isLogin
              ? "Inicia sesión para acceder al panel"
              : "Crea tu cuenta de administrador"
          }}
        </p>
      </div>

      <!-- Card con Formularios -->
      <div
        class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
      >
        <div class="relative w-full">
          <!-- Formulario de Login -->
          <div
            class="w-full transition-all duration-300 ease-in-out"
            :class="isLogin ? 'block' : 'hidden'"
          >
            <form @submit.prevent="handleLogin" class="p-6 md:p-8 space-y-6">
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <!-- Contraseña -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>

              <!-- Botón de Login -->
              <button
                type="submit"
                class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
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

          <!-- Formulario de Registro -->
          <div
            class="w-full transition-all duration-300 ease-in-out"
            :class="!isLogin ? 'block' : 'hidden'"
          >
            <form @submit.prevent="handleRegister" class="p-6 md:p-8 space-y-6">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  v-model="registerForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <!-- Contraseña -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>

              <!-- Confirmar Contraseña -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>

              <!-- Botón de Registro -->
              <button
                type="submit"
                class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
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

      <!-- Toggle Login/Register -->
      <div class="text-center mt-6">
        <button
          @click="toggleForm"
          class="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
        >
          {{
            isLogin
              ? "¿No tienes cuenta? Créala aquí"
              : "¿Ya tienes cuenta? Inicia sesión"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const loading = ref(false);
const isLogin = ref(true);

const loginForm = ref({
  email: "",
  password: "",
  remember: false,
});

const registerForm = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleLogin = async () => {
  loading.value = true;
  try {
    // Aquí iría la lógica de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/admin/dashboard");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  try {
    // Aquí iría la lógica de registro
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isLogin.value = true;
  } catch (error) {
    console.error("Error al registrar:", error);
  } finally {
    loading.value = false;
  }
};

const toggleForm = () => {
  isLogin.value = !isLogin.value;
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
