<template>
  <div>
    <!-- Encabezado de bienvenida -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-3">
        ¡Bienvenido al Panel de Administración!
      </h1>
      <p class="text-gray-400">
        Desde aquí podrás gestionar todos los aspectos de tu tienda online.
      </p>
    </div>

    <!-- Grid de acciones principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Información del Negocio -->
      <div
        class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-indigo-500 transition-colors group"
      >
        <div class="p-6">
          <div
            class="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors"
          >
            <BuildingStorefrontIcon class="w-6 h-6 text-indigo-500" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">
            Información del Negocio
          </h3>
          <p class="text-gray-400 mb-4">
            Configura los datos principales de tu tienda, logo, información de
            contacto y más.
          </p>
          <router-link
            to="/admin/business"
            class="inline-flex items-center text-indigo-400 hover:text-indigo-300 gap-2"
          >
            Administrar
            <ArrowRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Gestión de Productos -->
      <div
        class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-green-500 transition-colors group"
      >
        <div class="p-6">
          <div
            class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors"
          >
            <ShoppingBagIcon class="w-6 h-6 text-green-500" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Productos</h3>
          <p class="text-gray-400 mb-4">
            Añade, edita y gestiona tu catálogo de productos, precios y stock.
          </p>
          <router-link
            to="/admin/products"
            class="inline-flex items-center text-green-400 hover:text-green-300 gap-2"
          >
            Gestionar Productos
            <ArrowRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Gestión de Categorías -->
      <div
        class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-colors group"
      >
        <div class="p-6">
          <div
            class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors"
          >
            <TagIcon class="w-6 h-6 text-purple-500" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Categorías</h3>
          <p class="text-gray-400 mb-4">
            Organiza tus productos en categorías y subcategorías.
          </p>
          <router-link
            to="/admin/categories"
            class="inline-flex items-center text-purple-400 hover:text-purple-300 gap-2"
          >
            Gestionar Categorías
            <ArrowRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Gestión de Pedidos -->
      <!-- <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-yellow-500 transition-colors group">
        <div class="p-6">
          <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-colors">
            <ShoppingCartIcon class="w-6 h-6 text-yellow-500" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Pedidos</h3>
          <p class="text-gray-400 mb-4">
            Gestiona los pedidos, estados de envío y facturación.
          </p>
          <router-link 
            to="/admin/orders"
            class="inline-flex items-center text-yellow-400 hover:text-yellow-300 gap-2"
          >
            Ver Pedidos
            <ArrowRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div> -->

      <!-- Gestión de Usuarios -->
      <!-- <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-colors group">
        <div class="p-6">
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
            <UsersIcon class="w-6 h-6 text-blue-500" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Usuarios</h3>
          <p class="text-gray-400 mb-4">
            Administra los usuarios, roles y permisos de tu tienda.
          </p>
          <router-link 
            to="/admin/users"
            class="inline-flex items-center text-blue-400 hover:text-blue-300 gap-2"
          >
            Gestionar Usuarios
            <ArrowRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div> -->

      <!-- Estadísticas -->
      <!-- <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-500 transition-colors group">
        <div class="p-6">
          <div class="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-colors">
            <ChartBarIcon class="w-6 h-6 text-pink-500" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Estadísticas</h3>
          <p class="text-gray-400 mb-4">
            Visualiza reportes y métricas importantes de tu negocio.
          </p>
          <router-link 
            to="/admin/dashboard"
            class="inline-flex items-center text-pink-400 hover:text-pink-300 gap-2"
          >
            Ver Estadísticas
            <ArrowRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div> -->
    </div>

    <!-- Nueva sección de guía -->
    <div class="mt-12 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <QuestionMarkCircleIcon class="w-6 h-6 text-indigo-400" />
        ¿No sabes cómo comenzar?
      </h2>

      <div class="space-y-6">
        <p class="text-gray-400">
          Sigue estos pasos para configurar tu tienda correctamente:
        </p>

        <div class="grid gap-4">
          <!-- Paso 1 -->
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-semibold"
            >
              1
            </div>
            <div>
              <h3 class="text-white font-medium mb-1">
                Configura la información de tu negocio
              </h3>
              <p class="text-gray-400">
                Comienza añadiendo los datos básicos de tu tienda: nombre, logo,
                información de contacto y detalles importantes para tus
                clientes.
              </p>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-semibold"
            >
              2
            </div>
            <div>
              <h3 class="text-white font-medium mb-1">
                Crea tus categorías y subcategorías
              </h3>
              <p class="text-gray-400">
                Organiza tu catálogo creando categorías principales y
                subcategorías. Esto ayudará a tus clientes a encontrar los
                productos más fácilmente.
              </p>
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="flex gap-4">
            <div
              class="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-semibold"
            >
              3
            </div>
            <div>
              <h3 class="text-white font-medium mb-1">Añade tus productos</h3>
              <p class="text-gray-400">
                Con las categorías listas, comienza a cargar tus productos.
                Asegúrate de incluir buenas imágenes, descripciones detalladas y
                precios actualizados.
              </p>
            </div>
          </div>

          <!-- Consejo adicional -->
          <div
            class="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20"
          >
            <div class="flex items-start gap-3">
              <InformationCircleIcon
                class="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5"
              />
              <p class="text-blue-300">
                <span class="font-medium">Consejo:</span> Mantén tu catálogo
                organizado desde el principio te ahorrará tiempo en el futuro y
                mejorará la experiencia de compra de tus clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowRightIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  TagIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
</script>
