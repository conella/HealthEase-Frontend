<template>
    <v-container>
      <!-- Display different content based on the user's role -->
      <div v-if="userRole === 'patient'">
        <PatientDashboard />
      </div>
      <div v-if="userRole === 'doctor'">
        <DoctorDashboard />
      </div>
      <div v-if="userRole === 'admin'">
        <AdminDashboard />
      </div>
  
      <!-- Show loading message if userRole is undefined (i.e., user is not loaded yet) -->
      <div v-else-if="userRole === undefined">
        <p>Loading dashboard content...</p>
      </div>
    </v-container>
  </template>
  
  <script setup>
  import { computed, onMounted } from "vue";
  import { useAuthStore } from "@/stores";
  import PatientDashboard from "@/views/users/PatientDashboard.vue";
  import DoctorDashboard from "@/views/users/doctor/DoctorDashboard.vue";
  import AdminDashboard from "@/views/users/AdminDashboard.vue";
  import { router } from "@/router";
  
  const authStore = useAuthStore();
  
  // Get the current user's role
  const userRole = computed(() => authStore.user?.role);
  
  // Redirect to home if no user is logged in
  onMounted(() => {
    if (!authStore.user) {
      router.push("/"); // Redirect to home if no user is found
    }
  });
  </script>