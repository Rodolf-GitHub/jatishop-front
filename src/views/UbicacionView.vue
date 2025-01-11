<script setup>
import { ref, computed, onMounted } from "vue";
import { MapPinIcon } from "@heroicons/vue/24/outline";
import { services } from "@/services/api";
import { useRoute } from "vue-router";

const route = useRoute();
const infoNegocio = ref(null);

onMounted(async () => {
  try {
    const response = await services.getStore(route.params.slug);
    infoNegocio.value = response.data;
  } catch (error) {
    console.error("Error al cargar la información del negocio:", error);
  }
});

const getGoogleMapsUrl = computed(() => {
  if (!infoNegocio.value?.latitud || !infoNegocio.value?.longitud) {
    return null;
  }
  
  const lat = infoNegocio.value.latitud;
  const lng = infoNegocio.value.longitud;
  
  // Aumentamos el zoom a 19 para ver más cerca
  return `https://www.google.com/maps?q=${lat},${lng}&z=19&output=embed&t=m`;
});

const getDirectionsUrl = computed(() => {
  if (!infoNegocio.value?.latitud || !infoNegocio.value?.longitud) {
    return null;
  }
  
  const lat = infoNegocio.value.latitud;
  const lng = infoNegocio.value.longitud;
  const nombre = encodeURIComponent(infoNegocio.value.nombre);
  
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_name=${nombre}`;
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-4 text-center">
      ¿Cómo llegar a nuestra tienda?
    </h1>

    <div class="grid gap-8 mt-8">
      <!-- Ubicación -->
      <div v-if="infoNegocio?.direccion" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPinIcon class="h-6 w-6 text-jati" />
          Ubicación
        </h2>
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="flex-1">
              <p class="font-medium">Dirección</p>
              <p class="text-gray-600">{{ infoNegocio.direccion }}</p>
              <p v-if="infoNegocio.horario" class="text-gray-500 mt-1">
                {{ infoNegocio.horario }}
              </p>
              <a
                v-if="getDirectionsUrl"
                :href="getDirectionsUrl"
                target="_blank"
                class="inline-block mt-2 text-jati hover:text-shop transition-colors"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </div>

        <!-- Mapa -->
        <div 
          v-if="infoNegocio?.latitud && infoNegocio?.longitud"
          class="relative h-[450px] rounded-2xl overflow-hidden shadow-lg mt-4"
        >
          <iframe
            :src="getGoogleMapsUrl"
            width="100%"
            height="100%"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="absolute inset-0"
          ></iframe>
        </div>
        <p v-else class="text-gray-500 text-center mt-4">
          Ubicación no disponible en el mapa
        </p>
      </div>
    </div>
  </div>
</template>