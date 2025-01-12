<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { services } from "@/services/api";
import { getImageUrl } from "@/utils/image";
import {
  ShoppingCartIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import { useRouter, useRoute } from 'vue-router'
import CheckoutModal from './CheckoutModal.vue'
import IconWhatsApp from '@/components/icons/IconWhatsApp.vue'

const cartStore = useCartStore();
const showCart = ref(false);
const showCheckoutModal = ref(false);
const infoNegocio = ref(null);
const router = useRouter();
const route = useRoute();
const errorMessage = ref('');

const totalItems = computed(() => cartStore.totalItems);
const totalAmount = computed(() => cartStore.totalAmount);

const openCheckoutModal = async () => {
  try {
    if (route.params.slug) {
      const response = await services.getStore(route.params.slug);
      infoNegocio.value = response.data;
      showCheckoutModal.value = true;
    }
  } catch (error) {
    console.error("Error al obtener información del negocio:", error);
    errorMessage.value = "Error al procesar el pedido";
  }
};

const updateQuantity = (producto, cantidad) => {
  try {
    if (cantidad < 1) {
      cartStore.removeFromCart(producto.id);
    } else {
      cartStore.updateQuantity(producto.id, cantidad);
    }
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const clearCart = () => {
  cartStore.clearCart();
  showCart.value = false;
};

const handleEscKey = (event) => {
  if (event.key === "Escape") {
    showCart.value = false;
  }
};

const generateWhatsAppLink = () => {
  if (!infoNegocio.value?.whatsapp) return '#';
  return `${infoNegocio.value.whatsapp}`;
};

onMounted(async () => {
  document.addEventListener("keydown", handleEscKey);
  try {
    if (route.params.slug) {
      const response = await services.getStore(route.params.slug);
      infoNegocio.value = response.data;
    }
  } catch (error) {
    console.error("Error al obtener información del negocio:", error);
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscKey);
});
</script>

<template>
  <div>
    <!-- Botón de WhatsApp -->
    <a
      v-if="infoNegocio?.whatsapp"
      :href="generateWhatsAppLink()"
      target="_blank"
      class="fixed bottom-4 right-20 z-40 bg-green-500 text-white p-2.5 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      title="Contactar por WhatsApp"
    >
      <IconWhatsApp class="h-5 w-5" />
    </a>

    <!-- Botón del carrito -->
    <button
      @click="showCart = true"
      class="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-jati to-shop text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
    >
      <ShoppingCartIcon class="h-6 w-6" />
      <span
        v-if="totalItems"
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ totalItems }}
      </span>
    </button>

    <!-- Panel del carrito -->
    <div
      v-if="showCart"
      class="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <!-- Overlay -->
      <div
        class="fixed inset-0 bg-black/30 transition-opacity"
        @click="showCart = false"
      ></div>

      <!-- Panel -->
      <div class="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
        <div class="flex flex-col h-full">
          <!-- Encabezado -->
          <div class="flex items-center justify-between p-4 bg-gradient-to-r from-jati to-shop text-white">
            <h2 class="text-xl font-bold">Carrito de Compras</h2>
            <div class="flex items-center gap-2">
              <button
                v-if="cartStore.items.length"
                @click="clearCart"
                class="p-2 rounded-full hover:bg-white/20 transition-colors"
                title="Vaciar carrito"
              >
                <TrashIcon class="h-6 w-6" />
              </button>
              <button
                @click="showCart = false"
                class="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Mensaje de error si existe -->
          <div
            v-if="errorMessage"
            class="bg-red-50 text-red-500 px-4 py-2 text-sm"
          >
            {{ errorMessage }}
          </div>

          <!-- Lista de productos -->
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="!cartStore.items.length" class="text-center text-gray-500 py-8">
              El carrito está vacío
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="item in cartStore.items"
                :key="item.producto.id"
                class="flex gap-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <img
                  :src="getImageUrl(item.producto.imagen)"
                  :alt="item.producto.nombre"
                  class="w-20 h-20 object-cover rounded-lg bg-gray-50"
                  @error="$event.target.src = '/placeholder-image.png'"
                />
                <div class="flex-1">
                  <h3 class="font-medium">{{ item.producto.nombre }}</h3>
                  <p class="text-sm text-gray-600">
                    Precio: ${{ item.producto.precio_con_descuento || 
                      (item.producto.precio * (1 - item.producto.descuento/100)).toFixed(2) }}
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      @click="updateQuantity(item.producto, item.cantidad - 1)"
                      class="p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span class="w-8 text-center">{{ item.cantidad }}</span>
                    <button
                      @click="updateQuantity(item.producto, item.cantidad + 1)"
                      class="p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      @click="cartStore.removeFromCart(item.producto.id)"
                      class="ml-auto text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                      title="Eliminar producto"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                  <!-- Stock disponible -->
                  <p class="text-sm text-gray-500 mt-1">
                    Stock disponible: {{ item.producto.stock }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con total y botón de checkout -->
          <div class="border-t border-gray-200 p-4 bg-gray-50">
            <div class="flex justify-between mb-4">
              <span class="font-medium">Total:</span>
              <span class="font-bold text-lg">${{ totalAmount }}</span>
            </div>
            <button
              @click="openCheckoutModal"
              class="w-full bg-gradient-to-r from-jati to-shop text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              :disabled="!cartStore.items.length"
            >
              Proceder con la compra
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de checkout -->
    <CheckoutModal 
      :show-modal="showCheckoutModal"
      :info-negocio="infoNegocio"
      :cart-items="cartStore.items"
      :total-amount="totalAmount"
      @close="showCheckoutModal = false"
    />
  </div>
</template>

<style scoped>
/* Añadir animación de hover suave */
a, button {
  transition: all 0.2s ease-in-out;
}

a:hover, button:hover {
  transform: scale(1.05);
}
</style>
