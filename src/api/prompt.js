import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;
  

const aiReplier = async (userQuery) => {
    const requestData = { userQuery };
    try {
        const response = await axios.post(`${apiBaseUrl}/prompt/bot-reply`, requestData);
        if (response && response.data) {
            return response.data;
        } else {
            throw new Error("Empty response received");
        }
    } catch (error) {
        throw new Error("Error while generating prompt");
    }
};

export { aiReplier };
