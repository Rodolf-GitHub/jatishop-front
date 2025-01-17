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
        <router-link 
          v-for="(item, index) in menuItems" 
          :key="index"
          :to="item.route"
          class="group flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition-colors relative"
          :class="{ 
            'bg-gray-700 text-indigo-400': isActiveRoute(item.route)
          }"
        >
          <component :is="item.icon" class="w-6 h-6 flex-shrink-0" />
          <span class="whitespace-nowrap">
            {{ item.name }}
          </span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  ChartBarIcon,
  BuildingStorefrontIcon,
  TagIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  HomeIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();

const menuItems = ref([
  // {
  //   name: 'Dashboard',
  //   icon: ChartBarIcon,
  //   route: '/admin/dashboard'
  // },
  {
    name: 'Inicio',
    icon: HomeIcon,
    route: '/admin/home'
  },
  {
    name: 'Mi Negocio',
    icon: BuildingStorefrontIcon,
    route: '/admin/business'
  },
  {
    name: 'Categorías',
    icon: TagIcon,
    route: '/admin/categories'
  },
  {
    name: 'Productos',
    icon: CubeIcon,
    route: '/admin/products'
  },
  // {
  //   name: 'Pedidos',
  //   icon: ShoppingCartIcon,
  //   route: '/admin/orders'
  // },
  // {
  //   name: 'Usuarios',
  //   icon: UsersIcon,
  //   route: '/admin/users'
  // }
]);

const isActiveRoute = (path) => {
  return route.path === path;
};
</script>

<style scoped>
.router-link-active {
  @apply bg-gray-700 text-indigo-400;
}
</style> 