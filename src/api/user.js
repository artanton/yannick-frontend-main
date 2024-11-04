import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

export const getPlansByEmail = async (data) => {

    try {
        const response = await axios.post(`${apiBaseUrl}/user/get-plans`, data);

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error("Empty response received");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'User not found ';
        return { error: errorMessage };
    }
};



export const searchPlansOfUser = async (data) => {

    try {
        const response = await axios.post(`${apiBaseUrl}/user/search-plan`, data);

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error("Empty response received");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Search Error';
        return { error: errorMessage };
    }
};
