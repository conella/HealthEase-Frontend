import { defineStore } from "pinia";
import api from "@/services/api";

export const useAppointmentsStore = defineStore("appointments", {
  state: () => ({
    appointments: [],
  }),

  actions: {
    async fetchAppointments() {
      try {
        const res = await api.get("/api/appointments");
        this.appointments = res.data;
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        throw error;
      }
    },

    // Inside the appointments store
    async cancelAppointment(id) {
      try {
        // Make a PUT request to the cancel endpoint
        await api.put(`/api/appointments/${id}/cancel`);

        // Update the status locally in the store to reflect the cancellation
        this.appointments = this.appointments.map((appt) =>
          appt.id === id ? { ...appt, status: "canceled" } : appt
        );
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
        throw error;
      }
    },

    async rescheduleAppointment(id, newDate, newTime) {
      try {
        await api.put(`/api/appointments/${id}`, {
          newAppointmentDate: newDate,
          newAppointmentTime: newTime,
        });

        await this.fetchAppointments();
      } catch (error) {
        console.error("Failed to reschedule appointment:", error);
        throw error;
      }
    },

    // New method to book an appointment
    async bookAppointment({ doctorId, appointmentDate, appointmentTime }) {
      try {
        const res = await api.post("/api/appointments", {
          doctorId,
          appointmentDate,
          appointmentTime,
        });

        // Optionally, fetch updated appointments after booking
        await this.fetchAppointments();
      } catch (error) {
        console.error("Failed to book appointment:", error);
        throw error;
      }
    },

    async fetchDoctors() {
      try {
        const res = await api.get("/api/doctors");

        // Extract and map data directly
        doctors.value = res.data.map((d) => ({
          id: d.id,
          name: `${d.firstName} ${d.lastName}`,
        }));
      } catch (error) {
        console.error("Error fetching doctors:", error);
        alert(
          "Error fetching doctors: " +
            (error.response?.data?.message || error.message)
        );
      }
    },
  },
});
