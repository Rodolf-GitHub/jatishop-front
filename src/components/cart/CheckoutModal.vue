<script setup>
import { ref } from 'vue'
import { PhoneIcon, MapPinIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import IconWhatsApp from '@/components/icons/IconWhatsApp.vue'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const props = defineProps({
  showModal: Boolean,
  infoNegocio: Object,
  cartItems: Array,
  totalAmount: String,
})

const emit = defineEmits(['close'])
const copied = ref(false)

const formatPhoneNumber = (phone) => phone?.replace(/\D/g, "") || "";

const generateOrderText = () => {
  const header = "🛍️ NUEVO PEDIDO\n\n";
  const items = props.cartItems.map(item => 
    `• ${item.cantidad}x ${item.producto.nombre}\n` +
    `  💰 $${item.producto.precio_con_descuento}\n` + 
    `  📦 Total: $${(item.producto.precio_con_descuento * item.cantidad).toFixed(2)}`
  ).join("\n\n");
  
  return `${header}${items}\n\n💵 Total: $${props.totalAmount}`;
};

const generateWhatsAppMessage = () => encodeURIComponent(generateOrderText());

const handleWhatsAppClick = () => {
  setTimeout(() => {
    cartStore.clearCart()
    emit('close')
  }, 1000)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generateOrderText());
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Error al copiar:', err);
  }
};
</script>

<template>
  <div v-if="showModal" 
       class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
       @click="$emit('close')">
    <div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md" @click.stop>
      <h3 class="text-lg sm:text-xl font-bold mb-4">Proceso de compra</h3>

      <div class="space-y-4">
        <!-- Copiar orden -->
        <div class="border rounded-lg p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="bg-jati text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
            <h4 class="font-medium">Copia tu orden</h4>
          </div>
          <button @click="copyToClipboard"
                  class="w-full flex items-center gap-2 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <component :is="copied ? ClipboardDocumentCheckIcon : ClipboardDocumentIcon" class="h-5 w-5"/>
            <span>{{ copied ? '¡Copiado!' : 'Copiar orden' }}</span>
          </button>
        </div>

        <!-- Contacto -->
        <div class="border rounded-lg p-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="bg-jati text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
            <h4 class="font-medium">Contacta con la tienda</h4>
          </div>
          
          <div class="space-y-2">
            <a v-if="infoNegocio?.whatsapp"
               :href="`${infoNegocio.whatsapp}?text=${generateWhatsAppMessage()}`"
               target="_blank"
               @click="handleWhatsAppClick"
               class="flex items-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <IconWhatsApp class="h-5 w-5"/>
              <span>WhatsApp</span>
            </a>

            <a v-if="infoNegocio?.telefono"
               :href="`tel:${formatPhoneNumber(infoNegocio.telefono)}`"
               class="flex items-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <PhoneIcon class="h-5 w-5"/>
              <span>Llamar</span>
            </a>

            <div v-if="infoNegocio?.direccion"
                 class="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
              <MapPinIcon class="h-5 w-5 text-gray-600"/>
              <div class="min-w-0">
                <p class="font-medium truncate">Visitar el negocio</p>
                <p class="text-sm text-gray-600 truncate">{{ infoNegocio.direccion }}</p>
                <p class="text-sm text-gray-500 truncate">{{ infoNegocio.horario }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button @click="$emit('close')"
              class="mt-4 w-full py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
        Cerrar
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>