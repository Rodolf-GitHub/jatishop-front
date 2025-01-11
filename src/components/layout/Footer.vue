<script setup>
import { ChatBubbleLeftRightIcon, BuildingStorefrontIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-wrap justify-between items-center">
        <!-- Logo y copyright -->
        <div class="flex items-center space-x-2">
          <span class="font-semibold text-white">E-comCuba</span>
          <span class="text-sm">© {{ new Date().getFullYear() }}</span>
        </div>

        <!-- Enlaces -->
        <div class="flex space-x-6">
          <router-link 
            to="/tiendas"
            class="text-sm hover:text-white transition-colors flex items-center gap-1"
          >
            <BuildingStorefrontIcon class="h-4 w-4" />
            Tiendas
          </router-link>
          
          <router-link 
            to="/acerca"
            class="text-sm hover:text-white transition-colors flex items-center gap-1"
          >
            <InformationCircleIcon class="h-4 w-4" />
            Crear Tienda
          </router-link>

          <a 
            href="https://chat.whatsapp.com/DjFYBTcfSdg4jF7SIMMVOS" 
            target="_blank"
            class="text-sm hover:text-white transition-colors flex items-center gap-1"
          >
            <ChatBubbleLeftRightIcon class="h-4 w-4" />
            Soporte
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>