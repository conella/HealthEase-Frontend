import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore, useAlertStore } from "@/stores";
import { Home } from "@/views";
import accountRoutes from "./account.routes";

import PatientPortal from "@/views/users/PatientPortal.vue";
import DoctorPortal from "@/views/users/DoctorPortal.vue";
import AdminPortal from "@/views/users/AdminPortal.vue";
import PatientAppointments from "@/views/users/PatientAppointments.vue"; // ✅ NEW

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    { path: "/", component: Home },
    accountRoutes,

    // ✅ Patient routes with nested structure
    {
      path: "/patient/portal",
      component: PatientPortal,
      children: [
        {
          path: "appointments",
          component: PatientAppointments,
        },
      ],
    },

    // Doctor & Admin portals
    { path: "/admin/portal", component: AdminPortal },
    { path: "/doctor/portal", component: DoctorPortal },

    // Catch all
    // { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

// // ✅ Auth guard
// router.beforeEach(async (to) => {
//   console.log("Navigating to:", to.fullPath); // 👀 add this
//   const alertStore = useAlertStore();
//   alertStore.clear();

//   const publicPages = ["/account/login", "/account/register"];
//   const authRequired = !publicPages.some((path) => to.path.startsWith(path));
//   const authStore = useAuthStore();

//   if (authRequired && !authStore.user) {
//     authStore.returnUrl = to.fullPath;
//     return "/account/login";
//   }
// });

let isAuthResolved = false;

router.beforeEach(async (to) => {
  const alertStore = useAlertStore();
  alertStore.clear();

  const authStore = useAuthStore();
  const publicPages = ["/account/login", "/account/register"];
  const authRequired = !publicPages.some((path) => to.path.startsWith(path));

  // ✅ Run checkAuth only once
  if (!isAuthResolved) {
    await authStore.checkAuth();
    isAuthResolved = true;
  }

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath;
    return "/account/login";
  }
});
