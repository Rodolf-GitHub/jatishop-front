<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { services } from '@/services/api';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const router = useRouter();
const productos = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);
const searchQuery = ref('');

const fetchProductos = async (page = 1, search = '') => {
  try {
    if (page === 1) {
      loading.value = true;
      productos.value = [];
    } else {
      loadingMore.value = true;
    }

    const response = await services.getMarketplaceProducts(page, search);
    
    if (response?.data?.results) {
      if (page === 1) {
        productos.value = response.data.results;
      } else {
        productos.value = [...productos.value, ...response.data.results];
      }
      
      hasMore.value = !!response.data.next;
      currentPage.value = page;
    }

  } catch (err) {
    error.value = "Error al cargar los productos";
    console.error('Error:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchProductos(1, searchQuery.value);
};

const getImageUrl = (url) => {
  if (!url) return '/no-image.png';
  const MEDIA_URL = import.meta.env.VITE_MEDIA_URL;
  return `${MEDIA_URL}${url}`;
};

const navigateToStore = (storeSlug, productId) => {
  router.push(`/store/${storeSlug}/producto/${productId}`);
};

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    fetchProductos(currentPage.value + 1, searchQuery.value);
  }
};

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.offsetHeight;
  
  if (scrollPosition >= documentHeight - 500 && !loadingMore.value && hasMore.value) {
    loadMore();
  }
};

onMounted(() => {
  fetchProductos();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="products-container max-w-7xl mx-auto">
    <!-- Search bar -->
    <div class="mb-8">
      <div class="max-w-xl mx-auto">
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Buscar productos..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
          >
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-gray-600">Cargando productos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error bg-red-100 text-red-700 p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Products grid -->
    <div v-else class="products-grid">
      <div v-if="productos && productos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="producto in productos" :key="producto.id" class="product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <!-- Imagen -->
          <div 
            class="relative aspect-square cursor-pointer"
            @click="navigateToStore(producto.tienda.slug, producto.id)"
          >
            <img
              :src="getImageUrl(producto.imagen)"
              :alt="producto.nombre"
              class="w-full h-full object-contain bg-gray-50 p-2"
            />
            <div
              v-if="producto.descuento > 0"
              class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            >
              -{{ producto.descuento }}%
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <p class="text-sm text-blue-600 mb-1 hover:text-blue-700">
              {{ producto.tienda.nombre }}
            </p>
            
            <h3 class="font-medium text-gray-900 mb-1 line-clamp-2 h-12">
              {{ producto.nombre }}
            </h3>

            <div class="flex items-baseline gap-2 mb-3">
              <span class="text-lg font-bold text-gray-900">
                ${{ producto.precio_con_descuento }}
              </span>
              <span 
                v-if="producto.descuento > 0" 
                class="text-sm text-gray-500 line-through"
              >
                ${{ producto.precio }}
              </span>
            </div>

            <button
              @click="navigateToStore(producto.tienda.slug, producto.id)"
              class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Ver en tienda
              <ArrowRightIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="no-products bg-gray-50 rounded-lg p-8 text-center">
        <p class="text-gray-600">No hay productos disponibles</p>
      </div>

      <!-- Loading more indicator -->
      <div v-if="loadingMore" class="loading-more">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p class="mt-2 text-gray-600">Cargando más productos...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-container {
  padding: 20px;
}

.loading, .error, .no-products {
  text-align: center;
  padding: 20px;
}

.loading-more {
  text-align: center;
  padding: 20px;
  margin-top: 20px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>