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

      <!-- Mensaje de Error -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg"
      >
        <p class="text-red-500 text-sm">{{ errorMessage }}</p>
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
              <!-- Email/Username -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <input
                  v-model="loginForm.email"
                  type="text"
                  :class="{ 'border-red-500': v$.loginForm.email.$error }"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="usuario"
                />
                <span
                  v-if="v$.loginForm.email.$error"
                  class="text-red-500 text-xs mt-1"
                >
                  {{ v$.loginForm.email.$errors[0].$message }}
                </span>
              </div>

              <!-- Contraseña -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  :class="{ 'border-red-500': v$.loginForm.password.$error }"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="••••••••"
                />
                <span
                  v-if="v$.loginForm.password.$error"
                  class="text-red-500 text-xs mt-1"
                >
                  {{ v$.loginForm.password.$errors[0].$message }}
                </span>
              </div>

              <!-- Botón de Login -->
              <button
                type="submit"
                class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Nombre
                </label>
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Juan"
                />
              </div>

              <!-- Apellido -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Apellidos
                </label>
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Pérez González"
                />
              </div>

              <!-- Username -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <input
                  v-model="registerForm.username"
                  type="text"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="usuario123"
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";
import { useAuth } from "@/composables/useAuth";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";

const router = useRouter();
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
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert("Las contraseñas no coinciden");
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
  } catch (err) {
    console.error(err);
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
