import { faker } from '@faker-js/faker';

type WithId<T> = T & {
  _id: string;
};

export type User = WithId<{
  firstName: string;
  lastName: string;
  dp: string;
  favorites: {
    lion: string;
    fish: string;
  };
  dob: Date;
}>;

export type Order = WithId<{
  product_id: string;
}>;

function createMockUser(): User {
  return {
    _id: faker.database.mongodbObjectId(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    dp: faker.image.avatar(),
    dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    favorites: {
      fish: faker.animal.fish(),
      lion: faker.animal.lion(),
    },
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
