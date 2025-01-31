<script setup>
import { ref } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { adminServices } from "@/services/admin";
import {
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  showModal: Boolean,
  infoNegocio: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "success"]);
const cartStore = useCartStore();
const loading = ref(false);
const error = ref("");

const formData = ref({
  nombre_cliente: "",
  email_cliente: "",
  telefono_cliente: "",
  direccion_entrega: "",
  nota_comprador: "",
});

const createOrder = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Preparar los productos en el formato requerido
    const productos = cartStore.items.map(item => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad
    }));


    // Crear el objeto de pedido con el formato requerido
    const orderData = {
      ...formData.value,
      productos: productos,
    };

    console.log('orderData', orderData);

    const response = await adminServices.createOrder(orderData);
    cartStore.clearCart();
    emit("success", response.data);
    emit("close");
  } catch (err) {
    console.error("Error al crear el pedido:", err);
    error.value = err.response?.data?.error || "Error al procesar el pedido";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="$emit('close')"
    ></div>

    <!-- Modal -->
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <!-- Header -->
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">
                Crear Pedido
              </h3>
              <button
                @click="$emit('close')"
                class="rounded-md text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="createOrder" class="space-y-4">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="formData.nombre_cliente"
                    type="text"
                    required
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <EnvelopeIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="formData.email_cliente"
                    type="email"
                    required
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <!-- Teléfono -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <PhoneIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="formData.telefono_cliente"
                    type="tel"
                    required
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Tu teléfono"
                  />
                </div>
              </div>

              <!-- Dirección -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Dirección de entrega
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 pt-2">
                    <MapPinIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    v-model="formData.direccion_entrega"
                    required
                    rows="2"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Dirección completa para la entrega"
                  ></textarea>
                </div>
              </div>

              <!-- Notas -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Notas adicionales (opcional)
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 pt-2">
                    <ChatBubbleBottomCenterTextIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    v-model="formData.nota_comprador"
                    rows="2"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Instrucciones especiales para tu pedido"
                  ></textarea>
                </div>
              </div>

              <!-- Error message -->
              <div v-if="error" class="text-red-500 text-sm">
                {{ error }}
              </div>

              <!-- Buttons -->
              <div class="mt-5 sm:mt-6 flex gap-3">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  @click="$emit('close')"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  {{ loading ? "Procesando..." : "Confirmar pedido" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 