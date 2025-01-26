<template>
  <div>
    <div
      class="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0"
    >
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-white mb-2">
          Categorías
        </h1>
        <p class="text-sm md:text-base text-gray-400">
          Gestiona las categorías y subcategorías de tu tienda
        </p>
      </div>
      <button
        @click="showAddModal = true"
        class="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center md:justify-start gap-2"
      >
        <i class="fas fa-plus"></i>
        Nueva Categoría
      </button>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" 
      class="bg-gray-800 rounded-xl border border-gray-700 p-8"
    >
      <div class="flex flex-col items-center justify-center">
        <svg 
          class="animate-spin h-8 w-8 text-indigo-500 mb-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          />
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span class="text-gray-400">Cargando categorías...</span>
      </div>
    </div>

    <!-- Estado vacío -->
    <div
      v-else-if="!categories.length"
      class="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center"
    >
      <div class="mx-auto w-16 h-16 mb-4 text-gray-600">
        <FolderIcon class="w-full h-full" />
      </div>
      <h3 class="text-lg font-medium text-white mb-2">No hay categorías</h3>
      <p class="text-gray-400 mb-4">
        Aún no has creado ninguna categoría. Comienza agregando tu primera
        categoría.
      </p>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 gap-2"
      >
        <PlusCircleIcon class="w-5 h-5" />
        Agregar Categoría
      </button>
    </div>

    <!-- Lista de Categorías -->
    <div class="grid gap-4 md:gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
      >
        <!-- Cabecera de Categoría -->
        <div class="p-4 md:p-6 border-b border-gray-700">
          <div class="flex items-center justify-between">
            <!-- Información de la categoría -->
            <div class="flex items-center gap-4 min-w-0 flex-1">
              <div
                v-if="category.imagen"
                class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden"
              >
                <img
                  :src="getImageUrl(category.imagen)"
                  class="w-full h-full object-cover"
                  alt="Categoría"
                  @error="$event.target.style.display = 'none'"
                />
              </div>
              <div
                v-else
                class="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-700 flex items-center justify-center"
              >
                <FolderIcon class="w-8 h-8 text-gray-400" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-lg font-medium text-white truncate max-w-[200px]">{{ category.nombre }}</h3>
                <p v-if="category.descripcion" class="text-sm text-gray-400 truncate max-w-[200px]">
                  {{ category.descripcion }}
                </p>
              </div>
            </div>

            <!-- Botones de acción de categoría -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <button
                @click="editCategory(category)"
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                title="Editar categoría"
              >
                <PencilSquareIcon class="w-5 h-5" />
                <span class="text-sm hidden md:inline">Editar</span>
              </button>
              <button
                @click="deleteCategory(category.id)"
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                title="Eliminar categoría"
              >
                <TrashIcon class="w-5 h-5" />
                <span class="text-sm hidden md:inline">Eliminar</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sección de Subcategorías -->
        <div class="p-4 md:p-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-gray-400">
                {{ category.subcategorias?.length || 0 }} subcategorías
              </span>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="addSubcategory(category.id)"
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                title="Añadir subcategoría"
              >
                <PlusCircleIcon class="w-5 h-5" />
                <span class="text-sm">Añadir Subcategoría</span>
              </button>
              <button
                @click="category.isExpanded = !category.isExpanded"
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
              >
                <ChevronDownIcon
                  class="w-5 h-5 transition-transform duration-200"
                  :class="{ 'rotate-180': category.isExpanded }"
                />
                <span class="text-sm">
                  {{ category.isExpanded ? 'Ocultar' : 'Mostrar' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Lista de subcategorías -->
          <div
            v-if="category.isExpanded && category.subcategorias?.length > 0"
            class="mt-4 divide-y divide-gray-700 bg-gray-750 rounded-lg"
          >
            <div
              v-for="subcategory in category.subcategorias"
              :key="subcategory.id"
              class="p-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-4 min-w-0 flex-1">
                <div
                  v-if="subcategory.imagen"
                  class="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden"
                >
                  <img
                    :src="getImageUrl(subcategory.imagen)"
                    class="w-full h-full object-cover"
                    alt="Subcategoría"
                    @error="$event.target.style.display = 'none'"
                  />
                </div>
                <div
                  v-else
                  class="w-10 h-10 flex-shrink-0 rounded-lg bg-gray-700 flex items-center justify-center"
                >
                  <DocumentIcon class="w-6 h-6 text-gray-400" />
                </div>
                <span class="text-gray-300 truncate max-w-[200px]">{{ subcategory.nombre }}</span>
              </div>
              
              <!-- Botones de acción de subcategoría -->
              <div class="flex gap-2 flex-shrink-0">
                <button
                  @click="editSubcategory(category.id, subcategory)"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                  title="Editar subcategoría"
                >
                  <PencilSquareIcon class="w-4 h-4" />
                  <span class="text-sm hidden md:inline">Editar</span>
                </button>
                <button
                  @click="deleteSubcategory(category.id, subcategory.id)"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                  title="Eliminar subcategoría"
                >
                  <TrashIcon class="w-4 h-4" />
                  <span class="text-sm hidden md:inline">Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Añadir/Editar Categoría -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <!-- Overlay de carga -->
        <div v-if="isSubmitting" 
          class="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center z-10">
          <div class="flex flex-col items-center gap-2">
            <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-white">{{ editingCategory ? 'Actualizando...' : 'Creando...' }}</span>
          </div>
        </div>

        <h2 class="text-xl font-bold text-white mb-6">
          {{ editingCategory ? "Editar Categoría" : "Nueva Categoría" }}
        </h2>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre
            </label>
            <input
              v-model="categoryForm.nombre"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <!-- Imagen Preview y Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Imagen
            </label>
            <div class="flex items-center gap-4">
              <div
                class="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="categoryImagePreview"
                  :src="categoryImagePreview"
                  alt="Preview"
                  class="w-full h-full object-cover"
                />
                <FolderIcon v-else class="w-12 h-12 text-gray-500" />
              </div>
              <div class="flex flex-col gap-2">
                <input
                  type="file"
                  ref="categoryImageInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.categoryImageInput.click()"
                  class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Seleccionar Imagen
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="closeModal"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="!isSubmitting">
                {{ editingCategory ? "Guardar Cambios" : "Crear Categoría" }}
              </span>
              <div v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Procesando...</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Añadir/Editar Subcategoría -->
    <div
      v-if="showSubcategoryModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md relative">
        <!-- Overlay de carga -->
        <div v-if="isSubmitting" 
          class="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center z-10">
          <div class="flex flex-col items-center gap-2">
            <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-white">{{ editingSubcategory ? 'Actualizando...' : 'Creando...' }}</span>
          </div>
        </div>

        <h2 class="text-xl font-bold text-white mb-6">
          {{
            editingSubcategory ? "Editar Subcategoría" : "Nueva Subcategoría"
          }}
        </h2>

        <form @submit.prevent="saveSubcategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre
            </label>
            <input
              v-model="subcategoryForm.nombre"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <!-- Imagen Preview y Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Imagen
            </label>
            <div class="flex items-center gap-4">
              <div
                class="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="subcategoryImagePreview"
                  :src="subcategoryImagePreview"
                  alt="Preview"
                  class="w-full h-full object-cover"
                />
                <DocumentIcon v-else class="w-12 h-12 text-gray-500" />
              </div>
              <div class="flex flex-col gap-2">
                <input
                  type="file"
                  ref="subcategoryImageInput"
                  @change="handleSubcategoryImageUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.subcategoryImageInput.click()"
                  class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Seleccionar Imagen
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="closeSubcategoryModal"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="!isSubmitting">
                {{ editingSubcategory ? "Guardar Cambios" : "Crear Subcategoría" }}
              </span>
              <div v-else class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Procesando...</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { adminServices } from "@/services/admin";
import { getImageUrl } from "@/utils/image";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon,
} from "@heroicons/vue/24/outline";
import { emitter, EVENT_TYPES } from '@/utils/eventBus';

const toast = useToast();
const showAddModal = ref(false);
const editingCategory = ref(null);
const categories = ref([]);

const categoryForm = ref({
  nombre: "",
  imagen: null,
});

// Estado para subcategorías
const showSubcategoryModal = ref(false);
const editingSubcategory = ref(null);
const selectedCategoryId = ref(null);
const subcategoryForm = ref({
  nombre: "",
  imagen: null,
});

// Agregar refs para las previsualizaciones
const categoryImagePreview = ref(null);
const subcategoryImagePreview = ref(null);

const isSubmitting = ref(false);
const isLoading = ref(true);

// Cargar categorías al montar el componente
const loadCategories = async () => {
  isLoading.value = true;
  try {
    const response = await adminServices.getMyCategories();
    categories.value = response.data.map((cat) => ({
      ...cat,
      isExpanded: false,
    }));
  } catch (error) {
    toast.error("Error al cargar las categorías");
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    categoryForm.value.imagen = file;
    categoryImagePreview.value = URL.createObjectURL(file);
  }
};

const handleSubcategoryImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    subcategoryForm.value.imagen = file;
    subcategoryImagePreview.value = URL.createObjectURL(file);
  }
};

const clearCategoryImage = () => {
  categoryForm.value.imagen = null;
  categoryImagePreview.value = null;
  if (this.$refs.categoryImageInput) {
    this.$refs.categoryImageInput.value = "";
  }
};

const clearSubcategoryImage = () => {
  subcategoryForm.value.imagen = null;
  subcategoryImagePreview.value = null;
  if (this.$refs.subcategoryImageInput) {
    this.$refs.subcategoryImageInput.value = "";
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingCategory.value = null;
  categoryForm.value = {
    nombre: "",
    imagen: null,
  };
  categoryImagePreview.value = null;
};

const closeSubcategoryModal = () => {
  showSubcategoryModal.value = false;
  editingSubcategory.value = null;
  selectedCategoryId.value = null;
  subcategoryForm.value = {
    nombre: "",
    imagen: null,
  };
  subcategoryImagePreview.value = null;
};

const saveCategory = async () => {
  try {
    isSubmitting.value = true;
    const formData = new FormData();
    formData.append("nombre", categoryForm.value.nombre);
    if (categoryForm.value.imagen) {
      formData.append("imagen", categoryForm.value.imagen);
    }

    if (editingCategory.value) {
      await adminServices.updateCategory(editingCategory.value.id, formData);
      toast.success("Categoría actualizada correctamente");
    } else {
      await adminServices.createCategory(formData);
      toast.success("Categoría creada correctamente");
    }
    closeModal();
    loadCategories();
    emitter.emit(EVENT_TYPES.CATEGORY_UPDATED);
  } catch (error) {
    console.error("Error:", error);
    toast.error("Error al guardar la categoría");
  } finally {
    isSubmitting.value = false;
  }
};

// Eliminar categoría
const deleteCategory = async (categoryId) => {
  if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
    try {
      await adminServices.deleteCategory(categoryId);
      toast.success("Categoría eliminada correctamente");
      loadCategories();
    } catch (error) {
      toast.error("Error al eliminar la categoría");
      console.error("Error:", error);
    }
  }
};

// Editar categoría
const editCategory = (category) => {
  editingCategory.value = category;
  categoryForm.value = {
    nombre: category.nombre,
    imagen: null,
  };
  categoryImagePreview.value = category.imagen
    ? getImageUrl(category.imagen)
    : null;
  showAddModal.value = true;
};

// Gestión de subcategorías
const addSubcategory = (categoryId) => {
  selectedCategoryId.value = categoryId;
  showSubcategoryModal.value = true;
};

const saveSubcategory = async () => {
  try {
    isSubmitting.value = true;
    const formData = new FormData();
    formData.append("nombre", subcategoryForm.value.nombre);
    if (subcategoryForm.value.imagen) {
      formData.append("imagen", subcategoryForm.value.imagen);
    }

    if (editingSubcategory.value) {
      await adminServices.updateSubcategory(
        selectedCategoryId.value,
        editingSubcategory.value.id,
        formData
      );
      toast.success("Subcategoría actualizada correctamente");
    } else {
      await adminServices.createSubcategory(selectedCategoryId.value, formData);
      toast.success("Subcategoría creada correctamente");
    }
    closeSubcategoryModal();
    loadCategories();
    emitter.emit(EVENT_TYPES.SUBCATEGORY_UPDATED);
  } catch (error) {
    console.error("Error:", error);
    toast.error("Error al guardar la subcategoría");
  } finally {
    isSubmitting.value = false;
  }
};

// Editar subcategoría
const editSubcategory = (categoryId, subcategory) => {
  selectedCategoryId.value = categoryId;
  editingSubcategory.value = subcategory;
  subcategoryForm.value = {
    nombre: subcategory.nombre,
    imagen: null,
  };
  subcategoryImagePreview.value = subcategory.imagen
    ? getImageUrl(subcategory.imagen)
    : null;
  showSubcategoryModal.value = true;
};

// Eliminar subcategoría
const deleteSubcategory = async (categoryId, subcategoryId) => {
  if (confirm("¿Estás seguro de que deseas eliminar esta subcategoría?")) {
    try {
      await adminServices.deleteSubcategory(categoryId, subcategoryId);
      toast.success("Subcategoría eliminada correctamente");
      loadCategories();
    } catch (error) {
      toast.error("Error al eliminar la subcategoría");
      console.error("Error:", error);
    }
  }
};

onMounted(() => {
  loadCategories();
});
</script>
