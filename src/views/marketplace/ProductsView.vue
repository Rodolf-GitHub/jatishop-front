<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useMarketplaceStore } from "@/stores/marketplace";
import { useRoute, useRouter } from "vue-router";
import MarketplaceProductCard from "@/components/marketplace/MarketplaceProductCard.vue";
import axios from "axios";

const route = useRoute();
const API_URL = import.meta.env.VITE_API_BASE_URL;
const marketplaceStore = useMarketplaceStore();

const productos = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);

const fetchProductos = async (page = 1) => {
  try {
    if (loading.value || loadingMore.value) return;

    if (page === 1) {
      loading.value = true;
      productos.value = [];
    } else {
      loadingMore.value = true;
    }

    const urlParams = new URLSearchParams();

    if (marketplaceStore.filters.provincia) {
      urlParams.append("provincia", marketplaceStore.filters.provincia);
    }
    if (marketplaceStore.filters.municipio) {
      urlParams.append("municipio", marketplaceStore.filters.municipio);
    }
    urlParams.append("page", page.toString());

    const url = `${API_URL}/marketplace/productos/?${urlParams.toString()}`;
    console.log("Realizando petición a:", url);

    const response = await axios.get(url);
    console.log("Respuesta de productos:", response.data.results);

    if (!response?.data?.results?.length) {
      hasMore.value = false;
      return;
    }

    const productosFormateados = response.data.results.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      precio_con_descuento: producto.precio_con_descuento,
      stock: producto.stock,
      descuento: producto.descuento,
      imagen: producto.imagen,
      activo: producto.activo,
      created_at: producto.created_at,
      updated_at: producto.updated_at,
      subcategoria: producto.subcategoria,
      tienda_nombre: producto.tienda_nombre,
      tienda_slug: producto.tienda_slug,
      tienda_id: producto.tienda_id,
    }));

    if (page === 1) {
      productos.value = productosFormateados;
    } else {
      productos.value = [...productos.value, ...productosFormateados];
    }

    hasMore.value = !!response.data.next;
    if (hasMore.value) {
      currentPage.value = page + 1;
    }
  } catch (err) {
    hasMore.value = false;
    console.error("Error:", err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !loading.value && !loadingMore.value) {
    console.log("Cargando página:", currentPage.value);
    fetchProductos(currentPage.value);
  }
};

const handleScroll = () => {
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.offsetHeight - 500
  ) {
    loadMore();
  }
};

watch(
  () => marketplaceStore.filters,
  () => {
    fetchProductos();
  },
  { deep: true }
);

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/") {
      currentPage.value = 1;
      hasMore.value = true;
      fetchProductos(1);
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchProductos();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="products-container max-w-7xl mx-auto">
    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Cargando productos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error bg-red-100 text-red-700 p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Products grid -->
    <div v-else class="products-grid">
      <div
        v-if="loading || productos.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <MarketplaceProductCard
          v-for="producto in productos"
          :key="producto.id"
          :producto="producto"
        />
      </div>

      <div v-else class="no-products bg-gray-50 rounded-lg p-8 text-center">
        <p class="text-gray-600">No hay productos disponibles</p>
      </div>

      <!-- Loading more indicator -->
      <div v-if="loadingMore" class="loading-more">
        <div
          class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"
        ></div>
        <p class="mt-2 text-gray-600">Cargando más productos...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-container {
  padding: 20px;
  margin-top: 20px;
}

.loading,
.error,
.no-products {
  text-align: center;
  padding: 20px;
}

.loading-more {
  text-align: center;
  padding: 20px;
  margin-top: 20px;
}
</style>
