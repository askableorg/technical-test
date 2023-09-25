import { store } from "../store";
import { logout } from "./authSlice";

const checkAuthExpiration = () => {
    const state = store.getState();
    const { timestamp } = state.auth;

    if (timestamp) {
        const currentTime = new Date().getTime();
        const timeSinceLastAction = currentTime - timestamp;

        if (timeSinceLastAction > 24 * 60 * 60 * 1000) {
            // 24 hours
            store.dispatch(logout());
        }
    }
};

export default checkAuthExpiration;
