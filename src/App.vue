<script setup>
import Footer from "@/components/layout/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>
