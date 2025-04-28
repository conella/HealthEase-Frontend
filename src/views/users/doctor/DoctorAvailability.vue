<template>
  <v-container>
    <!-- Header -->
    <v-row class="text-center mb-4">
      <v-col cols="12">
        <h1 class="display-1 font-weight-bold">Appointment Schedule</h1>
        <p class="text-subtitle-1 text-blue-darken-2">
          View your upcoming patient appointments.
        </p>
      </v-col>
    </v-row>

    <!-- Date Filters -->
    <v-row class="mb-4" justify="center">
      <v-col cols="12" md="3">
        <v-text-field v-model="startDate" label="Start Date" type="date" :min="today" />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="endDate" label="End Date" type="date" :min="today" />
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn color="primary" @click="fetchAppointments">Filter</v-btn>
      </v-col>
    </v-row>

    <!-- Appointments Table -->
    <v-row>
      <v-col cols="12">
        <v-alert v-if="appointments.length === 0" type="info">
          No appointments found for the selected dates.
        </v-alert>

        <v-table v-if="appointments.length > 0">
          <thead>
            <tr>
              <th class="text-left">Date</th>
              <th class="text-left">Time</th>
              <th class="text-left">Patient</th>
              <th class="text-left">Department</th>
              <th class="text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(appt, index) in appointments" :key="index">
              <td>{{ formatDate(appt.appointmentdate) }}</td>
              <td>{{ formatTime(appt.appointmenttime) }}</td>
              <td>{{ appt.patientname }}</td>
              <td>{{ appt.department }}</td>
              <td>
                <v-chip :color="statusColor(appt.status)" dark>{{ appt.status }}</v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
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

const today = ref(new Date().toISOString().split("T")[0]);

// Fetch appointments when page loads
onMounted(fetchAppointments);

async function fetchAppointments() {
  try {
    const query = [];
    if (startDate.value && endDate.value) {
      query.push(`startDate=${startDate.value}`, `endDate=${endDate.value}`);
    }

    const url = `/api/checkappointments/${authStore.user.id}${query.length > 0 ? "?" + query.join("&") : ""
      }`;

    const res = await api.get(url);
    appointments.value = res.data;
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
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
.text-blue-darken-2 {
  color: #1565c0;
}
</style>