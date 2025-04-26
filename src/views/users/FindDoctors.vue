<template>
    <v-container>
        <v-row>
            <!-- Heading -->
            <v-col cols="12" class="text-center mb-4">
                <h1 class="display-1 font-weight-bold">Find Doctors</h1>
                <p class="text-subtitle-1 health-subtext">
                    Find the best doctors in your area and book an appointment.
                </p>
            </v-col>

            <!-- Search Bar -->
            <v-col cols="12" class="mb-4">
                <v-text-field v-model="search" label="Search Doctors" prepend-inner-icon="mdi-magnify"
                    variant="outlined" hide-details single-line></v-text-field>
            </v-col>

            <!-- Loading state -->
            <v-col cols="12" v-if="loading" class="text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>Loading doctors...</p>
            </v-col>

            <!-- Error state -->
            <v-col cols="12" v-if="error" class="text-center">
                <v-alert type="error">Error loading doctors: {{ error }}</v-alert>
            </v-col>

            <!-- Doctors Table -->
            <v-col cols="12">
                <v-table v-if="filteredDoctors.length > 0">
                    <thead>
                        <tr>
                            <th class="text-left">Doctor Name</th>
                            <th class="text-left">Department</th>
                            <th class="text-left">Email</th>
                            <th class="text-left">Phone</th>
                            <th class="text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="doctor in filteredDoctors" :key="doctor.doctorname">
                            <td>{{ doctor.doctorname }}</td>
                            <td>{{ doctor.department }}</td>
                            <td>{{ doctor.email }}</td>
                            <td>{{ doctor.phonenumber }}</td>
                            <td>
                                <v-btn class="doctor-btn" size="x-small" color="primary"
                                    @click="viewDoctorDetails(doctor)">
                                    View Details
                                </v-btn>
                                <v-btn class="doctor-btn" size="x-small" color="success"
                                    @click="viewDoctorDetails(doctor)">
                                    Availability
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <!-- Pagination -->
                <v-pagination v-model:page="page" :length="Math.ceil(filteredDoctors.length / itemsPerPage)" circle />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';

const doctors = ref([]);
const loading = ref(true);
const error = ref(null);
const page = ref(1);
const itemsPerPage = 5; // Adjust based on how many doctors you want to show per page
const search = ref('');

const fetchDoctors = async () => {
    try {
        const response = await api.get('/api/doctors/find-doctors');
        doctors.value = response.data;
    } catch (err) {
        error.value = err.response?.data?.message || err.message;
    } finally {
        loading.value = false;
    }
};

// Fetch doctors when component is mounted
onMounted(fetchDoctors);

// Handle viewing doctor details
const viewDoctorDetails = (doctor) => {
    // TODO
};

// Computed property to filter doctors based on the search input
const filteredDoctors = computed(() => {
    if (!search.value) {
        return doctors.value;
    }
    return doctors.value.filter(doctor => {
        return (
            doctor.doctorname.toLowerCase().includes(search.value.toLowerCase()) ||
            doctor.department.toLowerCase().includes(search.value.toLowerCase()) ||
            doctor.email.toLowerCase().includes(search.value.toLowerCase()) ||
            doctor.phonenumber.toLowerCase().includes(search.value.toLowerCase())
        );
    });
});
</script>

<style scoped>
.health-subtext {
    color: #4caf50;
}

.doctor-btn {
    padding: 5px 5px 5px 5px !important;
    margin: 2px;
}
</style>
