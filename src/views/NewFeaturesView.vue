<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">
        Novedades en E-comCuba
      </h1>
      <p class="text-gray-600 text-lg">
        Última actualización: 26 de enero de 2024
      </p>
    </div>

    <!-- Nuevas características -->
    <div class="bg-white rounded-2xl shadow-xl p-8 mb-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <SparklesIcon class="w-7 h-7 text-yellow-500 mr-3" />
        Nuevas características
      </h2>
      <div class="grid gap-6">
        <div
          class="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start">
            <CheckCircleIcon
              class="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-lg mb-2">
                Panel Administrativo Mejorado
              </h3>
              <p class="text-gray-600">
                Hemos optimizado la interfaz y corregido errores para una mejor
                experiencia de gestión.
              </p>
            </div>
          </div>
        </div>
        <div
          class="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start">
            <AcademicCapIcon
              class="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-lg mb-2">
                Tutorial para Nuevos Usuarios
              </h3>
              <p class="text-gray-600">
                Guía paso a paso para ayudarte a comenzar en E-comCuba.
              </p>
            </div>
          </div>
        </div>
        <div
          class="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start">
            <UserPlusIcon
              class="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-lg mb-2">
                Mejoras en Creación de Cuentas
              </h3>
              <p class="text-gray-600">
                Proceso simplificado y corrección de errores en el registro de
                usuarios.
              </p>
            </div>
          </div>
        </div>
        <div
          class="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-start">
            <BuildingStorefrontIcon
              class="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-lg mb-2">
                Listado de Tiendas Mejorado
              </h3>
              <p class="text-gray-600">
                Las tiendas ahora se ordenan por cantidad de productos y solo se
                muestran las que tienen productos disponibles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Próximamente -->
    <div
      class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-xl p-8"
    >
      <h2 class="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
        <RocketLaunchIcon class="w-7 h-7 text-indigo-600 mr-3" />
        Próximamente
      </h2>
      <div class="grid gap-6">
        <div
          class="p-6 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all"
        >
          <div class="flex items-start">
            <ShoppingCartIcon
              class="w-6 h-6 text-indigo-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-indigo-900 text-lg mb-2">
                Compras Directas en Tienda
              </h3>
              <p class="text-indigo-700">
                Realiza tus compras sin necesidad de WhatsApp.
              </p>
            </div>
          </div>
        </div>
        <div
          class="p-6 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all"
        >
          <div class="flex items-start">
            <UserGroupIcon
              class="w-6 h-6 text-indigo-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-indigo-900 text-lg mb-2">
                Programa de Referidos
              </h3>
              <p class="text-indigo-700">
                Gana 2 USD por cada persona que invites a E-comCuba.
              </p>
            </div>
          </div>
        </div>
        <div
          class="p-6 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all"
        >
          <div class="flex items-start">
            <StarIcon class="w-6 h-6 text-indigo-500 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 class="font-semibold text-indigo-900 text-lg mb-2">
                Sistema de Valoraciones
              </h3>
              <p class="text-indigo-700">
                Comentarios y calificación por estrellas en productos.
              </p>
            </div>
          </div>
        </div>
        <div
          class="p-6 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all"
        >
          <div class="flex items-start">
            <MagnifyingGlassIcon
              class="w-6 h-6 text-indigo-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-indigo-900 text-lg mb-2">
                Búsqueda Avanzada
              </h3>
              <p class="text-indigo-700">
                Barras de búsqueda y filtros mejorados en el marketplace.
              </p>
            </div>
          </div>
        </div>
        <div
          class="p-6 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all"
        >
          <div class="flex items-start">
            <UsersIcon
              class="w-6 h-6 text-indigo-500 mt-1 mr-4 flex-shrink-0"
            />
            <div>
              <h3 class="font-semibold text-indigo-900 text-lg mb-2">
                Gestores de Tienda
              </h3>
              <p class="text-indigo-700">
                Los dueños podrán añadir administradores adicionales para
                gestionar su tienda, delegando tareas y responsabilidades.
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
  SparklesIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  UserPlusIcon,
  RocketLaunchIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  StarIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from "@heroicons/vue/24/outline";
</script>
