import axios from "axios";


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-type": "application/json"
  } // Access the base URL from the .env file
});

export default apiClient;
