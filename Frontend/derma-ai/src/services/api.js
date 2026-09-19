import axios from "axios";
import toast from "react-hot-toast";
import { getCookie } from "../utils/cookies";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  timeout: 30000,
});

export const apiCall = async (method, url, data = null, config = {}) => {
  let toastId;

  try {
    if (method.toLowerCase() !== "get") {
      toastId = toast.loading("Loading...");
    }
    const requestConfig = { ...config, headers: { ...config.headers } };
    const lowerCaseMethod = method.toLowerCase();

    if (
      lowerCaseMethod !== "get" &&
      lowerCaseMethod !== "head" &&
      lowerCaseMethod !== "options"
    ) {
      const csrfToken = getCookie("csrf_access_token");
      if (csrfToken) {
        requestConfig.headers["X-CSRF-TOKEN"] = csrfToken;
      }
    }

    const response = await apiClient({
      method,
      url,
      data,
      ...requestConfig,
    });

    if (toastId) {
      toast.dismiss(toastId);
    }

    return response.data;
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    const errorDetail = error.response?.data?.detail;

    if (typeof errorDetail === "string") {
      errorMessage = errorDetail;
    } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
      errorMessage = errorDetail[0].msg || "A validation error occurred.";
    }

    if (toastId) {
      toast.error(errorMessage, { id: toastId });
    } else {
      toast.error(errorMessage);
    }

    throw error;
  }
};

export default apiClient;
