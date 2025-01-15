<template>
  <div class="flex min-h-screen bg-gray-900">
    <AdminSidebar />

    <main class="flex-1">
      <AdminHeader />

      <!-- Page Content -->
      <div class="p-8">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from "../../components/admin/AdminSidebar.vue";
import AdminHeader from "../../components/admin/AdminHeader.vue";
</script>
