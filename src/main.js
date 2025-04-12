import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/globals.scss";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { router } from "./router"; // Import the router configuration
import { createPinia } from "pinia"; // Import Pinia
import { useAuthStore } from '@/stores';

import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App);

// Initialize Pinia
const pinia = createPinia();
app.use(pinia);

const authStore = useAuthStore();

const vuetify = createVuetify({
  components,
  directives,
});

app.use(router);
app.use(vuetify);

// Wait for auth before mounting
authStore.checkAuth().finally(() => {
  app.mount('#app');
});
