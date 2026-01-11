import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_API,
    withCredentials: true
})

/*api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        if(token) {
            config.headers.token = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)*/

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response){
            const { status } = error.response;

            const isLoginPage = window.location.pathname === '/login';

            if (status === 404 && !isLoginPage) {
                console.log("User not found.");
                window.location.href = '/login';
            }

            if (status === 401 && !isLoginPage) {
                console.log("Session expired.");
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
)

export default api;