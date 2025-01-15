<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <img src="@/assets/logo.svg" alt="Logo" class="w-16 h-16 mx-auto mb-4">
        <h2 class="text-2xl font-bold text-white">Panel de Administración</h2>
        <p class="text-gray-400 mt-2">Inicia sesión para acceder al panel</p>
      </div>

      <!-- Formulario -->
      <div class="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-700">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input 
              v-model="form.email"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
              placeholder="ejemplo@correo.com"
            >
          </div>

          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input 
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            >
          </div>

          <!-- Recordarme -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
              >
              <label class="ml-2 block text-sm text-gray-300">Recordarme</label>
            </div>
            <a href="#" class="text-sm text-indigo-400 hover:text-indigo-300">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Botón de Login -->
          <button 
            type="submit"
            class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const form = ref({
  email: '',
  password: '',
  remember: false
});

const handleLogin = async () => {
  loading.value = true;
  
  try {
    // Aquí iría la lógica de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de delay
    
    // Si el login es exitoso, redirigir al dashboard
    router.push('/admin/dashboard');
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
  } finally {
    loading.value = false;
  }
};
</script> 