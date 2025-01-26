<template>
    <div class="flex flex-col gap-8 p-8">
        <div>
            <h1 class="text-2xl font-bold text-white mb-2">Mi Perfil</h1>
            <p class="text-gray-400">Gestiona tu información personal y configuración de la cuenta</p>
        </div>

        <!-- Mensaje de desarrollo -->
        <div class="bg-indigo-900/50 border border-indigo-500 rounded-xl p-6">
            <div class="flex items-center gap-3">
                <i class="fas fa-tools text-indigo-400"></i>
                <p class="text-indigo-200">
                    Esta página está en desarrollo. Aquí podrás:
                </p>
            </div>
            <ul class="list-disc list-inside mt-4 text-indigo-200 ml-4">
                <li>Gestionar tu información personal y del negocio</li>
                <li>Ver las personas que has invitado usando tu enlace de referido</li>
                <li>Administrar tus preferencias de cuenta</li>
                <li>Cambiar tu contraseña</li>
                <li>Ver estadísticas de referidos</li>
            </ul>
        </div>

        <!-- Próximamente -->
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
            <i class="fas fa-clock text-4xl text-gray-400 mb-4"></i>
            <h2 class="text-xl text-white font-semibold mb-2">Próximamente</h2>
            <p class="text-gray-400">
                Estamos trabajando para traerte la mejor experiencia en la gestión de tu perfil.
                ¡Vuelve pronto!
            </p>
        </div>
    </div>
</template>