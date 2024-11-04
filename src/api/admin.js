import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

// Fetch all prompts
const fetchPrompts = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/admin/prompts`);
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty response received");
    }
  } catch (error) {
    throw new Error("Error fetching prompts");
  }
};

// Add a new prompt
const addPrompt = async (prompt) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/admin/prompts`, prompt);
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty response received");
    }
  } catch (error) {
    throw new Error("Error adding prompt");
  }
};

// Edit an existing prompt
const editPrompt = async (id, prompt) => {
  try {
    const response = await axios.put(`${apiBaseUrl}/admin/prompts/${id}`, prompt);
    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Empty response received");
    }
  } catch (error) {
    throw new Error("Error editing prompt");
  }
};

export { fetchPrompts, addPrompt, editPrompt };

