<template>
  <aside class="w-64 bg-gray-800 border-r border-gray-700">
    <div class="p-6">
      <div class="flex items-center gap-3 mb-8">
        <img src="../../assets/logo.svg" alt="Logo" class="w-10 h-10">
        <h2 class="text-xl font-bold text-white">Panel Admin</h2>
      </div>
      
      <nav class="space-y-2">
        <router-link 
          v-for="(item, index) in menuItems" 
          :key="index"
          :to="item.route"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition-colors"
          :class="{ 'bg-gray-700 text-indigo-400': isActiveRoute(item.route) }"
        >
          <i :class="item.icon" class="w-5 h-5"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const menuItems = ref([
  {
    name: 'Dashboard',
    icon: 'fas fa-chart-line',
    route: '/admin/dashboard'
  },
  {
    name: 'Mi Negocio',
    icon: 'fas fa-store',
    route: '/admin/business'
  },
  {
    name: 'Categorías',
    icon: 'fas fa-tags',
    route: '/admin/categories'
  },
  {
    name: 'Productos',
    icon: 'fas fa-box',
    route: '/admin/products'
  },
  {
    name: 'Pedidos',
    icon: 'fas fa-shopping-cart',
    route: '/admin/orders'
  },
  {
    name: 'Usuarios',
    icon: 'fas fa-users',
    route: '/admin/users'
  }
]);

const isActiveRoute = (path) => {
  return route.path === path;
};
</script> 