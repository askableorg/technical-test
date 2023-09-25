import { faker } from "@faker-js/faker";
import { User } from "../types";

function createMockUser(): User {
    return {
        _id: faker.database.mongodbObjectId(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: "testuser@testemail.com",
        dp: faker.image.avatar(),
        dob: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
        favorites: {
            fish: faker.animal.fish(),
            lion: faker.animal.lion(),
        },
        isAdmin: false,
        password: "testpasswordhash",
    };
}

export function generateUserData() {
    return Array(10000)
        .fill(null)
        .reduce<{ users: User[] }>(
            (acc, _curr) => {
                const users = createMockUser();
                acc.users.push(users);
                return acc;
            },
            {
                users: [],
            }
        );
}
