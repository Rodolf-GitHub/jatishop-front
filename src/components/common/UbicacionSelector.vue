<script setup>
import { ref, watch, onMounted } from 'vue';
import { services } from '@/services/api';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ provincia: '', municipio: '' })
  }
});

const emit = defineEmits(['update:modelValue']);

const provincias = ref([]);
const municipios = ref([]);
const selectedProvincia = ref(props.modelValue.provincia || '');
const selectedMunicipio = ref(props.modelValue.municipio || '');

const loadProvincias = async () => {
  try {
    const response = await services.getProvincias();
    console.log('Provincias cargadas:', response.data);
    provincias.value = response.data;
  } catch (error) {
    console.error('Error al cargar provincias:', error);
  }
};

const loadMunicipios = async (provincia) => {
  if (!provincia) {
    municipios.value = [];
    return;
  }
  
  try {
    const response = await services.getMunicipios(provincia);
    console.log('Municipios cargados:', response.data);
    municipios.value = response.data;
  } catch (error) {
    console.error('Error al cargar municipios:', error);
  }
};

// Actualizar el modelo cuando cambia la provincia
watch(selectedProvincia, (newProvincia) => {
  console.log('Provincia seleccionada:', newProvincia);
  selectedMunicipio.value = '';
  loadMunicipios(newProvincia);
  emit('update:modelValue', {
    provincia: newProvincia,
    municipio: ''
  });
});

// Actualizar el modelo cuando cambia el municipio
watch(selectedMunicipio, (newMunicipio) => {
  console.log('Municipio seleccionado:', newMunicipio);
  emit('update:modelValue', {
    provincia: selectedProvincia.value,
    municipio: newMunicipio
  });
});

// Sincronizar con cambios externos
watch(() => props.modelValue, (newValue) => {
  console.log('Modelo actualizado externamente:', newValue);
  if (newValue.provincia !== selectedProvincia.value) {
    selectedProvincia.value = newValue.provincia;
  }
  if (newValue.municipio !== selectedMunicipio.value) {
    selectedMunicipio.value = newValue.municipio;
  }
}, { deep: true });

onMounted(async () => {
  console.log('Componente montado, cargando provincias...');
  await loadProvincias();
  if (props.modelValue.provincia) {
    await loadMunicipios(props.modelValue.provincia);
  }
});
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Provincia
      </label>
      <select
        v-model="selectedProvincia"
        class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Seleccione una provincia</option>
        <option
          v-for="provincia in provincias"
          :key="provincia"
          :value="provincia"
        >
          {{ provincia }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Municipio
      </label>
      <select
        v-model="selectedMunicipio"
        :disabled="!selectedProvincia"
        class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
      >
        <option value="">Seleccione un municipio</option>
        <option
          v-for="municipio in municipios"
          :key="municipio"
          :value="municipio"
        >
          {{ municipio }}
        </option>
      </select>
    </div>

    <div class="text-sm text-gray-500" v-if="provincias.length === 0">
      Cargando provincias...
    </div>
  </div>
</template>