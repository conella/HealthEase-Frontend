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

    async cancelAppointment(id) {
      try {
        await api.put(`/api/appointments/${id}/cancel`);
        // Optimistically update state
        this.appointments = this.appointments.map((appt) =>
          appt.id === id ? { ...appt, status: "cancelled" } : appt
        );
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
        throw error;
      }
    },

    async rescheduleAppointment(id, newDate, newTime) {
      try {
        await api.put(`/api/appointments/${id}/reschedule`, {
          appointmentDate: newDate,
          appointmentTime: newTime,
        });

        // Optional: re-fetch to reflect changes
        await this.fetchAppointments();
      } catch (error) {
        console.error("Failed to reschedule appointment:", error);
        throw error;
      }
    },
  },
});