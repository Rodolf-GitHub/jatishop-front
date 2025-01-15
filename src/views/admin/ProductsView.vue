<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Productos</h1>
        <p class="text-gray-400">Gestiona el catálogo de productos de tu tienda</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Nuevo Producto
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Buscar productos..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
        </div>
        <div>
          <select 
            v-model="filters.category"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <select 
            v-model="filters.status"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="out_of_stock">Sin Stock</option>
          </select>
        </div>
        <div>
          <select 
            v-model="filters.sort"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de Productos -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-750">
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Producto</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Categoría</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Precio</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Stock</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Estado</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-750">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="product.image" :alt="product.name" class="w-12 h-12 rounded-lg object-cover">
                  <div>
                    <div class="font-medium text-white">{{ product.name }}</div>
                    <div class="text-sm text-gray-400">SKU: {{ product.sku }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-300">{{ product.category }}</td>
              <td class="px-6 py-4 text-gray-300">${{ product.price.toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="{
                    'text-green-400': product.stock > 10,
                    'text-yellow-400': product.stock <= 10 && product.stock > 0,
                    'text-red-400': product.stock === 0
                  }"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-500/20 text-green-400': product.status === 'active',
                    'bg-gray-500/20 text-gray-400': product.status === 'inactive',
                    'bg-red-500/20 text-red-400': product.status === 'out_of_stock'
                  }"
                >
                  {{ getStatusText(product.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-3">
                  <button 
                    @click="editProduct(product)"
                    class="text-gray-400 hover:text-white"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteProduct(product.id)"
                    class="text-gray-400 hover:text-red-500"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-400">
          Mostrando 1-10 de 45 productos
        </div>
        <div class="flex gap-2">
          <button 
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
            :disabled="currentPage === 1"
          >
            Anterior
          </button>
          <button 
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showAddModal = ref(false);
const currentPage = ref(1);

const filters = ref({
  search: '',
  category: '',
  status: '',
  sort: 'newest'
});

const categories = ref([
  { id: 1, name: 'Electrónicos' },
  { id: 2, name: 'Ropa' },
  { id: 3, name: 'Hogar' }
]);

const products = ref([
  {
    id: 1,
    name: 'iPhone 13 Pro',
    sku: 'IP13-PRO-256',
    category: 'Electrónicos',
    price: 999.99,
    stock: 15,
    status: 'active',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'MacBook Pro M1',
    sku: 'MB-PRO-M1',
    category: 'Electrónicos',
    price: 1299.99,
    stock: 8,
    status: 'active',
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'AirPods Pro',
    sku: 'AP-PRO-2',
    category: 'Electrónicos',
    price: 249.99,
    stock: 0,
    status: 'out_of_stock',
    image: 'https://via.placeholder.com/150'
  }
]);

const getStatusText = (status) => {
  const statusMap = {
    active: 'Activo',
    inactive: 'Inactivo',
    out_of_stock: 'Sin Stock'
  };
  return statusMap[status] || status;
};

const editProduct = (product) => {
  // Aquí iría la lógica para editar el producto
  console.log('Editando producto:', product);
};

const deleteProduct = (productId) => {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    // Aquí iría la lógica para eliminar el producto
    console.log('Eliminando producto:', productId);
  }
};
</script> 