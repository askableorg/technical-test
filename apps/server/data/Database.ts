import { generateProductData } from "../generators/productsGenerators";
import { generateUserData } from "../generators/usersGenerator";

/**
 * Treat this as a fake local database.
 * Implement functions that will help you create/read/update/delete the mocked data
 */
export class Database {
  private static data = { ...generateProductData(), ...generateUserData() };

  static async getProducts() {
    return this.data.products;
  }

  static async getUsers() {
    return this.data.users;
  }
}
