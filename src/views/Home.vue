<template>
    <v-container class="container-centered">
      <v-row justify="center" class="text-center">
        <!-- Title -->
        <v-col cols="12" class="mb-4">
          <h1 class="display-1 font-weight-bold text-primary">Welcome to Hopewell General Hospital</h1>
          <p class="text-subtitle-1 health-subtext">
            Empowering patients and doctors with seamless healthcare technology.
          </p>
        </v-col>
  
        <!-- About the Hospital -->
        <v-col cols="12" md="8">
          <v-card class="pa-5 mb-6" outlined>
            <v-card-title class="headline">About Hopewell General Hospital</v-card-title>
            <v-card-text>
              Located in the heart of the UK, Hopewell General Hospital is dedicated to providing world-class healthcare services
              with compassion and innovation. With over <strong>20 experienced doctors</strong> and <strong>15 specialized departments</strong>, 
              we ensure that patients receive personalized care tailored to their needs.
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- About HealthEase -->
        <v-col cols="12" md="8">
          <v-card class="pa-5" outlined>
            <v-card-title class="headline">Introducing HealthEase</v-card-title>
            <v-card-text>
              HealthEase is a modern appointment management system built to simplify the healthcare journey for both patients and doctors. 
              From booking appointments online to accessing medical records securely, HealthEase brings everything under one roof. 
              The platform is user-friendly, secure, and accessible — built with the latest web technologies.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <style scoped lang="scss">
  h1 {
    font-size: $font-size-xl;
    color: $color-primary;
  }
  
  .v-card {
    border-radius: $radius-lg;
    box-shadow: $box-shadow-medium;
  }
  
  .health-subtext {
    color: $color-secondary;
  }
  </style>