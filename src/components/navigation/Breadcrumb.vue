<script setup>
import { ref, computed, watch } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { useRoute } from "vue-router";
import { services } from "@/services/api";

const route = useRoute();
const categoriaInfo = ref(null);
const subcategoriaInfo = ref(null);
const productoInfo = ref(null);

const fetchCategoriaInfo = async (categoriaId) => {
  if (!categoriaId) return;
  try {
    const response = await services.getCategoria(
      route.params.slug,
      categoriaId,
    );
    if (response?.data) {
      categoriaInfo.value = response.data;
    }
  } catch (error) {
    console.error("Error al cargar categoría:", error);
  }
};

const fetchSubcategoriaInfo = async (subcategoriaId) => {
  if (!subcategoriaId) return;
  try {
    const response = await services.getSubcategoria(
      route.params.slug,
      subcategoriaId,
    );
    if (response?.data) {
      subcategoriaInfo.value = response.data;
      if (response.data.categoria) {
        await fetchCategoriaInfo(response.data.categoria);
      }
    }
  } catch (error) {
    console.error("Error al cargar subcategoría:", error);
  }
};

const fetchProductoInfo = async (productoId) => {
  if (!productoId) return;
  try {
    const response = await services.getProducto(route.params.slug, productoId);
    if (response?.data) {
      productoInfo.value = response.data;
      if (response.data.categoria) {
        await fetchCategoriaInfo(response.data.categoria);
      }
      if (response.data.subcategoria) {
        await fetchSubcategoriaInfo(response.data.subcategoria);
      }
    }
  } catch (error) {
    console.error("Error al cargar producto:", error);
  }
};

const breadcrumbs = computed(() => {
  const items = [
    {
      name: "Inicio",
      to: {
        name: "store",
        params: { slug: route.params.slug },
      },
    },
  ];

  if (route.name === "store-ayuda") {
    items.push({
      name: "Ayuda",
      to: null,
    });
    return items;
  }

  if (categoriaInfo.value) {
    const categoriaRoute = {
      name: "store-categoria",
      params: {
        slug: route.params.slug,
        id: categoriaInfo.value.id,
      },
    };

    items.push({
      name: categoriaInfo.value.nombre,
      to: route.name === "store-categoria" ? null : categoriaRoute,
    });
  }

  if (subcategoriaInfo.value && categoriaInfo.value) {
    const subcategoriaRoute = {
      name: "store-subcategoria",
      params: {
        slug: route.params.slug,
        id: categoriaInfo.value.id,
        subcategoriaId: subcategoriaInfo.value.id,
      },
    };

    items.push({
      name: subcategoriaInfo.value.nombre,
      to: route.name === "store-subcategoria" ? null : subcategoriaRoute,
    });
  }

  if (route.name === "store-producto" && productoInfo.value) {
    items.push({
      name: productoInfo.value.nombre,
      to: null,
    });
  }

  return items;
});

watch(
  () => route.fullPath,
  async () => {
    try {
      // Limpiar estados
      categoriaInfo.value = null;
      subcategoriaInfo.value = null;
      productoInfo.value = null;

      // Cargar datos según la ruta actual
      if (route.name === "store-producto" && route.params.productoId) {
        await fetchProductoInfo(route.params.productoId);
      } else if (
        route.name === "store-subcategoria" &&
        route.params.subcategoriaId
      ) {
        await fetchSubcategoriaInfo(route.params.subcategoriaId);
      } else if (route.name === "store-categoria" && route.params.id) {
        await fetchCategoriaInfo(route.params.id);
      }
    } catch (error) {
      console.error("Error en watch:", error);
    }
  },
  { immediate: true },
);
</script>

<template>
  <nav class="flex items-center space-x-1 text-sm text-gray-500 mb-2">
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <router-link
        v-if="item.to"
        :to="item.to"
        class="hover:text-gray-700 transition-colors duration-200"
      >
        {{ item.name }}
      </router-link>
      <span v-else class="text-jati font-medium">
        {{ item.name }}
      </span>
      <ChevronRightIcon v-if="index < breadcrumbs.length - 1" class="h-4 w-4" />
    </template>
  </nav>
</template>
