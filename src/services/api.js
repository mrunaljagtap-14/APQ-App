import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Adjust based on your setup
});

export default instance;
