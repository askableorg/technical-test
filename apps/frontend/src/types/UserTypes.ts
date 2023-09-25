export type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    dp?: string;
    favorites?: {
        lion: string;
        fish: string;
    };
    isAdmin: boolean;
    dob: string;
    password: string;
};

export type UserRequest = User;
