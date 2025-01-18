<script setup>
import { ref, computed, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { services } from "@/services/api";
import ProductCard from "@/components/products/ProductCard.vue";

const route = useRoute();
const productos = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = inject('searchQuery');
const categoriaInfo = ref('');

// Productos filtrados basado en la búsqueda
const filteredProducts = computed(() => {
  if (!searchQuery.value) return productos.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return productos.value.filter(producto => 
    producto.nombre.toLowerCase().includes(query)
  );
});



const fetchProductos = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    let response;
    if (route.params.subcategoriaId) {
      response = await services.getProductosPorSubcategoria(
        route.params.slug,
        route.params.subcategoriaId
      );
      if (response?.data?.subcategoria) {
        categoriaInfo.value = response.data.subcategoria;
      }
      productos.value = response?.data || [];
    } else if (route.params.id) {
      response = await services.getProductosPorCategoria(
        route.params.slug,
        route.params.id
      );
      if (response?.data?.categoria) {
        categoriaInfo.value = response.data.categoria;
      }
      productos.value = response?.data || [];
    }
  } catch (err) {
    console.error("Error al cargar productos:", err);
    error.value = "Error al cargar los productos";
    productos.value = [];
  } finally {
    loading.value = false;
  }
};

// Observar cambios en los parámetros de la ruta
watch(
  () => route.params,
  () => {
    searchQuery.value = ''; // Limpiar búsqueda al cambiar de categoría
    fetchProductos();
  },
  { immediate: true }
);
</script>

<template>
  <div class="container mx-auto px-4 mt-[120px]">


    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-jati"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-500 bg-red-50 p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Resultados -->
    <div v-else>
      <!-- Mensaje cuando no hay productos -->
      <div v-if="filteredProducts.length === 0" class="text-center text-gray-500 py-8">
        {{ searchQuery ? `No se encontraron productos para "${searchQuery}"` : 'No hay productos disponibles' }}
      </div>

      <!-- Grid de productos -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ProductCard
          v-for="producto in filteredProducts"
          :key="producto.id"
          :producto="producto"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1600px;
}
</style>
