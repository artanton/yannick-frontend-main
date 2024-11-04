import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

export const excelFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${apiBaseUrl}/upload/uploadExcelFile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error("Empty response received");
        }
    } catch (error) {
        
        const errorMessage = error.response?.data?.message || 'Error while uploading file';
        return { error: errorMessage };
    }
};


export const updateExcel = async (data) => {

    try {
        const response = await axios.post(`${apiBaseUrl}/upload/updateExel`, data);

        if (response && response.data) {
            return response.data;
        } else {
            throw new Error("Empty response received");
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error while uploading file';
        return { error: errorMessage };
    }
};
