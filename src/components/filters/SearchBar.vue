<script setup>
import { ref } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["filter"]);
const searchQuery = ref("");

const handleSearch = () => {
  emit("filter", searchQuery.value.toLowerCase().trim());
};
</script>

<template>
  <div class="relative w-full max-w-lg">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        class="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jati focus:border-transparent"
        placeholder="Buscar por nombre..."
        @input="handleSearch"
      />
      <div
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
      >
        <MagnifyingGlassIcon class="h-5 w-5" />
      </div>
    </div>
  </div>
</template>
