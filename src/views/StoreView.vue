<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from 'vue-router';
import { services } from "@/services/api";
import ProductCard from "@/components/products/ProductCard.vue";
import InfiniteProductList from "@/components/products/InfiniteProductList.vue";

const route = useRoute();
const loading = ref(true);
const error = ref(null);
const infoNegocio = ref(null);
const allProducts = ref([]);
const activeSection = ref('todos');
const showNav = ref(true);
const lastScrollPosition = ref(0);
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

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;
  
  if (currentScrollPosition < 0) {
    return;
  }
  
  // Mostrar/ocultar basado en la dirección del scroll
  if (currentScrollPosition < lastScrollPosition.value || currentScrollPosition < 200) {
    showNav.value = true;
  } else {
    showNav.value = false;
  }
  
  lastScrollPosition.value = currentScrollPosition;
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
  } catch (err) {
    error.value = "Error al cargar la información de la tienda";
    console.error(err);
  }
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 180; // Ajusta este valor según sea necesario
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
  // Resetear la sección activa cuando se realiza una búsqueda
  activeSection.value = 'todos';
};

// Modificar el computed de filteredProducts
const filteredProducts = computed(() => {
  if (!searchQuery.value || !allProducts.value.length) return allProducts.value;
  
  const query = searchQuery.value.toLowerCase().trim();
  return allProducts.value.filter(producto => 
    producto.nombre.toLowerCase().includes(query) ||
    producto.descripcion?.toLowerCase().includes(query)
  );
});

// Definir la función handleLoadError
const handleLoadError = (err) => {
  error.value = "Error al cargar los productos";
  loading.value = false;
  console.error('Error en StoreView:', err);
};

onMounted(() => {
  fetchStoreInfo();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Banner de imagen de portada -->
    <div v-if="infoNegocio?.img_portada" class="w-full relative mt-[140px] md:mt-[112px] mb-8">
      <img :src="infoNegocio.img_portada" 
           :alt="infoNegocio.nombre"
           class="w-full h-64 md:h-80 lg:h-96 object-cover object-center">
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
    </div>

    <div class="container mx-auto px-4">
      <!-- Mensaje de error si existe -->
      <div v-if="error" class="text-red-500 text-center py-4">
        {{ error }}
      </div>

      <!-- Lista infinita de productos con búsqueda integrada -->
      <InfiniteProductList 
        :store-slug="route.params.slug"
        @products-loaded="handleProductsLoaded"
        @error="handleLoadError"
      />

      <!-- Secciones adicionales solo cuando no hay búsqueda -->
      <template v-if="!showOnlyProducts && destacados">
        <!-- ... secciones destacadas existentes ... -->
      </template>

      <!-- Navegación de secciones destacadas -->
      <nav 
        class="sticky top-[112px] z-30 bg-white shadow-md transition-transform duration-300 -mx-4 px-4"
        :class="[showNav ? 'translate-y-0' : '-translate-y-full']"
      >
        <div class="container mx-auto">
          <div class="flex space-x-4 overflow-x-auto py-3 scrollbar-hide">
            <button 
              v-if="destacados?.ofertas?.length"
              @click="scrollToSection('ofertas')"
              :class="['whitespace-nowrap px-4 py-2 rounded-full transition-colors',
                       activeSection === 'ofertas' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600']"
            >
              5 con mayor descuento
            </button>
            <button 
              v-if="destacados?.economicos?.length"
              @click="scrollToSection('economicos')"
              :class="['whitespace-nowrap px-4 py-2 rounded-full transition-colors',
                       activeSection === 'economicos' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600']"
            >
              5 más económicos
            </button>
            <button 
              v-if="destacados?.nuevos?.length"
              @click="scrollToSection('nuevos')"
              :class="['whitespace-nowrap px-4 py-2 rounded-full transition-colors',
                       activeSection === 'nuevos' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600']"
            >
              5 más recientes
            </button>
            <button 
              v-if="destacados?.ultimas_unidades?.length"
              @click="scrollToSection('ultimas_unidades')"
              :class="['whitespace-nowrap px-4 py-2 rounded-full transition-colors',
                       activeSection === 'ultimas_unidades' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600']"
            >
              5 últimas unidades
            </button>
          </div>
        </div>
      </nav>

      <!-- Secciones destacadas -->
      <div class="mt-8">
        <template v-if="destacados">
          <!-- Ofertas -->
          <section v-if="destacados.ofertas?.length" id="ofertas" class="mb-16">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              5 Productos con Mayor Descuento
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <ProductCard
                v-for="producto in destacados.ofertas"
                :key="producto.id"
                :producto="producto"
              />
            </div>
          </section>

          <!-- Económicos -->
          <section v-if="destacados.economicos?.length" id="economicos" class="mb-16">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              5 Productos más Económicos
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <ProductCard
                v-for="producto in destacados.economicos"
                :key="producto.id"
                :producto="producto"
              />
            </div>
          </section>

          <!-- Nuevos -->
          <section v-if="destacados.nuevos?.length" id="nuevos" class="mb-16">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              5 Productos más Recientes
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <ProductCard
                v-for="producto in destacados.nuevos"
                :key="producto.id"
                :producto="producto"
              />
            </div>
          </section>

          <!-- Últimas unidades -->
          <section v-if="destacados.ultimas_unidades?.length" id="ultimas_unidades" class="mb-16">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              5 Productos con Últimas Unidades
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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