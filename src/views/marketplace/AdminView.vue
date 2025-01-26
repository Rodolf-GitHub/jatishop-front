<script setup>
import {
  ArrowRightIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
} from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

const router = useRouter();

const handleAdminClick = () => {
  router.push("/login");
};

const handleCreateStoreClick = () => {
  router.push("/login?register=true");
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-5xl mx-auto">
      <!-- Encabezado -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Panel de Administración
        </h1>
        <p class="text-gray-600 text-lg">
          Gestiona tu negocio o comienza a vender en nuestra plataforma
        </p>
      </div>

      <!-- Tarjetas principales -->
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Tarjeta para Administrar Tienda -->
        <div
          class="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:border-indigo-500 transition-all"
        >
          <div class="flex flex-col h-full">
            <div
              class="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-xl mb-6"
            >
              <BuildingStorefrontIcon class="w-8 h-8 text-indigo-600" />
            </div>

            <h3 class="text-2xl font-semibold mb-4 text-gray-900">
              ¿Ya tienes una tienda?
            </h3>

            <p class="text-gray-600 mb-8 flex-grow">
              Accede a tu panel de administración para gestionar tus productos,
              ver estadísticas, administrar pedidos y más.
            </p>

            <button
              @click="handleAdminClick"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full"
            >
              Ir al Panel Admin
              <ArrowRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Tarjeta para Crear Tienda -->
        <div
          class="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:border-green-500 transition-all"
        >
          <div class="flex flex-col h-full">
            <div
              class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6"
            >
              <ShoppingBagIcon class="w-8 h-8 text-green-600" />
            </div>

            <h3 class="text-2xl font-semibold mb-4 text-gray-900">
              ¿Quieres vender en línea?
            </h3>

            <p class="text-gray-600 mb-8 flex-grow">
              Crea tu tienda en minutos y comienza a vender. Obtén herramientas
              profesionales para gestionar tu negocio en línea.
            </p>

            <button
              @click="handleCreateStoreClick"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full"
            >
              Crear mi Tienda
              <ArrowRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Características -->
      <div class="mt-16 grid md:grid-cols-3 gap-8">
        <div class="text-center bg-white p-6 rounded-xl shadow-md">
          <h4 class="text-lg font-semibold text-gray-900 mb-2">
            Fácil de Usar
          </h4>
          <p class="text-gray-600">
            Interfaz intuitiva diseñada para una gestión eficiente
          </p>
        </div>
        <div class="text-center bg-white p-6 rounded-xl shadow-md">
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Soporte 24/7</h4>
          <p class="text-gray-600">
            Asistencia técnica disponible cuando la necesites
          </p>
        </div>
        <div class="text-center bg-white p-6 rounded-xl shadow-md">
          <h4 class="text-lg font-semibold text-gray-900 mb-2">
            Sin Comisiones
          </h4>
          <p class="text-gray-600">
            Gestiona tu negocio sin costos adicionales
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
