// frontend/store/useUserStore.js
import { create } from 'zustand';
import * as AuthApi from "../api/auth.api";

const useUserStore = create((set) => ({
    userId: null,
    user: null,
    username: null, // Add username to the store
    setUserId: (id) => set({ userId: id }),
    setUser: (userData) => set({ user: userData }),
    setUsername: (username) => set({ username }), // Add a method to set username
    fetchUserData: async (email) => {  // Fetch user data using email
        try {
            const userData = await AuthApi.getUserByEmail(email);  // Call your API method
            if (userData && userData.user) { // Check if user data exists
                set({ user: userData.user }); // Update the user state with fetched data
                
                // Extract the username from the user_metadata field
                const username = userData.user.user_metadata?.username;
                if (username) {
                    set({ username }); // Set the username in the state
                } else {
                    console.error('Username not found in user data');
                }
            } else {
                console.error('Failed to fetch user data:', userData.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
}));

export default useUserStore;
