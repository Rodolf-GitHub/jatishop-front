<template>
  <div class="flex items-center gap-6">
    <!-- Notifications -->
    <button class="relative text-gray-300 hover:text-white">
      <i class="fas fa-bell text-xl"></i>
      <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
        3
      </span>
    </button>

    <!-- User Menu -->
    <div class="flex items-center gap-3 cursor-pointer">
      <img 
        src="../../assets/logo.svg" 
        alt="Usuario" 
        class="w-9 h-9 rounded-full border-2 border-gray-600"
      >
      <span class="text-gray-200">Admin</span>
      <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
    </div>
  </div>
</template> 