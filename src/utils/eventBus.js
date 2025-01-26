import mitt from "mitt"; // Necesitarás instalar: npm install mitt

export const emitter = mitt();

// Definir los tipos de eventos para mejor mantenimiento
export const EVENT_TYPES = {
  BUSINESS_UPDATED: "business-updated",
  CATEGORY_UPDATED: "category-updated",
  SUBCATEGORY_UPDATED: "subcategory-updated",
  PRODUCT_UPDATED: "product-updated",
};
