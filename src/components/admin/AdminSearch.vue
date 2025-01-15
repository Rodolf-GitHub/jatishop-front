<template>
  <div class="relative hidden md:block">
    <input 
      type="text" 
      placeholder="Buscar..." 
      class="w-64 lg:w-96 px-4 py-2 pl-10 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
    <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
</script> 