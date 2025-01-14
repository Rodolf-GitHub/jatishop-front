<script setup>
import { ArrowRightIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { getImageUrl } from "@/utils/image";

const router = useRouter();

const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
});

const navigateToStore = () => {
  console.log('Datos del producto:', props.producto);
  
  if (!props.producto.tienda_slug) {
    console.error('Error: tienda_slug no está definido en el producto', props.producto);
    return;
  }

  const route = `/store/${props.producto.tienda_slug}/producto/${props.producto.id}`;
  console.log('Navegando a:', route);
  router.push(route);
};
</script>

<template>
  <div class="product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <!-- Imagen -->
    <div class="relative aspect-square cursor-pointer" @click="navigateToStore">
      <img
        :src="getImageUrl(producto.imagen)"
        :alt="producto.nombre"
        class="w-full h-full object-contain bg-gray-50 p-2"
      />
      <div
        v-if="producto.descuento > 0"
        class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
      >
        -{{ producto.descuento }}%
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <p v-if="producto.tienda_nombre" class="text-sm text-blue-600 mb-1 hover:text-blue-700">
        {{ producto.tienda_nombre }}
      </p>

      <h3 class="font-medium text-gray-900 mb-1 line-clamp-2 h-12">
        {{ producto.nombre }}
      </h3>

      <div class="flex items-baseline gap-2 mb-3">
        <span class="text-lg font-bold text-gray-900">
          ${{ producto.precio_con_descuento }}
        </span>
        <span
          v-if="producto.descuento > 0"
          class="text-sm text-gray-500 line-through"
        >
          ${{ producto.precio }}
        </span>
      </div>

      <button
        @click="navigateToStore"
        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        Ver producto
        <ArrowRightIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template> 