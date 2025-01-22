<template>
  <div>
    <div class="mb-8">
      <h1 class="text-xl md:text-2xl font-bold text-white mb-2">
        {{ negocio ? "Editar Negocio" : "Crear Negocio" }}
      </h1>
      <p class="text-sm md:text-base text-gray-400">
        {{
          negocio
            ? "Actualiza la información de tu negocio"
            : "Configura tu negocio para empezar a vender"
        }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"
      ></div>
    </div>

    <!-- Error Message -->
    <div
      v-else-if="error"
      class="bg-red-500/10 border border-red-500 rounded-xl p-4 mb-6"
    >
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Form -->
    <form
      v-else
      @submit.prevent="handleSubmit"
      class="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6"
    >
      <!-- Imágenes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Logo -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Logo del Negocio</label
          >
          <div class="flex items-center gap-4">
            <div
              class="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="previewLogo"
                :src="previewLogo"
                alt="Logo Preview"
                class="w-full h-full object-cover"
              />
              <i v-else class="fas fa-store text-4xl text-gray-500"></i>
            </div>
            <input
              type="file"
              ref="logoInput"
              @change="handleLogoChange"
              accept="image/*"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.logoInput.click()"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Cambiar Logo
            </button>
          </div>
        </div>

        <!-- Imagen de Portada -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Imagen de Portada</label
          >
          <div class="flex items-center gap-4">
            <div
              class="w-32 h-24 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="previewPortada"
                :src="previewPortada"
                alt="Portada Preview"
                class="w-full h-full object-cover"
              />
              <i v-else class="fas fa-image text-4xl text-gray-500"></i>
            </div>
            <input
              type="file"
              ref="portadaInput"
              @change="handlePortadaChange"
              accept="image/*"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.portadaInput.click()"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Cambiar Portada
            </button>
          </div>
        </div>
      </div>

      <!-- Información Básica -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Nombre del Negocio*</label
          >
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Email*</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Teléfono*</label
          >
          <input
            v-model="form.telefono"
            type="tel"
            required
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >WhatsApp</label
          >
          <input
            v-model="form.whatsapp"
            type="tel"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <!-- Ubicación -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Provincia*</label
          >
          <select
            v-model="form.provincia"
            required
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
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
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Municipio*</label
          >
          <select
            v-model="form.municipio"
            required
            :disabled="!form.provincia"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
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

        <!-- Nuevos campos de Latitud y Longitud -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300"
              >Latitud</label
            >
            <div class="flex gap-2">
              <input
                v-model="form.latitud"
                type="text"
                readonly
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300"
              >Longitud</label
            >
            <div class="flex gap-2">
              <input
                v-model="form.longitud"
                type="text"
                readonly
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div class="md:col-span-2 flex justify-end">
            <button
              type="button"
              @click="showMapModal = true"
              class="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              Seleccionar Ubicación
            </button>
          </div>
        </div>
      </div>

      <!-- Dirección -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Dirección*</label
        >
        <textarea
          v-model="form.direccion"
          required
          rows="2"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
        ></textarea>
      </div>

      <!-- Descripción -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Descripción del Negocio</label
        >
        <textarea
          v-model="form.descripcion"
          rows="4"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
        ></textarea>
      </div>

      <!-- Horario -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Horario de Atención</label
        >
        <input
          v-model="form.horario"
          type="text"
          placeholder="Ej: Lunes a Viernes 9:00 AM - 6:00 PM"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <!-- Configuraciones -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              v-model="form.activo"
              class="w-4 h-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-800"
            />
            <span class="text-gray-300">Negocio Activo</span>
          </label>
        </div>

        <div>
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              v-model="form.hace_domicilio"
              class="w-4 h-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-800"
            />
            <span class="text-gray-300">Hace Domicilios</span>
          </label>
        </div>

        <div>
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              v-model="form.acepta_transferencia"
              class="w-4 h-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-800"
            />
            <span class="text-gray-300">Acepta Transferencias</span>
          </label>
        </div>
      </div>

      <!-- Moneda -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2"
          >Moneda Principal*</label
        >
        <select
          v-model="form.moneda_principal"
          required
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="CUP">CUP - Peso Cubano</option>
          <option value="USD">USD - Dólar Americano</option>
          <option value="EUR">EUR - Euro</option>
          <option value="ZELLE">ZELLE</option>
          <option value="MLC">MLC</option>
        </select>
      </div>

      <!-- Colores del tema -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Color Primario</label
          >
          <input
            v-model="form.tema.color_primario"
            type="color"
            class="w-full h-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          />
          <p class="mt-1 text-sm text-gray-400">
            Color actual: {{ form.tema.color_primario }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Color Secundario</label
          >
          <input
            v-model="form.tema.color_secundario"
            type="color"
            class="w-full h-10 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          />
          <p class="mt-1 text-sm text-gray-400">
            Color actual: {{ form.tema.color_secundario }}
          </p>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
          @click="window.location.reload()"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <span
            v-if="loading"
            class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
          ></span>
          {{ negocio ? "Actualizar Negocio" : "Crear Negocio" }}
        </button>
      </div>
    </form>

    <!-- Modal del Mapa -->
    <Teleport to="body">
      <div
        v-if="showMapModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <div class="bg-gray-800 rounded-xl w-full max-w-3xl">
          <div class="p-6">
            <h2 class="text-xl font-bold text-white mb-4">
              Seleccionar ubicación
            </h2>
            <div
              class="h-[400px] w-full bg-gray-700 rounded-lg mb-4"
              ref="mapContainer"
            ></div>
            <div class="flex justify-end gap-4">
              <button
                @click="showMapModal = false"
                class="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                @click="confirmarUbicacion"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { adminServices } from "@/services/admin";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { PROVINCIAS, getMunicipios } from "@/utils/ubicaciones";

const router = useRouter();
const toast = useToast();

const negocio = ref(null);
const loading = ref(false);
const error = ref(null);
const provincias = ref(PROVINCIAS);
const municipios = ref([]);

const previewLogo = ref(null);
const previewPortada = ref(null);

// Nuevas referencias
const showMapModal = ref(false);
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);

// Formulario con valores por defecto según el modelo
const form = ref({
  nombre: "",
  descripcion: "Este negocio aún no tiene descripción",
  direccion: "Este negocio aún no ha configurado su dirección",
  telefono: "Sin teléfono",
  email: "",
  logo: null,
  img_portada: null,
  activo: true,
  hace_domicilio: false,
  acepta_transferencia: false,
  moneda_principal: "CUP",
  whatsapp: "",
  horario: "Este negocio aún no ha configurado su horario",
  latitud: "21.9442",
  longitud: "-79.1714",
  provincia: "",
  municipio: "",
  tema: {
    color_primario: "#8E44AD",
    color_secundario: "#E67E22",
  },
});

// Cargar provincias
const loadProvincias = async () => {
  // try {
  //   const response = await adminServices.getProvincias();
  //   provincias.value = response.data;
  // } catch (err) {
  //   console.error("Error al cargar provincias:", err);
  //   toast.error("Error al cargar las provincias");
  // }
  provincias.value = PROVINCIAS;
};

// Cargar municipios cuando cambia la provincia
const handleProvinciaChange = () => {
  form.value.municipio = ""; // Reset municipio
  municipios.value = getMunicipios(form.value.provincia); // Obtener municipios de la provincia seleccionada
};

// Observar cambios en provincia
watch(
  () => form.value.provincia,
  (newValue) => {
    if (newValue) {
      municipios.value = getMunicipios(newValue);
      // Solo resetear municipio si la provincia cambió (no en la carga inicial)
      if (negocio.value && negocio.value.provincia !== newValue) {
        form.value.municipio = "";
      }
    } else {
      municipios.value = [];
    }
  }
);

// Manejar cambios de imágenes
const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.logo = file;
    previewLogo.value = URL.createObjectURL(file);
  }
};

const handlePortadaChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.img_portada = file;
    previewPortada.value = URL.createObjectURL(file);
  }
};

// Validar formulario
const validateForm = () => {
  const requiredFields = {
    nombre: "Nombre del negocio",
    provincia: "Provincia",
    municipio: "Municipio",
  };

  for (const [field, label] of Object.entries(requiredFields)) {
    if (!form.value[field]) {
      toast.error(`El campo ${label} es requerido`);
      return false;
    }
  }

  // Validar que los colores del tema estén presentes
  if (!form.value.tema?.color_primario || !form.value.tema?.color_secundario) {
    toast.error("Los colores del tema son requeridos");
    return false;
  }

  return true;
};

// Enviar formulario
const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = null;

  try {
    if (negocio.value) {
      // Primero actualizamos la información general del negocio
      const datosActualizacion = {
        nombre: form.value.nombre,
        descripcion: form.value.descripcion,
        direccion: form.value.direccion,
        telefono: form.value.telefono,
        email: form.value.email,
        whatsapp: form.value.whatsapp,
        horario: form.value.horario,
        provincia: form.value.provincia,
        municipio: form.value.municipio,
        latitud: form.value.latitud,
        longitud: form.value.longitud,
        activo: form.value.activo,
        hace_domicilio: form.value.hace_domicilio,
        acepta_transferencia: form.value.acepta_transferencia,
        moneda_principal: form.value.moneda_principal,
      };

      // Si hay archivos nuevos, agregarlos
      if (form.value.logo instanceof File) {
        datosActualizacion.logo = form.value.logo;
      }
      if (form.value.img_portada instanceof File) {
        datosActualizacion.img_portada = form.value.img_portada;
      }

      // Primero actualizamos la información general
      await adminServices.updateNegocio(datosActualizacion);

      // Luego actualizamos los colores del tema
      await adminServices.updateTema({
        color_primario: form.value.tema.color_primario,
        color_secundario: form.value.tema.color_secundario,
      });

      toast.success("Negocio actualizado exitosamente");
    } else {
      // Para crear un nuevo negocio
      await adminServices.createNegocio(form.value);

      // Después de crear, actualizamos los colores
      await adminServices.updateTema({
        color_primario: form.value.tema.color_primario,
        color_secundario: form.value.tema.color_secundario,
      });

      toast.success("Negocio creado exitosamente");
    }
  } catch (err) {
    console.error("Error:", err);
    if (err.response?.data) {
      console.error("Respuesta del servidor:", err.response.data);
    }
    error.value =
      err.response?.data?.message || "Error al procesar la solicitud";
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

// Resetear formulario
const resetForm = () => {
  Object.assign(form.value, {
    nombre: "",
    descripcion: "Este negocio aún no tiene descripción",
    direccion: "Este negocio aún no ha configurado su dirección",
    telefono: "Sin teléfono",
    email: "",
    logo: null,
    img_portada: null,
    activo: true,
    hace_domicilio: false,
    acepta_transferencia: false,
    moneda_principal: "CUP",
    whatsapp: "",
    horario: "Este negocio aún no ha configurado su horario",
    latitud: "0",
    longitud: "0",
    provincia: "",
    municipio: "",
    tema: {
      color_primario: "#8E44AD",
      color_secundario: "#E67E22",
    },
  });
  previewLogo.value = null;
  previewPortada.value = null;
};

// Cargar negocio existente si lo hay
const loadExistingNegocio = async () => {
  const currentUser = adminServices.getCurrentUser();
  if (currentUser?.negocio) {
    try {
      const response = await adminServices.getNegocio(currentUser.negocio);
      negocio.value = response.data;

      // Asegurarse de que el tema se maneje correctamente
      const tema = response.data.tema || {};

      Object.assign(form.value, {
        ...response.data,
        tema: {
          color_primario: tema.color_primario || "#8E44AD",
          color_secundario: tema.color_secundario || "#E67E22",
        },
      });

      if (response.data.logo) previewLogo.value = response.data.logo;
      if (response.data.img_portada)
        previewPortada.value = response.data.img_portada;
    } catch (err) {
      console.error("Error al cargar negocio:", err);
      toast.error("Error al cargar la información del negocio");
    }
  }
};

// Función para inicializar el mapa
const initializeMap = () => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }

  // Coordenadas de Jatibonico, Sancti Spíritus
  const defaultLat = 21.9442;
  const defaultLng = -79.1714;

  // Usar las coordenadas existentes si están disponibles, si no usar las de Jatibonico
  const lat = form.value.latitud ? parseFloat(form.value.latitud) : defaultLat;
  const lng = form.value.longitud
    ? parseFloat(form.value.longitud)
    : defaultLng;

  nextTick(() => {
    map.value = L.map(mapContainer.value).setView([lat, lng], 13); // Zoom más cercano para ver mejor la ciudad

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
    }).addTo(map.value);

    // Siempre agregar un marcador, ya sea en la ubicación existente o en la ubicación por defecto
    marker.value = L.marker([lat, lng]).addTo(map.value);

    // Evento click en el mapa
    map.value.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker.value) {
        marker.value.setLatLng([lat, lng]);
      } else {
        marker.value = L.marker([lat, lng]).addTo(map.value);
      }
    });

    // Ajustar tamaño del mapa
    setTimeout(() => {
      map.value?.invalidateSize();
    }, 100);
  });
};

// Watch para el modal
watch(showMapModal, (newValue) => {
  if (newValue) {
    nextTick(() => {
      initializeMap();
    });
  }
});

// Función para confirmar ubicación
const confirmarUbicacion = () => {
  if (marker.value) {
    const { lat, lng } = marker.value.getLatLng();
    form.value.latitud = lat.toFixed(6);
    form.value.longitud = lng.toFixed(6);
    showMapModal.value = false;
  }
};

// Agregar esto después de los imports para corregir el ícono del marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

onMounted(async () => {
  loading.value = true;
  try {
    await loadProvincias();
    await loadExistingNegocio();
  } catch (err) {
    error.value = "Error al cargar la información inicial";
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.leaflet-control-container .leaflet-control {
  z-index: 1000;
}
</style>
