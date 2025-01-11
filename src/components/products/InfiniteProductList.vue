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
const searchTimeout = ref(null);

const fetchProductos = async (page = 1) => {
  try {
    if (page === 1) {
      loading.value = true;
      productos.value = [];
    } else {
      loadingMore.value = true;
    }

    const response = await services.getStoreProducts(props.storeSlug, page);
    
    if (response?.data?.results) {
      if (page === 1) {
        productos.value = response.data.results;
        emit('products-loaded', response.data.results);
      } else {
        const newProducts = response.data.results;
        productos.value = [...productos.value, ...newProducts];
      }
      
      hasMore.value = !!response.data.next;
      currentPage.value = page;
    }
  } catch (err) {
    console.log('Error fetching store products:', err);
    error.value = err;
    emit('error', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const filteredProducts = computed(() => {
  if (!searchQuery.value) return productos.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return productos.value.filter(producto => 
    producto.nombre.toLowerCase().includes(query) ||
    producto.descripcion?.toLowerCase().includes(query)
  );
});

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    // Solo resetear la búsqueda si se limpia el campo
    if (!searchQuery.value) {
      fetchProductos(1);
    }
  }, 300);
};

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.offsetHeight;
  
  if (scrollPosition >= documentHeight - 500 && !loadingMore.value && hasMore.value && !searchQuery.value) {
    fetchProductos(currentPage.value + 1);
  }
};

onMounted(() => {
  fetchProductos();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
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

    <!-- Estado de carga inicial -->
    <div v-if="loading && !productos.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Lista de productos -->
    <template v-else>
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ProductCard
          v-for="producto in filteredProducts"
          :key="producto.id"
          :producto="producto"
          class="product-card"
        />
      </div>

      <!-- Mensaje de no productos encontrados -->
      <div 
        v-else
        class="text-center py-12 text-gray-500"
      >
        <p class="text-xl">
          {{ searchQuery ? `No se encontraron productos para "${searchQuery}"` : 'No hay productos disponibles' }}
        </p>
      </div>

      <!-- Indicador de carga para más productos -->
      <div 
        v-if="loadingMore" 
        class="flex justify-center items-center py-8"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    </template>
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