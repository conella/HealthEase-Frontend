import { defineStore } from "pinia";
import { router } from "@/router";
import api from "@/services/api"; // using the axios instance

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),

  actions: {
    async login(username, password) {
      try {
        // Using the custom axios instance with credentials
        const response = await api.post("/login", {
          username,
          password,
        });

        this.user = response.data.user;

        // Redirect based on user role
        switch (this.user.role) {
          case "admin":
            router.push("/admin/portal");
            break;
          case "doctor":
            router.push("/doctor/portal");
            break;
          case "patient":
            router.push("/patient/portal");
            break;
          default:
            router.push("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },

    async logout() {
      try {
        await api.post("/logout");
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        this.user = null;
        router.push("/account/login");
      }
    },

    async checkAuth() {
      try {
        const response = await api.get("/me");
        this.user = response.data;
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.warn("Not authenticated");
        this.user = null;
      }
    },
  },
});
