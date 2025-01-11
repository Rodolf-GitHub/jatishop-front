<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { services } from "@/services/api";
import ProductCard from "./ProductCard.vue";

const props = defineProps({
  storeSlug: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['products-loaded', 'error']);

const productos = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);
const searchQuery = ref('');
const isSearching = ref(false);
const totalItems = ref(0);

// Productos filtrados
const filteredProducts = computed(() => {
  if (!searchQuery.value) return productos.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return productos.value.filter(producto => 
    producto.nombre.toLowerCase().includes(query) ||
    producto.descripcion?.toLowerCase().includes(query)
  );
});

const handleSearch = (event) => {
  searchQuery.value = event.target.value;
  isSearching.value = !!searchQuery.value;
  // Resetear la paginación cuando se busca
  if (isSearching.value) {
    hasMore.value = false;
  } else {
    hasMore.value = true;
    currentPage.value = 1;
    fetchProductos();
  }
};

const fetchProductos = async (page = 1) => {
  try {
    if (!hasMore.value || loadingMore.value || isSearching.value) return;
    
    loadingMore.value = true;
    const response = await services.getStoreProducts(props.storeSlug, page);
    
    if (response.data) {
      // Asumimos que la API devuelve { results: [...], count: number }
      const products = Array.isArray(response.data) ? response.data : response.data.results;
      totalItems.value = response.data.count || products.length;
      
      if (page === 1) {
        productos.value = products;
        emit('products-loaded', products);
      } else {
        productos.value = [...productos.value, ...products];
      }
      
      // Verificar si hay más páginas comparando con el total
      const itemsPerPage = 10; // Ajusta esto según tu API
      hasMore.value = productos.value.length < totalItems.value;
      currentPage.value = page;
    }
  } catch (err) {
    console.log('Error fetching store products:', err);
    // Si es 404, significa que no hay más páginas
    if (err.response?.status === 404) {
      hasMore.value = false;
      // No emitimos error si es simplemente que no hay más páginas
      return;
    }
    error.value = err;
    emit('error', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const handleScroll = () => {
  if (isSearching.value || !hasMore.value || loadingMore.value) return;
  
  const scrollPosition = window.scrollY + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const threshold = 200; // Reducimos el umbral para evitar múltiples llamadas
  
  if (scrollPosition >= documentHeight - threshold) {
    fetchProductos(currentPage.value + 1);
  }
};

// Debounce para el scroll
let scrollTimeout;
const debouncedScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(handleScroll, 100);
};

onMounted(() => {
  fetchProductos();
  window.addEventListener('scroll', debouncedScroll);
});

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  window.removeEventListener('scroll', debouncedScroll);
});
</script>

<template>
  <div>
    <!-- Barra de búsqueda -->
    <div class="mb-6">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Buscar productos..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Mensaje de búsqueda -->
    <h2 v-if="isSearching" class="text-2xl font-bold text-gray-800 mb-6">
      Resultados para "{{ searchQuery }}"
    </h2>

    <!-- Lista de productos -->
    <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <ProductCard
        v-for="producto in filteredProducts"
        :key="producto.id"
        :producto="producto"
      />
    </div>

    <!-- Estado de carga inicial -->
    <div v-else-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      <p>Error al cargar los productos</p>
    </div>

    <!-- Mensaje de no productos -->
    <div 
      v-else-if="!loading && filteredProducts.length === 0" 
      class="text-center py-12 text-gray-500"
    >
      <p class="text-xl">No se encontraron productos</p>
    </div>

    <!-- Indicador de carga para más productos -->
    <div 
      v-if="loadingMore && !isSearching" 
      class="flex justify-center items-center py-8"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Indicador de fin de lista -->
    <div 
      v-if="!hasMore && !isSearching && productos.length > 0" 
      class="text-center py-8 text-gray-500"
    >
      No hay más productos para mostrar
    </div>
  </div>
</template>

<style scoped>
.products-container {
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}
</style>