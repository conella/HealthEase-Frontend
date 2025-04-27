import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import PatientDashboard from "@/views/users/PatientDashboard.vue";
import { useAppointmentsStore } from "@/stores/appointments.store";
import { useAuthStore } from "@/stores";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createMemoryHistory } from "vue-router";
import { setupVuetify } from "@/../tests/setup/vuetify";

// Mock necessary modules
vi.mock("@/stores/appointments.store");
vi.mock("@/stores");

describe("PatientDashboard", () => {
  let appointmentsStore;
  let authStore;
  let vuetify;
  let router;

  beforeEach(async () => {
    vuetify = setupVuetify();

    // Setup mock router with a dummy route for 'book-appointment'
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/account",
          component: PatientDashboard,
        },
        {
          path: "/account/book-appointment",
          name: "book-appointment",
          component: { template: "<div>Book Appointment</div>" }, // Dummy component for testing
        },
      ],
    });

    // Mock stores
    appointmentsStore = {
      appointments: [],
      fetchAppointments: vi.fn(), // Mock the fetchAppointments method
    };

    authStore = {
      user: { id: 1, name: "John Doe" },
    };

    useAppointmentsStore.mockReturnValue(appointmentsStore); // Return mock appointmentsStore when used
    useAuthStore.mockReturnValue(authStore); // Return mock authStore when used
  });

  // Helper function to mount the component with required plugins
  const mountComponent = () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    const wrapper = mount(PatientDashboard, {
      global: {
        plugins: [router, pinia, vuetify], // Pass the router, pinia, and vuetify plugins
      },
    });

    return wrapper;
  };

  // Test case: Check if the component renders correctly
  it("renders the component correctly", () => {
    const wrapper = mountComponent();
    expect(wrapper.find("h1").text()).toBe("Patient Dashboard");
    expect(wrapper.find(".health-subtext").text()).toBe(
      "Overview of your appointments and upcoming schedule."
    );
  });

  // Test case: Verify total number of appointments is displayed correctly
  it("displays the correct total number of appointments", async () => {
    appointmentsStore.appointments = [
      {
        doctorId: 1,
        appointmentdate: "2025-05-10",
        appointmenttime: "10:00",
        status: "booked",
      },
      {
        doctorId: 2,
        appointmentdate: "2025-05-12",
        appointmenttime: "14:00",
        status: "booked",
      },
    ];

    const wrapper = mountComponent();
    await wrapper.vm.$nextTick(); // Ensure DOM is updated

    // Check if the total number of appointments is correctly displayed
    expect(wrapper.find(".v-card-text").text()).toContain("2");
  });

  // Test case: Verify next appointment is displayed correctly
  it("displays the next appointment correctly", async () => {
    appointmentsStore.appointments = [
      {
        doctorId: 1,
        appointmentdate: "2025-05-10",
        appointmenttime: "10:00",
        status: "booked",
      },
      {
        doctorId: 2,
        appointmentdate: "2025-05-12",
        appointmenttime: "14:00",
        status: "booked",
      },
    ];

    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();

    // Verify that the Total Appointments card contains the correct number (2)
    expect(wrapper.find(".v-card-text").text()).toContain("2");

    // Now, find the "Next Appointment" card specifically by targeting its index in the cards
    const nextAppointmentCard = wrapper.findAll(".v-card-text").at(1); // The next appointment card should be at index 1

    // Check that the next appointment contains the correct date and time
    expect(nextAppointmentCard.text()).toContain("5/10/2025 Time: 10:00");
  });

  // Test case: Check if "No upcoming appointments" message is shown when no upcoming appointments are available
  it('shows "No upcoming appointments" when there are no upcoming appointments', async () => {
    appointmentsStore.appointments = [
      {
        id: 1,
        status: "canceled",
        doctorName: "Dr. Smith",
        appointmentdate: "2025-05-01",
        appointmenttime: "10:00",
      },
    ];

    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();

    const appointmentDataCheck = wrapper.findAll(".v-card-text").at(1);
    expect(appointmentDataCheck.text()).toContain("No upcoming appointments.");
  });

  // Test case: Verify appointment status counts are calculated correctly (booked, canceled, rescheduled)
  it("calculates appointment status counts correctly", async () => {
    appointmentsStore.appointments = [
      {
        id: 1,
        status: "booked",
        appointmentdate: "2025-05-10",
        appointmenttime: "10:00",
      },
      {
        id: 2,
        status: "canceled",
        appointmentdate: "2025-05-12",
        appointmenttime: "14:00",
      },
      {
        id: 3,
        status: "rescheduled",
        appointmentdate: "2025-05-15",
        appointmenttime: "16:00",
      },
      {
        id: 4,
        status: "booked",
        appointmentdate: "2025-05-17",
        appointmenttime: "09:00",
      },
    ];

    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();

    // Find the Appointment Status Overview card and check the text
    const statusCards = wrapper.findAll(".v-card-text").at(2);
    expect(statusCards.text()).toContain("Booked: 2Canceled: 1Rescheduled: 1");
  });

  // Test case: Check if the "Book New Appointment" button exists
  it('shows the "Book New Appointment" button', async () => {
    const wrapper = mountComponent();
    await wrapper.vm.$nextTick();

    // Ensure the button exists and contains the correct text
    expect(wrapper.find(".v-btn").exists()).toBe(true);
    expect(wrapper.find(".v-btn").text()).toBe("Book New Appointment");
  });

  // Test case: Ensure fetchAppointments is called on component mount
  it("fetches appointments on mount", () => {
    mountComponent();
    expect(appointmentsStore.fetchAppointments).toHaveBeenCalled(); // Verify the mock method is called
  });
});
