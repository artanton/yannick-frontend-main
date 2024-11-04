import ApiClient from "../api.client";

export const registerUser = async (data) => {
    try {
        const response = await ApiClient.post(`/auth/register`, data);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const login = async (data) => {
    try {
        const response = await ApiClient.post(`/auth/login`, data);
        return response.data;
    } catch (error) {
        return error;
    }
};
export const createPaymentIntent = async (data) => {
    try {
        // Make a POST request to your backend endpoint for creating a payment intent
        const response = await ApiClient.post(`/auth/create-payment-intent`, data);
        return response.data; // Return the client secret or any response data needed
    } catch (error) {
        return error.response ? error.response.data : { error: 'An unexpected error occurred' };
    }
};

export const forgotPassword = async (data) => {
    console.log('register response',data);
    try {
        const response = await ApiClient.post('/auth/forgot-password', data);
        return response.data;
    }
    catch (error) {
        return error?.response.data;
    }
}
export const resetPassword = async (data) => {
    const { token, password } = data;
    console.log('reset password',token,password);
    try {
        const response = await ApiClient.post(`/auth/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        return error?.response.data;
    }
};

export const getUserById = async (data) => {
    const { userId } = data;
   
    try {
        const response = await ApiClient.get(`/auth/user-info/${userId}`);
        console.log("Retrive user by Email", response )
        return response.data;
    } catch (error) {
        return error?.response.data;    
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await ApiClient.get(`/auth/user-info`, {
            
            params: { email }, // Ensure email is sent correctly
        });
        console.log("Retrive user by Email", response )
        return response.data;
    } catch (error) {
        return error?.response?.data;    
    }
};