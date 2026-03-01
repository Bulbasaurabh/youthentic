import axios from "axios";

// In development: uses localhost
// In production: uses REACT_APP_API_URL from .env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:10000",
});

export default API;