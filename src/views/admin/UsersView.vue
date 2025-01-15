<template>
  <div>
    <div class="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-white mb-2">Usuarios</h1>
        <p class="text-sm md:text-base text-gray-400">Gestiona los usuarios de tu tienda</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center md:justify-start gap-2"
      >
        <i class="fas fa-plus"></i>
        Nuevo Usuario
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Buscar usuarios..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
        </div>
        <div>
          <select 
            v-model="filters.role"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="staff">Staff</option>
            <option value="customer">Cliente</option>
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
            <option value="blocked">Bloqueado</option>
          </select>
        </div>
        <div>
          <select 
            v-model="filters.sort"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de Usuarios -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="bg-gray-750">
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Usuario</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Rol</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Último acceso</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-400">Estado</th>
              <th class="px-6 py-4 text-right text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-750">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img 
                    :src="user.avatar" 
                    :alt="user.name"
                    class="w-10 h-10 rounded-full object-cover"
                  >
                  <div>
                    <div class="font-medium text-white">{{ user.name }}</div>
                    <div class="text-sm text-gray-400">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getRoleClass(user.role)"
                >
                  {{ getRoleText(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-gray-300">{{ formatDate(user.lastLogin) }}</div>
                <div class="text-sm text-gray-400">{{ formatTime(user.lastLogin) }}</div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(user.status)"
                >
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-3">
                  <button 
                    @click="editUser(user)"
                    class="text-gray-400 hover:text-white"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="toggleUserStatus(user)"
                    class="text-gray-400 hover:text-white"
                    :title="user.status === 'active' ? 'Desactivar' : 'Activar'"
                  >
                    <i :class="user.status === 'active' ? 'fas fa-ban' : 'fas fa-check'"></i>
                  </button>
                  <button 
                    @click="resetPassword(user.id)"
                    class="text-gray-400 hover:text-white"
                    title="Resetear contraseña"
                  >
                    <i class="fas fa-key"></i>
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
          Mostrando 1-10 de {{ totalUsers }} usuarios
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

    <!-- Modal para Añadir/Editar Usuario -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">
            {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h2>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Nombre
            </label>
            <input 
              v-model="userForm.name"
              type="text"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input 
              v-model="userForm.email"
              type="email"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Rol
            </label>
            <select 
              v-model="userForm.role"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="admin">Administrador</option>
              <option value="staff">Staff</option>
              <option value="customer">Cliente</option>
            </select>
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
              {{ editingUser ? 'Guardar Cambios' : 'Crear Usuario' }}
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
const editingUser = ref(null);
const currentPage = ref(1);
const totalUsers = ref(25);

const filters = ref({
  search: '',
  role: '',
  status: '',
  sort: 'newest'
});

const userForm = ref({
  name: '',
  email: '',
  role: 'customer'
});

const users = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date(),
    avatar: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@example.com',
    role: 'staff',
    status: 'active',
    lastLogin: new Date(),
    avatar: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@example.com',
    role: 'customer',
    status: 'inactive',
    lastLogin: new Date(),
    avatar: 'https://via.placeholder.com/150'
  }
]);

const getRoleClass = (role) => {
  const classes = {
    admin: 'bg-purple-500/20 text-purple-400',
    staff: 'bg-blue-500/20 text-blue-400',
    customer: 'bg-green-500/20 text-green-400'
  };
  return classes[role] || '';
};

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    blocked: 'bg-red-500/20 text-red-400'
  };
  return classes[status] || '';
};

const getRoleText = (role) => {
  const roles = {
    admin: 'Administrador',
    staff: 'Staff',
    customer: 'Cliente'
  };
  return roles[role] || role;
};

const getStatusText = (status) => {
  const statuses = {
    active: 'Activo',
    inactive: 'Inactivo',
    blocked: 'Bloqueado'
  };
  return statuses[status] || status;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString();
};

const editUser = (user) => {
  editingUser.value = user;
  userForm.value = { ...user };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  editingUser.value = null;
  userForm.value = {
    name: '',
    email: '',
    role: 'customer'
  };
};

const saveUser = () => {
  // Aquí iría la lógica para guardar el usuario
  console.log('Guardando usuario:', userForm.value);
  closeModal();
};

const toggleUserStatus = (user) => {
  // Aquí iría la lógica para cambiar el estado del usuario
  console.log('Cambiando estado del usuario:', user.id);
};

const resetPassword = (userId) => {
  // Aquí iría la lógica para resetear la contraseña
  console.log('Reseteando contraseña para el usuario:', userId);
};
</script> 