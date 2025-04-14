<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores'
import { Nav, Alert } from '@/components';

onMounted(() => {
  const authStore = useAuthStore();
  authStore.checkAuth();
});

</script>

<template>
    <v-app>
        <Nav />
        <Alert />
        <v-main>
            <router-view />
        </v-main>
    </v-app>

</template>