import { create } from 'zustand';

const useNotificationStore = create((set) => ({
    notificationBadge: { showNotification: false, isSuccess: null, message: "" },
    setNotificationBadge: (newNotificationBadge) => set(() => ({
        notificationBadge: newNotificationBadge
    }))
}));

export default useNotificationStore;
