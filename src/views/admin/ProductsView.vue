<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-white mb-2">Productos</h1>
        <p class="text-sm md:text-base text-gray-400">Gestiona el catálogo de productos de tu tienda</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center md:justify-start gap-2"
      >
        <i class="fas fa-plus"></i>
        Nuevo Producto
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Buscar productos..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
        </div>
        <!-- <div>
          <select 
            v-model="filters.category"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div> -->
        <!-- <div>
          <select 
            v-model="filters.status"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="out_of_stock">Sin Stock</option>
          </select>
        </div> -->
        <!-- <div>
          <select 
            v-model="filters.sort"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
          </select>
        </div> -->
      </div>
    </div>

    <!-- Tabla de Productos -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
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
              <td class="px-6 py-4 text-gray-300">${{ parseFloat(product.price).toFixed(2) }}</td>
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
                  {{ statusText(product.status) }}
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

    <!-- Agregar el modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div class="bg-gray-800 rounded-xl w-full max-w-3xl my-8">
        <!-- Cabecera del modal -->
        <div class="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 class="text-xl font-bold text-white">
            {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
          </h2>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-white"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="saveProduct" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Columna izquierda -->
            <div class="space-y-6">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Producto *
                </label>
                <input 
                  v-model="productForm.nombre"
                  type="text"
                  required
                  placeholder="Ej: Smartphone XYZ"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                >
              </div>

              <!-- Descripción -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea 
                  v-model="productForm.descripcion"
                  rows="4"
                  placeholder="Describe las características principales del producto..."
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <!-- Imagen -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Imagen del Producto
                </label>
                <div class="flex items-center gap-4">
                  <!-- Vista previa de imagen -->
                  <div v-if="imagePreview || editingProduct?.imagen" 
                    class="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center"
                  >
                    <img 
                      :src="imagePreview || editingProduct?.imagen" 
                      class="w-full h-full object-cover"
                      alt="Vista previa"
                    >
                  </div>
                  <div class="flex-1">
                    <input 
                      type="file"
                      @change="handleImageUpload"
                      accept="image/*"
                      class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                    >
                    <p class="mt-1 text-xs text-gray-400">
                      Formatos permitidos: JPG, PNG. Máximo 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna derecha -->
            <div class="space-y-6">
              <!-- Categoría -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <select 
                  v-model="selectedCategory"
                  required
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Selecciona una categoría</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>

              <!-- Subcategoría -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Subcategoría *
                </label>
                <select 
                  v-model="selectedSubcategory"
                  required
                  :disabled="!selectedCategory"
                  class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                >
                  <option value="">{{ selectedCategory ? 'Selecciona una subcategoría' : 'Primero selecciona una categoría' }}</option>
                  <option 
                    v-for="subcat in selectedCategorySubcategories" 
                    :key="subcat.id" 
                    :value="subcat.id"
                  >
                    {{ subcat.nombre }}
                  </option>
                </select>
              </div>

              <!-- Precio y Stock en la misma fila -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Precio *
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-400">$</span>
                    <input 
                      v-model="productForm.precio"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Stock *
                  </label>
                  <input 
                    v-model="productForm.stock"
                    type="number"
                    min="0"
                    required
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                </div>
              </div>

              <!-- Descuento y Estado en la misma fila -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Descuento (%)
                  </label>
                  <input 
                    v-model="productForm.descuento"
                    type="number"
                    min="0"
                    max="99"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                  >
                  <p class="mt-1 text-xs text-gray-400">
                    Valor entre 0 y 99
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Estado
                  </label>
                  <div class="flex items-center space-x-4 mt-2">
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        v-model="productForm.activo"
                        :value="true"
                        class="form-radio text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                      >
                      <span class="ml-2 text-gray-300">Activo</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        type="radio"
                        v-model="productForm.activo"
                        :value="false"
                        class="form-radio text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                      >
                      <span class="ml-2 text-gray-300">Inactivo</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Mostrar precio con descuento si hay descuento -->
              <div v-if="productForm.descuento > 0" class="mt-4">
                <p class="text-sm text-gray-400">
                  Precio con descuento: 
                  <span class="text-green-500 font-medium">
                    ${{ calculateDiscountedPrice }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
            <button 
              type="button"
              @click="closeModal"
              class="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              :disabled="isSubmitting"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              {{ editingProduct ? 'Guardar Cambios' : 'Crear Producto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { adminServices } from '@/services/admin';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const toast = useToast();
const showAddModal = ref(false);
const currentPage = ref(1);
const editingProduct = ref(null);
const categories = ref([]);
const selectedCategory = ref(null);
const selectedSubcategory = ref(null);
const imagePreview = ref(null);
const isSubmitting = ref(false);

const productForm = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  imagen: null,
  subcategoria: null,
  descuento: 0,
  activo: true
});

const filters = ref({
  search: '',
  category: '',
  status: '',
  sort: 'newest'
});

const products = ref([]);

// Función para convertir el estado a texto
const statusText = (status) => {
  const statusMap = {
    'active': 'Activo',
    'inactive': 'Inactivo', 
    'out_of_stock': 'Sin Stock'
  };
  return statusMap[status] || status;
};

// Cargar categorías y subcategorías
const loadCategories = async () => {
  try {
    const response = await adminServices.getMyCategories();
    categories.value = response.data;
  } catch (error) {
    toast.error('Error al cargar las categorías');
    console.error('Error:', error);
  }
};

// Cargar productos
const loadProducts = async () => {
  try {
    const response = await adminServices.getMyProducts();
    products.value = response.data;
  } catch (error) {
    toast.error('Error al cargar los productos');
    console.error('Error:', error);
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    productForm.value.imagen = file;
    // Crear preview de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingProduct.value = null;
  selectedCategory.value = null;
  selectedSubcategory.value = null;
  imagePreview.value = null;
  productForm.value = {
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
    subcategoria: null,
    descuento: 0,
    activo: true
  };
};

const saveProduct = async () => {
  try {
    isSubmitting.value = true;
    const formData = new FormData();
    formData.append('nombre', productForm.value.nombre);
    formData.append('descripcion', productForm.value.descripcion);
    formData.append('precio', productForm.value.precio);
    formData.append('stock', productForm.value.stock);
    formData.append('subcategoria', selectedSubcategory.value);
    formData.append('descuento', productForm.value.descuento);
    formData.append('activo', productForm.value.activo);
    
    if (productForm.value.imagen) {
      formData.append('imagen', productForm.value.imagen);
    }

    if (editingProduct.value) {
      await adminServices.updateProduct(editingProduct.value.id, formData);
      toast.success('Producto actualizado correctamente');
    } else {
      await adminServices.createProduct(formData);
      toast.success('Producto creado correctamente');
    }
    closeModal();
    loadProducts();
  } catch (error) {
    toast.error('Error al guardar el producto');
    console.error('Error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const editProduct = (product) => {
  editingProduct.value = product;
  selectedCategory.value = product.subcategoria.categoria.id;
  selectedSubcategory.value = product.subcategoria.id;
  productForm.value = {
    nombre: product.nombre,
    descripcion: product.descripcion,
    precio: product.precio,
    stock: product.stock,
    imagen: null,
    descuento: product.descuento,
    activo: product.activo
  };
  showAddModal.value = true;
};

const deleteProduct = async (productId) => {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      await adminServices.deleteProduct(productId);
      toast.success('Producto eliminado correctamente');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error('Error:', error);
    }
  }
};

const selectedCategorySubcategories = computed(() => {
  if (!selectedCategory.value) return [];
  const category = categories.value.find(cat => cat.id === selectedCategory.value);
  return category ? category.subcategorias : [];
});

// Computed para calcular el precio con descuento
const calculateDiscountedPrice = computed(() => {
  if (!productForm.value.precio || !productForm.value.descuento) return 0;
  const precio = parseFloat(productForm.value.precio);
  const descuento = parseFloat(productForm.value.descuento);
  const precioConDescuento = precio - (precio * descuento / 100);
  return precioConDescuento.toFixed(2);
});

onMounted(() => {
  loadCategories();
  loadProducts();
});
</script> 