import { defineStore } from "pinia";
import { getImageUrl } from "@/utils/image";

export const useCartStore = defineStore("cart", {
  state: () => ({
    currentStore: null,
    storeItems: {},
  }),

  getters: {
    items: (state) => state.storeItems[state.currentStore]?.items || [],

    totalItems: (state) => {
      const items = state.storeItems[state.currentStore]?.items || [];
      return items.reduce((sum, item) => sum + item.cantidad, 0);
    },

    totalAmount: (state) => {
      const items = state.storeItems[state.currentStore]?.items || [];
      return items
        .reduce((sum, item) => {
          const precio = Number(
            item.producto.precio_con_descuento ||
              (
                item.producto.precio *
                (1 - item.producto.descuento / 100)
              ).toFixed(2),
          );
          return sum + precio * item.cantidad;
        }, 0)
        .toFixed(2);
    },
  },

  actions: {
    setCurrentStore(storeSlug, storeInfo = null) {
      this.currentStore = storeSlug;
      if (!this.storeItems[storeSlug]) {
        // Intentar cargar desde localStorage
        const storedCart = localStorage.getItem(`cart_${storeSlug}`);
        if (storedCart) {
          this.storeItems[storeSlug] = JSON.parse(storedCart);
        } else {
          // Inicializar nuevo carrito para la tienda
          this.storeItems[storeSlug] = {
            items: [],
            storeInfo,
          };
        }
      }
    },

    addToCart(producto) {
      if (!this.currentStore) return;

      const items = this.storeItems[this.currentStore].items;
      const existingItem = items.find(
        (item) => item.producto.id === producto.id,
      );

      if (existingItem) {
        if (existingItem.cantidad >= producto.stock) {
          throw new Error(
            `No hay más stock disponible. Stock máximo: ${producto.stock}`,
          );
        }
        existingItem.cantidad++;
      } else {
        if (producto.stock < 1) {
          throw new Error("Producto sin stock disponible");
        }
        if (producto.stock >= 1) {
          const productoConImagen = {
            ...producto,
            imagen: producto.imagen,
          };

          items.push({
            producto: productoConImagen,
            cantidad: 1,
          });
        }
      }
      this.saveToLocalStorage();
    },

    removeFromCart(productoId) {
      if (!this.currentStore) return;

      this.storeItems[this.currentStore].items = this.storeItems[
        this.currentStore
      ].items.filter((item) => item.producto.id !== productoId);
      this.saveToLocalStorage();
    },

    updateQuantity(productoId, cantidad) {
      if (!this.currentStore) return;

      const item = this.storeItems[this.currentStore].items.find(
        (item) => item.producto.id === productoId,
      );
      if (item) {
        if (cantidad > item.producto.stock) {
          throw new Error(
            `No hay suficiente stock. Stock máximo: ${item.producto.stock}`,
          );
        }
        item.cantidad = cantidad;
        this.saveToLocalStorage();
      }
    },

    clearCart() {
      if (!this.currentStore) return;

      this.storeItems[this.currentStore].items = [];
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      if (this.currentStore) {
        localStorage.setItem(
          `cart_${this.currentStore}`,
          JSON.stringify(this.storeItems[this.currentStore]),
        );
      }
    },
  },

  persist: true,
});
