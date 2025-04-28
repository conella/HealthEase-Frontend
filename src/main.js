import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/globals.scss";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { router } from "./router";
import { createPinia } from "pinia";
import "@mdi/font/css/materialdesignicons.css"

const app = createApp(App);

// Set up Pinia first
const pinia = createPinia();
app.use(pinia);

// Auth store after Pinia is available
import { useAuthStore } from "@/stores";
const authStore = useAuthStore();

// Set up Vuetify
const vuetify = createVuetify({
  components,
  directives,
});

app.use(vuetify);
app.use(router);

// Wait for auth + router
authStore.checkAuth().finally(async () => {
  await router.isReady();
  app.mount("#app");
});