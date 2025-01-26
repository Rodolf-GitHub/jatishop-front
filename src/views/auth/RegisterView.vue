<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Crea tu tienda</h2>
        <p class="text-gray-600 mt-2">Comienza a vender en línea hoy mismo</p>
      </div>

      <!-- Tabs de navegación -->
      <div class="flex justify-center space-x-8 mb-8">
        <router-link
          to="/login"
          class="text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Iniciar Sesión
        </router-link>
        <button
          class="text-gray-900 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600"
        >
          Crear Cuenta
        </button>
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
          <form @submit.prevent="handleRegister" class="space-y-5">
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
                :class="{ 'border-red-300': v$.registerForm.username.$error }"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="usuario123"
              />
              <span
                v-if="v$.registerForm.username.$error"
                class="text-red-500 text-xs mt-1"
              >
                {{ v$.registerForm.username.$errors[0].$message }}
              </span>
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
                :class="{ 'border-red-300': v$.registerForm.password.$error }"
                class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              <span
                v-if="v$.registerForm.password.$error"
                class="text-red-500 text-xs mt-1"
              >
                {{ v$.registerForm.password.$errors[0].$message }}
              </span>
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
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const toast = useToast();
const { register, loading } = useAuth();
const errorMessage = ref("");
const router = useRouter();

const registerForm = ref({
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = {
  registerForm: {
    username: {
      required: helpers.withMessage(
        "El nombre de usuario es requerido",
        required,
      ),
      minLength: helpers.withMessage(
        "El nombre de usuario debe tener al menos 3 caracteres",
        minLength(3),
      ),
    },
    password: {
      required: helpers.withMessage("La contraseña es requerida", required),
      minLength: helpers.withMessage(
        "La contraseña debe tener al menos 6 caracteres",
        minLength(6),
      ),
    },
  },
};

const v$ = useVuelidate(rules, { registerForm });

const handleRegister = async () => {
  errorMessage.value = "";

  const isFormValid = await v$.value.registerForm.$validate();
  if (!isFormValid) return;

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

    registerForm.value = {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    router.push("/login");
  } catch (err) {
    console.error("Error en registro:", err);
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
</script>
