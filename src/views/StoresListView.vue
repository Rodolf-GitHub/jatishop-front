<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { services } from "@/services/api";
import { getImageUrl } from "@/utils/image";
import { useMarketplaceStore } from "@/stores/marketplace";
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  ShoppingBagIcon,
  TagIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/outline";

const stores = ref([]);
const loading = ref(true);
const error = ref(null);
const marketplaceStore = useMarketplaceStore();

// Computed property para ordenar las tiendas y filtrar las que no tienen productos
const sortedStores = computed(() => {
  return [...stores.value]
    .filter((store) => store.cantidad_productos > 0)
    .sort((a, b) => {
      // Ordenar por cantidad_productos de mayor a menor
      return b.cantidad_productos - a.cantidad_productos;
    });
});

const getStoreImageUrl = (url) => {
  if (!url) return "/no-image.png";
  const MEDIA_URL = import.meta.env.VITE_MEDIA_URL;
  return `${MEDIA_URL}${url}`;
};

const loadStores = async () => {
  loading.value = true;
  try {
    const params = {};
    if (marketplaceStore.filters.provincia) {
      params.provincia = marketplaceStore.filters.provincia;
      if (marketplaceStore.filters.municipio) {
        params.municipio = marketplaceStore.filters.municipio;
      }
    }
    const response = await services.getStores(params);
    stores.value = response.data;
  } catch (err) {
    error.value = "Error al cargar las tiendas";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Observar cambios en los filtros
watch(
  () => marketplaceStore.filters,
  () => {
    loadStores();
  },
  { deep: true },
);

onMounted(() => {
  loadStores();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        class="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-jati to-shop bg-clip-text text-transparent"
      >
        Descubre Nuestras Tiendas
      </h1>
      <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Explora nuestra selección de tiendas y encuentra productos increíbles de
        vendedores locales
      </p>

      <!-- Loading state -->
      <div
        v-if="loading"
        class="flex justify-center items-center min-h-[400px]"
      >
        <div
          class="animate-spin rounded-full h-16 w-16 border-4 border-jati border-t-transparent"
        ></div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="text-red-500 text-center p-6 bg-red-50 rounded-xl shadow-sm"
      >
        <p class="font-medium">{{ error }}</p>
        <button
          @click="fetchStores"
          class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="stores.length === 0"
        class="text-center py-16 bg-white rounded-xl shadow-sm"
      >
        <p class="text-xl text-gray-500">
          No hay tiendas disponibles en este momento.
        </p>
      </div>

      <!-- Stores grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <router-link
          v-for="store in sortedStores"
          :key="store.id"
          :to="`/store/${store.slug}`"
          :style="{
            borderWidth: '3px',
            borderStyle: 'solid',
            borderImage: `linear-gradient(45deg, ${store.tema?.color_primario || '#12AD07'}, ${store.tema?.color_secundario || '#3817E6'}) 1`,
            boxShadow:
              'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
          }"
          class="bg-white rounded-2xl overflow-hidden group flex flex-col relative transition-all duration-300 hover:scale-[1.02]"
        >
          <!-- Banner y Logo -->
          <div class="relative h-60">
            <img
              :src="store.img_portada || '/no-image.png'"
              class="w-full h-full object-cover"
              alt=""
              @error="$event.target.src = '/no-image.png'"
            />
            <div
              class="absolute inset-0"
              :style="{
                background: `linear-gradient(to bottom, transparent, ${store.tema?.color_primario}99)`,
              }"
            ></div>
            <div class="absolute -bottom-12 left-6">
              <img
                :src="getImageUrl(store.logo)"
                :alt="store.nombre"
                class="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover bg-white"
                @error="$event.target.src = '/no-image.png'"
              />
            </div>
            <!-- Badge de productos -->
            <div class="absolute top-4 right-4 flex items-center gap-2">
              <div
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white/90 shadow-lg"
              >
                <ShoppingBagIcon
                  class="w-4 h-4"
                  :style="{ color: store.tema?.color_primario }"
                />
                <span :style="{ color: store.tema?.color_primario }"
                  >{{ store.cantidad_productos }} productos</span
                >
              </div>
            </div>
          </div>

          <!-- Información de la tienda -->
          <div class="p-6 pt-16 flex-1">
            <h2
              class="text-2xl font-bold transition-colors"
              :style="{ color: store.tema?.color_primario }"
            >
              {{ store.nombre }}
            </h2>
            <p v-if="store.descripcion" class="text-gray-600 mt-3 line-clamp-2">
              {{ store.descripcion }}
            </p>

            <!-- Detalles de contacto -->
            <div class="mt-6 space-y-3 text-sm text-gray-500">
              <div v-if="store.direccion" class="flex items-center gap-2">
                <MapPinIcon class="w-5 h-5" />
                <span>{{ store.direccion }}</span>
              </div>
              <div v-if="store.telefono" class="flex items-center gap-2">
                <PhoneIcon class="w-5 h-5" />
                <span>{{ store.telefono }}</span>
              </div>
              <div v-if="store.horario" class="flex items-center gap-2">
                <ClockIcon class="w-5 h-5" />
                <span>{{ store.horario }}</span>
              </div>
            </div>
          </div>

          <!-- Footer con estadísticas -->
          <div
            class="px-6 py-4 mt-auto border-t"
            :style="{
              borderColor: `${store.tema?.color_primario}22`,
              background: `linear-gradient(to right, ${store.tema?.color_primario}11, ${store.tema?.color_secundario}11)`,
            }"
          >
            <div class="flex items-center justify-between">
              <div
                class="flex items-center gap-2"
                :style="{ color: store.tema?.color_primario }"
              >
                <span class="font-medium">Visitar tienda</span>
                <ArrowRightIcon
                  class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </div>

              <div class="flex items-center gap-2">
                <div
                  v-if="store.categorias_count"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                  :style="{
                    backgroundColor: `${store.tema?.color_secundario}22`,
                    color: store.tema?.color_secundario,
                  }"
                >
                  <TagIcon class="w-4 h-4" />
                  <span>{{ store.categorias_count }} categorías</span>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
