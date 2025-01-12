<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { services } from "@/services/api";
import { XMarkIcon, ChevronDownIcon, HomeIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  isOpen: Boolean,
  store: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);
const route = useRoute();
const router = useRouter();
const categorias = ref([]);
const expandedCategories = ref(new Set());

const fetchData = async () => {
  try {
    const [categoriasResponse, subcategoriasResponse] = await Promise.all([
      services.getCategorias(route.params.slug),
      services.getSubcategorias(route.params.slug)
    ]);

    const subcategoriasPorCategoria = subcategoriasResponse.data.reduce((acc, sub) => {
      if (!acc[sub.categoria]) {
        acc[sub.categoria] = [];
      }
      acc[sub.categoria].push(sub);
      return acc;
    }, {});

    categorias.value = categoriasResponse.data.map(cat => ({
      ...cat,
      subcategorias: subcategoriasPorCategoria[cat.id] || []
    }));
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
};

const toggleCategory = (categoriaId) => {
  if (expandedCategories.value.has(categoriaId)) {
    expandedCategories.value.delete(categoriaId);
  } else {
    expandedCategories.value.add(categoriaId);
  }
};

const isCategoryExpanded = (categoriaId) => {
  return expandedCategories.value.has(categoriaId);
};

const navigateToCategoria = (categoria) => {
  router.push({
    name: 'store-categoria',
    params: {
      slug: route.params.slug,
      id: categoria.id
    }
  });
  emit('close');
};

const navigateToSubcategoria = (categoria, subcategoria) => {
  router.push({
    name: 'store-subcategoria',
    params: {
      slug: route.params.slug,
      id: categoria.id,
      subcategoriaId: subcategoria.id
    }
  });
  emit('close');
};

const navigateToHome = () => {
  router.push({
    name: 'store',
    params: {
      slug: route.params.slug
    }
  });
  emit('close');
};

onMounted(fetchData);
</script>

<template>
  <div>
    <!-- Overlay -->
    <div
      v-show="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
      @click="emit('close')"
    />

    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col"
      :class="[isOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-jati to-shop text-white">
        <h2 class="text-xl font-bold">Categorías</h2>
        <button
          @click="emit('close')"
          class="p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Categories List -->
      <div class="flex-1 overflow-y-auto">
        <div class="py-2">
          <!-- Sección Todos -->
          <div class="px-4 mb-4">
            <div 
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors bg-gradient-to-r from-gray-50 to-gray-100"
              :class="{'bg-gradient-to-r from-jati/10 to-shop/10': !route.params.id && !route.params.subcategoriaId}"
              @click="navigateToHome"
            >
              <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <HomeIcon class="h-6 w-6 text-shop" />
              </div>
              <span class="font-medium text-gray-700" :class="{'font-semibold text-shop': !route.params.id && !route.params.subcategoriaId}">
                Ver Todo
              </span>
            </div>
          </div>

          <div v-for="categoria in categorias" :key="categoria.id" class="mb-2">
            <!-- Categoría -->
            <div class="px-4">
              <div 
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                :class="{'bg-gray-50': route.params.id === String(categoria.id)}"
                @click="navigateToCategoria(categoria)"
              >
                <!-- Imagen de categoría -->
                <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    v-if="categoria.imagen"
                    :src="categoria.imagen"
                    :alt="categoria.nombre"
                    class="w-full h-full object-cover"
                    @error="$event.target.src = '/placeholder-image.png'"
                  />
                  <div v-else class="w-full h-full bg-gradient-to-br from-jati to-jati/70" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span 
                      class="font-medium text-jati truncate"
                      :class="{'font-semibold': route.params.id === String(categoria.id)}"
                    >
                      {{ categoria.nombre }}
                    </span>
                    <ChevronDownIcon
                      v-if="categoria.subcategorias?.length"
                      class="h-5 w-5 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': isCategoryExpanded(categoria.id) }"
                      @click.stop="toggleCategory(categoria.id)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Subcategorías -->
            <div
              v-if="categoria.subcategorias?.length"
              class="overflow-hidden transition-all duration-200"
              :class="[isCategoryExpanded(categoria.id) ? 'max-h-[300px]' : 'max-h-0']"
            >
              <div 
                class="pl-16 pr-4 overflow-y-auto max-h-[300px] subcategorias-container"
              >
                <div
                  v-for="subcategoria in categoria.subcategorias"
                  :key="subcategoria.id"
                  class="py-2"
                >
                  <div
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    :class="{'bg-gray-50': route.params.subcategoriaId === String(subcategoria.id)}"
                    @click="navigateToSubcategoria(categoria, subcategoria)"
                  >
                    <!-- Imagen de subcategoría -->
                    <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        v-if="subcategoria.imagen"
                        :src="subcategoria.imagen"
                        :alt="subcategoria.nombre"
                        class="w-full h-full object-cover"
                        @error="$event.target.src = '/placeholder-image.png'"
                      />
                      <div v-else class="w-full h-full bg-gradient-to-br from-shop to-shop/70" />
                    </div>

                    <span 
                      class="text-shop font-medium truncate"
                      :class="{'font-semibold': route.params.subcategoriaId === String(subcategoria.id)}"
                    >
                      {{ subcategoria.nombre }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.from-jati {
  --tw-gradient-from: theme('colors.jati');
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-shop {
  --tw-gradient-to: theme('colors.shop');
}

.subcategorias-container {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.shop') transparent;
}

.subcategorias-container::-webkit-scrollbar {
  width: 6px;
}

.subcategorias-container::-webkit-scrollbar-track {
  background: transparent;
}

.subcategorias-container::-webkit-scrollbar-thumb {
  background-color: theme('colors.shop');
  border-radius: 3px;
}
</style>
