<script setup>
import { ref, computed } from "vue";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  PhotoIcon
} from "@heroicons/vue/24/outline";
import { useCartStore } from "@/stores/cartStore";
import { useRoute, useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/image';

const props = defineProps({
  producto: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const cantidad = ref(1);
const alertMessage = ref('');
const showAlert = ref(false);
const imageError = ref(false);

const imagenUrl = computed(() => {
  if (!props.producto.imagen || imageError.value) {
    return null;
  }
  return getImageUrl(props.producto.imagen);
});

const navigateToProduct = () => {
  // Asegurarse de que el ID sea string
  const productoId = props.producto.id.toString();
  
  // Navegar a la vista de detalle
  router.push({
    name: 'store-producto',
    params: {
      slug: route.params.slug,
      productoId: productoId
    }
  }).catch(err => {
    console.error('Error de navegación:', err);
  });
};

const precioFinal = computed(() => {
  const precio =
    props.producto.precio_con_descuento ||
    props.producto.precio * (1 - props.producto.descuento / 100);
  return Number(precio).toFixed(2);
});

const stockStatus = computed(() => {
  if (!props.producto.stock) return { text: "Agotado", class: "text-red-500" };
  if (props.producto.stock <= 5)
    return {
      text: `¡Solo ${props.producto.stock} disponibles!`,
      class: "text-orange-500",
    };
  return {
    text: `${props.producto.stock} disponibles`,
    class: "text-green-600",
  };
});

const incrementar = () => {
  if (cantidad.value < props.producto.stock) {
    cantidad.value++;
  } else {
    alertMessage.value = `¡Solo hay ${props.producto.stock} unidad${props.producto.stock === 1 ? '' : 'es'} disponible${props.producto.stock === 1 ? '' : 's'}!`;
    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
  }
};

const decrementar = () => {
  if (cantidad.value > 1) {
    cantidad.value--;
  }
};

const agregarAlCarrito = () => {
  try {
    if (!props.producto.stock) {
      throw new Error('Producto sin stock disponible');
    }
    // Añadir al carrito con la cantidad seleccionada
    for(let i = 0; i < cantidad.value; i++) {
      cartStore.addToCart(props.producto);
    }
    cantidad.value = 1; // Reset cantidad después de agregar
  } catch (error) {
    alertMessage.value = error.message;
    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 2000);
  }
};
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
  >
    <!-- Imagen y badge de descuento -->
    <div class="relative aspect-square cursor-pointer" @click="navigateToProduct">
      <template v-if="imagenUrl">
        <img
          :src="imagenUrl"
          :alt="producto.nombre"
          class="w-full h-full object-contain bg-white p-2 hover:scale-105 transition-transform duration-300"
          @error="imageError = true"
        />
      </template>
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
        <PhotoIcon class="h-16 w-16 text-gray-400" />
      </div>
      <div
        v-if="producto.descuento > 0"
        class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
      >
        -{{ producto.descuento }}%
      </div>
    </div>

    <!-- Información del producto -->
    <div class="p-2">
      <!-- Stock indicator -->
      <div class="mb-1">
        <span :class="['text-xs font-medium', stockStatus.class]">
          {{ stockStatus.text }}
        </span>
      </div>

      <!-- Precio -->
      <div class="flex items-center mb-1">
        <div class="flex flex-col">
          <span
            v-if="producto.descuento > 0"
            class="text-xs text-gray-400 line-through"
          >
            ${{ producto.precio }}
          </span>
          <span class="text-lg font-bold text-jati"> ${{ precioFinal }} </span>
        </div>
      </div>

      <!-- Nombre -->
      <h3 class="text-xs font-medium text-gray-600 line-clamp-1 mb-2">
        {{ producto.nombre }}
      </h3>

      <!-- Controles de producto -->
      <div class="space-y-2">
        <!-- Control de cantidad -->
        <div class="flex items-center justify-center bg-gray-50 rounded-lg w-full">
          <button 
            @click.stop="decrementar"
            class="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-1.5 transition-colors"
            :disabled="cantidad === 1"
            :class="{ 'opacity-50 cursor-not-allowed': cantidad === 1 }"
          >
            <MinusIcon class="h-4 w-4" />
          </button>
          <span class="text-sm font-medium w-8 text-center">{{ cantidad }}</span>
          <button 
            @click.stop="incrementar"
            class="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-1.5 transition-colors"
            :disabled="cantidad >= producto.stock"
            :class="{ 'opacity-50 cursor-not-allowed': cantidad >= producto.stock }"
          >
            <PlusIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Botón de añadir al carrito -->
        <button 
          @click.stop="agregarAlCarrito"
          class="w-full bg-gradient-to-r from-jati to-shop text-white py-2 px-4 rounded-lg 
                 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          :disabled="!producto.stock"
          :class="{ 'opacity-50 cursor-not-allowed': !producto.stock }"
        >
          <ShoppingCartIcon class="h-4 w-4" />
          <span class="text-sm">{{ producto.stock ? 'Añadir' : 'Agotado' }}</span>
        </button>

        <!-- Alerta de stock -->
        <Transition
          enter-active-class="transform transition ease-out duration-300"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transform transition ease-in duration-200"
          leave-from-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-to-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        >
          <div 
            v-if="showAlert"
            class="absolute -top-16 left-0 right-0 mx-2"
          >
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">
                    {{ alertMessage }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Asegurar que el contenedor del producto tenga posición relativa para la alerta */
.product-card {
  position: relative;
}
</style>
