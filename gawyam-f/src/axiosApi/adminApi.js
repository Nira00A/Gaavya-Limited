import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.REACT_APP_ADMIN_API,
  withCredentials: true 
});

export default adminApi;