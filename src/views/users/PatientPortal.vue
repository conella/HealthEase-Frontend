<template>
    <v-container class="portal-container">
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <h1 class="title">Welcome, {{ user.firstName }}!</h1>
                <p class="subtitle">Manage your health effortlessly with HealthEase.</p>
            </v-col>
            <v-col cols="12" md="8">
                <v-card outlined class="dashboard-card">
                    <v-card-title class="headline">Your Quick Actions</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-btn block color="primary" to="/patient/appointments">
                                    <v-icon start color="secondary">mdi-calendar-account</v-icon>
                                    View Appointments</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-btn block color="primary" to="/patient/history">
                                    <v-icon start color="secondary">mdi-file-document</v-icon>
                                    Medical Records</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-btn block color="primary" to="/patient/search-doctor">
                                    <v-icon start color="secondary">mdi-doctor</v-icon>
                                    Find a Doctor</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores'
const { user } = useAuthStore()
</script>

<style scoped lang="scss">
.portal-container {
    padding-top: 60px;
}

.title {
    font-size: 2.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.subtitle {
    font-size: 1.2rem;
    color: #7f8c8d;
}

.dashboard-card {
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>