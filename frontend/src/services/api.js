import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const signup = async (form) => {
  try {
    const { data } = await api.post("/auth/signup", form);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed." };
  }
};

export const login = async (form) => {
  try {
    const { data } = await api.post("/auth/login", form);
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed." };
  }
};

export const refresh = async () => {
  const { data } = await api.get("/auth/refresh");
  return data;
};

export const fetchProfile = async () => {
  const { data } = await api.get("/user/me");
  return data.user;
};

export const logoutApi = async () => {
  await api.post("/auth/logout");
};

export default api;
