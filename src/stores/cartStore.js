import { defineStore } from "pinia";
import { getImageUrl } from "@/utils/image";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.cantidad, 0),
    totalAmount: (state) =>
      state.items
        .reduce((sum, item) => {
          const precio = Number(
            item.producto.precio_con_descuento ||
            (item.producto.precio * (1 - item.producto.descuento/100)).toFixed(2)
          );
          return sum + precio * item.cantidad;
        }, 0)
        .toFixed(2),
  },

  actions: {
    addToCart(producto) {
      const existingItem = this.items.find(
        (item) => item.producto.id === producto.id
      );

      // Verificar si el producto ya está en el carrito
      if (existingItem) {
        // Verificar que la cantidad actual más 1 no exceda el stock
        if (existingItem.cantidad >= producto.stock) {
          throw new Error(`No hay más stock disponible. Stock máximo: ${producto.stock}`);
        }
        existingItem.cantidad++;
      } else {
        // Verificar si hay stock antes de añadir
        if (producto.stock < 1) {
          throw new Error('Producto sin stock disponible');
        }
        // Verificar que el stock sea mayor a 0 y añadir solo 1 unidad
        if (producto.stock >= 1) {
          // Crear una copia del producto y asegurarse de que la imagen tenga la URL completa
          const productoConImagen = {
            ...producto,
            imagen: producto.imagen // La URL se procesará con getImageUrl al mostrarla
          };
          
          this.items.push({
            producto: productoConImagen,
            cantidad: 1,
          });
        }
      }
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    removeFromCart(productoId) {
      this.items = this.items.filter((item) => item.producto.id !== productoId);
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    updateQuantity(productoId, cantidad) {
      const item = this.items.find((item) => item.producto.id === productoId);
      if (item) {
        // Verificar que la nueva cantidad no exceda el stock
        if (cantidad > item.producto.stock) {
          throw new Error(`No hay suficiente stock. Stock máximo: ${item.producto.stock}`);
        }
        item.cantidad = cantidad;
        localStorage.setItem("cart", JSON.stringify(this.items));
      }
    },

    clearCart() {
      this.items = [];
      localStorage.setItem("cart", JSON.stringify([]));
    },
  },

  persist: true,
});
