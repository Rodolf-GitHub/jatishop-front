<script setup>
import { ref, onMounted } from "vue";
import { services } from "@/services/api";
import ProductCard from "@/components/products/ProductCard.vue";

const loading = ref(true);
const error = ref(null);
const productosDestacados = ref(null);
const categorias = ref([]);

const fetchData = async () => {
  try {
    loading.value = true;
    const [productosResponse, categoriasResponse] = await Promise.all([
      services.getProductosDestacados(),
      services.getCategorias(),
    ]);
    productosDestacados.value = productosResponse.data;
    categorias.value = categoriasResponse.data;
  } catch (err) {
    error.value = "Error al cargar los datos";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading state -->
      <div
        v-if="loading"
        class="flex justify-center items-center min-h-[300px]"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-jati"
        ></div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="bg-red-50 text-red-500 p-4 rounded-lg text-center"
      >
        {{ error }}
      </div>

      <template v-else>
        <!-- Categorías -->
        <section v-if="categorias.length" class="mb-16">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Explora nuestras categorías
          </h2>
          <div
            class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4"
          >
            <router-link
              v-for="categoria in categorias"
              :key="categoria.id"
              :to="`/categoria/${categoria.id}`"
              class="group flex flex-col items-center"
            >
              <div
                class="bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-1 border-2 border-transparent hover:border-jati"
              >
                <!-- Imagen de categoría -->
                <div class="relative w-20 h-20 sm:w-24 sm:h-24">
                  <img
                    :src="categoria.imagen"
                    :alt="categoria.nombre"
                    class="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    @error="$event.target.src = '/placeholder-image.png'"
                  />
                </div>
              </div>
              <!-- Nombre debajo de la imagen -->
              <h3
                class="mt-2 text-sm font-medium text-gray-700 group-hover:text-jati text-center transition-colors"
              >
                {{ categoria.nombre }}
              </h3>
            </router-link>
          </div>
        </section>

        <!-- Nuevos Productos -->
        <section v-if="productosDestacados?.nuevos?.length" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Nuevos Productos
          </h2>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <ProductCard
              v-for="producto in productosDestacados.nuevos"
              :key="producto.id"
              :producto="producto"
            />
          </div>
        </section>

        <!-- Ofertas -->
        <section v-if="productosDestacados?.ofertas?.length" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Mejores Ofertas</h2>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            <ProductCard
              v-for="producto in productosDestacados.ofertas"
              :key="producto.id"
              :producto="producto"
            />
          </div>
        </section>

        <!-- Económicos -->
        <section v-if="productosDestacados?.economicos?.length" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Precios Especiales
          </h2>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            <ProductCard
              v-for="producto in productosDestacados.economicos"
              :key="producto.id"
              :producto="producto"
            />
          </div>
        </section>

        <!-- Últimas Unidades -->
        <section
          v-if="productosDestacados?.ultimas_unidades?.length"
          class="mb-12"
        >
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            ¡Últimas Unidades!
          </h2>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            <ProductCard
              v-for="producto in productosDestacados.ultimas_unidades"
              :key="producto.id"
              :producto="producto"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1600px;
}
</style>
