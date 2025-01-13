import { defineStore } from 'pinia';
import { services } from '@/services/api';

export const useMarketplaceStore = defineStore('marketplace', {
  state: () => ({
    products: [],
    stores: [],
    loading: false,
    filters: {
      provincia: '',
      municipio: '',
      search: '',
      // ... otros filtros existentes ...
    }
  }),

  actions: {
    async setUbicacionFiltros(ubicacion) {
      this.filters.provincia = ubicacion.provincia;
      this.filters.municipio = ubicacion.municipio;
    },

    async loadProducts() {
      this.loading = true;
      try {
        const response = await services.getMarketplaceProducts(this.filters);
        this.products = response.data;
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        this.loading = false;
      }
    },

    async loadStores() {
      this.loading = true;
      try {
        const response = await services.getStores(this.filters);
        this.stores = response.data;
      } catch (error) {
        console.error('Error loading stores:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}); 