<template>
  <div>
    <div class="mb-8">
      <h1 class="text-xl md:text-2xl font-bold text-white mb-2">Información del Negocio</h1>
      <p class="text-sm md:text-base text-gray-400">Gestiona la información principal de tu tienda</p>
    </div>

    <div class="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
      <form @submit.prevent="saveBusinessInfo" class="space-y-4 md:space-y-6">
        <!-- Logo -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Logo de la Tienda
          </label>
          <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-700 flex items-center justify-center">
              <img v-if="businessInfo.logo" :src="businessInfo.logo" alt="Logo" class="w-20 h-20 object-contain">
              <i v-else class="fas fa-store text-4xl text-gray-500"></i>
            </div>
            <button type="button" class="w-full md:w-auto px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
              Cambiar Logo
            </button>
          </div>
        </div>

        <!-- Información Básica -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre de la Tienda
            </label>
            <input 
              type="text" 
              v-model="businessInfo.name"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              v-model="businessInfo.email"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Teléfono
            </label>
            <input 
              type="tel" 
              v-model="businessInfo.phone"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Moneda
            </label>
            <select 
              v-model="businessInfo.currency"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="USD">USD - Dólar Americano</option>
              <option value="EUR">EUR - Euro</option>
              <option value="CUP">CUP - Peso Cubano</option>
            </select>
          </div>
        </div>

        <!-- Dirección -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Dirección
          </label>
          <textarea 
            v-model="businessInfo.address"
            rows="3"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          ></textarea>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Descripción de la Tienda
          </label>
          <textarea 
            v-model="businessInfo.description"
            rows="4"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-4">
          <button 
            type="button"
            class="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const businessInfo = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  currency: 'USD',
  logo: null
});

const saveBusinessInfo = () => {
  // Aquí iría la lógica para guardar la información
  console.log('Guardando información:', businessInfo.value);
};
</script> 