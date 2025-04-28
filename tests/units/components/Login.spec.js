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

import { useAuthStore } from "@/stores/auth.store.js";
import { useAlertStore } from "@/stores/alert.store.js";

import ResizeObserver from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserver;

vi.mock("@/router", () => ({
  router: {
    push: vi.fn(),
  },
}));

describe("Login", () => {
  let vuetify;
  let router;
  let authStore;
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

    const wrapper = mount(Login, {
      global: {
        plugins: [router, pinia, vuetify],
      },
    });

    authStore = useAuthStore();
    alertStore = useAlertStore();

    return wrapper;
  };

  const fillForm = async (wrapper, { username, password }) => {
    await wrapper.find("input[name=\"username\"]").setValue(username);
    await wrapper.find("input[name=\"password\"]").setValue(password);
  };

  it("renders the login form", async () => {
    const wrapper = mountComponent();

    expect(wrapper.find("h1").text()).toBe("Welcome to HealthEase");
    expect(wrapper.find("button").text()).toBe("Login");
  });

  it("submits the form successfully and navigates", async () => {
    const loginMock = vi.fn().mockResolvedValue();
    const successMock = vi.fn();

    const wrapper = mountComponent();
    await flushPromises();
    await nextTick();

    authStore.login = loginMock;
    alertStore.success = successMock;

    await fillForm(wrapper, {
      username: "johndoe",
      password: "password123",
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    await nextTick();

    expect(loginMock).toHaveBeenCalledWith("johndoe", "password123");
    expect(mockedRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("handles login error gracefully", async () => {
    const errorMock = vi.fn();
    const loginMock = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    const wrapper = mountComponent();

    authStore.login = loginMock;
    alertStore.error = errorMock;

    await fillForm(wrapper, {
      username: "johndoe",
      password: "wrongPassword",
    });

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();
    await nextTick();

    expect(errorMock).toHaveBeenCalledWith("Invalid credentials");
  });
});
