<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Bars3Icon,
  QuestionMarkCircleIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from "@heroicons/vue/24/outline";
import SearchBar from "../filters/SearchBar.vue";
import SideBar from "./SideBar.vue";
import Breadcrumb from "./Breadcrumb.vue";

const props = defineProps({
  store: {
    type: Object,
    required: false,
    default: null
  }
});

const emit = defineEmits(['search']);
const router = useRouter();
const route = useRoute();
const isSideBarOpen = ref(false);

const homeRoute = computed(() => ({
  name: 'store',
  params: { slug: route.params.slug }
}));

const ayudaRoute = computed(() => ({
  name: 'store-ayuda',
  params: { slug: route.params.slug }
}));

const ubicacionRoute = computed(() => ({
  name: 'store-ubicacion',
  params: { slug: route.params.slug }
}));

const showSearch = computed(() => {
  return ['store-categoria', 'store-subcategoria'].includes(route.name);
});

const handleSearch = (query) => {
  emit('search', query);
};

const getMonedaTitle = (moneda) => {
  const monedas = {
    'CUP': 'Pesos Cubanos',
    'USD': 'Dólares Americanos',
    'EUR': 'Euros',
    'ZELLE': 'Zelle',
    'MLC': 'Moneda Libremente Convertible'
  };
  return monedas[moneda] || moneda;
};
</script>

<template>
  <div>
    <nav class="fixed top-0 left-0 right-0 bg-gray-50 shadow-lg z-40">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div class="flex flex-col">
          <!-- Barra superior -->
          <div class="flex items-center h-14 md:h-16">
            <!-- Sección izquierda -->
            <div class="flex items-center">
              <button
                v-if="store"
                @click="isSideBarOpen = true"
                class="p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
              >
                <Bars3Icon class="h-7 w-7 text-jati stroke-[2.5]" />
              </button>

              <!-- Logo y nombre de la tienda -->
              <a 
                v-if="store"
                href="#"
                @click.prevent="router.push(homeRoute)"
                class="flex items-center gap-2 ml-2 md:ml-4"
              >
                <img 
                  v-if="store?.logo" 
                  :src="store.logo"
                  class="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full"
                  alt="Logo"
                />
                <span class="text-lg md:text-xl font-bold gradient-text">
                  {{ store?.nombre }}
                </span>
              </a>
            </div>

            <!-- Sección central (SearchBar en desktop) -->
            <div 
              v-if="store && showSearch" 
              class="hidden md:flex flex-1 justify-center px-8"
            >
              <SearchBar @filter="handleSearch" />
            </div>

            <!-- Sección derecha -->
            <div v-if="store" class="flex items-center space-x-2 md:space-x-4 ml-auto">
              <div
                class="flex items-center p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
                :title="getMonedaTitle(store?.moneda_principal)"
              >
                <CurrencyDollarIcon class="h-7 w-7 text-jati stroke-[2.5]" />
                <span class="text-sm font-medium text-jati ml-1 mr-1">
                  {{store?.moneda_principal}}
                </span>
              </div>
              <a
                href="#"
                @click.prevent="router.push(ubicacionRoute)"
                class="p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
                title="Ubicación"
              >
                <MapPinIcon class="h-7 w-7 text-jati hover:text-shop transition-colors stroke-[2.5]" />
              </a>
              <a
                href="#"
                @click.prevent="router.push(ayudaRoute)"
                class="p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
                title="Ayuda"
              >
                <QuestionMarkCircleIcon class="h-7 w-7 text-jati hover:text-shop transition-colors stroke-[2.5]" />
              </a>
            </div>
          </div>

          <!-- SearchBar y Breadcrumb -->
          <div v-if="store" class="pb-2 md:pb-3">
            <div 
              v-if="showSearch" 
              class="md:hidden mb-1"
            >
              <SearchBar @filter="handleSearch" />
            </div>
            <Breadcrumb />
          </div>
        </div>
      </div>
    </nav>

    <!-- Ajustar el espaciador -->
    <div :class="{'h-24 md:h-28': store, 'h-14 md:h-16': !store}"></div>

    <SideBar 
      v-if="store"
      :is-open="isSideBarOpen" 
      :store="store"
      @close="isSideBarOpen = false" 
    />
  </div>
</template>

<style scoped>
.gradient-text {
  background-size: 200% auto;
  background-image: linear-gradient(
    90deg, 
    v-bind('store?.tema?.color_primario || "#8E44AD"') 0%,
    v-bind('store?.tema?.color_secundario || "#E67E22"') 50%,
    v-bind('store?.tema?.color_primario || "#8E44AD"') 100%
  );
  animation: shine 3s linear infinite;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}
</style>
