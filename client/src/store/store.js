import { create } from "zustand";

const useGlobalStateStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    setUser: (user) => {
        set(() => {
            localStorage.setItem('user', JSON.stringify(user));
            return { user: user };
        });
    },
}));

export default useGlobalStateStore;
