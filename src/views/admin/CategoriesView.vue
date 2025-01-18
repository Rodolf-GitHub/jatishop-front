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
            <img 
              v-if="category.imagen" 
              :src="category.imagen" 
              class="w-10 h-10 rounded-lg object-cover"
              alt="Categoría"
            />
            <div>
              <h3 class="font-medium text-white">{{ category.nombre }}</h3>
              <p v-if="category.descripcion" class="text-sm text-gray-400">{{ category.descripcion }}</p>
              <p class="text-sm text-gray-400">{{ category.subcategories.length }} subcategorías</p>
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

        <!-- Subcategorías -->
        <div v-show="category.isExpanded" class="p-4 md:p-6 bg-gray-750">
          <div class="space-y-2">
            <div 
              v-for="subcategory in category.subcategories" 
              :key="subcategory.id"
              class="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <span class="text-gray-300">{{ subcategory.name }}</span>
              <div class="flex gap-2">
                <button class="text-gray-400 hover:text-white">
                  <PencilSquareIcon class="w-4 h-4" />
                </button>
                <button class="text-gray-400 hover:text-red-500">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { adminServices } from '@/services/admin';
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ChevronDownIcon,
  ComputerDesktopIcon,
  UsersIcon,
  Square2StackIcon,
} from '@heroicons/vue/24/outline';

const toast = useToast();
const showAddModal = ref(false);
const editingCategory = ref(null);
const categories = ref([]);

const categoryForm = ref({
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
const addSubcategory = async (categoryId) => {
  // Implementar lógica para añadir subcategoría
};

const editSubcategory = async (categoryId, subcategory) => {
  // Implementar lógica para editar subcategoría
};

const deleteSubcategory = async (categoryId, subcategoryId) => {
  // Implementar lógica para eliminar subcategoría
};

onMounted(() => {
  loadCategories();
});
</script> 