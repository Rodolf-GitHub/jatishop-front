<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">
          Panel de Administración
        </h1>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="text-center">
            <h3 class="text-xl font-semibold mb-4 text-green-600">
              ¿Ya eres dueño de una tienda y necesitas administrarla?
            </h3>
            <router-link 
              to="/login"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ir al Panel Admin
              <ArrowRightIcon class="h-5 w-5" />
            </router-link>
          </div>

          <div class="text-center">
            <h3 class="text-xl font-semibold mb-4 text-blue-600">
              ¿Quieres crear tu tienda?
            </h3>
            <a 
              href="https://chat.whatsapp.com/GPNmT1EPg5lJzAGieiS9Zs" 
              target="_blank"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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