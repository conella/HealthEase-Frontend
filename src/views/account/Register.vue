<template>
    <v-container class="container-centered">
        <v-row justify="center">
            <!-- Welcome Text -->
            <v-col cols="12" class="text-center mb-4">
                <h1 class="display-1 font-weight-bold">Create Your Account</h1>
                <p class="text-subtitle-1 health-subtext">
                    Join the HealthEase family and take control of your health.
                </p>
            </v-col>
            <!-- Register Form -->
            <v-col cols="12" md="6">
                <v-card class="pa-5" outlined>
                    <v-card-title class="headline">Register</v-card-title>
                    <v-card-text>
                        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ isSubmitting }">
                            <!-- First Name -->
                            <Field name="firstName" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" label="First Name"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <!-- Last Name -->
                            <Field name="lastName" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" label="Last Name"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <!-- Email -->
                            <Field name="email" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" label="Email"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <!-- Phone Number -->
                            <Field name="phoneNumber" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" label="Phone Number"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <!-- Username -->
                            <Field name="username" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" label="Username"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <!-- Password -->
                            <Field name="password" v-slot="{ field, errorMessage }">
                                <v-text-field v-bind="field" type="password" label="Password"
                                    :error-messages="errorMessage ? [errorMessage] : []" outlined dense required />
                            </Field>

                            <v-btn :loading="isSubmitting" color="primary" type="submit" block class="mt-4">
                                Register
                            </v-btn>
                        </Form>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-center">
                        <router-link to="/account/login" class="v-btn v-btn--text">
                            Already have an account? Login
                        </router-link>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

import { useUsersStore, useAlertStore } from '@/stores'
import { router } from '@/router'

const schema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
})

async function onSubmit(values) {
    const usersStore = useUsersStore()
    const alertStore = useAlertStore()
    try {
        await usersStore.register(values)
        await router.push('/account/login')
        alertStore.success('Registration successful')
    } catch (error) {
        alertStore.error(error)
    }
}
</script>

<style scoped lang="scss">
h1 {
    font-size: $font-size-xl;
    color: $color-primary;
}

.v-card {
    max-width: 500px;
    margin: auto;
    border-radius: $radius-lg;
    box-shadow: $box-shadow-medium;
}

.v-btn {
    text-transform: none;
}

.health-subtext {
    color: $color-secondary;
}
</style>