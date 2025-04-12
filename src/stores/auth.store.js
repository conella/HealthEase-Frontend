import { defineStore } from "pinia";

import { router } from "@/router";
import axios from 'axios';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),

  actions: {
    async login(username, password) {
      try {
        // Make a POST request to the backend login endpoint
        const response = await axios.post(`${baseUrl}/login`, {
          username,
          password,
        });

        // Store the authenticated user in the store
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
        // Handle login error (e.g., invalid username or password)
        console.error("Login failed:", error);
        throw new Error(error.response?.data?.message || "Login failed");
      }
    },

    logout() {
      this.user = null;
      router.push("/login");
    },
  },
});
