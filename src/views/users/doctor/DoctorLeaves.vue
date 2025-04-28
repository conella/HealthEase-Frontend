<template>
  <v-container>
    <v-row class="text-center mb-4">
      <v-col cols="12">
        <h1 class="display-1 font-weight-bold">Manage Leaves</h1>
        <p class="text-subtitle-1 text-green-darken-2">Apply or view your leave schedule</p>
      </v-col>
    </v-row>

    <!-- Leave Form -->
    <v-row class="mb-6">
      <v-col cols="12" md="6" offset-md="3">
        <v-card class="pa-4" outlined>
          <v-card-title>Apply for Leave</v-card-title>
          <v-card-text>
            <v-text-field v-model="selectedDate" label="Select Leave Date" type="date" :min="today" />
            <v-text-field v-model="leaveReason" label="Reason for Leave" placeholder="e.g. Sick Leave, Personal..."
              required />
            <v-alert v-if="feedback" :type="feedbackType" dense>{{ feedback }}</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="applyLeave">Apply Leave</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Existing Leaves -->
    <v-row>
      <v-col cols="12" class="text-center mb-2">
        <h2 class="headline font-weight-bold">Your Leaves</h2>
      </v-col>

      <v-col cols="12" md="6" offset-md="3">
        <v-card outlined>
          <v-list>
            <v-list-item v-for="(leave, index) in leaves" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ formatDate(leave.leavedate) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="leaves.length === 0">
              <v-list-item-content>No leaves added yet.</v-list-item-content>
            </v-list-item>
          </v-list>
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
const leaves = ref([]);
const selectedDate = ref("");
const feedback = ref("");
const feedbackType = ref("");
const leaveReason = ref("");

const today = ref(new Date().toISOString().split("T")[0]);

// Fetch leave dates on mount
onMounted(async () => {
  await fetchLeaves();
});

// Fetch leaves for the logged-in doctor
const fetchLeaves = async () => {
  try {
    const res = await api.get(`/api/showleavedays/getleaves/${authStore.user.id}`);
    leaves.value = res.data;
  } catch (err) {
    console.error("Error fetching leaves:", err);
  }
};

// Apply for a leave
const applyLeave = async () => {
  if (!selectedDate.value) {
    feedback.value = "Please select a date.";
    feedbackType.value = "error";
    return;
  }

  try {
    const checkRes = await api.post("/api/checkdoctorleaves/checkleave", {
      doctorId: authStore.user.id,
      selectedDate: selectedDate.value,
    });

    if (checkRes.data.isOnLeave) {
      feedback.value = "You're already on leave that day!";
      feedbackType.value = "info";
      return;
    }

    // Add leave
    await api.post("/api/doctorleaves/addleave", {
      doctorId: authStore.user.id,
      leaveDate: selectedDate.value,
      reason: leaveReason.value,
    });

    feedback.value = "Leave added successfully!";
    feedbackType.value = "success";
    selectedDate.value = "";
    leaveReason.value = "";
    await fetchLeaves(); // refresh the list
  } catch (err) {
    console.error("Error applying leave:", err);
    feedback.value = "Failed to apply leave.";
    feedbackType.value = "error";
  }
};

// Format date to readable string
function formatDate(dateStr) {
  return new Date(dateStr).toDateString();
}
</script>

<style scoped>
.text-green-darken-2 {
  color: #2e7d32;
}
</style>