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
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: category.color + '20' }"
            >
              <component 
                :is="getIconComponent(category.icon)" 
                class="w-6 h-6"
                :style="{ color: category.color }"
              />
            </div>
            <div>
              <h3 class="font-medium text-white">{{ category.name }}</h3>
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
              v-model="categoryForm.name"
              type="text"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Ícono
            </label>
            <input 
              v-model="categoryForm.icon"
              type="text"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Color
            </label>
            <input 
              v-model="categoryForm.color"
              type="color"
              class="w-full h-10 px-2 bg-gray-700 border border-gray-600 rounded-lg"
            >
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button 
              type="button"
              @click="showAddModal = false"
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
import { ref } from 'vue';
import { 
  PlusCircleIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ChevronDownIcon,
  ComputerDesktopIcon,
  UsersIcon,
  Square2StackIcon,
} from '@heroicons/vue/24/outline';

const showAddModal = ref(false);
const editingCategory = ref(null);

const categoryForm = ref({
  name: '',
  icon: '',
  color: '#6366f1'
});

// Mapa de iconos actualizado
const iconComponents = {
  'computer': ComputerDesktopIcon,
  'shirt': UsersIcon,
  'default': Square2StackIcon
};

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || iconComponents.default;
};

const categories = ref([
  {
    id: 1,
    name: 'Electrónicos',
    icon: 'computer',
    color: '#6366f1',
    isExpanded: true,
    subcategories: [
      { id: 1, name: 'Laptops' },
      { id: 2, name: 'Smartphones' },
      { id: 3, name: 'Tablets' }
    ]
  },
  {
    id: 2,
    name: 'Ropa',
    icon: 'shirt',
    color: '#ec4899',
    isExpanded: false,
    subcategories: [
      { id: 4, name: 'Camisetas' },
      { id: 5, name: 'Pantalones' },
      { id: 6, name: 'Vestidos' }
    ]
  }
]);

const saveCategory = () => {
  // Aquí iría la lógica para guardar la categoría
  showAddModal.value = false;
};

const editCategory = (category) => {
  editingCategory.value = category;
  categoryForm.value = { ...category };
  showAddModal.value = true;
};

const deleteCategory = (categoryId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
    // Aquí iría la lógica para eliminar la categoría
  }
};

const addSubcategory = (categoryId) => {
  // Aquí iría la lógica para añadir subcategoría
};

const editSubcategory = (subcategory) => {
  // Aquí iría la lógica para editar subcategoría
};

const deleteSubcategory = (categoryId, subcategoryId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta subcategoría?')) {
    // Aquí iría la lógica para eliminar la subcategoría
  }
};
</script> 