import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, 
});

// interceptor yang ngambil dari localStorage udah aku hapus
export default instance;
