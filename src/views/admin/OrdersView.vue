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
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto">
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
          <tr
            v-for="order in orders"
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
                {{ order.estado_display }}
              </span>
            </td>
            <td class="px-4 md:px-6 py-4">
              <div class="flex justify-end gap-3">
                <button
                  @click.stop="updateOrderStatus(order)"
                  class="text-gray-400 hover:text-white"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
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

      <!-- Paginación -->
      <div
        class="px-4 md:px-6 py-4 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
      >
        <div class="text-sm text-gray-400">
          Mostrando 1-10 de {{ totalOrders }} pedidos
        </div>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
            :disabled="currentPage === 1"
          >
            Anterior
          </button>
          <button
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                      {{ selectedOrder.estado_display }}
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
                  <div class="text-gray-400 mt-2">
                    <span class="px-2 py-1 bg-gray-700/50 rounded-lg text-sm">
                      {{ selectedOrder.negocio_nombre }}
                    </span>
                  </div>
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
                <p class="text-white">{{ selectedOrder.metodo_pago_display }}</p>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-gray-750/50 p-4 rounded-xl border border-gray-700/50">
              <div class="flex justify-between items-center">
                <span class="text-lg font-medium text-white">Total del Pedido</span>
                <span class="text-xl font-bold text-indigo-400">${{ parseFloat(selectedOrder.total).toFixed(2) }}</span>
              </div>
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
  </div>
</template>

<script setup>
import { ref } from "vue";
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

const currentPage = ref(1);
const totalOrders = ref(45);
const selectedOrder = ref(null);

const orderStats = ref([
  { label: "Hoy", value: "2", color: "text-blue-400" },
  { label: "Pendientes", value: "1", color: "text-yellow-400" },
  { label: "En Proceso", value: "1", color: "text-blue-400" },
  { label: "Completados", value: "1", color: "text-green-400" }
]);

const filters = ref({
  search: "",
  status: "",
  dateRange: "week",
  sort: "newest",
});

const orders = ref([
  {
    id: "1001",
    nombre_cliente: "Juan Pérez",
    email_cliente: "juan.perez@example.com",
    telefono_cliente: "+34 612 345 678",
    direccion_entrega: "Calle Mayor 123, 2º B",
    negocio: 1,
    negocio_nombre: "Tienda Central",
    items: [
      {
        id: 1,
        producto: 101,
        producto_nombre: "iPhone 14 Pro",
        producto_precio: "999.99",
        cantidad: 1,
        precio_unitario: "999.99",
        subtotal: "999.99"
      },
      {
        id: 2,
        producto: 102,
        producto_nombre: "AirPods Pro",
        producto_precio: "249.99",
        cantidad: 2,
        precio_unitario: "249.99",
        subtotal: "499.98"
      }
    ],
    fecha_pedido: "2024-03-28T10:30:00.000Z",
    estado: "pendiente",
    estado_display: "Pendiente",
    metodo_pago: "tarjeta",
    metodo_pago_display: "Tarjeta de Crédito",
    nota_comprador: "Por favor, llamar antes de entregar",
    nota_vendedor: "Cliente VIP",
    total: "1499.97",
    updated_at: "2024-03-28T10:30:00.000Z"
  },
  {
    id: "1002",
    nombre_cliente: "María García",
    email_cliente: "maria.garcia@example.com",
    telefono_cliente: "+34 623 456 789",
    direccion_entrega: "Avenida Principal 45, 5º A",
    negocio: 2,
    negocio_nombre: "Tienda Norte",
    items: [
      {
        id: 3,
        producto: 201,
        producto_nombre: "MacBook Air M2",
        producto_precio: "1299.99",
        cantidad: 1,
        precio_unitario: "1299.99",
        subtotal: "1299.99"
      }
    ],
    fecha_pedido: "2024-03-27T15:45:00.000Z",
    estado: "en_proceso",
    estado_display: "En Proceso",
    metodo_pago: "efectivo",
    metodo_pago_display: "Efectivo",
    nota_comprador: "",
    nota_vendedor: "Entregar en horario de tarde",
    total: "1299.99",
    updated_at: "2024-03-27T16:00:00.000Z"
  },
  {
    id: "1003",
    nombre_cliente: "Carlos Rodríguez",
    email_cliente: "carlos.rodriguez@example.com",
    telefono_cliente: "+34 634 567 890",
    direccion_entrega: "Plaza España 78",
    negocio: 1,
    negocio_nombre: "Tienda Central",
    items: [
      {
        id: 4,
        producto: 301,
        producto_nombre: "iPad Air",
        producto_precio: "599.99",
        cantidad: 1,
        precio_unitario: "599.99",
        subtotal: "599.99"
      },
      {
        id: 5,
        producto: 302,
        producto_nombre: "Apple Pencil",
        producto_precio: "129.99",
        cantidad: 1,
        precio_unitario: "129.99",
        subtotal: "129.99"
      },
      {
        id: 6,
        producto: 303,
        producto_nombre: "Magic Keyboard",
        producto_precio: "299.99",
        cantidad: 1,
        precio_unitario: "299.99",
        subtotal: "299.99"
      }
    ],
    fecha_pedido: "2024-03-26T09:15:00.000Z",
    estado: "entregado",
    estado_display: "Entregado",
    metodo_pago: "transferencia",
    metodo_pago_display: "Transferencia Bancaria",
    nota_comprador: "Dejar con el portero si no estoy",
    nota_vendedor: "",
    total: "1029.97",
    updated_at: "2024-03-26T14:20:00.000Z"
  },
  {
    id: "1004",
    nombre_cliente: "Ana Martínez",
    email_cliente: "ana.martinez@example.com",
    telefono_cliente: "+34 645 678 901",
    direccion_entrega: "Calle Nueva 234",
    negocio: 3,
    negocio_nombre: "Tienda Sur",
    items: [
      {
        id: 7,
        producto: 401,
        producto_nombre: "Apple Watch Series 8",
        producto_precio: "399.99",
        cantidad: 1,
        precio_unitario: "399.99",
        subtotal: "399.99"
      }
    ],
    fecha_pedido: "2024-03-25T11:20:00.000Z",
    estado: "cancelado",
    estado_display: "Cancelado",
    metodo_pago: "tarjeta",
    metodo_pago_display: "Tarjeta de Débito",
    nota_comprador: "",
    nota_vendedor: "Cliente solicitó cancelación",
    total: "399.99",
    updated_at: "2024-03-25T12:30:00.000Z"
  }
]);

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
    pending: "Pendiente",
    processing: "En Proceso",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
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

const updateOrderStatus = (order) => {
  // Aquí iría la lógica para actualizar el estado del pedido
  console.log("Actualizando estado del pedido:", order.id);
};

const printOrder = (orderId) => {
  // Aquí iría la lógica para imprimir el pedido
  console.log("Imprimiendo pedido:", orderId);
};
</script>
