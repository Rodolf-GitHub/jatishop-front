<script setup>
import { ref, onMounted, watch, onUnmounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { services } from '@/services/api'
import NavBar from "@/components/navigation/NavBar.vue"
import ShoppingCart from "@/components/cart/ShoppingCart.vue"

const store = ref(null)
const loading = ref(true)
const error = ref(null)
const route = useRoute()
const searchQuery = ref('')

// Proveer searchQuery a todos los componentes hijos
provide('searchQuery', searchQuery)

const handleSearch = (query) => {
  searchQuery.value = query
}

const loadStoreData = async (slug) => {
  try {
    loading.value = true
    const response = await services.getStore(slug)
    store.value = response.data
    
    // Aplicar colores del tema
    if (store.value.tema) {
      document.documentElement.style.setProperty('--color-primary', store.value.tema.color_primario)
      document.documentElement.style.setProperty('--color-secondary', store.value.tema.color_secundario)
    }
  } catch (err) {
    error.value = "Error al cargar la tienda"
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Limpiar los colores cuando se desmonta el componente
onUnmounted(() => {
  document.documentElement.style.removeProperty('--color-primary')
  document.documentElement.style.removeProperty('--color-secondary')
})

onMounted(() => {
  if (route.params.slug) {
    loadStoreData(route.params.slug)
  }
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadStoreData(newSlug)
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-jati"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="bg-red-50 text-red-500 p-4 rounded-lg">
        {{ error }}
      </div>
    </div>

    <!-- Store content -->
    <template v-else-if="store">
      <NavBar 
        :store="store" 
        @search="handleSearch"
      />
      <main>
        <router-view 
          :store="store"
          :search-query="searchQuery"
        ></router-view>
      </main>
      <ShoppingCart />
    </template>
  </div>
</template>

<style>
:root {
  --color-primary: #8E44AD;
  --color-secondary: #E67E22;
}
</style> 