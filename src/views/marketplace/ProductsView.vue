<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { services } from "@/services/api";
import { ArrowRightIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { getImageUrl } from "@/utils/image";

const router = useRouter();
const productos = ref([]);
const allProductos = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(1);
const hasMore = ref(true);
const searchQuery = ref("");
const searchTimeout = ref(null);

const fetchProductos = async (page = 1) => {
  try {
    if (page === 1) {
      loading.value = true;
      productos.value = [];
    } else {
      loadingMore.value = true;
    }

    const response = await services.getMarketplaceProducts(page);

    if (response?.data?.results) {
      if (page === 1) {
        allProductos.value = response.data.results;
        productos.value = response.data.results;
      } else {
        const newProducts = response.data.results;
        allProductos.value = [...allProductos.value, ...newProducts];
        productos.value = [...productos.value, ...newProducts];
      }

      hasMore.value = !!response.data.next;
      currentPage.value = page;
    }
  } catch (err) {
    error.value = "Error al cargar los productos";
    console.error("Error:", err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const filterProducts = () => {
  const searchTerm = searchQuery.value.toLowerCase().trim();
  if (searchTerm === "") {
    productos.value = allProductos.value;
  } else {
    productos.value = allProductos.value.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm)
    );
  }
};

watch(searchQuery, (newValue) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    filterProducts();
  }, 300);
});

const productImageUrl = (url) => {
  if (!url) return "/no-image.png";
  const MEDIA_URL = import.meta.env.VITE_MEDIA_URL;
  return `$${url}`;
};

const navigateToStore = (storeSlug, productId) => {
  router.push(`/store/${storeSlug}/producto/${productId}`);
};

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    fetchProductos(currentPage.value + 1);
  }
};

const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.offsetHeight;

  if (
    scrollPosition >= documentHeight - 500 &&
    !loadingMore.value &&
    hasMore.value
  ) {
    loadMore();
  }
};

onMounted(() => {
  fetchProductos();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<template>
  <div class="products-container max-w-7xl mx-auto">
    <!-- Search bar -->
    <div class="fixed-search">
      <div class="max-w-xl mx-auto">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar productos..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500"
          >
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

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
        v-if="productos && productos.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        <div
          v-for="producto in productos"
          :key="producto.id"
          class="product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
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
  margin-top: 145px;
}

.fixed-search {
  position: fixed;
  top: 105px;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  z-index: 40;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>
