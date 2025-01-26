<script setup>
import { ref, onMounted,  } from "vue";
import {  useRoute } from "vue-router";
import { useMarketplaceStore } from '@/stores/marketplace';
import InfoBanner from '@/components/InfoBanner.vue';
import {
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  MapPinIcon,
} from "@heroicons/vue/24/outline";
import UbicacionModal from '@/components/marketplace/UbicacionModal.vue';


const route = useRoute();
const marketplaceStore = useMarketplaceStore();
const showUbicacionModal = ref(false);
const ubicacionActual = ref(null);

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

const handleUbicacionUpdate = async (nuevaUbicacion) => {
  ubicacionActual.value = nuevaUbicacion;
  
  // Actualizar los filtros en el store
  await marketplaceStore.setUbicacionFiltros(nuevaUbicacion);
  
  // Si estamos en una ruta de marketplace, recargar los datos
  if (route.path.includes('/marketplace')) {
    await marketplaceStore.loadProducts();
  }
};

onMounted(async () => {
  const savedUbicacion = localStorage.getItem('ubicacion');
  if (savedUbicacion) {
    const ubicacion = JSON.parse(savedUbicacion);
    ubicacionActual.value = ubicacion;
    await handleUbicacionUpdate(ubicacion);
  } else {
    showUbicacionModal.value = true;
  }
});
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-gray-50 shadow-lg z-40">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div class="flex flex-col">
        <!-- Primera sección con logo y botones -->
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center">
            <a href="/" class="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="E-comCuba" 
                class="h-8 w-8 object-cover rounded-full"
              >
              <span class="text-sm sm:text-lg font-bold">
                <span class="text-red-600">E-com</span><span class="text-blue-600">Cuba</span>
              </span>
            </a>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Botón de ubicación -->
            <button
              @click="showUbicacionModal = true"
              class="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm rounded-full border hover:bg-gray-50"
              :class="ubicacionActual?.provincia ? 'border-blue-500 text-blue-600' : 'border-gray-300 text-gray-600'"
            >
              <MapPinIcon class="h-4 w-4" />
              <span v-if="ubicacionActual?.provincia">
                {{ ubicacionActual.municipio || ubicacionActual.provincia }}
              </span>
              <span v-else>Toda Cuba</span>
            </button>

            <!-- Botón de mi tienda -->
            <router-link
              to="/admin"
              class="flex items-center gap-1 px-2 py-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all text-xs sm:text-sm"
              title="Mi Tienda"
            >
              <ShoppingBagIcon class="h-4 w-4" />
              <span>Mi Tienda</span>
            </router-link>
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

  <!-- Ajustar el espaciador -->
  <div class="h-28 md:h-32"></div>

  <!-- Agregamos el InfoBanner justo después del espaciador -->
  <InfoBanner 
  />

  <!-- Modal de ubicación -->
  <UbicacionModal 
    :show="showUbicacionModal"
    @close="showUbicacionModal = false"
    @update-ubicacion="handleUbicacionUpdate"
  />
</template>

<style scoped>
/* Eliminamos el estilo global de router-link-active para evitar que afecte a todos los enlaces */
</style>