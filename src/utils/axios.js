api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await api.post("/refresh");
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Refresh failed:", refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );