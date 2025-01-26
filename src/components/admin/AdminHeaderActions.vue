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
    <div class="relative">
      <div 
        @click.stop="toggleMenu"
        class="flex items-center gap-2 md:gap-3 cursor-pointer"
      >
        <img
          src="/user.jpg"
          alt="Usuario"
          class="w-10 h-10 rounded-full border-2 border-gray-600"
        />
        <span class="hidden md:block text-gray-200">{{ username }}</span>
        <ChevronDownIcon 
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'transform rotate-180': isMenuOpen }"
        />
      </div>

      <!-- Dropdown Menu -->
      <div
        v-show="isMenuOpen"
        class="absolute right-0 top-full mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50"
      >
        <a
          @click="handleLogout"
          href="#"
          class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          <UserIcon class="w-5 h-5" />
          <span>Mi Perfil</span>
        </a>
        <!-- <a
          @click="handleLogout"
          href="#"
          class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          <Cog6ToothIcon class="w-5 h-5" />
          <span>Configuración</span>
        </a> -->
        <a
          @click="handleLogout"
          href="#"
          class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from "@/composables/useAuth";
import {
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const { logout } = useAuth();
const username = ref('');
const isMenuOpen = ref(false);

onMounted(() => {
  username.value = window.localStorage.getItem('admin_username') || '';
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogout = async () => {
  isMenuOpen.value = false;
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

const handleClickOutside = (event) => {
  const menu = document.querySelector('.relative');
  if (menu && !menu.contains(event.target)) {
    isMenuOpen.value = false;
  }
};
</script>
