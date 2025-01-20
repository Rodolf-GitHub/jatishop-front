<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-white mb-2">Categorías</h1>
        <p class="text-sm md:text-base text-gray-400">Gestiona las categorías y subcategorías de tu tienda</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center md:justify-start gap-2"
      >
        <i class="fas fa-plus"></i>
        Nueva Categoría
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
        <div class="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
          <div class="flex items-center gap-4">
            <div v-if="category.imagen" 
              class="w-10 h-10 rounded-lg overflow-hidden"
            >
              <img 
                :src="getImageUrl(category.imagen)" 
                class="w-full h-full object-cover"
                alt="Categoría"
                @error="$event.target.style.display='none'"
              />
            </div>
            <div v-else
              class="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center"
            >
              <FolderIcon class="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 class="font-medium text-white">{{ category.nombre }}</h3>
              <p v-if="category.descripcion" class="text-sm text-gray-400">{{ category.descripcion }}</p>
              <p class="text-sm text-gray-400">{{ category.subcategorias?.length || 0 }} subcategorías</p>
            </div>
          </div>
          
          <div class="flex items-center justify-end gap-3">
            <button 
              @click="addSubcategory(category.id)"
              class="text-gray-400 hover:text-white"
              title="Añadir subcategoría"
            >
              <PlusCircleIcon class="w-5 h-5" />
            </button>
            <button 
              @click="editCategory(category)"
              class="text-gray-400 hover:text-white"
              title="Editar categoría"
            >
              <PencilSquareIcon class="w-5 h-5" />
            </button>
            <button 
              @click="deleteCategory(category.id)"
              class="text-gray-400 hover:text-red-500"
              title="Eliminar categoría"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
            <button 
              @click="category.isExpanded = !category.isExpanded"
              class="text-gray-400 hover:text-white"
            >
              <ChevronDownIcon 
                class="w-5 h-5 transition-transform duration-200"
                :class="{ 'rotate-180': category.isExpanded }"
              />
            </button>
          </div>
        </div>

        <!-- Lista de subcategorías -->
        <div v-if="category.isExpanded && category.subcategorias?.length > 0" class="border-t border-gray-700">
          <div 
            v-for="subcategory in category.subcategorias" 
            :key="subcategory.id"
            class="p-4 flex items-center justify-between border-b border-gray-700 last:border-b-0"
          >
            <div class="flex items-center gap-4">
              <div v-if="subcategory.imagen" 
                class="w-8 h-8 rounded-lg overflow-hidden"
              >
                <img 
                  :src="getImageUrl(subcategory.imagen)" 
                  class="w-full h-full object-cover"
                  alt="Subcategoría"
                  @error="$event.target.style.display='none'"
                />
              </div>
              <div v-else
                class="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center"
              >
                <DocumentIcon class="w-5 h-5 text-gray-400" />
              </div>
              <span class="text-gray-300">{{ subcategory.nombre }}</span>
            </div>
            <div class="flex gap-2">
              <button 
                @click="editSubcategory(category.id, subcategory)"
                class="text-gray-400 hover:text-white"
              >
                <PencilSquareIcon class="w-4 h-4" />
              </button>
              <button 
                @click="deleteSubcategory(category.id, subcategory.id)"
                class="text-gray-400 hover:text-red-500"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Añadir/Editar Categoría -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-white mb-6">
          {{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}
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
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Imagen
            </label>
            <input 
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button 
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {{ editingCategory ? 'Guardar Cambios' : 'Crear Categoría' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Añadir/Editar Subcategoría -->
    <div v-if="showSubcategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-white mb-6">
          {{ editingSubcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría' }}
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
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Imagen
            </label>
            <input 
              type="file"
              @change="handleSubcategoryImageUpload"
              accept="image/*"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button 
              type="button"
              @click="closeSubcategoryModal"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {{ editingSubcategory ? 'Guardar Cambios' : 'Crear Subcategoría' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { adminServices } from '@/services/admin';
import { getImageUrl } from '@/utils/image';
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();
const showAddModal = ref(false);
const editingCategory = ref(null);
const categories = ref([]);

const categoryForm = ref({
  nombre: '',
  imagen: null
});

// Estado para subcategorías
const showSubcategoryModal = ref(false);
const editingSubcategory = ref(null);
const selectedCategoryId = ref(null);
const subcategoryForm = ref({
  nombre: '',
  imagen: null
});

// Cargar categorías al montar el componente
const loadCategories = async () => {
  try {
    const response = await adminServices.getMyCategories();
    categories.value = response.data.map(cat => ({
      ...cat,
      isExpanded: false
    }));
  } catch (error) {
    toast.error('Error al cargar las categorías');
    console.error('Error:', error);
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    categoryForm.value.imagen = file;
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingCategory.value = null;
  categoryForm.value = {
    nombre: '',
    imagen: null
  };
};

const saveCategory = async () => {
  try {
    const formData = new FormData();
    formData.append('nombre', categoryForm.value.nombre);
    if (categoryForm.value.imagen) {
      formData.append('imagen', categoryForm.value.imagen);
    }

    if (editingCategory.value) {
      await adminServices.updateCategory(editingCategory.value.id, formData);
      toast.success('Categoría actualizada correctamente');
    } else {
      await adminServices.createCategory(formData);
      toast.success('Categoría creada correctamente');
    }
    closeModal();
    loadCategories();
  } catch (error) {
    toast.error('Error al guardar la categoría');
    console.error('Error:', error);
  }
};

// Eliminar categoría
const deleteCategory = async (categoryId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
    try {
      await adminServices.deleteCategory(categoryId);
      toast.success('Categoría eliminada correctamente');
      loadCategories();
    } catch (error) {
      toast.error('Error al eliminar la categoría');
      console.error('Error:', error);
    }
  }
};

// Editar categoría
const editCategory = (category) => {
  editingCategory.value = category;
  categoryForm.value = {
    nombre: category.nombre,
    imagen: null // La imagen existente se mantiene en el backend si no se sube una nueva
  };
  showAddModal.value = true;
};

// Gestión de subcategorías
const addSubcategory = (categoryId) => {
  selectedCategoryId.value = categoryId;
  showSubcategoryModal.value = true;
};

const handleSubcategoryImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validar el tipo y tamaño del archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      toast.error('El archivo debe ser una imagen (JPEG, PNG o GIF)');
      event.target.value = ''; // Limpiar el input
      return;
    }

    if (file.size > maxSize) {
      toast.error('La imagen no debe superar los 2MB');
      event.target.value = ''; // Limpiar el input
      return;
    }

    subcategoryForm.value.imagen = file;
  }
};

const closeSubcategoryModal = () => {
  showSubcategoryModal.value = false;
  editingSubcategory.value = null;
  selectedCategoryId.value = null;
  subcategoryForm.value = {
    nombre: '',
    imagen: null
  };
};

const saveSubcategory = async () => {
  try {
    const formData = new FormData();
    formData.append('nombre', subcategoryForm.value.nombre);
    
    // No es necesario enviar la categoría en el formData ya que va en la URL
    // formData.append('categoria', selectedCategoryId.value);
    
    // Asegúrate de que la imagen existe antes de intentar agregarla
    if (subcategoryForm.value.imagen instanceof File) {
      formData.append('imagen', subcategoryForm.value.imagen);
    }

    if (editingSubcategory.value) {
      await adminServices.updateSubcategory(
        selectedCategoryId.value, 
        editingSubcategory.value.id, 
        formData
      );
      toast.success('Subcategoría actualizada correctamente');
    } else {
      await adminServices.createSubcategory(selectedCategoryId.value, formData);
      toast.success('Subcategoría creada correctamente');
    }
    closeSubcategoryModal();
    loadCategories();
  } catch (error) {
    console.error('Error detallado:', error);
    toast.error('Error al guardar la subcategoría');
  }
};

// Editar subcategoría
const editSubcategory = (categoryId, subcategory) => {
  selectedCategoryId.value = categoryId;
  editingSubcategory.value = subcategory;
  subcategoryForm.value = {
    nombre: subcategory.nombre,
    imagen: null // La imagen existente se mantiene en el backend si no se sube una nueva
  };
  showSubcategoryModal.value = true;
};

// Eliminar subcategoría
const deleteSubcategory = async (categoryId, subcategoryId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta subcategoría?')) {
    try {
      await adminServices.deleteSubcategory(categoryId, subcategoryId);
      toast.success('Subcategoría eliminada correctamente');
      loadCategories();
    } catch (error) {
      toast.error('Error al eliminar la subcategoría');
      console.error('Error:', error);
    }
  }
};

onMounted(() => {
  loadCategories();
});
</script> 