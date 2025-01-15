<template>
  <header class="h-16 bg-gray-800 border-b border-gray-700">
    <div class="h-full px-6 flex items-center justify-between">
      <AdminSearch />
      <AdminHeaderActions />
    </div>
  </header>
</template>

<script setup>
import AdminSearch from './AdminSearch.vue';
import AdminHeaderActions from './AdminHeaderActions.vue';
</script> 