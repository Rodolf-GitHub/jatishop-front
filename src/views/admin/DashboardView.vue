<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p class="text-gray-400">Bienvenido al panel de administración</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-400">{{ stat.title }}</span>
          <i :class="[stat.icon, stat.color]"></i>
        </div>
        <div class="flex items-end gap-2">
          <h3 class="text-2xl font-bold text-white">{{ stat.value }}</h3>
          <span :class="[stat.trend > 0 ? 'text-green-500' : 'text-red-500']">
            {{ stat.trend > 0 ? "+" : "" }}{{ stat.trend }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Sales Chart -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 class="text-lg font-semibold text-white mb-6">Ventas Recientes</h3>
        <!-- Aquí irá el componente del gráfico -->
        <div class="h-80 bg-gray-700/50 rounded-lg"></div>
      </div>

      <!-- Top Products Chart -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 class="text-lg font-semibold text-white mb-6">
          Productos Más Vendidos
        </h3>
        <!-- Aquí irá el componente del gráfico -->
        <div class="h-80 bg-gray-700/50 rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const stats = ref([
  {
    title: "Ventas Totales",
    value: "$12,426",
    trend: 12.5,
    icon: "fas fa-dollar-sign text-2xl",
    color: "text-green-500",
  },
  {
    title: "Nuevos Clientes",
    value: "245",
    trend: 8.2,
    icon: "fas fa-users text-2xl",
    color: "text-blue-500",
  },
  {
    title: "Pedidos Pendientes",
    value: "18",
    trend: -2.4,
    icon: "fas fa-shopping-cart text-2xl",
    color: "text-yellow-500",
  },
  {
    title: "Productos Activos",
    value: "156",
    trend: 4.8,
    icon: "fas fa-box text-2xl",
    color: "text-purple-500",
  },
]);
</script>
