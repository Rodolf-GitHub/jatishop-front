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
    name: 'Info', 
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
      <div class="flex flex-col">
        <!-- Primera sección con logo -->
        <div class="flex items-center h-14 md:h-16">
          <div class="flex items-center">
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
        </div>

        <!-- Segunda sección con navegación -->
        <div class="flex justify-center items-center py-2 border-t">
          <div class="flex justify-center gap-4 w-full max-w-md">
            <template v-for="item in navigation" :key="item.name">
              <router-link
                :to="item.route"
                class="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                :class="{
                  'bg-blue-200 text-blue-800': isCurrentRoute(item.route.name),
                  'text-blue-600': !isCurrentRoute(item.route.name)
                }"
              >
                <component :is="item.icon" class="h-5 w-5" />
                <span class="text-sm font-medium">{{ item.name }}</span>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Ajustar el espaciador para las dos secciones -->
  <div class="h-28 md:h-32"></div>
</template>

<style scoped>
/* Eliminamos el estilo global de router-link-active para evitar que afecte a todos los enlaces */
</style>