<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center mb-4">
        <h1 class="display-1 font-weight-bold">Patient Dashboard</h1>
        <p class="text-subtitle-1 health-subtext">
          Overview of your appointments and upcoming schedule.
        </p>
      </v-col>

      <v-col cols="12" md="4" class="text-center mb-4">
        <v-card class="d-flex flex-column align-center pa-4 fixed-card-size" elevation="2">
          <v-card-title class="headline">Total Appointments</v-card-title>
          <v-card-text class="display-2 font-weight-bold">{{ totalAppointments }}</v-card-text>
        </v-card>
      </v-col>

      <!-- Next Appointment -->
      <v-col cols="12" md="4" class="text-center mb-4">
        <v-card class="d-flex flex-column align-center pa-4 fixed-card-size" elevation="2">
          <v-card-title class="headline">Next Appointment</v-card-title>
          <v-card-text>
            <div v-if="nextAppointment">
              <strong>{{ nextAppointment.doctorName }}</strong> {{ formatDate(nextAppointment.appointmentdate) }}
              <br />
              <strong>Time:</strong> {{ formatTime(nextAppointment.appointmenttime) }}
            </div>
            <div v-else>
              <p>No upcoming appointments.</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Appointment Status Overview -->
      <v-col cols="12" md="4" class="text-center mb-4">
        <v-card class="d-flex flex-column align-center pa-4 fixed-card-size" elevation="2">
          <v-card-title class="headline">Appointment Status</v-card-title>
          <v-card-text>
            <div>
              <p><strong>Booked:</strong> {{ statusCounts.booked }}</p>
              <p><strong>Canceled:</strong> {{ statusCounts.canceled }}</p>
              <p><strong>Rescheduled:</strong> {{ statusCounts.rescheduled }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Add Appointment Button -->
      <v-col cols="12" class="text-center mb-4">
        <v-btn color="primary" :to="{ name: 'book-appointment' }" elevation="2">Book New Appointment</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppointmentsStore } from '@/stores/appointments.store';
import { useAuthStore } from '@/stores';

const store = useAppointmentsStore();
const authStore = useAuthStore();

const totalAppointments = computed(() => store.appointments.length);

// Get next appointment
const nextAppointment = computed(() => {
  if (store.appointments.length === 0) return null;
  const upcomingAppointments = store.appointments
    .filter(app => new Date(app.appointmentdate) > new Date())
    .sort((a, b) => new Date(a.appointmentdate) - new Date(b.appointmentdate));
  return upcomingAppointments[0] || null;
});

// Appointment status counts
const statusCounts = computed(() => {
  return store.appointments.reduce(
    (counts, appointment) => {
      if (appointment.status === 'booked') counts.booked++;
      else if (appointment.status === 'canceled') counts.canceled++;
      else if (appointment.status === 'rescheduled') counts.rescheduled++;
      return counts;
    },
    { booked: 0, canceled: 0, rescheduled: 0 }
  );
});

// Fetch appointments when the user is available
onMounted(() => {
  if (authStore.user) {
    store.fetchAppointments();
  }
});

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function formatTime(timeStr) {
  if (timeStr && timeStr.length >= 5) {
    return timeStr.slice(0, 5); // Trims to HH:mm
  }
  return 'Invalid Time'; // Fallback
}
</script>

<style scoped>
.health-subtext {
  color: #4caf50;
}

/* Make the cards a fixed size */
.fixed-card-size {
  height: 250px; /* Fixed height */
  width: 100%; /* Take full width of the column */
  min-width: 300px; /* Minimum width */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.v-btn {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
}

/* Optional: Additional style for text inside cards */
.v-card-title {
  font-size: 18px;
  font-weight: 500;
}
.v-card-text {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100%; /* Ensure the content takes the full height of the card */
  text-align: center; /* Center the text */
}

</style>