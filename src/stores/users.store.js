import { defineStore } from "pinia";
import api from "@/services/api"; // axios instance

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    user: null,
  }),

  actions: {
    // Register user via backend
    async register(user) {
      try {
        const res = await api.post('/register', user); // POST to backend
        return res.data;
      } catch (error) {
        console.error('Registration error:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || "Registration failed";
      }
    },

    // Login method
    async login(username, password) {
      try {
        const response = await api.post('/login', { username, password });
        this.user = response.data.user; // Store the user in Pinia

        return response.data.user; // Return user object
      } catch (error) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || 'Login failed';  // Show proper error
      }
    },
  }
});
