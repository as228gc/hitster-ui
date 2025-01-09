import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL, // Access the base URL from the .env file
});

export default apiClient;
