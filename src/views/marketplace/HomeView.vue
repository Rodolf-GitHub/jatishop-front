<script setup>
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1
          class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent"
        >
          Bienvenido a E-comCuba
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          El primer marketplace cubano que conecta vendedores locales con
          compradores. Una plataforma diseñada para impulsar el comercio
          electrónico en Cuba.
        </p>
      </div>

      <!-- Características -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-3 text-blue-600">
            Para Compradores
          </h3>
          <p class="text-gray-600">
            Encuentra productos de diferentes tiendas en un solo lugar. Compara
            precios y encuentra las mejores ofertas.
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-3 text-red-600">
            Para Vendedores
          </h3>
          <p class="text-gray-600">
            Crea tu tienda online y llega a más clientes. Gestiona tus productos
            y ventas de manera sencilla.
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-xl font-semibold mb-3 text-purple-600">Comunidad</h3>
          <p class="text-gray-600">
            Únete a nuestra comunidad de vendedores y compradores. Comparte
            experiencias y crece junto a nosotros.
          </p>
        </div>
      </div>

      <!-- Llamadas a la acción -->
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">
          ¿Listo para empezar?
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="text-center">
            <h3 class="text-xl font-semibold mb-4 text-blue-600">
              ¿Buscas administrar tu tienda?
            </h3>
            <a
              href="https://api.e-comcuba.com/admin"
              target="_blank"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Panel Admin
              <ArrowRightIcon class="h-5 w-5" />
            </a>
          </div>

          <div class="text-center">
            <h3 class="text-xl font-semibold mb-4 text-red-600">
              ¿Quieres crear tu tienda?
            </h3>
            <a
              href="https://chat.whatsapp.com/GPNmT1EPg5lJzAGieiS9Zs"
              target="_blank"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Contáctanos por WhatsApp
              <ArrowRightIcon class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
