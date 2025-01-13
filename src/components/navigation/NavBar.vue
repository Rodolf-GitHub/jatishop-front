<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Bars3Icon,
  QuestionMarkCircleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TruckIcon,
  BanknotesIcon,
} from "@heroicons/vue/24/outline";
import SearchBar from "../filters/SearchBar.vue";
import SideBar from "./SideBar.vue";
import Breadcrumb from "./Breadcrumb.vue";

const props = defineProps({
  store: {
    type: Object,
    required: false,
    default: null,
  },
});

const emit = defineEmits(["search"]);
const router = useRouter();
const route = useRoute();
const isSideBarOpen = ref(false);
const showCurrencyTooltip = ref(false);
const showDeliveryTooltip = ref(false);
const showTransferTooltip = ref(false);

const homeRoute = computed(() => ({
  name: "store",
  params: { slug: route.params.slug },
}));

const ayudaRoute = computed(() => ({
  name: "store-ayuda",
  params: { slug: route.params.slug },
}));

const ubicacionRoute = computed(() => ({
  name: "store-ubicacion",
  params: { slug: route.params.slug },
}));

const showSearch = computed(() => {
  return ["store-categoria", "store-subcategoria"].includes(route.name);
});

const handleSearch = (query) => {
  emit("search", query);
};

const getMonedaTitle = (moneda) => {
  return `Moneda principal: ${moneda}`;
};

const toggleCurrencyTooltip = () => {
  showCurrencyTooltip.value = true;
  setTimeout(() => {
    showCurrencyTooltip.value = false;
  }, 3000);
};

const toggleDeliveryTooltip = () => {
  showDeliveryTooltip.value = true;
  setTimeout(() => {
    showDeliveryTooltip.value = false;
  }, 3000);
};

const toggleTransferTooltip = () => {
  showTransferTooltip.value = true;
  setTimeout(() => {
    showTransferTooltip.value = false;
  }, 3000);
};

const getDeliveryTitle = (hasDelivery) => {
  return hasDelivery
    ? "Esta tienda realiza entregas a domicilio"
    : "Esta tienda no realiza entregas a domicilio";
};

const getTransferTitle = (acceptsTransfer) => {
  return acceptsTransfer
    ? "Esta tienda acepta transferencias bancarias"
    : "Esta tienda no acepta transferencias bancarias";
};
</script>

<template>
  <div>
    <nav class="fixed top-0 left-0 right-0 bg-gray-50 shadow-lg z-40">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div class="flex flex-col">
          <div class="flex flex-col md:flex-row">
            <div class="flex items-center h-14 md:h-16 w-full">
              <div class="flex items-center gap-2">
                <button
                  v-if="store"
                  @click="isSideBarOpen = true"
                  class="p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
                >
                  <Bars3Icon class="h-7 w-7 text-jati stroke-[2.5]" />
                </button>

                <a
                  v-if="store"
                  href="#"
                  @click.prevent="router.push(homeRoute)"
                  class="flex items-center gap-2"
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

              <div
                v-if="store && showSearch"
                class="hidden md:flex flex-1 justify-center px-8"
              >
                <SearchBar @filter="handleSearch" />
              </div>

              <div class="ml-auto flex items-center gap-2">
                <a
                  href="/"
                  class="flex items-center gap-2 p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
                >
                  <img
                    src="/logo.jpg"
                    class="h-7 w-7 object-cover rounded-full"
                    alt="E-comCuba"
                  />
                  <span class="hidden md:block text-sm">E-comCuba</span>
                </a>
              </div>
            </div>
          </div>

          <div v-if="store" class="flex justify-between items-center py-2">
            <div class="flex justify-between items-center w-full">
              <!-- Currency -->
              <div
                class="relative flex items-center p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md cursor-help"
                @click="toggleCurrencyTooltip"
              >
                <CurrencyDollarIcon class="h-7 w-7 text-jati stroke-[2.5]" />
                <span class="text-sm font-medium text-jati ml-1 mr-1">
                  {{ store?.moneda_principal }}
                </span>
                <transition name="fade">
                  <div
                    v-if="showCurrencyTooltip"
                    class="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-black/90 text-white text-sm rounded-lg shadow-xl z-50 backdrop-blur-sm"
                  >
                    {{ getMonedaTitle(store?.moneda_principal) }}
                  </div>
                </transition>
              </div>
              <!-- Delivery -->
              <div
                class="relative flex items-center p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md cursor-help overflow-hidden"
                @click="toggleDeliveryTooltip"
              >
                <div class="relative">
                  <TruckIcon class="h-7 w-7 text-jati stroke-[2.5]" />
                  <div
                    v-if="!store?.hace_domicilio"
                    class="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div
                      class="w-full h-0.5 bg-red-500 transform -rotate-45"
                    ></div>
                  </div>
                </div>
                <transition name="fade">
                  <div v-if="showDeliveryTooltip" class="tooltip">
                    {{ getDeliveryTitle(store?.hace_domicilio) }}
                  </div>
                </transition>
              </div>

              <!-- Transfer -->
              <div
                class="relative flex items-center p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md cursor-help overflow-hidden"
                @click="toggleTransferTooltip"
              >
                <div class="relative">
                  <BanknotesIcon class="h-7 w-7 text-jati stroke-[2.5]" />
                  <div
                    v-if="!store?.acepta_transferencia"
                    class="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div
                      class="w-full h-0.5 bg-red-500 transform -rotate-45"
                    ></div>
                  </div>
                </div>
                <transition name="fade">
                  <div v-if="showTransferTooltip" class="tooltip">
                    {{ getTransferTitle(store?.acepta_transferencia) }}
                  </div>
                </transition>
              </div>

              <a
                href="#"
                @click.prevent="router.push(ubicacionRoute)"
                class="flex items-center p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
                title="Ubicación"
              >
                <MapPinIcon
                  class="h-7 w-7 text-jati hover:text-shop transition-colors stroke-[2.5]"
                />
                <!-- <span class="block text-sm ml-1">Ubicación</span> -->
              </a>

              <a
                href="#"
                @click.prevent="router.push(ayudaRoute)"
                class="flex items-center p-1.5 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
                title="Ayuda"
              >
                <QuestionMarkCircleIcon
                  class="h-7 w-7 text-jati hover:text-shop transition-colors stroke-[2.5]"
                />
                <!-- <span class="block text-sm ml-1">Ayuda</span> -->
              </a>
            </div>

            <div v-if="showSearch" class="md:hidden flex-1 mx-4">
              <SearchBar @filter="handleSearch" />
            </div>
          </div>

          <div v-if="store" class="pb-2 md:pb-3">
            <Breadcrumb />
          </div>
        </div>
      </div>
    </nav>

    <div :class="{ 'h-32 md:h-28': store, 'h-14 md:h-16': !store }"></div>

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tooltip {
  @apply fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
         px-6 py-3 bg-black/90 text-white text-sm rounded-lg shadow-xl z-50 
         backdrop-blur-sm;
}

.line-through {
  @apply relative;
}

.line-through::after {
  content: "";
  @apply absolute top-1/2 left-0 w-full h-0.5 bg-red-500;
  transform: translateY(-50%) rotate(-45deg);
}
</style>
