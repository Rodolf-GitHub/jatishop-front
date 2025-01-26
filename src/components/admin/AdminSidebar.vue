<template>
  <aside 
    class="bg-gray-800 border-r border-gray-700 transition-all duration-300 h-screen w-64"
  >
    <div class="h-full p-6">
      <div class="flex items-center gap-3 mb-8">
        <img src="/favicon.ico" alt="Logo" class="w-12 h-12 rounded-full">
        <h2 class="text-xl font-bold text-white">Panel Admin</h2>
      </div>
      
      <nav class="space-y-2">
        <!-- Inicio siempre desbloqueado -->
        <router-link 
          to="/admin/home"
          class="group flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition-colors"
          :class="{ 'bg-gray-700 text-indigo-400': isActiveRoute('/admin/home') }"
        >
          <HomeIcon class="w-6 h-6 flex-shrink-0" />
          <span>Inicio</span>
        </router-link>

        <!-- Mi Negocio -->
        <div class="relative">
          <router-link 
            to="/admin/business"
            class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="[
              setupProgress.negocio 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400' 
                : 'text-gray-500 cursor-not-allowed'
            ]"
          >
            <BuildingStorefrontIcon class="w-6 h-6 flex-shrink-0" />
            <span>Mi Negocio</span>
          </router-link>
        </div>

        <!-- Categorías -->
        <div class="relative" v-if="setupProgress.negocio">
          <router-link 
            to="/admin/categories"
            class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="[
              setupProgress.categoria 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400' 
                : 'text-gray-500 cursor-not-allowed'
            ]"
          >
            <TagIcon class="w-6 h-6 flex-shrink-0" />
            <span>Categorías</span>
          </router-link>
        </div>

        <!-- Productos -->
        <div class="relative" v-if="setupProgress.categoria">
          <router-link 
            to="/admin/products"
            class="group flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="[
              setupProgress.producto 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400' 
                : 'text-gray-500 cursor-not-allowed'
            ]"
          >
            <CubeIcon class="w-6 h-6 flex-shrink-0" />
            <span>Productos</span>
          </router-link>
        </div>
      </nav>

      <!-- Mensajes informativos -->
      <div class="mt-6 text-sm text-gray-400">
        <p v-if="!setupProgress.negocio" class="p-3 bg-gray-700 rounded-lg mb-2">
          ⚡ Primero crea tu negocio para comenzar (ej: "Mi Restaurante")
        </p>
        <p v-else-if="!setupProgress.categoria" class="p-3 bg-gray-700 rounded-lg mb-2">
          📋 Crea las categorías principales (ej: "Alimentos", "Bebidas")
        </p>
        <p v-else-if="!setupProgress.subcategoria" class="p-3 bg-gray-700 rounded-lg mb-2">
          📑 Agrega subcategorías (ej: "Comida Rápida", "Postres", "Ensaladas")
        </p>
        <p v-else-if="!setupProgress.producto" class="p-3 bg-gray-700 rounded-lg mb-2">
          🎉 Ya puedes agregar tus productos (ej: "Hamburguesa Clásica", "Pizza Margherita")
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useSetupProgress } from '@/composables/useSetupProgress';
import { useRoute } from 'vue-router';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  TagIcon,
  CubeIcon,
  LockClosedIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const { setupProgress } = useSetupProgress();

const isActiveRoute = (path) => {
  return route.path === path;
};
</script>

<style scoped>
.router-link-active {
  @apply bg-gray-700 text-indigo-400;
}
</style> 