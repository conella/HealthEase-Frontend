import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore, useAlertStore } from "@/stores";
import { Home } from "@/views";
import accountRoutes from "./account.routes";
import PatientPortal from "@/views/users/PatientPortal.vue";
import DoctorPortal from "@/views/users/DoctorPortal.vue";
import AdminPortal from "@/views/users/AdminPortal.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    { path: "/", component: Home },
    { ...accountRoutes },
    // catch all redirect to home page
    { path: "/:pathMatch(.*)*", redirect: "/" },
    { path: "/admin/portal", component: AdminPortal },
    { path: "/doctor/portal", component: DoctorPortal },
    { path: "/patient/portal", component: PatientPortal },
    // ...other routes
  ],
});

router.beforeEach(async (to) => {
  // clear alert on route change
  const alertStore = useAlertStore();
  alertStore.clear();

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/account/login", "/account/register"];
  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath;
    return "/account/login";
  }
});
