<template>
  <div>
    <div
      class="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0"
    >
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-white mb-2">Productos</h1>
        <p class="text-sm md:text-base text-gray-400">
          Gestiona el catálogo de productos de tu tienda
        </p>
      </div>
      <button
        @click="showAddModal = true"
        class="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center md:justify-start gap-2"
      >
        <i class="fas fa-plus"></i>
        Nuevo Producto
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
        <span class="text-gray-400">Cargando productos...</span>
      </div>
    </div>

    <!-- Estado vacío -->
    <div
      v-else-if="!products.length"
      class="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center"
    >
      <div class="mx-auto w-16 h-16 mb-4 text-gray-600">
        <PhotoIcon class="w-full h-full" />
      </div>
      <h3 class="text-lg font-medium text-white mb-2">No hay productos</h3>
      <p class="text-gray-400 mb-4">
        Aún no has creado ningún producto. Comienza agregando tu primer
        producto.
      </p>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 gap-2"
      >
        <PlusCircleIcon class="w-5 h-5" />
        Agregar Producto
      </button>
    </div>

    <!-- Tabla de Productos -->
    <div
      v-else
      class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="bg-gray-750">
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">
                Producto
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">
                Subcategoría
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">
                Precio
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">
                Descuento
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">
                Stock
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">
                Estado
              </th>
              <th
                class="px-6 py-4 text-right text-sm font-medium text-gray-400"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="product in paginatedProducts"
              :key="product.id"
              class="hover:bg-gray-750"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
                    <img
                      :src="getImageUrl(product.imagen)"
                      :alt="product.nombre"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-white">
                      {{ product.nombre }}
                    </div>
                    <div class="text-sm text-gray-400 line-clamp-1">
                      {{ product.descripcion || "Sin descripción" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-300">
                {{ product.subcategoria?.nombre || "N/A" }}
                <span
                  v-if="product.subcategoria?.categoria"
                  class="text-gray-500 text-sm block"
                >
                  {{ product.subcategoria.categoria.nombre }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-gray-300">
                  ${{ parseFloat(product.precio || 0).toFixed(2) }}
                </div>
                <div
                  v-if="product.descuento > 0"
                  class="text-green-500 text-sm"
                >
                  ${{
                    parseFloat(product.precio_con_descuento || 0).toFixed(2)
                  }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="product.descuento > 0"
                  class="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400"
                >
                  {{ product.descuento }}%
                </span>
                <span v-else class="text-gray-500">-</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="{
                    'text-green-400': product.stock > 10,
                    'text-yellow-400': product.stock <= 10 && product.stock > 0,
                    'text-red-400': product.stock === 0,
                  }"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-500/20 text-green-400': product.activo,
                    'bg-gray-500/20 text-gray-400': !product.activo,
                  }"
                >
                  {{ product.activo ? "Activo" : "Inactivo" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-3">
                  <button
                    @click="editProduct(product)"
                    class="text-gray-400 hover:text-white"
                    title="Editar producto"
                  >
                    <PencilSquareIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="text-gray-400 hover:text-red-500"
                    title="Eliminar producto"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div
        class="px-6 py-4 border-t border-gray-700 flex items-center justify-between"
      >
        <div class="text-sm text-gray-400">
          Mostrando
          {{ Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) }} a
          {{ Math.min(currentPage * itemsPerPage, totalItems) }} de
          {{ totalItems }} productos
        </div>

        <div class="flex gap-2">
          <!-- Botón Anterior -->
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <!-- Números de página -->
          <div class="flex gap-1">
            <template v-for="page in totalPages" :key="page">
              <!-- Primera página, última página, o páginas cercanas a la actual -->
              <button
                v-if="
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                "
                @click="changePage(page)"
                :class="[
                  'px-3 py-1 rounded-lg',
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
                ]"
              >
                {{ page }}
              </button>

              <!-- Puntos suspensivos -->
              <span
                v-else-if="page === currentPage - 2 || page === currentPage + 2"
                class="px-2 py-1 text-gray-400"
              >
                ...
              </span>
            </template>
          </div>

          <!-- Botón Siguiente -->
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <ProductModal
      v-if="showAddModal"
      :editing-product="editingProduct"
      :categories="categories"
      @close="closeModal"
      @saved="onProductSaved"
    />

    <!-- Overlay de carga -->
    <div
      v-if="isSubmitting"
      class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg"
    >
      <div class="flex flex-col items-center gap-2">
        <svg
          class="animate-spin h-8 w-8 text-indigo-500"
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
        <span class="text-white">Guardando producto...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { adminServices } from "@/services/admin";
import { getImageUrl } from "@/utils/image";
import ProductModal from "@/components/admin/modals/ProductModal.vue";
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import { emitter, EVENT_TYPES } from '@/utils/eventBus';

const toast = useToast();
const showAddModal = ref(false);
const currentPage = ref(1);
const editingProduct = ref(null);
const categories = ref([]);
const selectedCategory = ref(null);
const selectedSubcategory = ref(null);
const imagePreview = ref(null);
const isSubmitting = ref(false);
const isLoading = ref(true);

const productForm = ref({
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: null,
  subcategoria: null,
  descuento: 0,
  activo: true,
});

const products = ref([]);

// Estados para la paginación
const itemsPerPage = ref(10);

// Computed properties para la paginación
const totalItems = computed(() => products.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);

// Computed para obtener los productos de la página actual
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return products.value.slice(start, end);
});

// Función para cambiar de página
const changePage = (page) => {
  currentPage.value = page;
};

// Función para convertir el estado a texto
const statusText = (status) => {
  const statusMap = {
    active: "Activo",
    inactive: "Inactivo",
    out_of_stock: "Sin Stock",
  };
  return statusMap[status] || status;
};

// Cargar categorías y subcategorías
const loadCategories = async () => {
  try {
    const response = await adminServices.getMyCategories();
    categories.value = response.data;
  } catch (error) {
    toast.error("Error al cargar las categorías");
    console.error("Error:", error);
  }
};

// Cargar productos
const loadProducts = async () => {
  isLoading.value = true;
  try {
    const response = await adminServices.getMyProducts();
    products.value = response.data;
  } catch (error) {
    console.error('Error al cargar productos:', error);
    toast.error('Error al cargar los productos');
  } finally {
    isLoading.value = false;
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
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: null,
    subcategoria: null,
    descuento: 0,
    activo: true,
  };
};

const onProductSaved = () => {
  closeModal();
  loadProducts();
};

const editProduct = (product) => {
  if (!product?.subcategoria) {
    toast.error("Error: Datos del producto incompletos");
    return;
  }

  editingProduct.value = product;

  // Primero seleccionamos la categoría
  selectedCategory.value = product.subcategoria.categoria;

  // Luego seleccionamos la subcategoría
  selectedSubcategory.value = product.subcategoria.id;

  // Llenamos el resto del formulario
  productForm.value = {
    nombre: product.nombre || "",
    descripcion: product.descripcion || "",
    precio: product.precio || 0,
    stock: product.stock || 0,
    imagen: null, // La imagen existente se mantiene en el backend si no se sube una nueva
    descuento: product.descuento || 0,
    activo: typeof product.activo === "boolean" ? product.activo : true,
  };

  showAddModal.value = true;
};

const deleteProduct = async (productId) => {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    try {
      await adminServices.deleteProduct(productId);
      toast.success("Producto eliminado correctamente");
      loadProducts();
    } catch (error) {
      toast.error("Error al eliminar el producto");
      console.error("Error:", error);
    }
  }
};

const selectedCategorySubcategories = computed(() => {
  if (!selectedCategory.value) return [];
  const category = categories.value.find(
    (cat) => cat.id === selectedCategory.value
  );
  return category ? category.subcategorias : [];
});

// Computed para calcular el precio con descuento
const calculateDiscountedPrice = computed(() => {
  if (!productForm.value.precio || !productForm.value.descuento) return 0;
  const precio = parseFloat(productForm.value.precio);
  const descuento = parseFloat(productForm.value.descuento);
  const precioConDescuento = precio - (precio * descuento) / 100;
  return precioConDescuento.toFixed(2);
});

// Agregar un watch para manejar el cambio de categoría
watch(selectedCategory, (newValue) => {
  // Solo limpiamos la subcategoría si no estamos editando
  if (newValue && !editingProduct.value) {
    selectedSubcategory.value = null;
  }
});

onMounted(() => {
  loadCategories();
  loadProducts();
});
</script>
