<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from 'vue-router';
import { services } from "@/services/api";
import ProductCard from "@/components/products/ProductCard.vue";
import InfiniteProductList from "@/components/products/InfiniteProductList.vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

const route = useRoute();
const loading = ref(true);
const error = ref(null);
const infoNegocio = ref(null);
const allProducts = ref([]);
const activeSection = ref('todos');
const searchQuery = ref('');
const showOnlyProducts = computed(() => {
  return !!searchQuery.value;
});

// Secciones destacadas computadas
const destacados = computed(() => {
  if (!allProducts.value.length) return null;

  return {
    ofertas: [...allProducts.value]
      .filter(p => p.descuento > 0)
      .sort((a, b) => b.descuento - a.descuento)
      .slice(0, 5),
      
    economicos: [...allProducts.value]
      .sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio))
      .slice(0, 5),
      
    nuevos: [...allProducts.value]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5),
      
    ultimas_unidades: [...allProducts.value]
      .filter(p => p.stock <= 5 && p.stock > 0)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)
  };
});

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 180;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
    activeSection.value = sectionId;
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  activeSection.value = 'todos';
};

const filteredProducts = computed(() => {
  if (!searchQuery.value || !allProducts.value.length) return allProducts.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return allProducts.value.filter(producto => 
    producto.nombre.toLowerCase().includes(query) ||
    producto.descripcion?.toLowerCase().includes(query)
  );
});

const handleLoadError = (err) => {
  error.value = "Error al cargar los productos";
  loading.value = false;
  console.error('Error en StoreView:', err);
};

const handleProductsLoaded = (products) => {
  if (products && products.length > 0) {
    allProducts.value = products;
  }
  loading.value = false;
};

const fetchStoreInfo = async () => {
  try {
    const response = await services.getStore(route.params.slug);
    infoNegocio.value = response.data;
    
    // Inicializar el carrito para esta tienda
    cartStore.setCurrentStore(route.params.slug, {
      id: response.data.id,
      nombre: response.data.nombre,
      slug: route.params.slug
    });
    
  } catch (err) {
    error.value = "Error al cargar la información de la tienda";
    console.error(err);
  }
};

onMounted(() => {
  fetchStoreInfo();
});

</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Banner de imagen de portada con overlay mejorado -->
    <div v-if="infoNegocio?.img_portada" class="w-full relative mt-[140px] md:mt-[112px] mb-8">
      <img :src="infoNegocio.img_portada" 
           :alt="infoNegocio.nombre"
           class="w-full h-64 md:h-80 lg:h-96 object-cover object-center">
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60">
        <div class="container mx-auto h-full flex items-end p-8">
          <h1 class="text-white text-3xl md:text-4xl font-bold">
            {{ infoNegocio.nombre }}
          </h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4">
      <!-- Mensaje de error mejorado -->
      <div v-if="error" 
           class="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Catálogo completo -->
      <div class="mt-12 mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">
          Todo Nuestro Catálogo
        </h2>
        <InfiniteProductList 
          :store-slug="route.params.slug"
          @products-loaded="handleProductsLoaded"
          @error="handleLoadError"
        />
      </div>

      <!-- Secciones destacadas mejoradas -->
      <div class="space-y-16">
        <template v-if="destacados">
          <!-- Ofertas -->
          <section v-if="destacados.ofertas?.length" id="ofertas" 
                   class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <span class="text-red-500 mr-3">🔥</span>
              5 Productos con Mayor Descuento
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <ProductCard
                v-for="producto in destacados.ofertas"
                :key="producto.id"
                :producto="producto"
              />
            </div>
          </section>

          <!-- Económicos -->
          <section v-if="destacados.economicos?.length" id="economicos" 
                   class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <span class="text-green-500 mr-3">💰</span>
              5 Productos más Económicos
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <ProductCard
                v-for="producto in destacados.economicos"
                :key="producto.id"
                :producto="producto"
              />
            </div>
          </section>

          <!-- Nuevos -->
          <section v-if="destacados.nuevos?.length" id="nuevos" 
                   class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <span class="text-blue-500 mr-3">✨</span>
              5 Productos más Recientes
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <ProductCard
                v-for="producto in destacados.nuevos"
                :key="producto.id"
                :producto="producto"
              />
            </div>
          </section>

          <!-- Últimas unidades -->
          <section v-if="destacados.ultimas_unidades?.length" id="ultimas_unidades" 
                   class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <span class="text-yellow-500 mr-3">⚡</span>
              5 Productos con Últimas Unidades
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <ProductCard
                v-for="producto in destacados.ultimas_unidades"
                :key="producto.id"
                :producto="producto"
              />
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1600px;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>