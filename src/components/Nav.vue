<script setup>
import { useAuthStore } from '@/stores';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();

import { ref, watchEffect } from 'vue';

const isRegisterPage = ref(false);
const isLoginPage = ref(false);

// Watch the route path and update flags
watchEffect(() => {
    isRegisterPage.value = route.path === '/account/register';
    isLoginPage.value = route.path === '/account/login';
});

</script>

<template>
    <v-app-bar app color="primary" dark>
        <v-toolbar-title>HealthEase</v-toolbar-title>
        <v-spacer />

        <!-- Unauthenticated (Login/Register) Navbar -->
        <template v-if="!authStore.user">
            <v-btn text to="/">Home</v-btn>
            <v-btn text to="/about">About</v-btn>

            <!-- Show Register only if not already on the register page -->
            <v-btn v-if="!isRegisterPage" text to="/account/register">Register</v-btn>

            <!-- Show Login only if not already on the login page -->
            <v-btn v-if="!isLoginPage" text to="/account/login">Login</v-btn>

            <v-btn text to="/terms">Terms</v-btn>
            <v-btn text to="/contact">Contact</v-btn>
        </template>

        <!-- Patient Navbar -->
        <template v-else-if="authStore.user.role === 'patient'">
            <v-btn text to="/dashboard">Dashboard</v-btn>
            <v-btn text to="/patient/portal/appointments">Appointments</v-btn>
            <v-btn text to="/patient/history">Medical Records</v-btn>
            <v-btn text to="/patient/portal/find-doctors">Find a Doctor</v-btn>
            <v-btn text @click="authStore.logout()">Logout</v-btn>
        </template>

        <!-- Doctor Navbar -->
        <template v-else-if="authStore.user.role === 'doctor'">
            <v-btn text to="/doctor/portal">Dashboard</v-btn>
            <v-btn text to="/doctor/schedule">My Schedule</v-btn>
            <v-btn text to="/doctor/appointments">Appointments</v-btn>
            <v-btn text to="/doctor/patients">Patients</v-btn>
            <v-btn text @click="authStore.logout()">Logout</v-btn>
        </template>

        <!-- Admin Navbar -->
        <template v-else-if="authStore.user.role === 'admin'">
            <v-btn text to="/admin/portal">Dashboard</v-btn>
            <v-btn text to="/admin/users">Manage Users</v-btn>
            <v-btn text to="/admin/reports">Reports</v-btn>
            <v-btn text to="/admin/appointments">Appointments</v-btn>
            <v-btn text @click="authStore.logout()">Logout</v-btn>
        </template>
    </v-app-bar>
</template>