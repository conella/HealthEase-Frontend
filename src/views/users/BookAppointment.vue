<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="text-center mb-4">
                <h1 class="display-1 font-weight-bold">Book a New Appointment</h1>
                <p class="text-subtitle-1 health-subtext">
                    Schedule your next appointment with ease.
                </p>
            </v-col>

            <v-col cols="12">
                <v-card class="mt-8 pa-4" outlined>
                    <v-card-title class="headline">Book New Appointment</v-card-title>
                    <v-card-text>
                        <!-- v-select without return-object -->
                        <v-select v-if="doctors.length > 0" v-model="selectedDoctorId" :items="doctors"
                            item-title="name" item-value="id" label="Select Doctor" />
                        <v-alert v-else-if="doctors.length === 0 && !loading" type="info">No doctors
                            available.</v-alert>
                        <v-alert v-else type="info">Loading doctors...</v-alert>

                        <v-text-field v-model="selectedDate" label="Select Date" type="date" />
                        <v-text-field v-model="selectedTime" label="Select Time" type="time" />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="bookAppointment">Book Appointment</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppointmentsStore } from "@/stores/appointments.store";
import api from '@/services/api';

const store = useAppointmentsStore();
const selectedDoctorId = ref(null); // Holds only the doctor ID
const selectedDate = ref("");
const selectedTime = ref("");
const doctors = ref([]); // doctors fetched from the backend
const loading = ref(true); // To show a loading state

onMounted(() => {
    fetchDoctors();
});

// Fetch doctors from the backend
async function fetchDoctors() {
    try {
        const res = await api.get("/api/doctors");
        const data = res.data;
        doctors.value = data.map((d) => ({
            id: d.id,
            name: `${d.firstname} ${d.lastname}`,
        }));
    } catch (err) {
        console.error("Failed to fetch doctors:", err);
    } finally {
        loading.value = false;
    }
}

// Book the appointment using the store
async function bookAppointment() {
    if (!selectedDoctorId.value || !selectedDate.value || !selectedTime.value) {
        alert("Please fill in all fields");
        return;
    }

    try {
        await store.bookAppointment({
            doctorId: selectedDoctorId.value, // Pass only the doctor's ID
            appointmentDate: selectedDate.value,
            appointmentTime: selectedTime.value,
        });

        // Clear the form after booking
        selectedDoctorId.value = null;
        selectedDate.value = "";
        selectedTime.value = "";

        alert("Appointment booked successfully!");
    } catch (error) {
        alert("Failed to book the appointment.");
        console.error("Booking failed:", error);
    }
}
</script>

<style scoped>
.health-subtext {
    color: #4caf50;
}
</style>
