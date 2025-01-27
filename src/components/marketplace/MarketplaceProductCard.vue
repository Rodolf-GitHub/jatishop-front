<script setup>
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { getImageUrl } from "@/utils/image";

const router = useRouter();

const props = defineProps({
  producto: {
    type: Object,
    required: true,
  },
});

const navigateToStore = () => {
  if (!props.producto?.negocio?.slug) {
    console.error("Error: slug de negocio no disponible", props.producto);
    return;
  }

  // Simplemente navegamos a la ruta de detalles del producto
  router.push({
    name: "store-producto",
    params: {
      slug: props.producto.negocio.slug,
      productoId: props.producto.id.toString(),
    },
  });
};
</script>

<template>
  <div
    @click="navigateToStore"
    class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative flex flex-col cursor-pointer h-full"
    :style="{
      background: `linear-gradient(to bottom, ${producto.negocio?.tema?.color_primario}05, ${producto.negocio?.tema?.color_secundario}10)`,
    }"
  >
    <!-- Imagen y badge de descuento -->
    <div class="relative pt-[100%] w-full overflow-hidden">
      <img
        :src="getImageUrl(producto.imagen)"
        :alt="producto.nombre"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="$event.target.src = '/no-image.png'"
      />
      <div
        v-if="producto.descuento > 0"
        class="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
        :style="{
          background: `linear-gradient(45deg, ${producto.negocio?.tema?.color_primario}, ${producto.negocio?.tema?.color_secundario})`,
          color: 'white',
        }"
      >
        -{{ producto.descuento }}%
      </div>
    </div>

    <!-- Info -->
    <div
      class="p-4 flex flex-col flex-grow"
      :style="{
        background: `linear-gradient(to bottom, transparent, ${producto.negocio?.tema?.color_primario}05)`,
      }"
    >
      <p
        v-if="producto.tienda_nombre"
        class="text-sm font-medium mb-2 hover:opacity-80 transition-opacity truncate"
        :style="{ color: producto.negocio?.tema?.color_primario }"
      >
        {{ producto.tienda_nombre }}
      </p>

      <h3 class="font-medium text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem]">
        {{ producto.nombre }}
      </h3>

      <div class="mt-auto space-y-2">
        <!-- Precio -->
        <div class="flex items-baseline gap-2">
          <span
            class="text-xl font-bold"
            :style="{ color: producto.negocio?.tema?.color_primario }"
          >
            ${{ producto.precio_con_descuento }}
          </span>
          <span
            v-if="producto.descuento > 0"
            class="text-sm text-gray-500 line-through"
          >
            ${{ producto.precio }}
          </span>
        </div>

        <!-- Stock indicator -->
        <div class="flex items-center gap-2">
          <span
            class="text-xs font-medium px-3 py-1.5 rounded-full"
            :style="{
              background: `linear-gradient(45deg, ${producto.negocio?.tema?.color_primario}15, ${producto.negocio?.tema?.color_secundario}15)`,
              color: producto.negocio?.tema?.color_primario,
            }"
          >
            {{ producto.stock }} disponibles
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.05),
    0 2px 4px -2px rgb(0 0 0 / 0.025);
}

.product-card:hover {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.05);
}
</style>
