<script setup>
import { Nav, Alert } from '@/components';

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