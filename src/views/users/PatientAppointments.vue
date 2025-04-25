<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center mb-4">
        <h1 class="display-1 font-weight-bold">My Appointments</h1>
        <p class="text-subtitle-1 health-subtext">
          Here are your upcoming and past appointments.
        </p>
      </v-col>

      <!-- Add Appointment Button -->
      <v-col cols="12" class="text-center mb-4">
        <v-btn color="primary" :to="{ name: 'book-appointment' }">
          Add Appointment
        </v-btn>
      </v-col>

      <v-col cols="12" v-if="appointments.length === 0" class="text-center">
        <v-alert type="info">You have no appointments yet.</v-alert>
      </v-col>

      <v-col cols="12" v-for="appointment in appointments" :key="appointment.id">
        <v-card class="mb-4" outlined>
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <strong>{{ appointment.doctorname }}</strong> - {{ appointment.department }}
            </div>
            <v-chip :color="statusColor(appointment.status)" dark>{{ appointment.status }}</v-chip>
          </v-card-title>

          <v-card-text>
            <p><strong>Date:</strong> {{ formatDate(appointment.appointmentdate) }}</p>
            <p><strong>Time:</strong> {{ formatTime(appointment.appointmenttime) }}</p>
          </v-card-text>

          <v-card-actions>
            <v-btn color="error" @click="cancel(appointment.id)" :disabled="appointment.status === 'canceled'">
              Cancel
            </v-btn>

            <v-btn color="primary" @click="openRescheduleDialog(appointment)"
              :disabled="appointment.status !== 'booked'">
              Reschedule
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reschedule Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Reschedule Appointment</v-card-title>
        <v-card-text>
          <v-text-field v-model="newDate" label="New Date" type="date" />
          <v-text-field v-model="newTime" label="New Time" type="time" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="reschedule">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, watch, computed, ref } from "vue";
import { useAppointmentsStore } from "@/stores/appointments.store";
import { useAuthStore } from '@/stores'

const store = useAppointmentsStore();
const dialog = ref(false);
const selectedAppointmentId = ref(null);
const newDate = ref("");
const newTime = ref("");

// const appointments = store.appointments;
const appointments = computed(() => store.appointments);
const authStore = useAuthStore()

// onMounted(() => {
//   store.fetchAppointments();
// });

// ✅ Wait for user to be available before fetching appointments
watch(
  () => authStore.user,
  (user) => {
    if (user) {
      store.fetchAppointments();
    }
  },
  { immediate: true }
);

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function formatTime(timeStr) {
  // Check if timeStr is a valid string and has the correct format before using .slice
  if (timeStr && timeStr.length >= 5) {
    return timeStr.slice(0, 5); // Trims to HH:mm
  }
  return 'Invalid Time'; // Return a fallback if the time format is incorrect or missing
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

function cancel(id) {
  store.cancelAppointment(id);
}

function openRescheduleDialog(appointment) {
  selectedAppointmentId.value = appointment.id;
  newDate.value = appointment.appointmentdate.split("T")[0]; // for input[type="date"]
  newTime.value = appointment.appointmenttime.slice(0, 5); // for input[type="time"]
  dialog.value = true;
}

async function reschedule() {
  await store.rescheduleAppointment(selectedAppointmentId.value, newDate.value, newTime.value);
  dialog.value = false;
}
</script>

<style scoped>
.health-subtext {
  color: #4caf50;
}
</style>