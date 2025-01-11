<script setup>
import MarketplaceNavBar from "@/components/navigation/MarketplaceNavBar.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <MarketplaceNavBar />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template> 