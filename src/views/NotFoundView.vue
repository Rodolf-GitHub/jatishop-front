<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center p-4">
    <div class="text-center max-w-lg mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
      <!-- Logo EcomCuba -->
      <img
        src="/logo.jpg"
        alt="EcomCuba Logo"
        class="w-24 h-24 mx-auto mb-6"
      />

      <!-- Icono de Error -->
      <div class="mb-6">
        <svg
          class="mx-auto h-20 w-20 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- Mensaje de Error -->
      <h1 class="text-5xl font-bold text-white mb-4">404</h1>
      <p class="text-xl text-blue-100 mb-8">
        ¡Ups! No pudimos encontrar la página que buscas
      </p>

      <!-- Botón de Regreso -->
      <router-link
        to="/"
        class="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Volver a EcomCuba
      </router-link>

      <!-- Texto adicional -->
      <p class="mt-8 text-blue-200 text-sm">
        Si crees que esto es un error, por favor contacta con nuestro equipo de soporte
      </p>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-to-b {
  background-size: 100% 100%;
  background-position: 0% 0%;
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>

<script setup>
// No se necesita lógica adicional
</script> 