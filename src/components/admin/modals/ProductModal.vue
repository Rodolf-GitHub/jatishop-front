<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div class="min-h-[calc(100vh-2rem)] flex items-center justify-center py-8">
      <div class="bg-gray-800 rounded-xl w-full max-w-2xl relative">
        <!-- Header (fijo) -->
        <div class="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 rounded-t-xl z-10">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-white">
              {{ props.editingProduct ? "Editar Producto" : "Nuevo Producto" }}
            </h3>
            <button
              @click="emit('close')"
              class="text-gray-400 hover:text-gray-300"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Contenido con scroll -->
        <div class="max-h-[calc(100vh-16rem)] overflow-y-auto">
          <form @submit.prevent="handleSubmit">
            <div class="p-6 space-y-6">
              <!-- Imagen -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Imagen del Producto
                </label>
                <div class="flex items-center gap-4">
                  <div
                    class="w-32 h-32 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      v-if="imagePreview"
                      :src="imagePreview"
                      alt="Preview"
                      class="w-full h-full object-cover"
                    />
                    <PhotoIcon v-else class="w-12 h-12 text-gray-500" />
                  </div>
                  <input
                    type="file"
                    ref="imageInput"
                    @change="handleImageUpload"
                    accept="image/*"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.imageInput.click()"
                    class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                  >
                    Seleccionar Imagen
                  </button>
                </div>
              </div>

              <!-- Categoría y Subcategoría -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Categoría*
                  </label>
                  <select
                    v-model="selectedCategory"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category"
                    >
                      {{ category.nombre }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Subcategoría*
                  </label>
                  <select
                    v-model="selectedSubcategory"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                    required
                  >
                    <option value="">Seleccionar subcategoría</option>
                    <option
                      v-for="subcategory in selectedCategorySubcategories"
                      :key="subcategory.id"
                      :value="subcategory.id"
                    >
                      {{ subcategory.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Nombre y Precio -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Nombre*
                  </label>
                  <input
                    v-model="form.nombre"
                    type="text"
                    required
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Precio*
                  </label>
                  <input
                    v-model="form.precio"
                    type="number"
                    step="0.01"
                    required
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                  />
                </div>
              </div>

              <!-- Stock y Descuento -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Stock*
                  </label>
                  <input
                    v-model="form.stock"
                    type="number"
                    required
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Descuento (%)
                  </label>
                  <input
                    v-model="form.descuento"
                    type="number"
                    min="0"
                    max="99"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                  />
                </div>
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  v-model="form.descripcion"
                  rows="3"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200"
                ></textarea>
              </div>

              <!-- Estado -->
              <div class="flex items-center">
                <input
                  v-model="form.activo"
                  type="checkbox"
                  class="w-4 h-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500"
                />
                <label class="ml-2 text-sm text-gray-300">Producto activo</label>
              </div>
            </div>

            <!-- Footer (fijo) -->
            <div class="sticky bottom-0 bg-gray-800 p-6 border-t border-gray-700 rounded-b-xl">
              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  @click="emit('close')"
                  class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isSubmitting"
                >
                  <div v-if="isSubmitting" class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Procesando...</span>
                  </div>
                  <span v-else>
                    {{ props.editingProduct ? "Actualizar" : "Crear" }}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import { adminServices } from "@/services/admin";
import { XMarkIcon, PhotoIcon } from "@heroicons/vue/24/outline";
import { emitter, EVENT_TYPES } from '@/utils/eventBus';

const props = defineProps({
  editingProduct: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'saved']);

const toast = useToast();
const selectedCategory = ref(null);
const selectedSubcategory = ref(null);
const imagePreview = ref(null);
const isSubmitting = ref(false);

const form = ref({
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: null,
  subcategoria: null,
  descuento: 0,
  activo: true,
});

// Computed para las subcategorías de la categoría seleccionada
const selectedCategorySubcategories = computed(() => {
  if (!selectedCategory.value) return [];
  return selectedCategory.value.subcategorias || [];
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.imagen = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  try {
    if (!selectedSubcategory.value) {
      toast.error("Debes seleccionar una subcategoría");
      return;
    }

    isSubmitting.value = true;
    const formData = new FormData();
    formData.append("subcategoria", selectedSubcategory.value);
    formData.append("nombre", form.value.nombre);
    formData.append("descripcion", form.value.descripcion || "");
    formData.append("precio", form.value.precio.toString());
    formData.append("stock", form.value.stock.toString());
    formData.append("descuento", (form.value.descuento || 0).toString());
    formData.append("activo", form.value.activo.toString());

    if (form.value.imagen) {
      formData.append("imagen", form.value.imagen);
    }

    // Log de los datos que se envían
    console.log('Datos enviados al backend:', {
      subcategoria: selectedSubcategory.value,
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      precio: form.value.precio,
      stock: form.value.stock,
      descuento: form.value.descuento,
      activo: form.value.activo,
      imagen: form.value.imagen ? 'Imagen presente' : 'Sin imagen'
    });

    if (props.editingProduct) {
      await adminServices.updateProduct(props.editingProduct.id, formData);
      toast.success("Producto actualizado correctamente");
    } else {
      await adminServices.createProduct(formData);
      toast.success("Producto creado correctamente");
    }
    
    emit('saved');
    emitter.emit(EVENT_TYPES.PRODUCT_UPDATED);
  } catch (error) {
    console.error("Error al guardar el producto:", error);

    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.subcategoria) {
        toast.error("Debes seleccionar una subcategoría válida");
      }
      else if (errorData.nombre) {
        if (Array.isArray(errorData.nombre)) {
          toast.error(errorData.nombre[0]);
        } else {
          toast.error(errorData.nombre);
        }
      }
      else if (errorData.precio) {
        toast.error(Array.isArray(errorData.precio) 
          ? errorData.precio[0] 
          : "El precio debe ser un número válido");
      }
      else if (errorData.stock) {
        toast.error(Array.isArray(errorData.stock) 
          ? errorData.stock[0] 
          : "El stock debe ser un número válido");
      }
      else if (errorData.descuento) {
        toast.error(Array.isArray(errorData.descuento) 
          ? errorData.descuento[0] 
          : "El descuento debe ser un número válido entre 0 y 100");
      }
      else if (errorData.imagen) {
        toast.error(Array.isArray(errorData.imagen) 
          ? errorData.imagen[0] 
          : "Error con la imagen del producto");
      }
      else if (typeof errorData === 'string') {
        toast.error(errorData);
      }
      else {
        toast.error("Error al guardar el producto. Por favor, verifica los datos");
      }
    } else {
      toast.error("Error al guardar el producto");
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Watch para cargar datos cuando se está editando
watch(() => props.editingProduct, (product) => {
  if (product) {
    selectedCategory.value = product.subcategoria.categoria;
    selectedSubcategory.value = product.subcategoria.id;
    form.value = {
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio || 0,
      stock: product.stock || 0,
      imagen: null,
      descuento: product.descuento || 0,
      activo: typeof product.activo === "boolean" ? product.activo : true,
    };
    if (product.imagen) {
      imagePreview.value = product.imagen;
    }
  }
}, { immediate: true });
</script> 