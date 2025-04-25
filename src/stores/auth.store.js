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

        // Redirect to the dashboard page (generic dashboard)
        router.push("/dashboard");
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
        const res = await api.get("/me");
        this.user = res.data;
      } catch (err) {
        this.user = null;
      }
    },
  },
});
