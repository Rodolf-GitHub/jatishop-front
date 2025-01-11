<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
  XMarkIcon
} from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();
const isMobileMenuOpen = ref(false);

const navigation = [
  { 
    name: 'Productos', 
    route: { name: 'marketplace-home' }, 
    icon: ShoppingBagIcon 
  },
  { 
    name: 'Tiendas', 
    route: { name: 'stores-list' }, 
    icon: BuildingStorefrontIcon 
  },
  { 
    name: 'Acerca de', 
    route: { name: 'marketplace-about' }, 
    icon: InformationCircleIcon 
  }
];

const isCurrentRoute = (routeName) => {
  return route.name === routeName;
};
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-gray-50 shadow-lg z-40">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div class="flex items-center h-14 md:h-16">
        <!-- Sección izquierda -->
        <div class="flex items-center">
          <!-- Logo y nombre -->
          <a href="/" class="flex items-center gap-2 ml-2 md:ml-4">
            <img 
              src="/logo.jpg" 
              alt="E-comCuba" 
              class="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full"
            >
            <span class="text-lg md:text-xl font-bold">
              <span class="text-red-600">E-com</span><span class="text-blue-600">Cuba</span>
            </span>
          </a>
        </div>

        <!-- Enlaces de navegación (Desktop) -->
        <div class="hidden md:flex items-center space-x-4 ml-auto">
          <template v-for="item in navigation" :key="item.name">
            <router-link
              :to="item.route"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100"
              :class="{
                'bg-blue-200 text-blue-800': isCurrentRoute(item.route.name)
              }"
            >
              <div class="flex items-center gap-2">
                <component :is="item.icon" class="h-5 w-5" />
                {{ item.name }}
              </div>
            </router-link>
          </template>
        </div>

        <!-- Enlaces de navegación (Mobile) -->
        <div class="md:hidden flex items-center space-x-2 ml-auto">
          <template v-for="item in navigation" :key="item.name">
            <router-link
              :to="item.route"
              class="p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md text-gray-600"
              :class="{
                'bg-blue-200 text-blue-800': isCurrentRoute(item.route.name)
              }"
            >
              <component :is="item.icon" class="h-7 w-7 stroke-[2.5]" />
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <!-- Ajustar el espaciador -->
  <div class="h-14 md:h-16"></div>
</template>

<style scoped>
/* Eliminamos el estilo global de router-link-active para evitar que afecte a todos los enlaces */
</style>