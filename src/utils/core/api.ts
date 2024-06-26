import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000/api/";

export const apiUrl = {
  LOGIN: `login/`,
  REGISTER: `register/`,
  LOGOUT: `logout/`,
  RECIPES: `recipes/`,
  RECIPE_IMAGES: `recipe-images/`,
  CATEGORIES: `categories/`,
};

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
