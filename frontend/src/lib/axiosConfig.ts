// axiosConfig.js

import axios from "axios";
import setHeader from "./axiosHeader";

axios.defaults.headers.common["Authorization"] = setHeader();
const instance = axios.create({
  // baseURL: "http://teamwork.ddnsfree.com:3001/api/v1/finance",
  // baseURL: "http://127.0.0.1:8000/api/lams/v1/", // --> need to change in 7001
  // baseURL: "http://localhost:5006/api/lams/v1/", // --> need to change in 7001
  // baseURL: "https://aadrikainfomedia.com/auth/api/lams/v1/", 

  baseURL: `${process.env.backend}/api/lams/v1`,
});

export default instance;

// export default axios;
