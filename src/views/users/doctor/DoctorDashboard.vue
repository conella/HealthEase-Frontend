<template>
  <v-container>
    <v-row>
      <!-- Title -->
      <v-col cols="12" class="text-center mb-4">
        <h1 class="display-1 font-weight-bold">Doctor Dashboard</h1>
        <p class="text-subtitle-1 health-subtext">
          Stay updated with your appointments and availability.
        </p>
      </v-col>

      <!-- Total Appointments -->
      <v-col cols="12" md="4" class="text-center mb-4">
        <v-card class="d-flex flex-column align-center pa-4 fixed-card-size" color="blue lighten-5" elevation="2">
          <v-card-title class="headline">Total Appointments</v-card-title>
          <v-card-text class="display-2 font-weight-bold text-black body-text">
            {{ totalAppointments }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Next Appointment -->
      <v-col cols="12" md="4" class="text-center mb-4">
        <v-card class="d-flex flex-column align-center pa-4 fixed-card-size" color="green lighten-5" elevation="2">
          <v-card-title class="headline">Next Appointment</v-card-title>
          <v-card-text class="text-black">
            <div v-if="nextAppointment">
              <strong>Patient:</strong> {{ nextAppointment.patientname }}<br />
              <strong>Date:</strong> {{ formatDate(nextAppointment.appointmentdate) }}<br />
              <strong>Time:</strong> {{ formatTime(nextAppointment.appointmenttime) }}
            </div>
            <div v-else>
              No upcoming appointments.
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Total Leave Days -->
      <v-col cols="12" md="4" class="text-center mb-4">
        <v-card class="d-flex flex-column align-center pa-4 fixed-card-size" color="blue-grey lighten-5" elevation="2">
          <v-card-title class="headline">Days on Leave</v-card-title>
          <v-card-text class="display-2 font-weight-bold text-black body-text">
            {{ leaveDays.length }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quick Actions -->
      <v-col cols="12" class="text-center mb-4">
        <v-btn color="primary" class="ma-2" :to="{ name: 'doctor-availability' }" elevation="2">
          View My Schedule
        </v-btn>
        <v-btn color="success" class="ma-2" :to="{ name: 'doctor-leaves' }" elevation="2">
          Apply for Leave
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores";
import api from "@/services/api";

const authStore = useAuthStore();
const totalAppointments = ref(0);
const nextAppointment = ref(null);
const leaveDays = ref([]);

onMounted(async () => {
  const doctorId = authStore.user?.id;
  if (!doctorId) return;

  await fetchAppointments(doctorId);
  await fetchLeaveDays(doctorId);
});

async function fetchAppointments(doctorId) {
  try {
    const res = await api.get(`/api/checkappointments/${doctorId}`);
    const appointments = res.data;

    totalAppointments.value = appointments.length;

    const upcoming = appointments
      .filter(a => new Date(a.appointmentdate) >= new Date() && a.status !== "canceled")
      .sort((a, b) => new Date(a.appointmentdate) - new Date(b.appointmentdate));

    nextAppointment.value = upcoming[0] || null;
  } catch (err) {
    console.error("Error fetching appointments:", err);
  }
}

async function fetchLeaveDays(doctorId) {
  try {
    const res = await api.get(`/api/showleavedays/getleaves/${doctorId}`);
    leaveDays.value = res.data || [];
  } catch (err) {
    console.error("Error fetching leaves:", err);
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

function formatTime(timeStr) {
  return timeStr?.slice(0, 5) || "N/A";
}
</script>

<style scoped>
.health-subtext {
  color: #4caf50;
}

/* Make the cards a fixed size */
.fixed-card-size {
  height: 250px;
  width: 100%;
  min-width: 300px;
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

/* Text styling to match patient dashboard */
.v-card-title {
  font-size: 18px;
  font-weight: 500;
}

.v-card-text {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.text-blue-darken-2 {
  color: #1565c0;
}

.text-grey-darken-2 {
  color: #455a64;
}

.text-grey-darken-4 {
  color: #263238;
}

.text-black {
  color: black;
}

.body-text {
  font-size: 60px;
}
</style>