<template>
  <div class="flex items-center gap-4 md:gap-6">
    <!-- Notifications -->
    <!-- <button class="relative text-gray-300 hover:text-white">
      <BellIcon class="w-6 h-6" />
      <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
        3
      </span>
    </button> -->

    <!-- Botón de Ir a EcomCuba -->
    <div class="ml-auto flex items-center gap-2">
      <a
        href="/"
        class="flex items-center gap-2 hover:bg-jati/10 rounded-full transition-colors bg-white shadow-md"
      >
        <img
          src="/logo.jpg"
          class="h-9 w-9 object-cover rounded-full"
          alt="E-comCuba"
        />
        <span class="hidden md:block text-sm">E-comCuba</span>
      </a>
    </div>

    <!-- User Menu -->
    <div class="flex items-center gap-2 md:gap-3 cursor-pointer group relative">
      <img
        src="/user.jpg"
        alt="Usuario"
        class="w-10 h-10 rounded-full border-2 border-gray-600"
      />
      <span class="hidden md:block text-gray-200">{{ username }}</span>
      <ChevronDownIcon class="w-4 h-4 text-gray-400" />

      <!-- Dropdown Menu -->
      <div
        class="absolute right-0 top-full mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 hidden group-hover:block"
      >
        <a
          href="#"
          class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          <UserIcon class="w-5 h-5" />
          <span>Mi Perfil</span>
        </a>
        <a
          href="#"
          class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          <Cog6ToothIcon class="w-5 h-5" />
          <span>Configuración</span>
        </a>
        <hr class="my-2 border-gray-700" />
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-gray-700"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';

const router = useRouter();
const { logout } = useAuth();
const username = ref('');

onMounted(() => {
  username.value = window.localStorage.getItem('admin_username') || '';
});

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>
