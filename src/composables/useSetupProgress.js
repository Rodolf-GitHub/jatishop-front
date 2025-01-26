import { ref } from 'vue';
import { adminServices } from '@/services/admin';

export function useSetupProgress() {
  const setupProgress = ref({
    negocio: false,
    categoria: false,
    subcategoria: false,
    producto: false
  });

  const checkSetupProgress = async () => {
    try {
      const response = await adminServices.getResumen();
      setupProgress.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Error al verificar el progreso:', error);
      return setupProgress.value;
    }
  };

  return {
    setupProgress,
    checkSetupProgress
  };
}
