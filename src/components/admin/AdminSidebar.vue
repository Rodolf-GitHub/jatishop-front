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
            <LockClosedIcon 
              v-if="!setupProgress.negocio"
              class="w-5 h-5 ml-auto text-gray-500" 
            />
            <div v-if="!setupProgress.negocio" class="absolute right-2 top-1/2 -translate-y-1/2">
              <span class="flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
            </div>
          </router-link>
        </div>

        <!-- Categorías -->
        <div class="relative">
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
            <LockClosedIcon 
              v-if="!setupProgress.categoria"
              class="w-5 h-5 ml-auto text-gray-500" 
            />
            <div v-if="setupProgress.negocio && !setupProgress.categoria" class="absolute right-2 top-1/2 -translate-y-1/2">
              <span class="flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
            </div>
          </router-link>
        </div>

        <!-- Productos -->
        <div class="relative">
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
            <LockClosedIcon 
              v-if="!setupProgress.producto"
              class="w-5 h-5 ml-auto text-gray-500" 
            />
            <div v-if="setupProgress.categoria && !setupProgress.producto" class="absolute right-2 top-1/2 -translate-y-1/2">
              <span class="flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-yellow-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
            </div>
          </router-link>
        </div>
      </nav>
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