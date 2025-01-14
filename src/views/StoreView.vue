<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { services } from "@/services/api";
import InfiniteProductList from "@/components/products/InfiniteProductList.vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

const route = useRoute();
const loading = ref(true);
const error = ref(null);
const infoNegocio = ref(null);
const allProducts = ref([]);

const handleLoadError = (err) => {
  if (loading.value) {
    loading.value = false;
    return;
  }
  error.value = "Error al cargar los productos";
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
    
    // Actualizar meta tags para compartir
    document.querySelector('meta[property="og:title"]').setAttribute('content', infoNegocio.value.nombre);
    document.querySelector('meta[property="og:description"]').setAttribute('content', infoNegocio.value.descripcion || 'Tienda en E-comCuba');
    document.querySelector('meta[property="og:image"]').setAttribute('content', infoNegocio.value.logo);
    document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
    document.title = infoNegocio.value.nombre;
    
    // Inicializar el carrito para esta tienda
    cartStore.setCurrentStore(route.params.slug, {
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
    <div v-if="infoNegocio?.img_portada" class="w-full relative mt-[72px] mb-8">
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
      <!-- Mensaje de error solo si no es la carga inicial -->
      <div v-if="error && !loading" class="text-red-500 text-center py-4">
        {{ error }}
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
