import axios from "axios";

const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
const isBrowser = typeof window !== "undefined";
const isLocalhostBaseUrl = configuredBaseUrl?.includes("localhost");
const shouldUseConfiguredBaseUrl =
  !!configuredBaseUrl && (!isBrowser || !isLocalhostBaseUrl);

const axiosInstance = axios.create({
  // In browser, prefer same-origin calls unless a non-localhost URL is configured.
  baseURL: shouldUseConfiguredBaseUrl ? configuredBaseUrl : undefined,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — centralized error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Une erreur est survenue";

    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
