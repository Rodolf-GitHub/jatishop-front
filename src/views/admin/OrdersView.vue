<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Pedidos</h1>
        <p class="text-gray-400">Gestiona los pedidos de tu tienda</p>
      </div>
      
      <!-- Stats Cards -->
      <div class="flex gap-4">
        <div v-for="stat in orderStats" :key="stat.label" class="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <div class="text-sm text-gray-400">{{ stat.label }}</div>
          <div class="text-xl font-bold" :class="stat.color">{{ stat.value }}</div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Buscar por ID o cliente..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
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
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Pedido</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Cliente</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Fecha</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Total</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Estado</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr 
              v-for="order in orders" 
              :key="order.id" 
              class="hover:bg-gray-750 cursor-pointer"
              @click="showOrderDetails(order)"
            >
              <td class="px-6 py-4">
                <div class="text-white font-medium">#{{ order.id }}</div>
                <div class="text-sm text-gray-400">{{ order.items }} productos</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-white">{{ order.customer.name }}</div>
                <div class="text-sm text-gray-400">{{ order.customer.email }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-white">{{ formatDate(order.date) }}</div>
                <div class="text-sm text-gray-400">{{ formatTime(order.date) }}</div>
              </td>
              <td class="px-6 py-4 text-white font-medium">
                ${{ order.total.toFixed(2) }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-3">
                  <button 
                    @click.stop="updateOrderStatus(order)"
                    class="text-gray-400 hover:text-white"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click.stop="printOrder(order.id)"
                    class="text-gray-400 hover:text-white"
                  >
                    <i class="fas fa-print"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
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
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-3xl">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-xl font-bold text-white">
              Pedido #{{ selectedOrder.id }}
            </h2>
            <p class="text-gray-400">{{ formatDate(selectedOrder.date) }}</p>
          </div>
          <button 
            @click="selectedOrder = null"
            class="text-gray-400 hover:text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Detalles del Cliente -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-2">Cliente</h3>
            <div class="text-white">{{ selectedOrder.customer.name }}</div>
            <div class="text-gray-400">{{ selectedOrder.customer.email }}</div>
            <div class="text-gray-400">{{ selectedOrder.customer.phone }}</div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-2">Envío</h3>
            <div class="text-white">{{ selectedOrder.shipping.address }}</div>
            <div class="text-gray-400">{{ selectedOrder.shipping.city }}</div>
            <div class="text-gray-400">{{ selectedOrder.shipping.postalCode }}</div>
          </div>
        </div>

        <!-- Productos -->
        <div class="border-t border-b border-gray-700 py-4 mb-6">
          <h3 class="text-sm font-medium text-gray-400 mb-4">Productos</h3>
          <div class="space-y-4">
            <div 
              v-for="item in selectedOrder.items" 
              :key="item.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-lg object-cover">
                <div>
                  <div class="text-white">{{ item.name }}</div>
                  <div class="text-sm text-gray-400">
                    {{ item.quantity }} x ${{ item.price.toFixed(2) }}
                  </div>
                </div>
              </div>
              <div class="text-white font-medium">
                ${{ (item.quantity * item.price).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Totales -->
        <div class="space-y-2">
          <div class="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>${{ selectedOrder.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>Envío</span>
            <span>${{ selectedOrder.shipping.cost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-white font-medium text-lg">
            <span>Total</span>
            <span>${{ selectedOrder.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentPage = ref(1);
const totalOrders = ref(45);
const selectedOrder = ref(null);

const orderStats = ref([
  { label: 'Hoy', value: '12', color: 'text-blue-400' },
  { label: 'Pendientes', value: '5', color: 'text-yellow-400' },
  { label: 'Completados', value: '28', color: 'text-green-400' }
]);

const filters = ref({
  search: '',
  status: '',
  dateRange: 'week',
  sort: 'newest'
});

const orders = ref([
  {
    id: '1001',
    date: new Date(),
    customer: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+1234567890'
    },
    items: 3,
    total: 299.97,
    status: 'pending',
    shipping: {
      address: 'Calle Principal 123',
      city: 'Ciudad',
      postalCode: '12345',
      cost: 10.00
    },
    subtotal: 289.97
  },
  // Añade más pedidos aquí...
]);

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-indigo-500/20 text-indigo-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };
  return classes[status] || '';
};

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Pendiente',
    processing: 'En Proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
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
  console.log('Actualizando estado del pedido:', order.id);
};

const printOrder = (orderId) => {
  // Aquí iría la lógica para imprimir el pedido
  console.log('Imprimiendo pedido:', orderId);
};
</script> 