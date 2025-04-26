import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore, useAlertStore } from "@/stores";
import { Home } from "@/views";
import accountRoutes from "./account.routes";

import PatientDashboard from "@/views/users/PatientDashboard.vue";
import DoctorDashboard from "@/views/users/DoctorDashboard.vue";
import AdminDashboard from "@/views/users/AdminDashboard.vue";
import PatientAppointments from "@/views/users/PatientAppointments.vue";
import BookAppointment from "../views/users/BookAppointment.vue";
import FindDoctors from "../views/users/FindDoctors.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: [
    { path: "/", component: Home },
    accountRoutes,
    // Dashboard route
    {
      path: "/dashboard",
      component: () => import('@/views/users/Dashboard.vue'), // Common parent component
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.user) {
          next(); // Allow access if user is logged in
        } else {
          next("/"); // Redirect to home if not logged in
          useAlertStore().error("You must be logged in to view the dashboard.");
        }
      },
    },

    // Patient routes
    { path: "/dashboard", component: PatientDashboard },
    { path: "/patient/portal/appointments", component: PatientAppointments },
    { path: "/patient/portal/appointments/book", name: "book-appointment", component: BookAppointment },
    { path: '/patient/portal/find-doctors', name: 'FindDoctors', component: FindDoctors },

    // Doctor & Admin portals
    { path: "/admin/portal", component: AdminDashboard },
    { path: "/doctor/portal", component: DoctorDashboard },

    // Catch all
    // { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

// // Auth guard
// router.beforeEach(async (to) => {
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

  // Run checkAuth only once
  if (!isAuthResolved) {
    await authStore.checkAuth();
    isAuthResolved = true;
  }

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath;
    return "/account/login";
  }
});
