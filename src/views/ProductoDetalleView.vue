<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { services } from '@/services/api';
import { useCartStore } from '@/stores/cartStore';
import { getImageUrl } from '@/utils/image';
import { PlusIcon, MinusIcon } from "@heroicons/vue/24/outline";
import { useHead } from '@vueuse/head';
import axios from 'axios';

const route = useRoute();
const producto = ref(null);
const loading = ref(true);
const error = ref(null);
const cartStore = useCartStore();
const errorMessage = ref('');
const showError = ref(false);
const cantidad = ref(1);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  return date.toLocaleDateString('es-ES', options);
};

const fetchProducto = async () => {
  if (!route.params.productoId || !route.params.slug) {
    error.value = "Producto no encontrado";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    const response = await services.getProducto(route.params.slug, route.params.productoId);
    producto.value = response.data;
    
    const imagenUrl = new URL(producto.value.imagen, window.location.origin).href;
    
    useHead({
      meta: [
        { property: 'og:title', content: producto.value.nombre },
        { property: 'og:description', content: producto.value.descripcion },
        { property: 'og:image', content: imagenUrl },
        { property: 'og:url', content: window.location.href }
      ]
    });
  } catch (err) {
    console.error("Error al cargar el producto:", err);
    error.value = "Error al cargar el producto";
    producto.value = null;
  } finally {
    loading.value = false;
  }
};

// Observar cambios en los parámetros de la ruta
watch(
  () => [route.params.slug, route.params.productoId],
  () => {
    fetchProducto();
  },
  { immediate: true }
);

onMounted(fetchProducto);

const addToCart = () => {
  try {
    if (!producto.value.stock) {
      throw new Error('Producto sin stock disponible');
    }
    if (cantidad.value > producto.value.stock) {
      throw new Error('No hay suficiente stock disponible');
    }
    for(let i = 0; i < cantidad.value; i++) {
      cartStore.addToCart(producto.value);
    }
  } catch (error) {
    errorMessage.value = error.message;
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 3000);
  }
};

const getPrecioFinal = () => {
  if (producto.value?.precio_con_descuento) {
    return producto.value.precio_con_descuento;
  }
  return (
    producto.value?.precio * (1 - producto.value?.descuento / 100)
  ).toFixed(2);
};

const incrementarCantidad = () => {
  if (cantidad.value < producto.value.stock) {
    cantidad.value++;
  }
};

const decrementarCantidad = () => {
  if (cantidad.value > 1) {
    cantidad.value--;
  }
};

const compartirProducto = async () => {
  try {
    await navigator.share({
      title: producto.value.nombre,
      text: producto.value.descripcion,
      url: window.location.href
    });
  } catch (error) {
    console.error('Error al compartir:', error);
  }
};
</script>
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-jati"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-500 py-8 bg-red-50 rounded-lg">
      {{ error }}
    </div>

    <!-- Producto details -->
    <div v-else-if="producto" class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Información principal -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Imagen -->
        <div class="relative h-[600px] md:h-[600px] overflow-hidden group">
          <img
            :src="getImageUrl(producto.imagen)"
            :alt="producto.nombre"
            class="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            @error="$event.target.src = '/placeholder-image.png'"
          />
        </div>

        <!-- Info principal -->
        <div class="flex flex-col p-8">
          <div class="flex justify-between items-start">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ producto.nombre }}</h1>
            <button 
              @click="compartirProducto"
              class="p-2 text-jati hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          
          <!-- Precios -->
          <div class="flex items-baseline gap-4">
            <p class="text-4xl font-bold text-jati">${{ getPrecioFinal() }}</p>
            <p v-if="producto.descuento" class="text-xl text-gray-500 line-through">
              ${{ producto.precio }}
              <span class="text-red-500 ml-2 text-lg">(-{{ producto.descuento }}%)</span>
            </p>
          </div>

          <!-- Descripción y stock -->
          <div class="mt-8 space-y-6">
            <p class="text-gray-700 text-lg leading-relaxed">{{ producto.descripcion }}</p>
            
            <div class="flex items-center bg-gray-50 p-4 rounded-lg">
              <span class="mr-2 font-medium">Stock:</span>
              <span :class="[
                producto.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'
              ]">
                {{ producto.stock > 0 ? producto.stock : 'Sin stock' }}
              </span>
            </div>

            <!-- Cantidad -->
            <div class="flex items-center space-x-4">
              <span class="font-medium">Cantidad:</span>
              <div class="flex items-center justify-center bg-gray-50 rounded-lg">
                <button 
                  @click="decrementarCantidad"
                  class="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-1.5 transition-colors"
                  :disabled="cantidad === 1"
                  :class="{ 'opacity-50 cursor-not-allowed': cantidad === 1 }"
                >
                  <MinusIcon class="h-4 w-4" />
                </button>
                <span class="text-sm font-medium w-8 text-center">{{ cantidad }}</span>
                <button 
                  @click="incrementarCantidad"
                  class="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-1.5 transition-colors"
                  :disabled="cantidad >= producto.stock"
                  :class="{ 'opacity-50 cursor-not-allowed': cantidad >= producto.stock }"
                >
                  <PlusIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Estado -->
            <div class="flex items-center bg-gray-50 p-4 rounded-lg">
              <span class="mr-2 font-medium">Estado:</span>
              <span :class="[
                producto.activo ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'
              ]">
                {{ producto.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>

          <!-- Error message -->
          <div
            v-if="showError"
            class="mt-6 bg-red-50 text-red-500 p-4 rounded-lg font-medium"
          >
            {{ errorMessage }}
          </div>

          <!-- Add to cart button -->
          <button
            @click="addToCart"
            :disabled="!producto.stock"
            class="mt-8 w-full bg-gradient-to-r from-jati to-shop text-white py-4 px-6 rounded-lg
                   text-lg font-semibold hover:opacity-90 transition-opacity 
                   disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {{ producto.stock ? 'Añadir al carrito' : 'Sin stock' }}
          </button>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="border-t border-gray-100 p-8">
        <h2 class="text-2xl font-bold mb-6 text-jati">Detalles adicionales</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Categorización -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="font-bold text-lg text-gray-900 mb-4">Categorización</h3>
            <div v-if="producto.categoria_info" class="space-y-2">
              <p class="flex items-center gap-2">
                <span class="font-medium text-gray-700">Categoría:</span>
                <span class="text-jati">{{ producto.categoria_info.nombre }}</span>
              </p>
            </div>
            <div v-if="producto.subcategoria_info" class="space-y-2 mt-2">
              <p class="flex items-center gap-2">
                <span class="font-medium text-gray-700">Subcategoría:</span>
                <span class="text-jati">{{ producto.subcategoria_info.nombre }}</span>
              </p>
            </div>
          </div>

          <!-- Fechas -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="font-bold text-lg text-gray-900 mb-4">Información temporal</h3>
            <div class="space-y-2">
              <p class="flex items-center gap-2">
                <span class="font-medium text-gray-700">Creado:</span>
                <span class="text-jati">{{ formatDate(producto.created_at) }}</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="font-medium text-gray-700">Última actualización:</span>
                <span class="text-jati">{{ formatDate(producto.updated_at) }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.from-jati {
  --tw-gradient-from: var(--color-primary);
  --tw-gradient-to: var(--color-secondary);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-shop {
  --tw-gradient-to: var(--color-secondary);
}

.text-jati {
  color: var(--color-primary);
}
</style>

