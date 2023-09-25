import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../reduxTypes/reduxTypes";
import { User } from "../types";

type LoginPayload = {
    user: User;
    timestamp: number;
};

const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
    timestamp: null,
    isAdmin: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<LoginPayload>) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
            state.timestamp = action.payload.timestamp;
            state.isAdmin = action.payload.user.isAdmin;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.timestamp = null;
            state.isAdmin = false;
        },
    },
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
