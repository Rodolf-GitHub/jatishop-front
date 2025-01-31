<template>
  <div>
    <div
      class="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0"
    >
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-white mb-2">Pedidos</h1>
        <p class="text-sm md:text-base text-gray-400">
          Gestiona los pedidos de tu tienda
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:flex gap-2 md:gap-4">
        <div
          v-for="stat in orderStats"
          :key="stat.label"
          class="px-3 md:px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
        >
          <div class="text-xs md:text-sm text-gray-400">{{ stat.label }}</div>
          <div class="text-lg md:text-xl font-bold" :class="stat.color">
            {{ stat.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar por ID o cliente..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="processing">En Proceso</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.dateRange"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.sort"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="total_high">Mayor importe</option>
            <option value="total_low">Menor importe</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de Pedidos -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-750">
              <th class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400">
                Pedido
              </th>
              <th class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400">
                Cliente
              </th>
              <th class="hidden md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-400">
                Fecha
              </th>
              <th class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400">
                Total
              </th>
              <th class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400">
                Estado
              </th>
              <th class="px-4 md:px-6 py-4 text-right text-sm font-medium text-gray-400">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <!-- Mensaje cuando no hay pedidos -->
            <tr v-if="!loading && orders.length === 0">
              <td colspan="6" class="px-4 md:px-6 py-8 text-center text-gray-400">
                <div class="flex flex-col items-center gap-2">
                  <ShoppingBagIcon class="w-12 h-12 text-gray-600" />
                  <p class="text-lg">No hay pedidos disponibles</p>
                  <p class="text-sm">Los pedidos que recibas aparecerán aquí</p>
                </div>
              </td>
            </tr>

            <!-- Lista de pedidos -->
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="hover:bg-gray-750 cursor-pointer"
              @click="showOrderDetails(order)"
            >
              <td class="px-4 md:px-6 py-4">
                <div class="text-white font-medium">#{{ order.id }}</div>
                <div class="text-sm text-gray-400">
                  {{ order.items.length }} productos
                </div>
              </td>
              <td class="px-4 md:px-6 py-4">
                <div class="text-white">{{ order.nombre_cliente }}</div>
                <div class="text-sm text-gray-400">
                  {{ order.email_cliente }}
                </div>
              </td>
              <td class="hidden md:table-cell px-6 py-4">
                <div class="text-white">{{ formatDate(order.fecha_pedido) }}</div>
                <div class="text-sm text-gray-400">
                  {{ formatTime(order.fecha_pedido) }}
                </div>
              </td>
              <td class="px-4 md:px-6 py-4 text-white font-medium">
                ${{ parseFloat(order.total).toFixed(2) }}
              </td>
              <td class="px-4 md:px-6 py-4">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(order.estado)"
                >
                  {{ order.estado }}
                </span>
              </td>
              <td class="px-4 md:px-6 py-4">
                <div class="flex justify-end gap-3">
                  <button
                    @click.stop="$refs.statusSelect.click()"
                    class="text-gray-400 hover:text-white"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <select
                    ref="statusSelect"
                    :value="order.estado"
                    @change="updateOrderStatus(order, $event.target.value)"
                    @click.stop
                    class="hidden"
                  >
                    <option v-for="state in availableStates" 
                            :key="state.value" 
                            :value="state.value">
                      {{ state.label }}
                    </option>
                  </select>
                  <button
                    @click.stop="printOrder(order.id)"
                    class="text-gray-400 hover:text-white"
                  >
                    <PrinterIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div
        v-if="orders.length > 0"
        class="px-4 md:px-6 py-4 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
      >
        <div class="text-sm text-gray-400">
          Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, orders.length) }} de {{ orders.length }} pedidos
        </div>
        <div class="flex gap-2">
          <button
            @click="previousPage"
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
          >
            Anterior
          </button>
          <button
            @click="nextPage"
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles del Pedido -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm"
      @click="selectedOrder = null"
    >
      <div class="min-h-full flex items-center justify-center p-4">
        <div 
          class="w-full max-w-4xl bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-700/50 relative"
          @click.stop
        >
          <!-- Header del Modal -->
          <div class="border-b border-gray-700/50">
            <div class="p-4 md:p-6">
              <div class="relative flex items-start justify-between">
                <div>
                  <div class="flex flex-wrap items-center gap-3">
                    <h2 class="text-xl md:text-2xl font-bold text-white">
                      Pedido #{{ selectedOrder.id }}
                    </h2>
                    <span
                      class="px-3 py-1 text-sm rounded-full"
                      :class="getStatusClass(selectedOrder.estado)"
                    >
                      {{ selectedOrder.estado }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-400 mt-1">
                    {{ formatDate(selectedOrder.fecha_pedido) }} - {{ formatTime(selectedOrder.fecha_pedido) }}
                  </p>
                </div>
                <button
                  @click="selectedOrder = null"
                  class="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <div class="p-4 md:p-6 space-y-6">
            <!-- Información del Cliente y Envío -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50">
                <h3 class="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <UserIcon class="w-5 h-5 text-indigo-400" /> Información del Cliente
                </h3>
                <div class="space-y-1">
                  <div class="text-white text-lg">{{ selectedOrder.nombre_cliente }}</div>
                  <div class="text-gray-400 flex items-center gap-2 text-sm">
                    <EnvelopeIcon class="w-4 h-4" />
                    {{ selectedOrder.email_cliente }}
                  </div>
                  <div class="text-gray-400 flex items-center gap-2 text-sm">
                    <PhoneIcon class="w-4 h-4" />
                    {{ selectedOrder.telefono_cliente }}
                  </div>
                </div>
              </div>

              <div class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50">
                <h3 class="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <TruckIcon class="w-5 h-5 text-indigo-400" /> Dirección de Envío
                </h3>
                <div class="space-y-1">
                  <div class="text-white text-lg">{{ selectedOrder.direccion_entrega }}</div>
                  <!-- <div class="text-gray-400 mt-2">
                    <span class="px-2 py-1 bg-gray-700/50 rounded-lg text-sm">
                      {{ selectedOrder.negocio_nombre }}
                    </span>
                  </div> -->
                </div>
              </div>
            </div>

            <!-- Productos -->
            <div>
              <h3 class="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <ShoppingBagIcon class="w-5 h-5 text-indigo-400" /> Productos
              </h3>
              <div class="relative">
                <div class="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <div
                    v-for="item in selectedOrder.items"
                    :key="item.id"
                    class="flex-shrink-0 w-[250px] md:w-[280px] snap-start bg-gray-750/50 rounded-xl border border-gray-700/50 overflow-hidden group hover:border-indigo-500/50 transition-colors"
                  >
                    <div class="p-3 md:p-4">
                      <h4 class="text-white font-medium mb-2 text-sm md:text-base">{{ item.producto_nombre }}</h4>
                      <div class="space-y-1">
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-400">Precio unitario:</span>
                          <span class="text-white">${{ parseFloat(item.precio_unitario).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-400">Cantidad:</span>
                          <span class="text-white">{{ item.cantidad }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm font-medium pt-2 border-t border-gray-700/50">
                          <span class="text-gray-400">Subtotal:</span>
                          <span class="text-indigo-400">${{ parseFloat(item.subtotal).toFixed(2) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notas y Método de Pago -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50">
                <h3 class="text-sm font-medium text-gray-400 mb-2">Notas del Comprador</h3>
                <p class="text-white text-sm">{{ selectedOrder.nota_comprador || 'Sin notas' }}</p>
              </div>
              <div class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50">
                <h3 class="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <CreditCardIcon class="w-5 h-5 text-indigo-400" /> Método de Pago
                </h3>
                <p class="text-white">{{ selectedOrder.metodo_pago.charAt(0).toUpperCase() + selectedOrder.metodo_pago.slice(1) }}</p>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50">
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-white">Total del Pedido</span>
                <span class="text-xl font-bold text-indigo-400">${{ parseFloat(selectedOrder.total).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Añadir selector de estado en el header del modal -->
            <div class="flex items-center gap-3 mt-4">
              <span class="text-gray-400">Cambiar estado:</span>
              <select
                :value="selectedOrder.estado"
                @change="updateOrderStatus(selectedOrder, $event.target.value)"
                class="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
              >
                <option v-for="state in availableStates" 
                        :key="state.value" 
                        :value="state.value">
                  {{ state.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Footer del Modal -->
          <div class="border-t border-gray-700/50">
            <div class="p-4 md:p-6 flex justify-end gap-3">
              <button
                @click.stop="printOrder(selectedOrder.id)"
                class="inline-flex items-center px-3 md:px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base"
              >
                <PrinterIcon class="w-5 h-5" />
                <span class="ml-2">Imprimir</span>
              </button>
              <button
                @click="selectedOrder = null"
                class="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm md:text-base"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
    </div>

    <!-- Error state -->
    <div v-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { adminServices } from "@/services/admin";
import {
  UserIcon,
  TruckIcon,
  XMarkIcon,
  PrinterIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShoppingBagIcon,
  CreditCardIcon
} from "@heroicons/vue/24/outline";

const orders = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedOrder = ref(null);
const loading = ref(false);
const error = ref(null);

// Computed properties para la paginación
const totalPages = computed(() => Math.ceil((orders.value?.length || 0) / itemsPerPage));
const paginatedOrders = computed(() => {
  if (!orders.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return orders.value.slice(start, end);
});

// Funciones de paginación
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Estados disponibles para el select
const availableStates = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' }
];

// Computed para las estadísticas
const orderStats = computed(() => {
  if (!orders.value) return [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    hoy: orders.value.filter(order => {
      const orderDate = new Date(order.fecha_pedido);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length,
    
    pendientes: orders.value.filter(order => 
      order.estado === 'pendiente'
    ).length,
    
    en_proceso: orders.value.filter(order => 
      order.estado === 'en_proceso'
    ).length,
    
    completados: orders.value.filter(order => 
      order.estado === 'entregado'
    ).length
  };

  return [
    { label: "Hoy", value: stats.hoy.toString(), color: "text-blue-400" },
    { label: "Pendientes", value: stats.pendientes.toString(), color: "text-yellow-400" },
    { label: "En Proceso", value: stats.en_proceso.toString(), color: "text-blue-400" },
    { label: "Completados", value: stats.completados.toString(), color: "text-green-400" }
  ];
});

const filters = ref({
  search: "",
  status: "",
  dateRange: "week",
  sort: "newest",
});

// Cargar pedidos
const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await adminServices.getOrders();
    orders.value = response.data || [];
    console.log(orders.value);
  } catch (err) {
    console.error('Error al cargar pedidos:', err);
    error.value = 'Error al cargar los pedidos';
    orders.value = []; // Asegurar que orders sea un array vacío en caso de error
  } finally {
    loading.value = false;
  }
};

// Actualizar estado del pedido
const updateOrderStatus = async (order, newStatus) => {
  try {
    await adminServices.updateOrderStatus(order.id, newStatus);
    // Actualizar el pedido en la lista local
    const index = orders.value.findIndex(o => o.id === order.id);
    if (index !== -1) {
      orders.value[index].estado = newStatus;
      if (selectedOrder.value?.id === order.id) {
        selectedOrder.value.estado = newStatus;
      }
    }
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};

const getStatusClass = (status) => {
  const classes = {
    pendiente: "bg-yellow-500/20 text-yellow-400",
    en_proceso: "bg-blue-500/20 text-blue-400",
    enviado: "bg-indigo-500/20 text-indigo-400",
    entregado: "bg-green-500/20 text-green-400",
    cancelado: "bg-red-500/20 text-red-400",
  };
  return classes[status] || "";
};

const getStatusText = (status) => {
  const statusMap = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };
  return statusMap[status] || status;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};

const showOrderDetails = (order) => {
  selectedOrder.value = order;
};

const printOrder = (orderId) => {
  // Aquí iría la lógica para imprimir el pedido
  console.log("Imprimiendo pedido:", orderId);
};

onMounted(fetchOrders);
</script>
