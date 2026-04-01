import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-finance-backend-0chy.onrender.com",  
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;