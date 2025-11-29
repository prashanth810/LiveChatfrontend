import axios from 'axios';

const HttpClient = axios.create({
    baseURL: "https://live-chat-application-22b5.onrender.com/api/auth",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add interceptor to attach token from localStorage if needed
HttpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // or however you store it
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default HttpClient;