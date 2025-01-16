<template>
  <header class="h-16 bg-gray-800 border-b border-gray-700">
    <div class="h-full px-4 md:px-6 flex items-center justify-between">
      <!-- Espacio para el botón de menú en móvil -->
      <div class="w-12 md:w-auto"></div>
      
      <!-- <AdminSearch /> -->
      <AdminHeaderActions />
    </div>
  </header>
</template>

<script setup>
import AdminSearch from './AdminSearch.vue';
import AdminHeaderActions from './AdminHeaderActions.vue';
</script> 