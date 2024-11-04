import axios from "axios";

const ApiClient = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});

ApiClient.interceptors.request.use(async (request) => {
    const accessToken = localStorage.getItem("user_token");
    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
});



export default ApiClient;