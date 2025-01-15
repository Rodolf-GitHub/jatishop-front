<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Categorías</h1>
        <p class="text-gray-400">Gestiona las categorías y subcategorías de tu tienda</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Nueva Categoría
      </button>
    </div>

    <!-- Lista de Categorías -->
    <div class="grid gap-6">
      <div 
        v-for="category in categories" 
        :key="category.id" 
        class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
      >
        <!-- Cabecera de Categoría -->
        <div class="p-6 flex items-center justify-between border-b border-gray-700">
          <div class="flex items-center gap-4">
            <div 
              class="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center"
              :style="{ backgroundColor: category.color + '20' }"
            >
              <i :class="category.icon" :style="{ color: category.color }"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">{{ category.name }}</h3>
              <p class="text-sm text-gray-400">{{ category.subcategories.length }} subcategorías</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="editCategory(category)"
              class="p-2 text-gray-400 hover:text-white"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="deleteCategory(category.id)"
              class="p-2 text-gray-400 hover:text-red-500"
            >
              <i class="fas fa-trash"></i>
            </button>
            <button 
              @click="category.isExpanded = !category.isExpanded"
              class="p-2 text-gray-400 hover:text-white"
            >
              <i :class="category.isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </button>
          </div>
        </div>

        <!-- Subcategorías -->
        <div v-show="category.isExpanded" class="p-6 bg-gray-850">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-sm font-medium text-gray-400">Subcategorías</h4>
            <button 
              @click="addSubcategory(category.id)"
              class="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <i class="fas fa-plus"></i>
              Añadir Subcategoría
            </button>
          </div>

          <div class="space-y-3">
            <div 
              v-for="subcategory in category.subcategories" 
              :key="subcategory.id"
              class="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              <span class="text-gray-200">{{ subcategory.name }}</span>
              <div class="flex items-center gap-2">
                <button 
                  @click="editSubcategory(subcategory)"
                  class="p-1.5 text-gray-400 hover:text-white"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="deleteSubcategory(category.id, subcategory.id)"
                  class="p-1.5 text-gray-400 hover:text-red-500"
                >
                  <i class="fas fa-trash"></i>
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

const showAddModal = ref(false);
const editingCategory = ref(null);

const categoryForm = ref({
  name: '',
  icon: '',
  color: '#6366f1'
});

const categories = ref([
  {
    id: 1,
    name: 'Electrónicos',
    icon: 'fas fa-laptop',
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
    icon: 'fas fa-tshirt',
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