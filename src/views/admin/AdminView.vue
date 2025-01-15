<template>
  <div class="flex min-h-screen bg-gray-900">
    <!-- Overlay para móvil -->
    <div 
      v-if="showMobileMenu"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      @click="toggleMobileMenu"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed md:static z-30',
        showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
      class="transition-transform duration-300"
    >
      <AdminSidebar />
    </div>

    <main class="flex-1 min-w-0 h-screen overflow-y-auto">
      <!-- Header con botón de menú -->
      <div class="sticky top-0 z-10">
        <button 
          @click="toggleMobileMenu"
          class="md:hidden absolute left-4 top-4 text-white p-2"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        <AdminHeader />
      </div>

      <!-- Page Content -->
      <div class="p-4 md:p-8">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";

const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};
</script>
