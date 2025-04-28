<template>
  <v-container>
    <!-- Header -->
    <v-row>
      <v-col cols="12" class="text-center mb-4">
        <h1 class="display-1 font-weight-bold">My Appointments</h1>
        <p class="text-subtitle-1 text-green-darken-2">
          Review your upcoming and past appointments.
        </p>
      </v-col>
    </v-row>

    <!-- Date Filter -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field v-model="startDate" label="Start Date" type="date" dense />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="endDate" label="End Date" type="date" dense />
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-end">
        <v-btn color="primary" @click="fetchAppointments">Apply Filter</v-btn>
      </v-col>
    </v-row>

    <!-- Appointments List -->
    <v-row>
      <v-col cols="12" v-if="appointments.length === 0">
        <v-alert type="info">No appointments found.</v-alert>
      </v-col>

      <v-col cols="12" v-for="appt in appointments" :key="appt.id">
        <v-card class="mb-4" outlined>
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <strong>{{ appt.patientname }}</strong> - {{ appt.department }}
            </div>
            <v-chip :color="statusColor(appt.status)" dark>{{ appt.status }}</v-chip>
          </v-card-title>
          <v-card-text>
            <p><strong>Date:</strong> {{ formatDate(appt.appointmentdate) }}</p>
            <p><strong>Time:</strong> {{ formatTime(appt.appointmenttime) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { useAuthStore } from "@/stores";

const authStore = useAuthStore();
const appointments = ref([]);
const startDate = ref("");
const endDate = ref("");

onMounted(() => {
  fetchAppointments();
});

async function fetchAppointments() {
  try {
    const doctorId = authStore.user?.id;
    if (!doctorId) return;

    let query = `/api/checkappointments/${doctorId}`;
    const params = [];

    if (startDate.value && endDate.value) {
      query += `?startDate=${startDate.value}&endDate=${endDate.value}`;
    }

    const res = await api.get(query);
    appointments.value = res.data;
  } catch (err) {
    console.error("Error fetching appointments:", err);
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function formatTime(timeStr) {
  return timeStr?.slice(0, 5) || "N/A";
}

function statusColor(status) {
  switch (status) {
    case "booked":
      return "green";
    case "canceled":
      return "red";
    case "rescheduled":
      return "blue";
    default:
      return "grey";
  }
}
</script>

<style scoped>
.text-green-darken-2 {
  color: #2e7d32;
}
</style>