import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import flushPromises from "flush-promises";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Layout, Login, Register } from "@/views/account";
import { Home } from "@/views";
import { createRouter, createMemoryHistory } from "vue-router";
import { router as mockedRouter } from "@/router";
import { createTestingPinia } from "@pinia/testing";
import { setupVuetify } from "@/../tests/setup/vuetify";

import { useUsersStore } from "@/stores/users.store.js";
import { useAlertStore } from "@/stores/alert.store.js";

import ResizeObserver from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserver;

vi.mock("@/router", () => ({
  router: {
    push: vi.fn(),
  },
}));

describe("Register", () => {
  let vuetify;
  let router;
  let usersStore;
  let alertStore;

  beforeEach(async () => {
    vuetify = setupVuetify();

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: Home },
        {
          path: "/account",
          component: Layout,
          children: [
            { path: "", redirect: "login" },
            { path: "login", component: Login },
            { path: "register", component: Register },
          ],
        },
      ],
    });
  });

  const mountComponent = () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    const wrapper = mount(Register, {
      global: {
        plugins: [router, pinia, vuetify],
      },
    });

    usersStore = useUsersStore();
    alertStore = useAlertStore();

    return wrapper;
  };

  const fillForm = async (
    wrapper,
    { firstName, lastName, email, phoneNumber, username, password }
  ) => {
    await wrapper.find('input[name="firstName"]').setValue(firstName);
    await wrapper.find('input[name="lastName"]').setValue(lastName);
    await wrapper.find('input[name="email"]').setValue(email);
    await wrapper.find('input[name="phoneNumber"]').setValue(phoneNumber);
    await wrapper.find('input[name="username"]').setValue(username);
    await wrapper.find('input[name="password"]').setValue(password);
  };

  it("renders the registration form", async () => {
    const wrapper = mountComponent();

    expect(wrapper.find("h1").text()).toBe("Create Your Account");
    expect(wrapper.find("button").text()).toBe("Register");
  });

  it("submits the form successfully and navigates", async () => {
    const registerMock = vi.fn().mockResolvedValue();
    const successMock = vi.fn();

    const wrapper = mountComponent();
    await flushPromises();
    await nextTick();

    usersStore.register = registerMock;
    alertStore.success = successMock;

    await fillForm(wrapper, {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "123456789",
      username: "johndoe",
      password: "password123",
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    await nextTick();

    expect(registerMock).toHaveBeenCalledWith({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "123456789",
      username: "johndoe",
      password: "password123",
    });

    expect(successMock).toHaveBeenCalledWith("Registration successful");
    expect(mockedRouter.push).toHaveBeenCalledWith("/account/login");
  });

  it("handles registration error gracefully", async () => {
    const errorMock = vi.fn();
    const registerMock = vi
      .fn()
      .mockRejectedValue(new Error("Registration failed").message);

    const wrapper = mountComponent();

    usersStore.register = registerMock;
    alertStore.error = errorMock;

    await fillForm(wrapper, {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@gmail.com",
      phoneNumber: "123456789",
      username: "johndoe",
      password: "password123",
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    await nextTick();

    expect(errorMock).toHaveBeenCalledWith("Registration failed");
  });
});
