export const createUserRequestSchema = {
    type: "object",
    required: ["firstName", "lastName", "email", "password", "dob", "isAdmin"],
    properties: {
        _id: { type: "string", minLength: 1 },
        firstName: { type: "string", minLength: 1 },
        lastName: { type: "string", minLength: 1 },
        email: { type: "string", format: "email" },
        dp: { type: "string", format: "uri", minLength: 1 },
        favorites: {
            type: "object",
            properties: {
                lion: { type: "string", minLength: 1 },
                fish: { type: "string", minLength: 1 },
            },
            additionalProperties: false,
        },
        isAdmin: { type: "boolean" },
        password: { type: "string", minLength: 8 },
        dob: {
            anyOf: [
                { type: "string", format: "date-time" },
                { type: "string", format: "date" },
            ],
        },
    },
    additionalProperties: false,
};
