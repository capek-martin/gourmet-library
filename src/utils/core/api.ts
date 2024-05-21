import axios from "axios";

/* axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true; */

export const API_BASE_URL = "http://127.0.0.1:8000/api/";
// export const API_BASE_URL = "http://16.16.78.135:8000/api/";
// export const API_BASE_URL = "http://192.168.0.52:5555/api/";
/* export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}); */

export const apiUrl = {
  LOGIN: `login/`,
  REGISTER: `register/`,
  LOGOUT: `logout/`,
  RECIPES: `recipes/`,
  RECIPE_IMAGES: `recipe-images/`,
  CATEGORIES: `categories/`,
};

/*let _csrfToken: any = null;

 async function getCsrfToken() {
  if (_csrfToken === null) {
    const response = await fetch(`${API_BASE_URL}csrf/`, {
      credentials: "include",
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
  }
  return _csrfToken;
} */

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to add CSRF token header
/* http.interceptors.request.use(async (config) => {
  const csrfToken = await getCsrfToken();
  config.headers["X-CSRFToken"] = csrfToken;
  return config;
}); */

export default http;
