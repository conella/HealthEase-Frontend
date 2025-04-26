<template>
    <v-container class="container-centered" style="min-height: 80vh;">
        <v-row align="center" justify="center">
            <!-- HealthEase Welcome Text -->
            <v-col cols="12" class="text-center">
                <h1 class="display-1 font-weight-bold">Welcome to HealthEase</h1>
                <p>Your health journey starts here. Please log in to access your health records and more.</p>
            </v-col>
            <!-- Login Form -->
            <v-col cols="12" md="6">
                <v-card class="pa-5" outlined>
                    <v-card-title class="headline">Login</v-card-title>
                    <v-card-text>
                        <!-- Show error message here if login fails -->
                        <v-alert v-if="errorMessage" type="error" dismissible>
                            {{ errorMessage }}
                        </v-alert>

                        <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ isSubmitting }">
                            <!-- Username Field -->
                            <Field name="username" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" label="Username"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <!-- Password Field (No password validation here) -->
                            <Field name="password" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" type="password" label="Password"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <!-- Submit Button -->
                            <v-btn :loading="isSubmitting" color="primary" block type="submit">
                                Login
                            </v-btn>
                        </Form>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-center">
                        <router-link to="/account/register" class="v-btn v-btn--text">Don't have an account?
                            Register</router-link>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
import { useAuthStore } from '@/stores'
import { router } from '@/router'
import { useAlertStore } from "@/stores/alert.store.js";

let alertStore = useAlertStore();

// Validation schema
const validationSchema = Yup.object().shape({
    username: Yup.string().required("Please enter your username."),
    password: Yup.string().required("Please enter your password."),
})

// Reactive state for error message
const errorMessage = ref('')
const authStore = useAuthStore()

// Submit handler
async function onSubmit(values) {
    const { username, password } = values

    try {
        // Call login from Pinia store
        await authStore.login(username, password)

        // Show success message and redirect
        router.push('/dashboard') // Redirect user based on role
    } catch (error) {
        console.error("Login failed:", error);
        alertStore.error(error.message || "Invalid credentials");
    }
}
</script>

<style scoped>
/* Custom styles for login */
h1 {
    font-size: 3rem;
    color: #2b2b2b;
}

p {
    font-size: 1.2rem;
    color: #4CAF50;
}

.v-card {
    max-width: 400px;
    margin: auto;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.v-btn {
    text-transform: none;
}

.v-card-actions {
    justify-content: center;
}

.v-btn:disabled {
    background-color: #e1e1e1;
}
</style>