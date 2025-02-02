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
    <div class="flex flex-wrap gap-4 mb-6">
      <!-- Búsqueda -->
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          class="w-full bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Filtro de estado -->
      <select
        v-model="filters.status"
        class="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option
          v-for="state in availableStates"
          :key="state.value"
          :value="state.value"
        >
          {{ state.label }}
        </option>
      </select>

      <!-- Filtro de fecha -->
      <select
        v-model="filters.dateRange"
        class="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="today">Hoy</option>
        <option value="week">Última semana</option>
        <option value="month">Último mes</option>
        <option value="all">Todos</option>
      </select>

      <!-- Ordenar -->
      <select
        v-model="filters.sort"
        class="bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      >
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
      </select>
    </div>

    <!-- Tabla de Pedidos -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-750">
              <th
                class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400"
              >
                Pedido
              </th>
              <th
                class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400"
              >
                Cliente
              </th>
              <th
                class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400"
              >
                Estado
              </th>
              <th
                class="hidden md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-400"
              >
                Fecha
              </th>
              <th
                class="px-4 md:px-6 py-4 text-left text-sm font-medium text-gray-400"
              >
                Total
              </th>

              <!-- <th
                class="px-4 md:px-6 py-4 text-right text-sm font-medium text-gray-400"
              >
                Acciones
              </th> -->
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <!-- Mensaje cuando no hay pedidos -->
            <tr v-if="!loading && orders.length === 0">
              <td
                colspan="6"
                class="px-4 md:px-6 py-8 text-center text-gray-400"
              >
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
              <td class="px-4 md:px-6 py-4">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(order.estado)"
                >
                  {{ order.estado }}
                </span>
              </td>
              <td class="hidden md:table-cell px-6 py-4">
                <div class="text-white">
                  {{ formatDate(order.fecha_pedido) }}
                </div>
                <div class="text-sm text-gray-400">
                  {{ formatTime(order.fecha_pedido) }}
                </div>
              </td>
              <td class="px-4 md:px-6 py-4 text-white font-medium">
                ${{ parseFloat(order.total).toFixed(2) }}
              </td>

              <!-- <td class="px-4 md:px-6 py-4">
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
                    <option
                      v-for="state in getAvailableStates(order.estado)"
                      :key="state.value"
                      :value="state.value"
                    >
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
              </td> -->
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
          Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
            Math.min(currentPage * itemsPerPage, orders.length)
          }}
          de {{ orders.length }} pedidos
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
                    {{ formatDate(selectedOrder.fecha_pedido) }} -
                    {{ formatTime(selectedOrder.fecha_pedido) }}
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
              <div
                class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50"
              >
                <h3
                  class="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2"
                >
                  <UserIcon class="w-5 h-5 text-indigo-400" /> Información del
                  Cliente
                </h3>
                <div class="space-y-1">
                  <div class="text-white text-lg">
                    {{ selectedOrder.nombre_cliente }}
                  </div>
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

              <div
                class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50"
              >
                <h3
                  class="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2"
                >
                  <TruckIcon class="w-5 h-5 text-indigo-400" /> Dirección de
                  Envío
                </h3>
                <div class="space-y-1">
                  <div class="text-white text-lg">
                    {{ selectedOrder.direccion_entrega }}
                  </div>
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
              <h3
                class="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"
              >
                <ShoppingBagIcon class="w-5 h-5 text-indigo-400" /> Productos
              </h3>
              <div class="relative">
                <div
                  class="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                >
                  <div
                    v-for="item in selectedOrder.items"
                    :key="item.id"
                    class="flex-shrink-0 w-[250px] md:w-[280px] snap-start bg-gray-750/50 rounded-xl border border-gray-700/50 overflow-hidden group hover:border-indigo-500/50 transition-colors"
                  >
                    <div class="p-3 md:p-4">
                      <h4
                        class="text-white font-medium mb-2 text-sm md:text-base"
                      >
                        {{ item.producto_nombre }}
                      </h4>
                      <div class="space-y-1">
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-400">Precio unitario:</span>
                          <span class="text-white"
                            >${{
                              parseFloat(item.precio_unitario).toFixed(2)
                            }}</span
                          >
                        </div>
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-400">Cantidad:</span>
                          <span class="text-white">{{ item.cantidad }}</span>
                        </div>
                        <div
                          class="flex justify-between items-center text-sm font-medium pt-2 border-t border-gray-700/50"
                        >
                          <span class="text-gray-400">Subtotal:</span>
                          <span class="text-indigo-400"
                            >${{ parseFloat(item.subtotal).toFixed(2) }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notas y Método de Pago -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50"
              >
                <h3 class="text-sm font-medium text-gray-400 mb-2">
                  Notas del Comprador
                </h3>
                <p class="text-white text-sm">
                  {{ selectedOrder.nota_comprador || "Sin notas" }}
                </p>
              </div>
              <div
                class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50"
              >
                <h3
                  class="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2"
                >
                  <CreditCardIcon class="w-5 h-5 text-indigo-400" /> Método de
                  Pago
                </h3>
                <p class="text-white">
                  {{
                    selectedOrder.metodo_pago.charAt(0).toUpperCase() +
                    selectedOrder.metodo_pago.slice(1)
                  }}
                </p>
              </div>
            </div>

            <!-- Total -->
            <div
              class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50"
            >
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-white"
                  >Total del Pedido</span
                >
                <span class="text-xl font-bold text-indigo-400"
                  >${{ parseFloat(selectedOrder.total).toFixed(2) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Footer del Modal -->
          <div class="border-t border-gray-700/50">
            <div class="p-4 md:p-6 flex justify-end gap-3">
              <!-- Botón para siguiente estado -->
              <button
                v-if="getNextStatus(selectedOrder.estado)"
                @click="
                  updateOrderStatus(
                    selectedOrder,
                    getNextStatus(selectedOrder.estado)
                  )
                "
                class="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                :class="getNextStatusButtonClass(selectedOrder.estado)"
              >
                <ArrowRightIcon class="w-5 h-5" />
                {{ getNextStatusLabel(selectedOrder.estado) }}
              </button>

              <!-- Botón para cancelar -->
              <button
                v-if="
                  selectedOrder.estado !== 'cancelado' &&
                  selectedOrder.estado !== 'entregado'
                "
                @click="updateOrderStatus(selectedOrder, 'cancelado')"
                class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircleIcon class="w-5 h-5" />
                Cancelar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { adminServices } from "@/services/admin";
import { useToast } from "vue-toastification";
import {
  UserIcon,
  TruckIcon,
  XMarkIcon,
  PrinterIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "@heroicons/vue/24/outline";

const toast = useToast();
const orders = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const selectedOrder = ref(null);
const loading = ref(false);

// Computed properties para la paginación
// const totalPages = computed(() =>
//   Math.ceil((orders.value?.length || 0) / itemsPerPage)
// );
// const paginatedOrders = computed(() => {
//   if (!orders.value) return [];
//   const start = (currentPage.value - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   return orders.value.slice(start, end);
// });

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

// Estados disponibles para el filtro
const availableStates = [
  { value: "", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

// Computed para las estadísticas
const orderStats = computed(() => {
  if (!orders.value) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    hoy: orders.value.filter((order) => {
      const orderDate = new Date(order.fecha_pedido);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length,

    pendientes: orders.value.filter((order) => order.estado === "pendiente")
      .length,

    en_proceso: orders.value.filter((order) => order.estado === "en_proceso")
      .length,

    completados: orders.value.filter((order) => order.estado === "entregado")
      .length,
  };

  return [
    { label: "Hoy", value: stats.hoy.toString(), color: "text-blue-400" },
    {
      label: "Pendientes",
      value: stats.pendientes.toString(),
      color: "text-yellow-400",
    },
    {
      label: "En Proceso",
      value: stats.en_proceso.toString(),
      color: "text-blue-400",
    },
    {
      label: "Completados",
      value: stats.completados.toString(),
      color: "text-green-400",
    },
  ];
});

const filters = ref({
  search: "",
  status: "",
  dateRange: "week",
  sort: "newest",
});

// Computed para filtrar los pedidos
const filteredOrders = computed(() => {
  if (!orders.value) return [];
  
  let filtered = [...orders.value];

  // Filtrar por búsqueda (nombre, email o teléfono del cliente)
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    filtered = filtered.filter(order => 
      order.nombre_cliente?.toLowerCase().includes(searchTerm) ||
      order.email_cliente?.toLowerCase().includes(searchTerm) ||
      order.telefono_cliente?.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrar por estado
  if (filters.value.status) {
    filtered = filtered.filter(order => order.estado === filters.value.status);
  }

  // Filtrar por rango de fecha
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  switch (filters.value.dateRange) {
    case 'today':
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.fecha_pedido);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });
      break;
    case 'week':
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(order => 
        new Date(order.fecha_pedido) >= weekAgo
      );
      break;
    case 'month':
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(order => 
        new Date(order.fecha_pedido) >= monthAgo
      );
      break;
    case 'all':
    default:
      // No aplicar filtro de fecha
      break;
  }

  // Ordenar
  filtered.sort((a, b) => {
    const dateA = new Date(a.fecha_pedido);
    const dateB = new Date(b.fecha_pedido);
    
    switch (filters.value.sort) {
      case 'oldest':
        return dateA - dateB;
      case 'newest':
      default:
        return dateB - dateA;
    }
  });

  return filtered;
});

// Actualizar el computed de paginación para usar los pedidos filtrados
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrders.value.slice(start, end);
});

// Actualizar el total de páginas basado en los pedidos filtrados
const totalPages = computed(() =>
  Math.ceil(filteredOrders.value.length / itemsPerPage)
);

// Asegurarse de resetear la página actual cuando cambian los filtros
watch(filters, () => {
  currentPage.value = 1;
}, { deep: true });

// Cargar pedidos
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await adminServices.getOrders();
    orders.value = response.data || [];
  } catch (err) {
    console.error("Error al cargar pedidos:", err);
    toast.error("Error al cargar los pedidos");
    orders.value = []; // Asegurar que orders sea un array vacío en caso de error
  } finally {
    loading.value = false;
  }
};

// Estados disponibles para el select - Ahora es una función que depende del estado actual
const getAvailableStates = (currentStatus) => {
  // Si el pedido está entregado, no permitir cambios
  if (currentStatus === "entregado") {
    return [{ value: "entregado", label: "Entregado" }];
  }

  // Si el pedido está cancelado, no permitir cambios
  if (currentStatus === "cancelado") {
    return [{ value: "cancelado", label: "Cancelado" }];
  }

  // Para pedidos pendientes o en proceso, mostrar todas las opciones excepto 'entregado'
  // si no está en proceso
  const baseStates = [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_proceso", label: "En Proceso" },
    { value: "cancelado", label: "Cancelado" },
  ];

  // Solo mostrar la opción de 'entregado' si está en proceso
  if (currentStatus === "en_proceso") {
    baseStates.splice(2, 0, { value: "entregado", label: "Entregado" });
  }

  return baseStates;
};

// Función para obtener el siguiente estado
const getNextStatus = (currentStatus) => {
  const statusFlow = {
    pendiente: "en_proceso",
    en_proceso: "entregado",
    entregado: null,
    cancelado: null,
  };
  return statusFlow[currentStatus];
};

// Función para obtener la etiqueta del siguiente estado
const getNextStatusLabel = (currentStatus) => {
  const statusLabels = {
    pendiente: "En Proceso",
    en_proceso: "Entregado",
    entregado: null,
    cancelado: null,
  };
  return statusLabels[currentStatus];
};

// Actualizar estado del pedido
const updateOrderStatus = async (order, newStatus) => {
  try {
    await adminServices.updateOrderStatus(order.id, newStatus);
    // Actualizar el pedido en la lista local
    const index = orders.value.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      orders.value[index].estado = newStatus;
      if (selectedOrder.value?.id === order.id) {
        selectedOrder.value.estado = newStatus;
      }
    }
    toast.success(`Estado actualizado a: ${newStatus}`);
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    toast.error("Error al actualizar el estado del pedido");
  }
};

const getStatusClass = (status) => {
  const classes = {
    pendiente: "bg-yellow-500/20 text-yellow-400",
    en_proceso: "bg-orange-600/20 text-orange-400",
    entregado: "bg-green-500/20 text-green-400",
    cancelado: "bg-red-500/20 text-red-400",
  };
  return classes[status] || "";
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

// Función para obtener la clase de color del siguiente estado
const getNextStatusButtonClass = (currentStatus) => {
  const statusClasses = {
    pendiente: "bg-orange-600 hover:bg-orange-500",
    en_proceso: "bg-green-600 hover:bg-green-500",
    entregado: "",
    cancelado: "",
  };
  return statusClasses[currentStatus];
};

onMounted(fetchOrders);
</script>
