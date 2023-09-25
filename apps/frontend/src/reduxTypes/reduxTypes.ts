import { User } from "../types";

export type AuthState = {
    user: User | null;
    isLoggedIn: boolean;
    timestamp: number | null;
    isAdmin: boolean;
};

export type RootState = {
    auth: AuthState;
};
