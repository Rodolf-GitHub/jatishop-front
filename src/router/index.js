import { createRouter, createWebHistory } from "vue-router";
import StoresListView from "../views/StoresListView.vue";
import StoreLayout from "../layouts/StoreLayout.vue";
import StoreView from "../views/StoreView.vue";
import MarketplaceLayout from "../layouts/MarketplaceLayout.vue";
import AdminDashboard from '../views/admin/DashboardView.vue'
import AdminLayout from '../views/admin/AdminView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import BusinessView from '../views/admin/BusinessView.vue'
import CategoriesView from '../views/admin/CategoriesView.vue'
import ProductsView from '../views/admin/ProductsView.vue'
import OrdersView from '../views/admin/OrdersView.vue'
import UsersView from '../views/admin/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MarketplaceLayout,
      children: [
        {
          path: '',
          name: 'marketplace-home',
          component: () => import("../views/marketplace/ProductsView.vue"),
        },
        {
          path: 'tiendas',
          name: 'stores-list',
          component: StoresListView
        },
        {
          path: 'admin',
          name: 'store-admin',
          component: () => import("../views/marketplace/AdminView.vue"),
        },
        {
          path: 'acerca',
          name: 'marketplace-about',
          component: () => import("../views/marketplace/HomeView.vue"),
        }
      ]
    },
    {
      path: '/store/:slug',
      component: StoreLayout,
      children: [
        {
          path: '',
          name: 'store',
          component: StoreView
        },
        
        {
          path: 'ayuda',
          name: 'store-ayuda',
          component: () => import("../views/AyudaView.vue"),
        },
        {
          path: 'categoria/:id',
          name: 'store-categoria',
          component: () => import("../views/CategoriaView.vue"),
          props: true,
        },
        {
          path: 'categoria/:id/subcategoria/:subcategoriaId',
          name: 'store-subcategoria',
          component: () => import("../views/CategoriaView.vue"),
          props: true,
        },
        {
          path: 'producto/:productoId',
          name: 'store-producto',
          component: () => import('@/views/ProductoDetalleView.vue'),
          props: true
        },
        {
          path: 'ubicacion',
          name: 'store-ubicacion',
          component: () => import("../views/UbicacionView.vue"),
        },
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: DashboardView
        },
        {
          path: 'business',
          name: 'admin-business',
          component: BusinessView
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: CategoriesView
        },
        {
          path: 'products',
          name: 'admin-products',
          component: ProductsView
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: OrdersView
        },
        {
          path: 'users',
          name: 'admin-users',
          component: UsersView
        }
      ]
    }
  ]
});

export default router;
