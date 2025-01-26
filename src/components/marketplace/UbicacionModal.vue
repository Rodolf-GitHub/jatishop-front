<script setup>
import { ref, onMounted } from "vue";
import { services } from "@/services/api";
import UbicacionSelector from "@/components/common/UbicacionSelector.vue";
import { MapPinIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close", "update-ubicacion"]);

const ubicacion = ref({
  provincia: "",
  municipio: "",
});

const guardarUbicacion = () => {
  localStorage.setItem("ubicacion", JSON.stringify(ubicacion.value));
  emit("update-ubicacion", ubicacion.value);
  emit("close");
};

const limpiarUbicacion = () => {
  localStorage.removeItem("ubicacion");
  ubicacion.value = { provincia: "", municipio: "" };
  emit("update-ubicacion", ubicacion.value);
  emit("close");
};

onMounted(() => {
  const savedUbicacion = localStorage.getItem("ubicacion");
  if (savedUbicacion) {
    ubicacion.value = JSON.parse(savedUbicacion);
  }
});
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full" @click.stop>
      <div class="flex items-center gap-2 mb-6">
        <MapPinIcon class="h-6 w-6 text-blue-600" />
        <h2 class="text-xl font-bold">Selecciona tu ubicación</h2>
      </div>

      <UbicacionSelector v-model="ubicacion" class="mb-6" />

      <div class="flex gap-4">
        <button
          @click="guardarUbicacion"
          :disabled="!ubicacion.provincia"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Guardar ubicación
        </button>
        <button
          @click="limpiarUbicacion"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Toda Cuba
        </button>
      </div>
    </div>
  </div>
</template>
