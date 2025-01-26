import { ref, onMounted } from "vue";
import { adminServices } from "@/services/admin";

export function useSetupProgress() {
  const setupProgress = ref({
    negocio: false,
    categoria: false,
    subcategoria: false,
    producto: false,
  });
  const isLoading = ref(true);

  const checkSetupProgress = async () => {
    try {
      const response = await adminServices.getResumen();
      setupProgress.value = response.data;
    } catch (error) {
      console.error("Error al obtener el progreso:", error);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    checkSetupProgress();
  });

  return {
    setupProgress,
    isLoading,
    checkSetupProgress,
  };
}
