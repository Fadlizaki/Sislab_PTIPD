import { createRouter, createWebHistory } from "vue-router";
import store from "../store"; // Pastikan jalur impor sesuai dengan struktur proyek Anda

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    component: () => import("../views/LoginView.vue"),
    beforeEnter: (to, from, next) => {
      if (store.getters["auth/isAuthenticated"]) {
        next("/home"); // Pengguna sudah terotentikasi, arahkan ke halaman beranda
      } else {
        next(); // Lanjutkan ke halaman login
      }
    },
  },
  { path: "/register", component: () => import("../views/RegisterView.vue") },
  {
    path: "/home",
    component: () => import("../views/HomeView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/datakomputer",
    component: () => import("../views/Master data/DatakomputerView.vue"),
  },
  {
    path: "/dataLaptop",
    component: () => import("../views/Master data/DataLaptopView.vue"),
  },
  {
    path: "/datalain",
    component: () => import("../views/Master data/DatalainView.vue"),
  },
  {
    path: "/ruangan",
    component: () => import("../views/Master data/RuanganView.vue"),
  },
  {
    path: "/ruangan/detail/:slug",
    component: () => import("../views/Master data/RuanganDetail.vue"),
    props: true,
  },
  {
    path: "/jlbarang",
    component: () => import("../views/peminjaman/BarangView.vue"),
  },
  {
    path: "/jlruangan",
    component: () => import("../views/peminjaman/RuanganView.vue"),
  },
  {
    path: "/mruangan",
    component: () => import("../views/Maintenace/MruanganView.vue"),
  },
  {
    path: "/mbarang",
    component: () => import("../views/Maintenace/MbarangView.vue"),
  },
  {
    path: "/Lkomputer",
    component: () => import("../views/Laporan/LKomputerView.vue"),
  },
  {
    path: "/Lbarang",
    component: () => import("../views/Laporan/peminjaman/LbarangView.vue"),
  },
  {
    path: "/Lruangan",
    component: () => import("../views/Laporan/peminjaman/LruanganView.vue"),
  },
  {
    path: "/LMbarang",
    component: () => import("../views/Laporan/Maintenance/LMbarangView.vue"),
  },
  {
    path: "/LMruangan",
    component: () => import("../views/Laporan/Maintenance/LMruanganView.vue"),
  },
  { path: "/user", component: () => import("../views/Akun/UserView.vue") },
  {
    path: "/tipe",
    component: () => import("../views/Setelan/KategoryView.vue"),
  },
  { path: "/merk", component: () => import("../views/Setelan/MerkView.vue") },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


export default router;
