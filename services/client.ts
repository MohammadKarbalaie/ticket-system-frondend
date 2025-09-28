import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export const setAuthHeader = (accessToken: string | null) => {
  if (accessToken) {
    apiClient.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete apiClient.defaults.headers["Authorization"];
  }
};

export default apiClient;
