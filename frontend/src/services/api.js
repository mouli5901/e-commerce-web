import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Enables sending and receiving HttpOnly cookies
});

export default API;
