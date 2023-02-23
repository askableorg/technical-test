import { generateProductData } from './generator';

/**
 * Treat this as a fake local database.
 * Implement functions that will help you create/read/update/delete the mocked data
 */
export class Database {
  private static data = generateProductData();

  static async getProducts() {
    return this.data.products;
  }
}
