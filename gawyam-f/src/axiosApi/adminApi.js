import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://192.168.1.7:5000/admin',
  withCredentials: true 
});

export default adminApi;